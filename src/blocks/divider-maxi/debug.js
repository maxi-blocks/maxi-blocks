const DEBUG_STORAGE_KEY = 'maxi-debug-divider';
const DEBUG_QUERY_PARAM = 'maxi-debug-divider';
const DEBUG_GLOBAL_KEY = '__maxiDividerDebug';

const STYLE_PROPERTIES = [
	'display',
	'visibility',
	'opacity',
	'position',
	'box-sizing',
	'width',
	'height',
	'min-width',
	'max-width',
	'min-height',
	'max-height',
	'border-top-style',
	'border-top-width',
	'border-top-color',
	'border-right-style',
	'border-right-width',
	'border-right-color',
	'border-bottom-style',
	'border-bottom-width',
	'border-bottom-color',
	'border-left-style',
	'border-left-width',
	'border-left-color',
	'border-radius',
	'background-image',
	'background-position',
	'background-repeat',
	'background-size',
	'background-color',
	'color',
	'transform',
	'overflow',
	'pointer-events',
];

const ATTRIBUTE_PREFIXES = [
	'line-orientation-',
	'line-horizontal-',
	'line-vertical-',
	'divider-border-',
	'divider-width-',
	'divider-height-',
	'height-',
	'width-',
	'display-',
	'force-aspect-ratio-',
];

const dividerDebugEntries = new Set();

const hasDottedDividerStyle = attributes =>
	Object.entries(attributes || {}).some(
		([key, value]) =>
			key.startsWith('divider-border-style') && value === 'dotted'
	);

export const getDividerDebugWindow = root =>
	root?.ownerDocument?.defaultView ||
	(typeof window !== 'undefined' ? window : undefined);

const hasDebugQueryParam = win => {
	const search = win?.location?.search;

	if (!search) return false;

	try {
		return new URLSearchParams(search).has(DEBUG_QUERY_PARAM);
	} catch {
		return search.includes(DEBUG_QUERY_PARAM);
	}
};

export const isDividerDebugEnabled = (
	win = typeof window !== 'undefined' ? window : undefined,
	attributes = {}
) => {
	if (!win) return false;

	if (hasDottedDividerStyle(attributes)) return true;

	if (hasDebugQueryParam(win)) return true;

	try {
		return win.localStorage?.getItem(DEBUG_STORAGE_KEY) === '1';
	} catch {
		return false;
	}
};

const getRectSnapshot = element => {
	if (!element?.getBoundingClientRect) return null;

	const { x, y, top, right, bottom, left, width, height } =
		element.getBoundingClientRect();

	return { x, y, top, right, bottom, left, width, height };
};

const getComputedStyleSnapshot = (element, win) => {
	if (!element || typeof win?.getComputedStyle !== 'function') return null;

	const styles = win.getComputedStyle(element);

	return STYLE_PROPERTIES.reduce((acc, property) => {
		acc[property] = styles.getPropertyValue(property);
		return acc;
	}, {});
};

const getDebugAttributes = attributes =>
	Object.entries(attributes || {}).reduce((acc, [key, value]) => {
		if (
			key === 'uniqueID' ||
			key === 'lineOrientation' ||
			ATTRIBUTE_PREFIXES.some(prefix => key.startsWith(prefix))
		)
			acc[key] = value;

		return acc;
	}, {});

const getStyleTagMatches = (root, uniqueID) => {
	if (!root?.ownerDocument || !uniqueID) return [];

	return Array.from(root.ownerDocument.querySelectorAll('style'))
		.reduce((acc, style, index) => {
			const text = style.textContent || '';
			const matchIndex = text.indexOf(uniqueID);

			if (matchIndex === -1) return acc;

			acc.push({
				index,
				id: style.id || null,
				length: text.length,
				snippet: text.slice(
					Math.max(0, matchIndex - 160),
					Math.min(text.length, matchIndex + 360)
				),
			});

			return acc;
		}, [])
		.slice(0, 10);
};

export const getDividerDebugSnapshot = ({
	label,
	root,
	attributes,
	deviceType,
}) => {
	const win = getDividerDebugWindow(root);
	const divider = root?.querySelector?.('hr.maxi-divider-block__divider');
	const blockWrapper = root?.closest?.('[data-block]');

	return {
		label,
		deviceType,
		uniqueID: attributes?.uniqueID,
		debugEnabledBy: {
			autoDotted: hasDottedDividerStyle(attributes),
			storageOrQuery: isDividerDebugEnabled(win),
		},
		breakpointClasses: {
			isHorizontal: root?.classList?.contains(
				'maxi-divider-block--horizontal'
			),
			isVertical: root?.classList?.contains(
				'maxi-divider-block--vertical'
			),
		},
		attributes: getDebugAttributes(attributes),
		classes: {
			root: root?.className || null,
			divider: divider?.className || null,
			blockWrapper: blockWrapper?.className || null,
		},
		inlineStyles: {
			root: root?.getAttribute?.('style') || '',
			divider: divider?.getAttribute?.('style') || '',
			blockWrapper: blockWrapper?.getAttribute?.('style') || '',
		},
		rects: {
			root: getRectSnapshot(root),
			divider: getRectSnapshot(divider),
			blockWrapper: getRectSnapshot(blockWrapper),
		},
		computed: {
			root: getComputedStyleSnapshot(root, win),
			divider: getComputedStyleSnapshot(divider, win),
		},
		styleTagMatches: getStyleTagMatches(root, attributes?.uniqueID),
	};
};

