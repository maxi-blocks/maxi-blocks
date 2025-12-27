/**
 * Memory Management Utilities for MaxiBlocks
 * 
 * Provides centralized cache cleanup and memory management
 * to prevent memory bloat in long editing sessions.
 */

// Registry of cleanup functions to call during memory cleanup
const cleanupRegistry = new Map();

/**
 * Register a cleanup function for a cache
 * @param {string} id - Unique identifier for the cache
 * @param {Function} cleanupFn - Function to call to clear/cleanup the cache
 */
export const registerCacheCleanup = (id, cleanupFn) => {
	cleanupRegistry.set(id, cleanupFn);
};

/**
 * Unregister a cleanup function
 * @param {string} id - Cache identifier to remove
 */
export const unregisterCacheCleanup = (id) => {
	cleanupRegistry.delete(id);
};

/**
 * Run all registered cleanup functions
 * @returns {number} Number of caches cleaned
 */
export const runGlobalCleanup = () => {
	let cleanedCount = 0;
	cleanupRegistry.forEach((cleanupFn, id) => {
		try {
			cleanupFn();
			cleanedCount++;
		} catch (error) {
			console.warn(`MaxiBlocks: Failed to cleanup cache "${id}":`, error);
		}
	});
	
	// Also trigger garbage collection hint if available
	if (typeof window !== 'undefined' && window.gc) {
		try {
			window.gc();
		} catch (e) {
			// gc() not available in most browsers
		}
	}
	
	console.log(`MaxiBlocks: Cleaned ${cleanedCount} caches`);
	return cleanedCount;
};

/**
 * Periodic memory cleanup timer
 */
let cleanupInterval = null;
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Start periodic memory cleanup
 * @param {number} intervalMs - Interval in milliseconds (default 5 minutes)
 */
export const startPeriodicCleanup = (intervalMs = CLEANUP_INTERVAL_MS) => {
	if (cleanupInterval) {
		clearInterval(cleanupInterval);
	}
	
	cleanupInterval = setInterval(() => {
		// Only cleanup if page has been idle for a bit
		if (typeof document !== 'undefined' && document.hidden) {
			runGlobalCleanup();
		}
	}, intervalMs);
	
	// Also cleanup when page becomes hidden (e.g., tab switch)
	if (typeof document !== 'undefined') {
		document.addEventListener('visibilitychange', () => {
			if (document.hidden) {
				runGlobalCleanup();
			}
		});
	}
};

/**
 * Stop periodic memory cleanup
 */
export const stopPeriodicCleanup = () => {
	if (cleanupInterval) {
		clearInterval(cleanupInterval);
		cleanupInterval = null;
	}
};

/**
 * Get memory cleanup status
 * @returns {Object} Status info
 */
export const getCleanupStatus = () => ({
	registeredCaches: cleanupRegistry.size,
	isPeriodicCleanupActive: !!cleanupInterval,
	cacheNames: Array.from(cleanupRegistry.keys()),
});

// Export for window access (debugging)
if (typeof window !== 'undefined') {
	window.maxiMemoryUtils = {
		runGlobalCleanup,
		getCleanupStatus,
		startPeriodicCleanup,
		stopPeriodicCleanup,
	};
}

export default {
	registerCacheCleanup,
	unregisterCacheCleanup,
	runGlobalCleanup,
	startPeriodicCleanup,
	stopPeriodicCleanup,
	getCleanupStatus,
};
