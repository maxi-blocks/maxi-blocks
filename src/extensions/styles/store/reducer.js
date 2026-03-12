/**
 * Internal dependencies
 */
import styleGenerator from '@extensions/styles/styleGenerator';
import {
	incrementRepeaterAggregate,
	measureRepeaterAggregate,
} from '@extensions/repeater/perf';
import controls from './controls';
import * as defaultGroupAttributes from '@extensions/styles/defaults/index';
import { MemoCache } from '@extensions/maxi-block/memoizationHelper';
import { omit } from 'lodash';

const BREAKPOINTS = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];
const cssCacheInputState = new Map();
const hasCompleteBreakpointCache = cacheEntry =>
	BREAKPOINTS.every(
		breakpoint => typeof cacheEntry?.[breakpoint] === 'string'
	);

// Enhanced LRU cache for CSS with memory management
class CSSCache extends MemoCache {
	constructor(maxSize = 200) {
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
		// More conservative thresholds to prevent excessive cleanup
		const maxAverageSize = 100 * 1024; // 100KB per block (was 50KB)
		const maxTotalSize = 20 * 1024 * 1024; // 20MB total (was 10MB)
		const minTimeBetweenCleanups = 30000; // 30 seconds minimum between cleanups

		// Don't cleanup too frequently
		const timeSinceLastCleanup = Date.now() - this.memoryStats.lastCleanup;
		if (timeSinceLastCleanup < minTimeBetweenCleanups) {
			return;
		}

		// Only cleanup if we actually exceed reasonable thresholds
		const shouldCleanup =
			(this.memoryStats.averageSize > maxAverageSize &&
				this.size() > 50) ||
			(this.memoryStats.totalSize > maxTotalSize && this.size() > 100);

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
					// eslint-disable-next-line no-console
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

// Global CSS cache instance
const cssCache = new CSSCache(200);

const saveCSSCacheEntry = (uniqueID, stylesObj, isIframe, isSiteEditor) => {
	const existingCache = cssCache.get(uniqueID) || {};
	const previousCacheInput = cssCacheInputState.get(uniqueID);

	if (
		previousCacheInput?.stylesObj === stylesObj &&
		previousCacheInput?.isIframe === isIframe &&
		previousCacheInput?.isSiteEditor === isSiteEditor &&
		hasCompleteBreakpointCache(existingCache)
	) {
		incrementRepeaterAggregate('stylesStore.saveCSSCache.shortCircuit', 1);
		return {
			cache: existingCache,
			didChange: false,
		};
	}

	const breakpointStyles = measureRepeaterAggregate(
		'stylesStore.saveCSSCache.generateAllBreakpoints',
		() =>
			BREAKPOINTS.reduce(
				(acc, breakpoint) => ({
					...acc,
					[breakpoint]: measureRepeaterAggregate(
						'stylesStore.saveCSSCache.styleGenerator',
						() =>
							styleGenerator(
								stylesObj,
								isIframe,
								isSiteEditor,
								breakpoint
							)
					),
				}),
				{
					...existingCache,
				}
			)
	);

	measureRepeaterAggregate('stylesStore.saveCSSCache.writeCache', () =>
		cssCache.set(uniqueID, breakpointStyles)
	);
	cssCacheInputState.set(uniqueID, {
		stylesObj,
		isIframe,
		isSiteEditor,
	});

	return {
		cache: breakpointStyles,
		didChange: true,
	};
};

const saveRawCSSCacheEntry = (uniqueID, stylesContent) => {
	const existingCache = cssCache.get(uniqueID) || {};
	const updatedCache = {
		...existingCache,
		...stylesContent,
	};

	cssCache.set(uniqueID, updatedCache);

	return updatedCache;
};

const removeCSSCacheEntry = uniqueID => {
	cssCache.delete(uniqueID);
	cssCacheInputState.delete(uniqueID);
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
			const nextStyleEntries = Object.entries(action.styles || {});
			if (!nextStyleEntries.length) {
				return state;
			}

			const hasChangedStyles = measureRepeaterAggregate(
				'stylesStore.updateStyles.hasChangedScan',
				() =>
					nextStyleEntries.some(
						([target, targetStyles]) =>
							state.styles[target] !== targetStyles
					)
			);
			if (!hasChangedStyles) {
				return state;
			}

			const updatedStyles = measureRepeaterAggregate(
				'stylesStore.updateStyles.cloneAndMerge',
				() => {
					const nextStyles = { ...state.styles };

					nextStyleEntries.forEach(([target, targetStyles]) => {
						nextStyles[target] = targetStyles;
					});

					return nextStyles;
				}
			);

			incrementRepeaterAggregate(
				'stylesStore.updateStyles.appliedTargets',
				nextStyleEntries.length
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
			const { didChange } = saveCSSCacheEntry(
				uniqueID,
				stylesObj,
				isIframe,
				isSiteEditor
			);

			return didChange ? { ...state } : state;
		}
		case 'SAVE_RAW_CSS_CACHE': {
			const { uniqueID, stylesContent } = action;
			saveRawCSSCacheEntry(uniqueID, stylesContent);

			return { ...state };
		}
		case 'REMOVE_CSS_CACHE': {
			const { uniqueID } = action;
			removeCSSCacheEntry(uniqueID);

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

	getEntry(uniqueID) {
		return cssCache.get(uniqueID);
	},

	saveEntry(uniqueID, stylesObj, isIframe, isSiteEditor) {
		return saveCSSCacheEntry(uniqueID, stylesObj, isIframe, isSiteEditor);
	},

	saveRawEntry(uniqueID, stylesContent) {
		return saveRawCSSCacheEntry(uniqueID, stylesContent);
	},

	removeEntry(uniqueID) {
		removeCSSCacheEntry(uniqueID);
	},

	/**
	 * Clear the CSS cache
	 */
	clearCache() {
		cssCache.clear();
		cssCacheInputState.clear();
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
