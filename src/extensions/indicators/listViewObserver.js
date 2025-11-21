/**
 * WordPress dependencies
 */
import { select, subscribe } from '@wordpress/data';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

const ATTR_NAME = 'data-maxi-interaction';
const DEBUG = false; // Set to true for debugging

/**
 * Updates a single List View item with the interaction attribute
 * @param {HTMLElement} item - The list view row element (tr or li)
 */
const updateListViewItem = (item) => {
    // Find the link that contains the block clientId
    const link = item.querySelector('a[href^="#block-"]');

    if (!link) {
        if (DEBUG) console.log('MaxiBlocks List View: No link found in item', item);
        return;
    }

    const href = link.getAttribute('href');
    if (!href) return;

    const clientId = href.replace('#block-', '');
    const block = select('core/block-editor').getBlock(clientId);

    if (!block) return;

    const hasInteraction = !isEmpty(block.attributes?.relations);

    if (hasInteraction) {
        item.setAttribute(ATTR_NAME, 'true');
        item.setAttribute('aria-label', 'Interaction');
        item.setAttribute('title', 'Interaction');
        if (DEBUG) console.log('MaxiBlocks List View: Added interaction attribute to', block.name, clientId);
    } else {
        item.removeAttribute(ATTR_NAME);
        item.removeAttribute('aria-label');
        item.removeAttribute('title');
    }
};

/**
 * Updates all visible List View items
 */
const updateAllListViewItems = () => {
    // Target the actual row elements in the List View
    const items = document.querySelectorAll('.block-editor-list-view-leaf, .block-editor-list-view__block');
    if (DEBUG) console.log('MaxiBlocks List View: Found', items.length, 'list view items');

    if (items.length === 0) return;

    items.forEach(updateListViewItem);
};

/**
 * Initialize the observer
 */
const initListViewObserver = () => {
    if (DEBUG) console.log('MaxiBlocks List View: Initializing observer');

    // Observer for DOM changes (List View opening, expanding, scrolling)
    const observer = new MutationObserver((mutations) => {
        let shouldUpdate = false;
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                // Check if nodes were added to the list view tree
                if (mutation.target.closest('.block-editor-list-view-tree')) {
                    shouldUpdate = true;
                    break;
                }
                // Check if the list view tree itself was added
                for (const node of mutation.addedNodes) {
                    if (
                        node.nodeType === 1 &&
                        (node.classList?.contains('block-editor-list-view-tree') ||
                            node.querySelector?.('.block-editor-list-view-tree'))
                    ) {
                        shouldUpdate = true;
                        break;
                    }
                }
            }
            if (shouldUpdate) break;
        }

        if (shouldUpdate) {
            setTimeout(updateAllListViewItems, 100);
        }
    });

    // Observe the body to catch sidebar opening/closing
    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    // Initial check
    setTimeout(updateAllListViewItems, 500);

    // Subscribe to block editor changes to update when blocks are modified
    let updateTimeout;
    subscribe(() => {
        if (document.querySelector('.block-editor-list-view-tree')) {
            clearTimeout(updateTimeout);
            updateTimeout = setTimeout(updateAllListViewItems, 300);
        }
    }, 'core/block-editor');

    // Periodic check as fallback
    setInterval(() => {
        if (document.querySelector('.block-editor-list-view-tree')) {
            updateAllListViewItems();
        }
    }, 2000);
};

// Initialize on DOM ready
wp.domReady(() => {
    initListViewObserver();
});
