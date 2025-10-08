/**
 * Memoization Helper for MaxiBlocks
 *
 * Provides LRU cache implementation for expensive calculations
 * to improve React component performance, especially with many blocks.
 */

/**
 * Simple memoization cache with LRU eviction
 * Used by style resolver and CSS cache for performance optimization
 */
class MemoCache {
	constructor(maxSize = 100) {
		this.cache = new Map();
		this.maxSize = maxSize;
	}

	get(key) {
		if (!this.cache.has(key)) {
			return undefined;
		}

		// Move to end (most recently used)
		const value = this.cache.get(key);
		this.cache.delete(key);
		this.cache.set(key, value);
		// eslint-disable-next-line getter-return, consistent-return
		return value;
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

export { MemoCache };

export default {
	MemoCache,
};
