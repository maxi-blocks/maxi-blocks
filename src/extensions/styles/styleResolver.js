/**
 * WordPress dependencies
 */
import { dispatch, select } from '@wordpress/data';

/**
 * External dependencies
 */
import { isEmpty, isNumber, isBoolean, isObject, merge, isEqual } from 'lodash';

/**
 * Internal dependencies
 */
import { MemoCache } from '@extensions/maxi-block/memoizationHelper';
import {
	incrementRepeaterAggregate,
	measureRepeaterAggregate,
} from '@extensions/repeater/perf';
import {
	queuePendingStyles,
	removePendingStyles,
	schedulePendingStylesFlush,
} from '@extensions/styles/store/pendingStyles';

/**
 * Styles resolver with LRU cache optimization
 */
const BREAKPOINTS = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];
const STYLE_CACHE_MAX_SIZE = 75;
const CLEAN_CONTENT_CACHE_MAX_SIZE = 75;
const MAX_STYLE_CACHE_KEY_LENGTH = 20000;
const MAX_STYLE_CACHE_VALUE_LENGTH = 100000;
const MAX_CONTENT_CACHE_KEY_LENGTH = 8000;
const CACHE_CHECK_INTERVAL = 25;

// LRU cache for style resolution results
const styleCache = new MemoCache(STYLE_CACHE_MAX_SIZE);
const cleanContentCache = new MemoCache(CLEAN_CONTENT_CACHE_MAX_SIZE);
const getCleanContentCache = new MemoCache(CLEAN_CONTENT_CACHE_MAX_SIZE);

// Cache statistics for monitoring
let cacheStats = {
	hits: 0,
	misses: 0,
	totalRequests: 0,
	lastCleared: Date.now(),
	skippedLargeEntries: 0,
};

const canCacheByKeyLength = (cacheKey, maxLength) =>
	typeof cacheKey === 'string' && cacheKey.length <= maxLength;

const trySetCache = (cache, cacheKey, value, maxValueLength = null) => {
	if (!canCacheByKeyLength(cacheKey, MAX_STYLE_CACHE_KEY_LENGTH)) {
		cacheStats.skippedLargeEntries += 1;
		return;
	}

	if (maxValueLength !== null) {
		const estimatedValueSize = JSON.stringify(value).length;
		if (estimatedValueSize > maxValueLength) {
			cacheStats.skippedLargeEntries += 1;
			return;
		}
	}

	cache.set(cacheKey, value);
};

const cleanContent = content => {
	// Generate cache key based on content structure
	const cacheKey = JSON.stringify(content);

	// Check cache first
	if (canCacheByKeyLength(cacheKey, MAX_CONTENT_CACHE_KEY_LENGTH)) {
		const cached = cleanContentCache.get(cacheKey);
		if (cached !== undefined) {
			cacheStats.hits += 1;
			return cached;
		}
	}

	cacheStats.misses += 1;
	let newContent = { ...content };

	for (const prop in newContent) {
		if (
			(isEmpty(newContent[prop]) &&
				!isNumber(newContent[prop]) &&
				!isBoolean(newContent[prop])) ||
			prop === 'label'
		)
			delete newContent[prop];
		else if (isObject(newContent[prop])) {
			if (BREAKPOINTS.includes(prop))
				newContent[prop] = cleanContent(newContent[prop]);
			else {
				newContent = merge(newContent, cleanContent(newContent[prop]));
				delete newContent[prop];
			}
		}
	}

	// Cache the result
	if (canCacheByKeyLength(cacheKey, MAX_CONTENT_CACHE_KEY_LENGTH)) {
		cleanContentCache.set(cacheKey, newContent);
	}
	return newContent;
};

const getCleanContent = content => {
	// Generate cache key based on content structure
	const cacheKey = JSON.stringify(content);

	// Check cache first
	if (canCacheByKeyLength(cacheKey, MAX_CONTENT_CACHE_KEY_LENGTH)) {
		const cached = getCleanContentCache.get(cacheKey);
		if (cached !== undefined) {
			cacheStats.hits += 1;
			return cached;
		}
	}

	cacheStats.misses += 1;
	const newContent = { ...content };

	// eslint-disable-next-line guard-for-in
	for (const target in newContent) {
		if (isObject(newContent[target]))
			newContent[target] = cleanContent(newContent[target]);

		if (isEmpty(newContent[target])) delete newContent[target];
		if (isEqual(newContent[target], { general: {} }))
			delete newContent[target];
	}

	// Cache the result
	if (canCacheByKeyLength(cacheKey, MAX_CONTENT_CACHE_KEY_LENGTH)) {
		getCleanContentCache.set(cacheKey, newContent);
	}
	return newContent;
};

