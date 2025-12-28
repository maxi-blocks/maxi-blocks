/**
 * WordPress dependencies
 */
import { dispatch, select, subscribe } from '@wordpress/data';

/**
 * Internal dependencies
 */
import goThroughMaxiBlocks from './goThroughMaxiBlocks';

/**
 * Editor Cache Manager
 *
 * Manages caching of uniqueIDs and customLabels for O(1) lookup performance.
 * Uses LAZY cache building - only builds when needed, not on init.
 */

let unsubscribe = null;
let previousBlockCount = 0;
let previousBlocksReference = null;
let isInitialized = false;
let lastCacheTime = 0;
const CACHE_DEBOUNCE_MS = 100; // Debounce cache rebuilds

/**
 * Build the editor cache by traversing all blocks once
 * OPTIMIZED: Only runs when cache is actually needed
 *
 * @returns {Object} Cache object with uniqueIDs and customLabels maps
 */
const buildEditorCache = () => {
	const editorUniqueIDsMap = {};
	const editorCustomLabelsMap = {};

	try {
		goThroughMaxiBlocks(block => {
			const { uniqueID, customLabel } = block.attributes || {};

			if (uniqueID) {
				// Count uniqueID occurrences
				editorUniqueIDsMap[uniqueID] =
					(editorUniqueIDsMap[uniqueID] || 0) + 1;

				// Track customLabel to uniqueID mapping
				if (customLabel) {
					if (!editorCustomLabelsMap[customLabel]) {
						editorCustomLabelsMap[customLabel] = [];
					}
					editorCustomLabelsMap[customLabel].push(uniqueID);
				}
			}

			return false; // Continue traversal
		});

		return { editorUniqueIDsMap, editorCustomLabelsMap };
	} catch (error) {
		// Silently fail - will retry on next access
		return { editorUniqueIDsMap: {}, editorCustomLabelsMap: {} };
	}
};

/**
 * Update the Redux store with the editor cache
 * OPTIMIZED: Debounced to avoid excessive rebuilds
 */
export const updateEditorCache = () => {
	const now = Date.now();
	if (now - lastCacheTime < CACHE_DEBOUNCE_MS) {
		// Too soon, skip this rebuild
		return;
	}

	lastCacheTime = now;
	const { editorUniqueIDsMap, editorCustomLabelsMap } = buildEditorCache();
	dispatch('maxiBlocks/blocks').updateEditorCache(
		editorUniqueIDsMap,
		editorCustomLabelsMap
	);
};

/**
 * Invalidate the editor cache (lightweight - just marks as invalid)
 */
export const invalidateEditorCache = () => {
	dispatch('maxiBlocks/blocks').invalidateEditorCache();
};

/**
 * Clear editor cache contents to avoid stale references
 */
const clearEditorCache = () => {
	lastCacheTime = 0;
	dispatch('maxiBlocks/blocks').updateEditorCache({}, {});
};

/**
 * Get the current block count for change detection
 *
 * @returns {number} Number of blocks in editor
 */
const getCurrentBlockCount = () => {
	try {
		const blocks = select('core/block-editor')?.getBlocks() || [];
		return blocks.length;
	} catch (error) {
		return 0;
	}
};

/**
 * Get the current blocks array reference for change detection
 *
 * @returns {Array} Current blocks array
 */
const getCurrentBlocksReference = () => {
	try {
		return select('core/block-editor')?.getBlocks() || [];
	} catch (error) {
		return [];
	}
};

/**
 * Detect if a bulk edit is happening (multi-selection change)
 *
 * @returns {boolean} Whether bulk edits are likely
 */
const getIsBulkEdit = () => {
	try {
		const getMultiSelectedBlockClientIds =
			select('core/block-editor')?.getMultiSelectedBlockClientIds;
		if (!getMultiSelectedBlockClientIds) {
			return false;
		}

		const selectedIds = getMultiSelectedBlockClientIds() || [];
		return selectedIds.length > 1;
	} catch (error) {
		return false;
	}
};

/**
 * Subscribe to block editor changes and invalidate cache conservatively
 * OPTIMIZED: Doesn't build cache on init - waits until first access
 */
export const initializeEditorCacheSubscription = () => {
	if (isInitialized) {
		return;
	}

	// DON'T build cache on init - let it be lazy
	previousBlockCount = getCurrentBlockCount();
	previousBlocksReference = getCurrentBlocksReference();

	// Subscribe to changes - only invalidate, don't rebuild
	unsubscribe = subscribe(() => {
		try {
			const currentBlockCount = getCurrentBlockCount();
			const currentBlocksReference = getCurrentBlocksReference();
			const hasBlocksChanged =
				currentBlocksReference !== previousBlocksReference;
			const isBulkEdit = getIsBulkEdit() && hasBlocksChanged;
			const hasBlockRemoval = currentBlockCount < previousBlockCount;

			// Clear stale entries when blocks are removed or bulk edits occur
			if (hasBlockRemoval || isBulkEdit) {
				clearEditorCache();
			}

			// LIGHTWEIGHT: Just invalidate cache if block count changed
			if (
				currentBlockCount !== previousBlockCount ||
				isBulkEdit ||
				hasBlocksChanged
			) {
				invalidateEditorCache();
				previousBlockCount = currentBlockCount;
				previousBlocksReference = currentBlocksReference;
			}
		} catch (error) {
			// Silently fail - cache will rebuild on next access
		}
	}, 'core/block-editor');

	isInitialized = true;
};

/**
 * Unsubscribe from block editor changes
 */
export const destroyEditorCacheSubscription = () => {
	if (unsubscribe) {
		unsubscribe();
		unsubscribe = null;
		isInitialized = false;
	}
};

/**
 * Check if cache is valid, rebuild if needed (LAZY rebuild)
 * This is the main entry point - cache only builds when actually needed
 *
 * @returns {boolean} True if cache was rebuilt
 */
export const ensureEditorCacheValid = () => {
	const isValid = select('maxiBlocks/blocks').isEditorCacheValid();

	if (!isValid) {
		// LAZY: Only build cache when it's actually needed
		updateEditorCache();
		return true;
	}

	return false;
};

export default {
	updateEditorCache,
	invalidateEditorCache,
	initializeEditorCacheSubscription,
	destroyEditorCacheSubscription,
	ensureEditorCacheValid,
};
