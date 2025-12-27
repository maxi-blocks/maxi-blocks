/**
 * Internal dependencies
 */
import styleGenerator from '@extensions/styles/styleGenerator';
import controls from './controls';
import * as defaultGroupAttributes from '@extensions/styles/defaults/index';
import { MemoCache } from '@extensions/maxi-block/memoizationHelper';
import { omit } from 'lodash';

const BREAKPOINTS = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

// Enhanced LRU cache for CSS with memory management
class CSSCache extends MemoCache {
	constructor(maxSize = 50) {  // Reduced from 200 to 50 for lower memory
		super(maxSize);
		this.memoryStats = {
			totalSize: 0,
			averageSize: 0,
			lastCleanup: Date.now(),
		};
	}

	set(key, value) {
		// Estimate memory usage of the CSS content
		const newSize = JSON.stringify(value).length;

		// Check for existing value and subtract its size from totalSize
		const oldValue = this.get(key);
		if (oldValue !== undefined) {
			const oldSize = JSON.stringify(oldValue).length;
			this.memoryStats.totalSize -= oldSize;
		}

		super.set(key, value);

		// Update totalSize with new value
		this.memoryStats.totalSize += newSize;

		// Recompute averageSize using post-insert size
		this.memoryStats.averageSize = this.memoryStats.totalSize / this.size();

		// Only check memory usage periodically (every 10 additions) to avoid performance issues
		if (this.size() % 10 === 0) {
			this.checkMemoryUsage();
		}
	}

	delete(key) {
		const value = this.get(key);
		if (value) {
			try {
				const estimatedSize = JSON.stringify(value).length;
				this.memoryStats.totalSize = Math.max(
					0,
					this.memoryStats.totalSize - estimatedSize
				);
			} catch (error) {
				// If we can't estimate size, just reset memory stats
				this.memoryStats.totalSize = 0;
			}
		}

		// Delete from cache - use this.cache instead of super.cache
		this.cache.delete(key);

		// Recalculate average after deletion
		this.memoryStats.averageSize =
			this.size() > 0 ? this.memoryStats.totalSize / this.size() : 0;
	}

	clear() {
		super.clear();
		this.memoryStats = {
			totalSize: 0,
			averageSize: 0,
			lastCleanup: Date.now(),
		};
	}

	checkMemoryUsage() {
		// Lower thresholds for more aggressive memory management
		const maxAverageSize = 25 * 1024; // 25KB per block (was 100KB)
		const maxTotalSize = 5 * 1024 * 1024; // 5MB total (was 20MB)
		const minTimeBetweenCleanups = 15000; // 15 seconds (was 30s)

		// Don't cleanup too frequently
		const timeSinceLastCleanup = Date.now() - this.memoryStats.lastCleanup;
		if (timeSinceLastCleanup < minTimeBetweenCleanups) {
			return;
		}

		// Only cleanup if we actually exceed reasonable thresholds
		const shouldCleanup =
			(this.memoryStats.averageSize > maxAverageSize &&
				this.size() > 20) ||  // Lower threshold from 50 to 20
			(this.memoryStats.totalSize > maxTotalSize && this.size() > 30);  // Lower from 100 to 30

		if (shouldCleanup) {
			const oldSize = this.size();

			// Only cleanup if we have a meaningful number of entries
			if (oldSize <= 20) {
				return; // Don't cleanup small caches
			}

			const entriesToKeep = Math.floor(this.maxSize * 0.6); // Keep 60% of entries (more aggressive)

			// Get most recently used entries (last 60%)
			const entries = Array.from(this.cache.entries()).slice(
				-entriesToKeep
			);

			// Reset memory stats before cleanup
			this.memoryStats.totalSize = 0;
			this.clear();

			// Re-add the most recent entries and recalculate memory stats
			entries.forEach(([key, value]) => {
				super.set(key, value);
				const estimatedSize = JSON.stringify(value).length;
				this.memoryStats.totalSize += estimatedSize;
			});

			// Recalculate average
			this.memoryStats.averageSize =
				this.size() > 0 ? this.memoryStats.totalSize / this.size() : 0;
			this.memoryStats.lastCleanup = Date.now();

			const newSize = this.size();
			if (newSize < oldSize) {
				// Only log in development or debug mode to reduce console noise
				const isDebugMode =
					process.env.NODE_ENV === 'development' ||
					(typeof window !== 'undefined' &&
						window.localStorage &&
						localStorage.getItem('maxiBlocks-debug') === 'true');
				if (isDebugMode) {
					console.log(
						`MaxiBlocks CSS Cache: Auto-cleanup triggered. Reduced from ${oldSize} to ${newSize} entries`
					);
				}
			}
		}
	}