const checkStyleResolverMemoryUsage = (maxSize = 1000) => {
	return measureRepeaterAggregate('styleResolver.trimCaches', () => {
		let totalSize =
			styleCache.size() +
			cleanContentCache.size() +
			getCleanContentCache.size();
		if (totalSize <= maxSize) return;

		const initialSize = totalSize;
		const cachesEvicted = [];

		// Preserve the expensive resolved style cache as long as possible.
		// The content-cleanup caches are cheaper to rebuild and do not trigger
		// downstream style-store sync churn when they miss.
		if (totalSize > maxSize) {
			cleanContentCache.clear();
			cachesEvicted.push('cleanContentCache (all)');
			incrementRepeaterAggregate(
				'styleResolver.trimmedCleanContentCache',
				1
			);
			totalSize =
				styleCache.size() +
				cleanContentCache.size() +
				getCleanContentCache.size();
		}

		if (totalSize > maxSize) {
			getCleanContentCache.clear();
			cachesEvicted.push('getCleanContentCache (all)');
			incrementRepeaterAggregate(
				'styleResolver.trimmedGetCleanContentCache',
				1
			);
			totalSize =
				styleCache.size() +
				cleanContentCache.size() +
				getCleanContentCache.size();
		}

		let styleCacheEvicted = 0;
		while (totalSize > maxSize && styleCache.size() > 0) {
			const oldestKey = styleCache.cache.keys().next().value;
			styleCache.cache.delete(oldestKey);
			styleCacheEvicted += 1;
			totalSize =
				styleCache.size() +
				cleanContentCache.size() +
				getCleanContentCache.size();
		}
		if (styleCacheEvicted > 0) {
			cachesEvicted.push(`styleCache (${styleCacheEvicted} entries)`);
			incrementRepeaterAggregate(
				'styleResolver.trimmedStyleCacheEntries',
				styleCacheEvicted
			);
		}

		console.warn(
			`MaxiBlocks StyleResolver: Trimmed caches due to memory usage (${initialSize} > ${maxSize}). ` +
				`Evicted: ${cachesEvicted.join(', ')}. Final size: ${totalSize}`
		);
	});
};

const isStoreAlreadySynced = styles => {
	const styleSelectors = select('maxiBlocks/styles');

	return Object.entries(styles).every(
		([target, targetStyles]) =>
			styleSelectors?.getBlockStyles?.(target) === targetStyles
	);
};

const getUnsyncedStoreStyles = styles => {
	const styleSelectors = select('maxiBlocks/styles');

	return Object.entries(styles).reduce((acc, [target, targetStyles]) => {
		const existingStyles = styleSelectors?.getBlockStyles?.(target);

		if (isEqual(existingStyles, targetStyles)) {
			return acc;
		}

		acc[target] = targetStyles;
		return acc;
	}, {});
};

const queueStoreUpdate = styles => {
	if (!queuePendingStyles(styles)) {
		return;
	}

	incrementRepeaterAggregate(
		'styleResolver.queuedUpdateStylesTargets',
		Object.keys(styles).length
	);

	schedulePendingStylesFlush(flushStyles => {
		const unsyncedFlushStyles = measureRepeaterAggregate(
			'styleResolver.flushSyncCheck',
			() => getUnsyncedStoreStyles(flushStyles)
		);

		if (isEmpty(unsyncedFlushStyles)) {
			incrementRepeaterAggregate('styleResolver.flushNoopSync', 1);
			return;
		}

		measureRepeaterAggregate('styleResolver.dispatchUpdateStyles', () =>
			dispatch('maxiBlocks/styles').updateStyles(
				null,
				unsyncedFlushStyles
			)
		);
	});
};