const getLiveDebugEntries = () =>
	Array.from(dividerDebugEntries).filter(({ getContext }) =>
		Boolean(getContext()?.root)
	);

const exposeDividerDebugGlobal = win => {
	if (!win) return;

	const debugApi = {
		isMaxiDividerDebug: true,
		enable() {
			try {
				win.localStorage?.setItem(DEBUG_STORAGE_KEY, '1');
			} catch {
				// No-op. The query param gate can still be used.
			}

			getLiveDebugEntries().forEach(({ attach }) => attach());

			return this.snapshot('manual-enable');
		},
		disable() {
			try {
				win.localStorage?.removeItem(DEBUG_STORAGE_KEY);
			} catch {
				// No-op. The query param gate can still be removed manually.
			}

			getLiveDebugEntries().forEach(({ attach }) => attach());

			return true;
		},
		snapshot(label = 'manual') {
			const entries = getLiveDebugEntries();

			entries.forEach(({ getContext }) =>
				logDividerDebugSnapshot(
					{
						label,
						...getContext(),
					},
					{ force: true }
				)
			);

			return entries.length;
		},
		count() {
			return getLiveDebugEntries().length;
		},
	};

	win[DEBUG_GLOBAL_KEY] = debugApi;

	try {
		if (win.parent && win.parent !== win)
			win.parent[DEBUG_GLOBAL_KEY] = debugApi;
	} catch {
		// Cross-frame access can fail in some editor contexts.
	}
};

export const logDividerDebugSnapshot = (context, { force = false } = {}) => {
	const win = getDividerDebugWindow(context.root);

	if (!force && !isDividerDebugEnabled(win, context.attributes)) return false;

	const snapshot = getDividerDebugSnapshot(context);
	const title = `[MaxiBlocks][DividerDebug] ${snapshot.label} ${snapshot.deviceType} ${snapshot.uniqueID}`;
	const logger = win?.console || console;

	if (typeof logger.groupCollapsed === 'function') {
		logger.groupCollapsed(title);
		logger.log(snapshot);
		logger.groupEnd();
	} else {
		logger.log(title, snapshot);
	}

	return true;
};

export const createDividerDebugController = getContext => {
	let root = null;
	let hoverHandler = null;
	let frameIds = [];
	let lastHoverTime = 0;
	let attach = () => {};

	const getSafeContext = () => getContext() || {};
	const entry = {
		getContext: getSafeContext,
		attach: () => attach(),
	};

	const cancelFrames = () => {
		const win = getDividerDebugWindow(root || getSafeContext().root);

		frameIds.forEach(frameId => {
			if (typeof win?.cancelAnimationFrame === 'function')
				win.cancelAnimationFrame(frameId);
			else if (typeof cancelAnimationFrame === 'function')
				cancelAnimationFrame(frameId);
		});

		frameIds = [];
	};

	const log = label =>
		logDividerDebugSnapshot({
			label,
			...getSafeContext(),
		});

	const schedule = (label, remainingFrames = 1) => {
		const context = getSafeContext();
		const win = getDividerDebugWindow(context.root);

		if (!isDividerDebugEnabled(win, context.attributes)) return;

		const requestFrame =
			typeof win?.requestAnimationFrame === 'function'
				? win.requestAnimationFrame.bind(win)
				: typeof requestAnimationFrame === 'function'
				? requestAnimationFrame
				: null;

		const run = frames => {
			if (frames <= 0 || !requestFrame) {
				log(label);
				return;
			}

			const frameId = requestFrame(() => {
				frameIds = frameIds.filter(id => id !== frameId);
				run(frames - 1);
			});

			frameIds.push(frameId);
		};

		run(remainingFrames);
	};

	const removeListeners = () => {
		if (root && hoverHandler) {
			root.removeEventListener('pointerenter', hoverHandler);
			root.removeEventListener('mouseenter', hoverHandler);
		}

		cancelFrames();
		root = null;
		hoverHandler = null;
	};

	const detach = () => {
		removeListeners();
		dividerDebugEntries.delete(entry);
	};

	attach = () => {
		const context = getSafeContext();
		const nextRoot = context.root;
		const win = getDividerDebugWindow(nextRoot);

		if (nextRoot) {
			dividerDebugEntries.add(entry);
			exposeDividerDebugGlobal(win);
		}

		if (!nextRoot || !isDividerDebugEnabled(win, context.attributes)) {
			removeListeners();
			return;
		}

		if (root === nextRoot && hoverHandler) return;

		removeListeners();

		hoverHandler = () => {
			const now = Date.now();

			if (now - lastHoverTime < 75) return;

			lastHoverTime = now;
			log('hover-before');
			schedule('hover-after-raf');
		};
		root = nextRoot;

		root.addEventListener('pointerenter', hoverHandler);
		root.addEventListener('mouseenter', hoverHandler);
	};

	return {
		attach,
		detach,
		schedule,
		log,
	};
};
