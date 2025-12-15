/**
 * WordPress dependencies
 */
import { select, subscribe } from '@wordpress/data';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

const ATTR_NAME = 'data-maxi-interaction';
const LEGEND_ID = 'maxi-list-view-legend';

/**
 * Updates a single List View item with the interaction attribute
 * @param {HTMLElement} item - The list view row element (tr or li)
 */
const updateListViewItem = item => {
	// Find the link that contains the block clientId
	const link = item.querySelector('a[href^="#block-"]');

	if (!link) {
		return;
	}

	const href = link.getAttribute('href');
	if (!href) return;

	const clientId = href.replace('#block-', '');
	const block = select('core/block-editor').getBlock(clientId);

	if (!block) return;

	const hasInteraction = !isEmpty(block.attributes?.relations);
	const hasBackgroundLayers = !isEmpty(
		block.attributes?.['background-layers']?.filter(
			layer => layer.type !== 'color'
		)
	);

	if (hasInteraction) {
		item.setAttribute(ATTR_NAME, 'true');
		item.setAttribute('aria-label', 'Interaction');
		item.setAttribute('title', 'Interaction');
	} else {
		item.removeAttribute(ATTR_NAME);
		if (!hasBackgroundLayers) {
			item.removeAttribute('aria-label');
			item.removeAttribute('title');
		}
	}

	if (hasBackgroundLayers) {
		item.setAttribute('data-maxi-background', 'true');
		// Build label based on current state, not previous label
		const label = hasInteraction ? 'Interaction, Background' : 'Background';
		item.setAttribute('aria-label', label);
		item.setAttribute('title', label);
	} else {
		item.removeAttribute('data-maxi-background');
	}
};

/**
 * Create and append the legend to the list view panel
 */
const createLegend = () => {
	// Check if legend already exists
	if (document.getElementById(LEGEND_ID)) return;

	// Try to find the list view panel - try multiple selectors for different WP versions
	const listViewTree = document.querySelector('.block-editor-list-view-tree');
	if (!listViewTree) {
		return;
	}

	// Find the secondary sidebar container (full height panel)
	let listViewPanel = listViewTree.closest('.interface-navigable-region.interface-interface-skeleton__secondary-sidebar');
	if (!listViewPanel) {
		listViewPanel = listViewTree.closest('.edit-post-editor__list-view-panel');
	}
	if (!listViewPanel) {
		listViewPanel = listViewTree.closest('.interface-navigable-region');
	}
	if (!listViewPanel) {
		listViewPanel = listViewTree.closest('.block-editor-list-view');
	}
	if (!listViewPanel) {
		// Fallback: use the parent element
		listViewPanel = listViewTree.parentElement;
	}

	if (!listViewPanel) {
		return;
	}

	// Ensure the panel has position relative for absolute positioning of legend
	listViewPanel.style.position = 'relative';

	// Check if there are any Maxi blocks on the page
	const blocks = select('core/block-editor').getBlocks();
	const hasMaxiBlocks = checkForMaxiBlocks(blocks);

	if (!hasMaxiBlocks) {
		return;
	}

	const legend = document.createElement('div');
	legend.id = LEGEND_ID;
	legend.className = 'maxi-list-view-legend';
	legend.innerHTML = `
		<div class="maxi-list-view-legend__title">Legend</div>
		<div class="maxi-list-view-legend__items">
			<div class="maxi-list-view-legend__item">
				<span class="maxi-list-view-legend__dot maxi-list-view-legend__dot--pink"></span>
				<span class="maxi-list-view-legend__label">Interaction</span>
			</div>
			<div class="maxi-list-view-legend__item">
				<span class="maxi-list-view-legend__dot maxi-list-view-legend__dot--orange"></span>
				<span class="maxi-list-view-legend__label">Background layer</span>
			</div>
			<div class="maxi-list-view-legend__item">
				<span class="maxi-list-view-legend__dot maxi-list-view-legend__dot--grey"></span>
				<span class="maxi-list-view-legend__label">Hidden layer</span>
			</div>
		</div>
	`;

	listViewPanel.appendChild(legend);
};

