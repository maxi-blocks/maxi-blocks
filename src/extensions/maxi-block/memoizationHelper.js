/**
 * Memoization Helper for MaxiBlocks
 *
 * Provides memoization utilities for expensive calculations
 * to improve React component performance, especially with many blocks.
 */

/**
 * Simple memoization cache with LRU eviction
 */
class MemoCache {
	constructor(maxSize = 100) {
		this.cache = new Map();
		this.maxSize = maxSize;
	}

	get(key) {
		if (this.cache.has(key)) {
			// Move to end (most recently used)
			const value = this.cache.get(key);
			this.cache.delete(key);
			this.cache.set(key, value);
			return value;
		}
		return undefined;
	}

	set(key, value) {
		if (this.cache.has(key)) {
			// Update existing
			this.cache.delete(key);
		} else if (this.cache.size >= this.maxSize) {
			// Remove least recently used
			const firstKey = this.cache.keys().next().value;
			this.cache.delete(firstKey);
		}
		this.cache.set(key, value);
	}

	clear() {
		this.cache.clear();
	}

	size() {
		return this.cache.size;
	}
}

/**
 * Create a memoized version of a function
 * @param {Function} fn - Function to memoize
 * @param {Function} keyFn - Function to generate cache key (optional)
 * @param {number} maxSize - Maximum cache size (default: 100)
 * @returns {Function} - Memoized function
 */
export const memoize = (fn, keyFn = null, maxSize = 100) => {
	const cache = new MemoCache(maxSize);

	return function memoized(...args) {
		// Generate cache key
		const key = keyFn ? keyFn(...args) : JSON.stringify(args);

		// Check cache
		const cached = cache.get(key);
		if (cached !== undefined) {
			return cached;
		}

		// Calculate and cache result
		const result = fn.apply(this, args);
		cache.set(key, result);
		return result;
	};
};

/**
 * Memoize object property access
 * @param {Function} fn - Function that returns object properties
 * @param {number} maxSize - Maximum cache size
 * @returns {Function} - Memoized function
 */
export const memoizeObjectAccess = (fn, maxSize = 50) => {
	return memoize(fn, (obj, path) => {
		// Create a stable key based on object identity and path
		return `${obj?.uniqueID || 'no-id'}:${path}`;
	}, maxSize);
};

/**
 * Memoize deep equality checks
 * @param {Function} equalityFn - Equality function (e.g., isEqual from lodash)
 * @param {number} maxSize - Maximum cache size
 * @returns {Function} - Memoized equality function
 */
export const memoizeDeepEqual = (equalityFn, maxSize = 200) => {
	return memoize(equalityFn, (obj1, obj2) => {
		// Create a stable key for the comparison
		const key1 = obj1?.uniqueID || JSON.stringify(obj1).slice(0, 50);
		const key2 = obj2?.uniqueID || JSON.stringify(obj2).slice(0, 50);
		return `${key1}__vs__${key2}`;
	}, maxSize);
};

/**
 * Create a shallow equality check for objects
 * @param {Object} obj1 - First object
 * @param {Object} obj2 - Second object
 * @returns {boolean} - True if shallowly equal
 */
export const shallowEqual = (obj1, obj2) => {
	if (obj1 === obj2) return true;
	if (!obj1 || !obj2) return false;
	if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return obj1 === obj2;

	const keys1 = Object.keys(obj1);
	const keys2 = Object.keys(obj2);

	if (keys1.length !== keys2.length) return false;

	for (const key of keys1) {
		if (obj1[key] !== obj2[key]) return false;
	}

	return true;
};

/**
 * Memoized shallow equality check
 */
export const memoizedShallowEqual = memoize(shallowEqual, (obj1, obj2) => {
	const id1 = obj1?.uniqueID || obj1?.clientId || 'unknown';
	const id2 = obj2?.uniqueID || obj2?.clientId || 'unknown';
	return `shallow:${id1}:${id2}`;
}, 100);

/**
 * Create a props comparison function optimized for MaxiBlocks
 * @param {Object} currentProps - Current props
 * @param {Object} nextProps - Next props
 * @returns {boolean} - True if props are equal for rendering purposes
 */
