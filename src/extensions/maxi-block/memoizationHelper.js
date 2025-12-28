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
	constructor(maxSize = 100, { maxAgeMs = null } = {}) {
		this.cache = new Map();
		this.maxSize = maxSize;
		this.maxAgeMs = maxAgeMs;
	}

	isEntryExpired(entry) {
		if (!this.maxAgeMs || !entry?.timestamp) {
			return false;
		}

		return Date.now() - entry.timestamp > this.maxAgeMs;
	}

	pruneExpiredEntries() {
		if (!this.maxAgeMs || this.cache.size === 0) {
			return;
		}

		for (const [key, entry] of this.cache.entries()) {
			if (this.isEntryExpired(entry)) {
				this.cache.delete(key);
			}
		}
	}

	get(key) {
		const entry = this.cache.get(key);

		if (!entry) {
			return undefined;
		}

		if (this.isEntryExpired(entry)) {
			this.cache.delete(key);
			return undefined;
		}

		// Move to end (most recently used)
		this.cache.delete(key);
		this.cache.set(key, entry);
		// eslint-disable-next-line getter-return, consistent-return
		return entry.value;
	}

	set(key, value) {
		this.pruneExpiredEntries();
		if (this.cache.has(key)) {
			// Update existing
			this.cache.delete(key);
		} else if (this.cache.size >= this.maxSize) {
			// Remove least recently used
			const firstKey = this.cache.keys().next().value;
			this.cache.delete(firstKey);
		}
		this.cache.set(key, { value, timestamp: Date.now() });
	}

	clear() {
		this.cache.clear();
	}

	size() {
		this.pruneExpiredEntries();
		return this.cache.size;
	}
}

export { MemoCache };

export default {
	MemoCache,
};
