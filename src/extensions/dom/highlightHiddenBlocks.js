/**
 * WordPress dependencies
 */
import { select, subscribe } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { getLastBreakpointAttribute } from '@extensions/styles';

/**
 * Tag List View items whose blocks are hidden at the current breakpoint.
 * Adds data attribute `data-maxi-hidden="true"` to the corresponding list item.
 */
const queryListItemByClientId = clientId =>
	document.querySelector(
		`.block-editor-list-view__block[data-block='${clientId}'], .block-editor-list-view-leaf[data-block='${clientId}']`
	);

const isMaxiBlock = name =>
	typeof name === 'string' && name.startsWith('maxi-blocks/');

const isHiddenAtDevice = (attributes, deviceType) => {
	const display = getLastBreakpointAttribute({
		target: 'display',
		breakpoint: deviceType,
		attributes,
		forceSingle: true,
		isHover: false,
	});
	return display === 'none';
};

let lastSignature = '';

const computeSignature = () => {
	const device = select('maxiBlocks').receiveMaxiDeviceType();
	const blocksTree = select('core/block-editor').getBlocks();
	// Simple signature: device + number of blocks + selection clientId
	const { getSelectedBlockClientId } = select('core/block-editor');
	return `${device}|${blocksTree?.length}|${getSelectedBlockClientId()}`;
};

const updateHighlights = () => {
	const deviceType = select('maxiBlocks').receiveMaxiDeviceType();
	const blocks = select('core/block-editor').getBlocks();
	if (!blocks) return;

	const visit = list => {
		list.forEach(block => {
			const { clientId, name, attributes, innerBlocks } = block;
			const listItem = queryListItemByClientId(clientId);

			if (listItem && isMaxiBlock(name)) {
				const hidden = isHiddenAtDevice(attributes, deviceType);
				if (hidden) listItem.setAttribute('data-maxi-hidden', 'true');
				else listItem.removeAttribute('data-maxi-hidden');
			}
			if (innerBlocks && innerBlocks.length) visit(innerBlocks);
		});
	};

	visit(blocks);
};

const initHighlightHiddenBlocks = () => {
	// Initial run (List View might render async; delay a tick)
	setTimeout(updateHighlights, 0);

	// Subscribe to relevant store changes; debounce via micro-signature
	subscribe(() => {
		const sig = computeSignature();
		if (sig !== lastSignature) {
			lastSignature = sig;
			// Run on next frame to avoid thrashing
			requestAnimationFrame(updateHighlights);
		}
	});

	// Observe List View DOM so we react when it opens or rows mount
	const mo = new MutationObserver(mutations => {
		let shouldUpdate = false;
		for (const m of mutations) {
			if (m.addedNodes && m.addedNodes.length) {
				for (const n of m.addedNodes) {
					if (
						n.nodeType === 1 &&
						(n.classList?.contains('block-editor-list-view-leaf') ||
							n.classList?.contains(
								'block-editor-list-view__block'
							) ||
							n.querySelector?.(
								'.block-editor-list-view-leaf, .block-editor-list-view__block'
							))
					) {
						shouldUpdate = true;
						break;
					}
				}
			}
			if (shouldUpdate) break;
		}
		if (shouldUpdate) requestAnimationFrame(updateHighlights);
	});

	mo.observe(document.body, { childList: true, subtree: true });
};

export default initHighlightHiddenBlocks;
