/**
 * Simulates a mouse drag on a resize handle inside the editor iframe by
 * directly invoking re-resizable's internal state/methods via the React
 * fiber tree.
 *
 * Why this approach
 * -----------------
 * Diagnostic tests confirmed:
 *  - CDP `Input.dispatchMouseEvent` (page.mouse) events at correct page-level
 *    coordinates do NOT trigger re-resizable's React `onMouseDown` handler inside
 *    the Gutenberg Block API v3 editor iframe, even when the block is selected,
 *    the handle is display:block/pointer-events:auto, and coordinates are exact.
 *  - frame.evaluate() + dispatchEvent also silently fails because of the same
 *    CDP → iframe → React delegation mismatch.
 *
 * Solution: access the `Resizable` class-component instance through the React
 * fiber tree, fix `instance.resizable` to the correct container DOM element,
 * and drive the resize by calling re-resizable's bound instance methods in the
 * correct order.
 *
 * @param {import('puppeteer-core').Page}  page          - Puppeteer page (kept for
 *                                                         API compat; provides
 *                                                         waitForTimeout).
 * @param {import('puppeteer-core').Frame} frame         - Editor iframe frame
 *                                                         (from `getEditorFrame()`).
 * @param {string}                         handleSelector - CSS selector for the
 *                                                          resize handle inside the
 *                                                          iframe.
 * @param {number}                         deltaX         - Horizontal drag distance
 *                                                          in px (negative = left).
 * @param {number}                         [deltaY=0]     - Vertical drag distance.
 * @return {Promise<void>}
 */
const dragInFrame = async (page, frame, handleSelector, deltaX, deltaY = 0) => {
	await frame.evaluate(
		async ({ sel, dx, dy }) => {
			// ── 1. Locate the handle element ─────────────────────────────────
			const handleEl = document.querySelector(sel);
			if (!handleEl) {
				throw new Error(`dragInFrame: handle not found: "${sel}"`);
			}

			// ── 2. Derive iframe-local client coordinates ─────────────────────
			const rect = handleEl.getBoundingClientRect();
			const startX = rect.left + rect.width / 2;
			const startY = rect.top + rect.height / 2;
			const endX = startX + dx;
			const endY = startY + dy;

			// ── 3. Find the Resizable class-component instance via React fiber ─
			//    re-resizable stores its instance methods as bound functions in
			//    the constructor, so we look for onResizeStart + onMouseUp.
			const fiberKey = Object.keys(handleEl).find(
				k =>
					k.startsWith('__reactFiber') ||
					k.startsWith('__reactInternalInstance')
			);
			if (!fiberKey) {
				throw new Error(
					'dragInFrame: no React fiber found on handle element'
				);
			}

			let fiber = handleEl[fiberKey];
			let instance = null;
			while (fiber) {
				if (
					fiber.stateNode &&
					typeof fiber.stateNode.onResizeStart === 'function' &&
					typeof fiber.stateNode.onMouseUp === 'function' &&
					typeof fiber.stateNode.onMouseMove === 'function' &&
					typeof fiber.stateNode.bindEvents === 'function'
				) {
					instance = fiber.stateNode;
					break;
				}
				fiber = fiber.return;
			}
			if (!instance) {
				throw new Error(
					'dragInFrame: Resizable instance not found in fiber tree'
				);
			}

			// ── 4. Repair instance.resizable with a guaranteed iframe DOM node ──
			//    Gutenberg's Block API v3 runs the React class in the main-frame
			//    JS context while its DOM lives in the iframe. Cross-frame
			//    `instanceof Element` checks fail, so calling onResizeStart
			//    directly causes `getComputedStyle` to throw. Instead we:
			//    a) Forcibly set instance.resizable to the container element
			//       (grand-parent of the handle: handle → handle-wrapper → container).
			//    b) Skip onResizeStart and manually replicate its essential setup
			//       so we avoid the cross-frame getComputedStyle call entirely.
			const containerEl =
				handleEl.parentElement?.parentElement;

			if (!containerEl) {
				throw new Error(
					'dragInFrame: could not locate the resizable container element'
				);
			}
			instance.resizable = containerEl;

			// ── 5. Determine resize direction from the handle's class name ────
			const dirMap = {
				bottomright: 'bottomRight',
				bottomleft: 'bottomLeft',
				topright: 'topRight',
				topleft: 'topLeft',
				bottom: 'bottom',
				top: 'top',
				left: 'left',
				right: 'right',
			};
			const classMatch = handleEl.className.match(
				/maxi-resizable__handle-(\w+)/
			);
			const dirKey = classMatch ? classMatch[1].toLowerCase() : '';
			const direction = dirMap[dirKey] || 'bottomRight';

			// ── 6. Set up state for the resize ───────────────────────────────
			//    Directly mutate instance.state (bypasses async setState).
			const origWidth = containerEl.offsetWidth;
			const origHeight = containerEl.offsetHeight;

			instance.ratio = origWidth / (origHeight || 1);
			instance.state = Object.assign({}, instance.state, {
				isResizing: true,
				direction,
				original: {
					x: startX,
					y: startY,
					width: origWidth,
					height: origHeight,
				},
			});

			// ── 7. Simulate the drag result directly on the DOM ───────────────
			//    onMouseUp reads `this.size.width` = `containerEl.offsetWidth`.
			//    handleOnResizeStop calls `getResizerSize(elt)` which uses
			//    `elt.getBoundingClientRect().width`. We skip onMouseMove (which
			//    relies on flushSync resolving to the correct ReactDOM instance —
			//    unreliable in Gutenberg's cross-frame setup) and instead set the
			//    inline style directly so the browser layout reflects the target.
			const newWidth = origWidth + dx;
			const newHeight = origHeight + dy;
			if (dx !== 0) containerEl.style.width = `${newWidth}px`;
			if (dy !== 0) containerEl.style.height = `${newHeight}px`;
			// Access offsetWidth to force a synchronous layout flush so the
			// browser returns the updated value when onMouseUp reads it.
			// eslint-disable-next-line no-unused-expressions
			containerEl.offsetWidth;

			// ── 8. Fire onMouseUp ─────────────────────────────────────────────
			//    Reads this.size.width (= containerEl.offsetWidth = newWidth),
			//    computes delta, calls props.onResizeStop → handleOnResizeStop
			//    → getResizerSize(elt) → maxiSetAttributes.
			instance.onMouseUp({
				clientX: endX,
				clientY: endY,
				preventDefault: () => {},
				stopPropagation: () => {},
			});
		},
		{ sel: handleSelector, dx: deltaX, dy: deltaY }
	);

	// Allow setAttributes / React re-render to propagate to the store.
	await page.waitForTimeout(200);
};

export default dragInFrame;