	getStats() {
		return {
			size: this.size(),
			maxSize: this.maxSize,
			...this.memoryStats,
			hitRate: this.hitRate || 0,
		};
	}
}

// Global CSS cache instance - reduced from 200 to 50 for lower memory
const cssCache = new CSSCache(50);

// Helper function to chunk large style objects
const chunkStylesIntoChunks = (styles, size) => {
	const chunks = [];
	const entries = Object.entries(styles);

	for (let i = 0; i < entries.length; i += size) {
		chunks.push(Object.fromEntries(entries.slice(i, i + size)));
	}

	return chunks;
};

/**
 * Reducer managing the styles
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 * @return {Object} Updated state.
 */
function reducer(
	state = {
		styles: {},
		isUpdate: null,
		prevSavedAttrs: [],
		prevSavedAttrsClientId: null,
		cssCache, // Use LRU cache instance instead of plain object
		blockMarginValue: '',
		defaultGroupAttributes,
	},
	action
) {
	switch (action.type) {
		case 'UPDATE_STYLES': {
			const chunkSize = 100;
			const chunks = chunkStylesIntoChunks(action.styles, chunkSize);

			const updatedStyles = chunks.reduce(
				(acc, chunk) => ({
					...acc,
					...chunk,
				}),
				state.styles
			);

			return { ...state, styles: updatedStyles };
		}
		case 'SAVE_STYLES':
			controls.SAVE_STYLES({
				styles: state.styles,
				isUpdate: action.isUpdate,
			});
			return { ...state, isUpdate: action.isUpdate };
		case 'REMOVE_STYLES':
			return { ...state, styles: omit(state.styles, action.targets) };
		case 'SAVE_PREV_SAVED_ATTRS':
			return {
				...state,
				prevSavedAttrs: action.prevSavedAttrs,
				prevSavedAttrsClientId: action.prevSavedAttrsClientId,
			};
		case 'SAVE_CSS_CACHE': {
			const { uniqueID, stylesObj, isIframe, isSiteEditor } = action;

			// Check if already cached
			const existingCache = state.cssCache.get(uniqueID);
			if (existingCache) {
				// Move to end (mark as recently used)
				state.cssCache.set(uniqueID, existingCache);
				return state;
			}

			const breakpointStyles = BREAKPOINTS.reduce(
				(acc, breakpoint) => ({
					...acc,
					[breakpoint]: styleGenerator(
						stylesObj,
						isIframe,
						isSiteEditor,
						breakpoint
					),
				}),
				{}
			);

			// Use LRU cache set method (automatically handles size limits)
			state.cssCache.set(uniqueID, breakpointStyles);

			return { ...state };
		}
		case 'SAVE_RAW_CSS_CACHE': {
			const { uniqueID, stylesContent } = action;

			// Get existing cache entry or create new one
			const existingCache = state.cssCache.get(uniqueID) || {};
			const updatedCache = {
				...existingCache,
				...stylesContent,
			};

			// Update the cache entry
			state.cssCache.set(uniqueID, updatedCache);

			return { ...state };
		}
		case 'REMOVE_CSS_CACHE': {
			const { uniqueID } = action;

			// Use LRU cache delete method
			state.cssCache.delete(uniqueID);

			return { ...state };
		}
		case 'SAVE_BLOCK_MARGIN_VALUE':
			return { ...state, blockMarginValue: action.blockMarginValue };
		default:
			return state;
	}
}

/**
 * CSS Cache management utilities
 */
export const cssCacheUtils = {
	/**
	 * Get cache statistics
	 * @returns {Object} CSS cache statistics
	 */
	getStats() {
		return cssCache.getStats();
	},

	/**
	 * Clear the CSS cache
	 */
	clearCache() {
		cssCache.clear();
	},

	/**
	 * Get cache size
	 * @returns {number} Current cache size
	 */
	getSize() {
		return cssCache.size();
	},

	/**
	 * Force memory cleanup
	 */
	forceCleanup() {
		cssCache.checkMemoryUsage();
	},
};

export default reducer;