export const maxiPropsEqual = (currentProps, nextProps) => {
	// Quick identity check
	if (currentProps === nextProps) return true;

	// Check critical props first (fast paths)
	if (currentProps.isSelected !== nextProps.isSelected) return false;
	if (currentProps.deviceType !== nextProps.deviceType) return false;
	if (currentProps.baseBreakpoint !== nextProps.baseBreakpoint) return false;

	// Check attributes - most important for blocks
	const currentAttrs = currentProps.attributes;
	const nextAttrs = nextProps.attributes;

	if (currentAttrs === nextAttrs) return true;
	if (!currentAttrs || !nextAttrs) return false;

	// Quick checks for commonly changed attributes
	if (currentAttrs.uniqueID !== nextAttrs.uniqueID) return false;
	if (currentAttrs.blockStyle !== nextAttrs.blockStyle) return false;

	// Shallow comparison of other critical props
	const criticalProps = ['clientId', 'name', 'isValid'];
	for (const prop of criticalProps) {
		if (currentProps[prop] !== nextProps[prop]) return false;
	}

	return true;
};

/**
 * Memoized version of maxiPropsEqual
 */
export const memoizedMaxiPropsEqual = memoize(maxiPropsEqual, (current, next) => {
	const currentId = current?.attributes?.uniqueID || current?.clientId || 'unknown';
	const nextId = next?.attributes?.uniqueID || next?.clientId || 'unknown';
	return `props:${currentId}:${nextId}`;
}, 150);

/**
 * Create a style cache key for a block
 * @param {Object} attributes - Block attributes
 * @param {string} deviceType - Current device type
 * @param {string} baseBreakpoint - Base breakpoint
 * @returns {string} - Cache key
 */
export const createStyleCacheKey = (attributes, deviceType, baseBreakpoint) => {
	const { uniqueID, blockStyle } = attributes;
	return `styles:${uniqueID}:${blockStyle}:${deviceType}:${baseBreakpoint}`;
};

/**
 * Performance monitoring for memoization
 */
export class MemoizationProfiler {
	constructor() {
		this.stats = {
			totalCalls: 0,
			cacheHits: 0,
			cacheMisses: 0,
			averageExecutionTime: 0,
		};
	}

	recordCall(isHit, executionTime = 0) {
		this.stats.totalCalls++;
		if (isHit) {
			this.stats.cacheHits++;
		} else {
			this.stats.cacheMisses++;
			// Update running average of execution time
			const currentAvg = this.stats.averageExecutionTime;
			this.stats.averageExecutionTime =
				(currentAvg * (this.stats.cacheMisses - 1) + executionTime) / this.stats.cacheMisses;
		}
	}

	getStats() {
		const hitRate = this.stats.totalCalls > 0
			? (this.stats.cacheHits / this.stats.totalCalls) * 100
			: 0;

		return {
			...this.stats,
			hitRate: hitRate.toFixed(2) + '%',
		};
	}

	reset() {
		this.stats = {
			totalCalls: 0,
			cacheHits: 0,
			cacheMisses: 0,
			averageExecutionTime: 0,
		};
	}
}

// Global profiler instance
export const globalMemoProfiler = new MemoizationProfiler();

/**
 * Create a profiled memoized function
 * @param {Function} fn - Function to memoize
 * @param {string} name - Name for profiling
 * @param {Function} keyFn - Key generation function
 * @param {number} maxSize - Maximum cache size
 * @returns {Function} - Profiled memoized function
 */
export const profiledMemoize = (fn, name = 'unknown', keyFn = null, maxSize = 100) => {
	const memoizedFn = memoize(fn, keyFn, maxSize);
	const profiler = new MemoizationProfiler();

	const profiledFn = function(...args) {
		const startTime = performance.now();
		const result = memoizedFn.apply(this, args);
		const endTime = performance.now();

		// Check if this was a cache hit by comparing execution time
		const isHit = (endTime - startTime) < 0.1; // Cache hits are very fast
		profiler.recordCall(isHit, endTime - startTime);
		globalMemoProfiler.recordCall(isHit, endTime - startTime);

		return result;
	};

	// Add profiling methods
	profiledFn.getStats = () => profiler.getStats();
	profiledFn.resetStats = () => profiler.reset();

	// Use defineProperty for the name since it's read-only
	try {
		Object.defineProperty(profiledFn, 'name', {
			value: name,
			configurable: true
		});
	} catch (error) {
		// Fallback if defineProperty fails
		profiledFn._debugName = name;
	}

	return profiledFn;
};

export { MemoCache };

export default {
	MemoCache,
	memoize,
	memoizeObjectAccess,
	memoizeDeepEqual,
	shallowEqual,
	memoizedShallowEqual,
	maxiPropsEqual,
	memoizedMaxiPropsEqual,
	createStyleCacheKey,
	MemoizationProfiler,
	globalMemoProfiler,
	profiledMemoize,
};