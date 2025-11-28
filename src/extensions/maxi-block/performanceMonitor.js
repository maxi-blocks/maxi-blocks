/**
 * Performance Monitor for UniqueID System
 *
 * Tracks cache performance metrics in development mode only
 * Provides insights into cache hit rates and tree traversal costs
 */

const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Performance metrics
 */
const metrics = {
	cacheHits: 0,
	cacheMisses: 0,
	treeTraversals: 0,
	treeTraversalTime: 0,
	cacheInvalidations: 0,
	uniqueIDChecks: 0,
	labelChecks: 0,
};

/**
 * Start timing a tree traversal
 *
 * @returns {number} Start timestamp
 */
export const startTraversal = () => {
	if (!isDevelopment) return 0;
	return performance.now();
};

/**
 * End timing a tree traversal
 *
 * @param {number} startTime - Start timestamp from startTraversal
 */
export const endTraversal = startTime => {
	if (!isDevelopment) return;

	const duration = performance.now() - startTime;
	metrics.treeTraversals += 1;
	metrics.treeTraversalTime += duration;
};

/**
 * Record a cache hit
 */
export const recordCacheHit = () => {
	if (!isDevelopment) return;
	metrics.cacheHits += 1;
};

/**
 * Record a cache miss
 */
export const recordCacheMiss = () => {
	if (!isDevelopment) return;
	metrics.cacheMisses += 1;
};

/**
 * Record a cache invalidation
 */
export const recordCacheInvalidation = () => {
	if (!isDevelopment) return;
	metrics.cacheInvalidations += 1;
};

/**
 * Record a uniqueID check
 */
export const recordUniqueIDCheck = () => {
	if (!isDevelopment) return;
	metrics.uniqueIDChecks += 1;
};

/**
 * Record a label check
 */
export const recordLabelCheck = () => {
	if (!isDevelopment) return;
	metrics.labelChecks += 1;
};

/**
 * Get current metrics
 *
 * @returns {Object} Current performance metrics
 */
export const getMetrics = () => {
	if (!isDevelopment) return null;

	const totalChecks = metrics.cacheHits + metrics.cacheMisses;
	const hitRate =
		totalChecks > 0 ? (metrics.cacheHits / totalChecks) * 100 : 0;
	const avgTraversalTime =
		metrics.treeTraversals > 0
			? metrics.treeTraversalTime / metrics.treeTraversals
			: 0;

	return {
		...metrics,
		hitRate: `${hitRate.toFixed(2)}%`,
		avgTraversalTime: `${avgTraversalTime.toFixed(2)}ms`,
		totalChecks,
	};
};

/**
 * Log current metrics to console
 */
export const logMetrics = () => {
	if (!isDevelopment) return;

	const currentMetrics = getMetrics();
	if (!currentMetrics) return;

	// eslint-disable-next-line no-console
	console.group('📊 MaxiBlocks Performance Metrics');
	// eslint-disable-next-line no-console
	console.log('Cache Hit Rate:', currentMetrics.hitRate);
	// eslint-disable-next-line no-console
	console.log('Cache Hits:', currentMetrics.cacheHits);
	// eslint-disable-next-line no-console
	console.log('Cache Misses:', currentMetrics.cacheMisses);
	// eslint-disable-next-line no-console
	console.log('Cache Invalidations:', currentMetrics.cacheInvalidations);
	// eslint-disable-next-line no-console
	console.log('Tree Traversals:', currentMetrics.treeTraversals);
	// eslint-disable-next-line no-console
	console.log('Avg Traversal Time:', currentMetrics.avgTraversalTime);
	// eslint-disable-next-line no-console
	console.log('UniqueID Checks:', currentMetrics.uniqueIDChecks);
	// eslint-disable-next-line no-console
	console.log('Label Checks:', currentMetrics.labelChecks);
	// eslint-disable-next-line no-console
	console.groupEnd();
};

/**
 * Reset metrics
 */
export const resetMetrics = () => {
	if (!isDevelopment) return;

	metrics.cacheHits = 0;
	metrics.cacheMisses = 0;
	metrics.treeTraversals = 0;
	metrics.treeTraversalTime = 0;
	metrics.cacheInvalidations = 0;
	metrics.uniqueIDChecks = 0;
	metrics.labelChecks = 0;
};

/**
 * Auto-log metrics every 30 seconds in development
 */
if (isDevelopment && typeof window !== 'undefined') {
	// Log metrics every 30 seconds
	setInterval(() => {
		const currentMetrics = getMetrics();
		if (
			currentMetrics &&
			(currentMetrics.totalChecks > 0 ||
				currentMetrics.treeTraversals > 0)
		) {
			logMetrics();
		}
	}, 30000);

	// Make metrics available globally for debugging
	window.maxiBlocksPerformance = {
		getMetrics,
		logMetrics,
		resetMetrics,
	};
}

export default {
	startTraversal,
	endTraversal,
	recordCacheHit,
	recordCacheMiss,
	recordCacheInvalidation,
	recordUniqueIDCheck,
	recordLabelCheck,
	getMetrics,
	logMetrics,
	resetMetrics,
};