/**
 * Recursively check for Maxi blocks in the block tree
 */
const checkForMaxiBlocks = blocks => {
	for (const block of blocks) {
		if (block.name?.startsWith('maxi-blocks/')) return true;
		if (block.innerBlocks?.length && checkForMaxiBlocks(block.innerBlocks)) {
			return true;
		}
	}
	return false;
};

/**
 * Remove legend when list view is closed
 */
const removeLegend = () => {
	const legend = document.getElementById(LEGEND_ID);
	if (legend) legend.remove();
};

/**
 * Updates all visible List View items
 */
const updateAllListViewItems = () => {
	// Target the actual row elements in the List View
	const items = document.querySelectorAll(
		'.block-editor-list-view-leaf, .block-editor-list-view__block'
	);

	if (items.length === 0) return;

	items.forEach(updateListViewItem);
};

/**
 * Initialize the observer
 */
const initListViewObserver = () => {
	// Track resources for cleanup
	let initialTimeout;
	let updateTimeout;
	let periodicInterval;
	let unsubscribe;

	// Observer for DOM changes (List View opening, expanding, scrolling)
	const observer = new MutationObserver(mutations => {
		let shouldUpdate = false;
		let listViewAdded = false;
		let listViewRemoved = false;
		
		for (const mutation of mutations) {
			if (mutation.type === 'childList') {
				// Check if nodes were added to the list view tree
				if (mutation.target.closest('.block-editor-list-view-tree')) {
					shouldUpdate = true;
				}
				// Check if the list view tree itself was added
				for (const node of mutation.addedNodes) {
					if (
						node.nodeType === 1 &&
						(node.classList?.contains(
							'block-editor-list-view-tree'
						) ||
							node.querySelector?.(
								'.block-editor-list-view-tree'
							))
					) {
						shouldUpdate = true;
						listViewAdded = true;
						break;
					}
				}
				// Check if list view was removed
				for (const node of mutation.removedNodes) {
					if (
						node.nodeType === 1 &&
						(node.classList?.contains(
							'block-editor-list-view-tree'
						) ||
							node.querySelector?.(
								'.block-editor-list-view-tree'
							) ||
							node.classList?.contains('block-editor-list-view'))
					) {
						listViewRemoved = true;
						break;
					}
				}
			}
		}

		if (listViewRemoved) {
			removeLegend();
		}

		if (shouldUpdate) {
			setTimeout(() => {
				updateAllListViewItems();
				if (listViewAdded) {
					createLegend();
				}
			}, 100);
		}
	});

	// Observe the body to catch sidebar opening/closing
	observer.observe(document.body, {
		childList: true,
		subtree: true,
	});

	// Initial check
	initialTimeout = setTimeout(() => {
		updateAllListViewItems();
		createLegend();
	}, 500);

	// Subscribe to block editor changes to update when blocks are modified
	unsubscribe = subscribe(() => {
		if (document.querySelector('.block-editor-list-view-tree')) {
			clearTimeout(updateTimeout);
			updateTimeout = setTimeout(updateAllListViewItems, 300);
		}
	}, 'core/block-editor');

	// Periodic check as fallback
	periodicInterval = setInterval(() => {
		if (document.querySelector('.block-editor-list-view-tree')) {
			updateAllListViewItems();
		}
	}, 2000);

	// Return cleanup function
	return () => {
		// Disconnect MutationObserver
		if (observer) {
			observer.disconnect();
		}

		// Clear all timeouts
		if (initialTimeout) {
			clearTimeout(initialTimeout);
		}
		if (updateTimeout) {
			clearTimeout(updateTimeout);
		}

		// Clear interval
		if (periodicInterval) {
			clearInterval(periodicInterval);
		}

		// Unsubscribe from block editor
		if (unsubscribe) {
			unsubscribe();
		}
	};
};

// Initialize on DOM ready and store cleanup function
let cleanup;
wp.domReady(() => {
	cleanup = initListViewObserver();
});

// Export cleanup function for manual teardown if needed
export const cleanupListViewObserver = () => {
	if (cleanup) {
		cleanup();
		cleanup = null;
	}
};
