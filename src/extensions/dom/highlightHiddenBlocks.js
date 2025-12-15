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
 * Also adds `data-maxi-hidden-parent="true"` to blocks that contain hidden descendants.
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
	const { getSelectedBlockClientId, getBlocks } = select('core/block-editor');
	const blocksTree = getBlocks();

	// Build a lightweight signature that reflects hidden/visible state per Maxi block
	const parts = [device, getSelectedBlockClientId()];
	const visit = list => {
		list.forEach(block => {
			const { name, attributes, clientId, innerBlocks } = block;
			if (isMaxiBlock(name)) {
				const hidden = isHiddenAtDevice(attributes, device) ? '1' : '0';
				parts.push(clientId, hidden);
			}
			if (innerBlocks && innerBlocks.length) visit(innerBlocks);
		});
	};
	if (blocksTree) visit(blocksTree);

	return parts.join('|');
};

const updateHighlights = () => {
	const blocks = select('core/block-editor').getBlocks();
	if (!blocks) return;

	const visit = (list, isParentHidden = false) => {
		list.forEach(block => {
			const { clientId, name, attributes, innerBlocks } = block;
			const listItem = queryListItemByClientId(clientId);

			if (listItem && isMaxiBlock(name)) {
				const deviceType = select('maxiBlocks').receiveMaxiDeviceType();
				const isSelfHidden = isHiddenAtDevice(attributes, deviceType);
				const isEffectivelyHidden = isParentHidden || isSelfHidden;

				// Check if any descendants are hidden
				let hasHiddenDescendants = false;
				if (innerBlocks && innerBlocks.length) {
					const checkHiddenDescendants = (children, parentHidden) => {
						return children.some(child => {
							const isChildMaxi = isMaxiBlock(child.name);
							if (!isChildMaxi) {
								// For non-Maxi blocks, check their children
								return child.innerBlocks &&
									child.innerBlocks.length
									? checkHiddenDescendants(
											child.innerBlocks,
											parentHidden
									  )
									: false;
							}
							const isChildHidden =
								parentHidden ||
								isHiddenAtDevice(child.attributes, deviceType);
							// Return true if this child is hidden OR any of its descendants are hidden
							return (
								isChildHidden ||
								(child.innerBlocks && child.innerBlocks.length
									? checkHiddenDescendants(
											child.innerBlocks,
											isChildHidden
									  )
									: false)
							);
						});
					};
					hasHiddenDescendants = checkHiddenDescendants(
						innerBlocks,
						isEffectivelyHidden
					);
				}

				// Set data-maxi-hidden attribute for hidden blocks
				if (isEffectivelyHidden)
					listItem.setAttribute('data-maxi-hidden', 'true');
				else listItem.removeAttribute('data-maxi-hidden');

				// Set data-maxi-hidden-parent attribute for blocks with hidden descendants
				if (hasHiddenDescendants)
					listItem.setAttribute('data-maxi-hidden-parent', 'true');
				else listItem.removeAttribute('data-maxi-hidden-parent');

				// Pass down the effective hidden state to children
				if (innerBlocks && innerBlocks.length)
					visit(innerBlocks, isEffectivelyHidden);
			} else if (innerBlocks && innerBlocks.length) {
				// For non-Maxi blocks, just continue traversing with current hidden state
				visit(innerBlocks, isParentHidden);
			}
		});
	};

	visit(blocks);
};

const initHighlightHiddenBlocks = () => {
	// Initial run (List View might render async; delay a tick)
	setTimeout(updateHighlights, 0);

	// Subscribe to relevant store changes; debounce via micro-signature.
	// IMPORTANT: Do not call select() while a reducer is executing.
	// We schedule the work to the macrotask queue so the current dispatch completes first.
	let isScheduled = false;
	const unsubscribe = subscribe(() => {
		if (isScheduled) return;
		isScheduled = true;
		setTimeout(() => {
			isScheduled = false;
			const sig = computeSignature();
			if (sig !== lastSignature) {
				lastSignature = sig;
				// Run on next frame to avoid thrashing
				requestAnimationFrame(updateHighlights);
			}
		}, 0);
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

	// Return cleanup to disconnect observer and unsubscribe from store updates
	return () => {
		try {
			mo.disconnect();
		} catch (e) {
			// Ignore errors during cleanup
		}
		if (typeof unsubscribe === 'function') unsubscribe();
	};
};

export default initHighlightHiddenBlocks;
