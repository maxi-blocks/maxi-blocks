/**
 * WordPress dependencies
 */
import { select, subscribe } from '@wordpress/data';
import domReady from '@wordpress/dom-ready';

const ATTR_NAME = 'data-maxi-interaction';
const BG_ATTR_NAME = 'data-maxi-background';
const LEGEND_ID = 'maxi-list-view-legend';

/**
 * Helper to check block attributes
 */
const getBlockStatus = block => {
	if (!block) return { hasInteraction: false, hasBackgroundLayers: false };

	const hasInteraction = !!(
		block.attributes?.relations && block.attributes.relations.length > 0
	);
	const hasBackgroundLayers = !!block.attributes?.['background-layers']?.some(
		layer => layer.type !== 'color'
	);

	return { hasInteraction, hasBackgroundLayers };
};

/**
 * Helper to check if block is hidden or has hidden descendants
 */
const getHiddenStatus = item => {
	const isHidden = item.getAttribute('data-maxi-hidden') === 'true';
	const hasHiddenParent =
		item.getAttribute('data-maxi-hidden-parent') === 'true';

	return { isHidden, hasHiddenParent };
};

/**
 * Updates a single List View item with indicators and a11y labels
 */
const updateListViewItem = item => {
	const link = item.querySelector('a[href^="#block-"]');
	if (!link) return;

	const clientId = link.getAttribute('href').replace('#block-', '');
	const block = select('core/block-editor').getBlock(clientId);
	if (!block) return;

	const { hasInteraction, hasBackgroundLayers } = getBlockStatus(block);
	const { isHidden, hasHiddenParent } = getHiddenStatus(item);

	// Apply Interaction Attributes
	if (hasInteraction) {
		item.setAttribute(ATTR_NAME, 'true');
	} else {
		item.removeAttribute(ATTR_NAME);
	}

	// Apply Background Attributes
	if (hasBackgroundLayers) {
		item.setAttribute(BG_ATTR_NAME, 'true');
	} else {
		item.removeAttribute(BG_ATTR_NAME);
	}

	// Combined Accessibility Label & Tooltip
	if (hasInteraction || hasBackgroundLayers || isHidden || hasHiddenParent) {
		const labelParts = [];
		if (hasInteraction) labelParts.push('Interaction');
		if (hasBackgroundLayers) labelParts.push('Background');
		if (isHidden) labelParts.push('Hidden block');
		if (hasHiddenParent) labelParts.push('Hidden block inside');

		const label = labelParts.join(', ');
		item.setAttribute('aria-label', label);
		item.setAttribute('title', label);
	} else {
		item.removeAttribute('aria-label');
		item.removeAttribute('title');
	}
};

/**
 * Check if indicators exist anywhere in the block tree
 */
const hasActiveIndicators = blocks => {
	const blockList = blocks || select('core/block-editor').getBlocks();

	// Check for interaction and background indicators
	const hasBlockIndicators = blockList.some(block => {
		const { hasInteraction, hasBackgroundLayers } = getBlockStatus(block);
		if (hasInteraction || hasBackgroundLayers) return true;
		if (block.innerBlocks?.length)
			return hasActiveIndicators(block.innerBlocks);
		return false;
	});

	// Also check if any elements in the DOM have the hidden-parent indicator
	const hasHiddenParentIndicators =
		document.querySelectorAll('[data-maxi-hidden-parent="true"]').length >
		0;

	return hasBlockIndicators || hasHiddenParentIndicators;
};

/**
 * Create and inject the legend into the List View panel
 */
const createLegend = () => {
	if (document.getElementById(LEGEND_ID)) return;
	if (!hasActiveIndicators()) return;

	const listViewTree = document.querySelector('.block-editor-list-view-tree');
	if (!listViewTree) return;

	const listViewPanel =
		listViewTree.closest('.interface-navigable-region') ||
		listViewTree.closest('.block-editor-list-view') ||
		listViewTree.parentElement;

	if (!listViewPanel) return;

	listViewPanel.style.position = 'relative';

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
                <span class="maxi-list-view-legend__label">Hidden block inside</span>
            </div>
        </div>
    `;

	listViewPanel.appendChild(legend);
};

/**
 * Sync the UI state
 */
const updateAll = () => {
	const items = document.querySelectorAll(
		'.block-editor-list-view-leaf, .block-editor-list-view__block'
	);
	const legend = document.getElementById(LEGEND_ID);

	if (items.length > 0) {
		items.forEach(updateListViewItem);

		// Check if any indicators exist - if not, remove legend
		if (hasActiveIndicators()) {
			createLegend();
		} else if (legend) {
			legend.remove();
		}
	} else if (legend) {
		legend.remove();
	}
};

/**
 * Initialize Observer and Subscription
 */
export const initListViewObserver = () => {
	let updateTimeout;

	const observer = new MutationObserver(() => {
		clearTimeout(updateTimeout);
		updateTimeout = setTimeout(updateAll, 150);
	});

	observer.observe(document.body, { childList: true, subtree: true });

	const unsubscribe = subscribe(() => {
		clearTimeout(updateTimeout);
		updateTimeout = setTimeout(updateAll, 300);
	}, 'core/block-editor');

	updateAll(); // Run immediately

	return () => {
		observer.disconnect();
		unsubscribe();
		clearTimeout(updateTimeout);
	};
};

let cleanup;
domReady(() => {
	cleanup = initListViewObserver();
});

export const cleanupListViewObserver = () => {
	if (cleanup) {
		cleanup();
		cleanup = null;
	}
};