const styleResolver = ({ styles, remover = false, breakpoints, uniqueID }) => {
	if (!styles) return {};

	// Generate cache key for the entire styleResolver operation
	const cacheKey = JSON.stringify({ styles, remover, breakpoints, uniqueID });
	cacheStats.totalRequests += 1;

	if (cacheStats.totalRequests % CACHE_CHECK_INTERVAL === 0) {
		checkStyleResolverMemoryUsage(150);
	}

	// Check cache first for non-remover operations (removers shouldn't be cached as they have side effects)
	if (!remover && canCacheByKeyLength(cacheKey, MAX_STYLE_CACHE_KEY_LENGTH)) {
		const cached = styleCache.get(cacheKey);
		if (cached !== undefined) {
			cacheStats.hits += 1;
			incrementRepeaterAggregate('styleResolver.cacheHit', 1);
			// BUGFIX: Even on cache hit, update Redux store so it has current styles for DB save
			if (
				!measureRepeaterAggregate(
					'styleResolver.cacheHitSyncCheck',
					() => isStoreAlreadySynced(cached)
				)
			) {
				queueStoreUpdate(cached);
			} else {
				incrementRepeaterAggregate('styleResolver.cacheHitNoopSync', 1);
			}
			return cached;
		}
		cacheStats.misses += 1;
		incrementRepeaterAggregate('styleResolver.cacheMiss', 1);
	}

	const response = (remover && []) || {};

	measureRepeaterAggregate('styleResolver.buildResponse', () => {
		Object.entries(styles).forEach(([target, props]) => {
			if (!remover) {
				if (!response[target])
					response[target] = {
						uniqueID,
						breakpoints,
						content: {},
					};
				response[target].content = props;
			}
			if (remover) response.push(target);

			if (response?.[target]?.content)
				response[target].content = getCleanContent(
					response[target].content
				);
		});
	});

	if (!remover) {
		const unsyncedResponse = measureRepeaterAggregate(
			'styleResolver.missSyncCheck',
			() => getUnsyncedStoreStyles(response)
		);
		if (!isEmpty(unsyncedResponse)) {
			queueStoreUpdate(unsyncedResponse);
		} else {
			incrementRepeaterAggregate('styleResolver.missNoopSync', 1);
		}
	} else {
		removePendingStyles(response);
		measureRepeaterAggregate('styleResolver.dispatchRemoveStyles', () =>
			dispatch('maxiBlocks/styles').removeStyles(response)
		);
	}

	// Cache the result for non-remover operations
	if (!remover) {
		measureRepeaterAggregate('styleResolver.cacheSet', () =>
			trySetCache(
				styleCache,
				cacheKey,
				response,
				MAX_STYLE_CACHE_VALUE_LENGTH
			)
		);
	}

	return response;
};

/**
 * Cache management utilities
 */
export const styleCacheUtils = {
	/**
	 * Get cache statistics
	 * @returns {Object} Cache statistics including hit rate, size, etc.
	 */
	getStats() {
		const hitRate =
			cacheStats.totalRequests > 0
				? ((cacheStats.hits / cacheStats.totalRequests) * 100).toFixed(
						2
				  )
				: 0;

		return {
			...cacheStats,
			hitRate: `${hitRate}%`,
			styleCacheSize: styleCache.size(),
			cleanContentCacheSize: cleanContentCache.size(),
			getCleanContentCacheSize: getCleanContentCache.size(),
			totalCacheSize:
				styleCache.size() +
				cleanContentCache.size() +
				getCleanContentCache.size(),
		};
	},

	/**
	 * Clear all caches
	 */
	clearCache() {
		styleCache.clear();
		cleanContentCache.clear();
		getCleanContentCache.clear();
		cacheStats = {
			hits: 0,
			misses: 0,
			totalRequests: 0,
			lastCleared: Date.now(),
			skippedLargeEntries: 0,
		};
	},

	/**
	 * Clear specific cache by type
	 * @param {string} type - Cache type ('style', 'cleanContent', 'getCleanContent')
	 */
	clearCacheByType(type) {
		switch (type) {
			case 'style':
				styleCache.clear();
				break;
			case 'cleanContent':
				cleanContentCache.clear();
				break;
			case 'getCleanContent':
				getCleanContentCache.clear();
				break;
			default:
				console.warn(`Unknown cache type: ${type}`);
		}
	},

	/**
	 * Check if cache should be cleared based on memory usage
	 * @param {number} maxSize - Maximum total cache size before clearing
	 */
	checkMemoryUsage(maxSize = 1000) {
		checkStyleResolverMemoryUsage(maxSize);
	},
};

export default styleResolver;
