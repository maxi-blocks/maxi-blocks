/**
 * Memory Profiler for MaxiBlocks
 *
 * Provides comprehensive memory monitoring, leak detection,
 * and performance tracking for the MaxiBlocks plugin.
 */

/**
 * Memory usage thresholds (in bytes)
 */
export const MEMORY_THRESHOLDS = {
	WARNING: 50 * 1024 * 1024, // 50MB
	CRITICAL: 100 * 1024 * 1024, // 100MB
	MAX_HEAP: 200 * 1024 * 1024, // 200MB
};

/**
 * Memory monitoring configuration
 */
export const MONITORING_CONFIG = {
	SAMPLE_INTERVAL: 5000, // 5 seconds
	HISTORY_SIZE: 100, // Keep last 100 samples
	ALERT_THRESHOLD: 3, // Alert after 3 consecutive high readings
	GC_TRIGGER_THRESHOLD: 0.8, // Trigger GC at 80% of threshold
};

/**
 * Memory usage tracker
 */
class MemoryUsageTracker {
	constructor() {
		this.samples = [];
		this.alerts = [];
		this.isMonitoring = false;
		this.monitoringInterval = null;
		this.consecutiveHighReadings = 0;
		this.totalSamples = 0;
		this.startTime = Date.now();
	}

	/**
	 * Start memory monitoring
	 */
	startMonitoring() {
		if (this.isMonitoring) return;

		this.isMonitoring = true;
		this.monitoringInterval = setInterval(() => {
			this.takeSample();
		}, MONITORING_CONFIG.SAMPLE_INTERVAL);

		console.log('MaxiBlocks MemoryProfiler: Started monitoring');
	}

	/**
	 * Stop memory monitoring
	 */
	stopMonitoring() {
		if (!this.isMonitoring) return;

		this.isMonitoring = false;
		if (this.monitoringInterval) {
			clearInterval(this.monitoringInterval);
			this.monitoringInterval = null;
		}

		console.log('MaxiBlocks MemoryProfiler: Stopped monitoring');
	}

	/**
	 * Take a memory usage sample
	 */
	takeSample() {
		const sample = this.getCurrentMemoryUsage();
		this.samples.push(sample);
		this.totalSamples++;

		// Limit sample history
		if (this.samples.length > MONITORING_CONFIG.HISTORY_SIZE) {
			this.samples.shift();
		}

		// Check for memory issues
		this.checkMemoryThresholds(sample);

		return sample;
	}

	/**
	 * Get current memory usage information
	 * @returns {Object} Memory usage data
	 */
	getCurrentMemoryUsage() {
		const timestamp = Date.now();
		let memoryInfo = {
			timestamp,
			estimated: this.estimateMemoryUsage(),
			performance: null,
			gc: null
		};

		// Try to get performance memory info (Chrome/Edge)
		if (performance && performance.memory) {
			memoryInfo.performance = {
				usedJSHeapSize: performance.memory.usedJSHeapSize,
				totalJSHeapSize: performance.memory.totalJSHeapSize,
				jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
				usedPercentage: (performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100
			};
		}

		// Check if GC was triggered
		if (this.samples.length > 0) {
			const lastSample = this.samples[this.samples.length - 1];
			if (lastSample.performance && memoryInfo.performance) {
				const heapDrop = lastSample.performance.usedJSHeapSize - memoryInfo.performance.usedJSHeapSize;
				if (heapDrop > 10 * 1024 * 1024) { // 10MB drop indicates GC
					memoryInfo.gc = {
						detected: true,
						freedMemory: heapDrop,
						timestamp
					};
				}
			}
		}

		return memoryInfo;
	}

	/**
	 * Estimate memory usage based on DOM and cache sizes
	 * @returns {Object} Estimated memory usage
	 */
	estimateMemoryUsage() {
		const domElements = document.querySelectorAll('*').length;
		const maxiBlocks = document.querySelectorAll('[class*="maxi-"]').length;

		// Rough estimation based on element count and cache sizes
		const estimatedDOMMemory = domElements * 500; // ~500 bytes per element
		const estimatedMaxiMemory = maxiBlocks * 2000; // ~2KB per Maxi block

		// Get cache sizes if available
		let cacheMemory = 0;
		if (window.MaxiBlocksStyleCache) {
			cacheMemory += window.MaxiBlocksStyleCache.getEstimatedSize?.() || 0;
		}

		return {
			dom: estimatedDOMMemory,
			maxiBlocks: estimatedMaxiMemory,
			cache: cacheMemory,
			total: estimatedDOMMemory + estimatedMaxiMemory + cacheMemory,
			elementCounts: {
				total: domElements,
				maxiBlocks
			}
		};
	}

	/**
	 * Check memory usage against thresholds
	 * @param {Object} sample - Memory sample to check
	 */
	checkMemoryThresholds(sample) {
		const memoryUsage = sample.performance?.usedJSHeapSize || sample.estimated.total;

		if (memoryUsage > MEMORY_THRESHOLDS.CRITICAL) {
			this.consecutiveHighReadings++;
			this.createAlert('CRITICAL', memoryUsage, sample);
		} else if (memoryUsage > MEMORY_THRESHOLDS.WARNING) {
			this.consecutiveHighReadings++;
			this.createAlert('WARNING', memoryUsage, sample);
		} else {
			this.consecutiveHighReadings = 0;
		}

		// Trigger cleanup if we have consecutive high readings
		if (this.consecutiveHighReadings >= MONITORING_CONFIG.ALERT_THRESHOLD) {
			this.triggerMemoryCleanup(sample);
		}
	}

	/**
	 * Create a memory alert
	 * @param {string} level - Alert level (WARNING, CRITICAL)
	 * @param {number} memoryUsage - Current memory usage
	 * @param {Object} sample - Memory sample
	 */
	createAlert(level, memoryUsage, sample) {
		const alert = {
			level,
			memoryUsage,
			timestamp: sample.timestamp,
			sample: { ...sample },
			consecutiveCount: this.consecutiveHighReadings
		};

		this.alerts.push(alert);

		// Limit alert history
		if (this.alerts.length > 50) {
			this.alerts.shift();
		}

		console.warn(`MaxiBlocks Memory Alert [${level}]: ${(memoryUsage / 1024 / 1024).toFixed(2)}MB used`);

		// Dispatch custom event for other components to listen
		if (typeof window !== 'undefined') {
			window.dispatchEvent(new CustomEvent('maxiBlocks:memoryAlert', {
				detail: alert
			}));
		}
	}

	/**
	 * Trigger memory cleanup procedures
	 * @param {Object} sample - Current memory sample
	 */
	triggerMemoryCleanup(sample) {
		console.warn('MaxiBlocks: Triggering memory cleanup due to high usage');

		// Clear style caches
		if (window.MaxiBlocksStyleCache) {
			window.MaxiBlocksStyleCache.forceCleanup?.();
		}

		// Trigger relation cleanup if available
		if (window.MaxiBlocksCleanupManager) {
			window.MaxiBlocksCleanupManager.performMemoryOptimization?.();
		}

		// Request garbage collection if available
		if (window.gc && typeof window.gc === 'function') {
			try {
				window.gc();
				console.log('MaxiBlocks: Triggered garbage collection');
			} catch (error) {
				// GC not available or failed
			}
		}

		// Reset consecutive readings after cleanup
		this.consecutiveHighReadings = 0;

		// Record cleanup event
		this.createAlert('CLEANUP_TRIGGERED', sample.performance?.usedJSHeapSize || sample.estimated.total, sample);
	}

	/**
	 * Get monitoring statistics
	 * @returns {Object} Comprehensive monitoring stats
	 */
	getStats() {
		if (this.samples.length === 0) {
			return {
				monitoring: false,
				samples: 0,
				uptime: Date.now() - this.startTime
			};
		}

		const currentSample = this.samples[this.samples.length - 1];
		const firstSample = this.samples[0];

		// Calculate trends
		const memoryTrend = this.calculateMemoryTrend();
		const averageMemory = this.calculateAverageMemory();
		const peakMemory = this.findPeakMemory();

		return {
			monitoring: this.isMonitoring,
			uptime: Date.now() - this.startTime,
			samples: {
				total: this.totalSamples,
				stored: this.samples.length,
				interval: MONITORING_CONFIG.SAMPLE_INTERVAL
			},
			current: currentSample,
			trends: memoryTrend,
			statistics: {
				average: averageMemory,
				peak: peakMemory,
				alertCount: this.alerts.length,
				consecutiveHighReadings: this.consecutiveHighReadings
			},
			thresholds: MEMORY_THRESHOLDS,
			recentAlerts: this.alerts.slice(-5) // Last 5 alerts
		};
	}

	/**
	 * Calculate memory usage trend
	 * @returns {Object} Trend analysis
	 */
	calculateMemoryTrend() {
		if (this.samples.length < 10) {
			return { trend: 'insufficient_data', slope: 0 };
		}

		const recentSamples = this.samples.slice(-10);
		const memoryValues = recentSamples.map(sample =>
			sample.performance?.usedJSHeapSize || sample.estimated.total
		);

		// Simple linear regression to detect trend
		const n = memoryValues.length;
		const x = Array.from({ length: n }, (_, i) => i);
		const y = memoryValues;

		const sumX = x.reduce((a, b) => a + b, 0);
		const sumY = y.reduce((a, b) => a + b, 0);
		const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
		const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);

		const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);

		let trend = 'stable';
		if (slope > 1024 * 1024) { // 1MB/sample increase
			trend = 'increasing';
		} else if (slope < -1024 * 1024) { // 1MB/sample decrease
			trend = 'decreasing';
		}

		return {
			trend,
			slope: slope / 1024 / 1024, // Convert to MB
			confidence: Math.abs(slope) > 100 * 1024 ? 'high' : 'low'
		};
	}

	/**
	 * Calculate average memory usage
	 * @returns {Object} Average memory statistics
	 */
	calculateAverageMemory() {
		const memoryValues = this.samples.map(sample =>
			sample.performance?.usedJSHeapSize || sample.estimated.total
		);

		const sum = memoryValues.reduce((a, b) => a + b, 0);
		const average = sum / memoryValues.length;

		return {
			total: average,
			formattedMB: (average / 1024 / 1024).toFixed(2) + 'MB'
		};
	}

	/**
	 * Find peak memory usage
	 * @returns {Object} Peak memory information
	 */
	findPeakMemory() {
		let peak = { usage: 0, timestamp: null, sample: null };

		this.samples.forEach(sample => {
			const usage = sample.performance?.usedJSHeapSize || sample.estimated.total;
			if (usage > peak.usage) {
				peak = {
					usage,
					timestamp: sample.timestamp,
					sample
				};
			}
		});

		return {
			...peak,
			formattedMB: (peak.usage / 1024 / 1024).toFixed(2) + 'MB'
		};
	}

	/**
	 * Export memory data for analysis
	 * @returns {Object} Exportable memory data
	 */
	exportData() {
		return {
			config: MONITORING_CONFIG,
			thresholds: MEMORY_THRESHOLDS,
			samples: this.samples,
			alerts: this.alerts,
			stats: this.getStats(),
			exportedAt: Date.now()
		};
	}

	/**
	 * Reset all monitoring data
	 */
	reset() {
		this.samples = [];
		this.alerts = [];
		this.consecutiveHighReadings = 0;
		this.totalSamples = 0;
		this.startTime = Date.now();
	}
}

/**
 * Performance monitoring utilities
 */
export class PerformanceMonitor {
	constructor() {
		this.measurements = [];
		this.markers = new Map();
		this.maxMeasurements = 1000;
	}

	/**
	 * Start a performance measurement
	 * @param {string} name - Measurement name
	 */
	start(name) {
		const startTime = performance.now();
		this.markers.set(name, { startTime, endTime: null });

		if (performance.mark) {
			performance.mark(`${name}-start`);
		}
	}

	/**
	 * End a performance measurement
	 * @param {string} name - Measurement name
	 * @returns {number} Duration in milliseconds
	 */
	end(name) {
		const endTime = performance.now();
		const marker = this.markers.get(name);

		if (!marker) {
			console.warn(`Performance measurement '${name}' was not started`);
			return 0;
		}

		marker.endTime = endTime;
		const duration = endTime - marker.startTime;

		// Record measurement
		this.measurements.push({
			name,
			duration,
			startTime: marker.startTime,
			endTime,
			timestamp: Date.now()
		});

		// Limit measurements history
		if (this.measurements.length > this.maxMeasurements) {
			this.measurements.shift();
		}

		if (performance.mark && performance.measure) {
			try {
				performance.mark(`${name}-end`);
				performance.measure(name, `${name}-start`, `${name}-end`);
			} catch (error) {
				// Performance API might not support all browsers
			}
		}

		this.markers.delete(name);
		return duration;
	}

	/**
	 * Get performance statistics for a specific measurement
	 * @param {string} name - Measurement name
	 * @returns {Object} Performance statistics
	 */
	getStats(name) {
		const measurements = this.measurements.filter(m => m.name === name);

		if (measurements.length === 0) {
			return null;
		}

		const durations = measurements.map(m => m.duration);
		const sum = durations.reduce((a, b) => a + b, 0);

		return {
			name,
			count: measurements.length,
			total: sum,
			average: sum / measurements.length,
			min: Math.min(...durations),
			max: Math.max(...durations),
			recent: measurements.slice(-10) // Last 10 measurements
		};
	}

	/**
	 * Get all performance statistics
	 * @returns {Object} All performance data
	 */
	getAllStats() {
		const uniqueNames = [...new Set(this.measurements.map(m => m.name))];
		const stats = {};

		uniqueNames.forEach(name => {
			stats[name] = this.getStats(name);
		});

		return stats;
	}

	/**
	 * Clear all measurements
	 */
	clear() {
		this.measurements = [];
		this.markers.clear();

		if (performance.clearMarks) {
			performance.clearMarks();
		}
		if (performance.clearMeasures) {
			performance.clearMeasures();
		}
	}
}

/**
 * Global memory profiler instance
 */
export const globalMemoryProfiler = new MemoryUsageTracker();

/**
 * Global performance monitor instance
 */
export const globalPerformanceMonitor = new PerformanceMonitor();

/**
 * Initialize memory monitoring (auto-start in development)
 */
export function initializeMemoryMonitoring() {
	// Auto-start monitoring in development or when debug is enabled
	const isDevelopment = process.env.NODE_ENV === 'development';
	const isDebugEnabled = localStorage.getItem('maxiBlocks-debug') === 'true';

	if (isDevelopment || isDebugEnabled) {
		globalMemoryProfiler.startMonitoring();
		console.log('MaxiBlocks: Memory monitoring started (development mode)');
	}

	// Expose to window for debugging
	if (typeof window !== 'undefined') {
		window.MaxiBlocksMemoryProfiler = globalMemoryProfiler;
		window.MaxiBlocksPerformanceMonitor = globalPerformanceMonitor;
	}
}

/**
 * Memory monitoring utilities
 */
export const memoryUtils = {
	/**
	 * Get current memory status
	 * @returns {Object} Memory status summary
	 */
	getMemoryStatus() {
		const stats = globalMemoryProfiler.getStats();
		const current = stats.current;

		if (!current) {
			return { status: 'unknown', message: 'No memory data available' };
		}

		const memoryUsage = current.performance?.usedJSHeapSize || current.estimated.total;

		if (memoryUsage > MEMORY_THRESHOLDS.CRITICAL) {
			return {
				status: 'critical',
				usage: memoryUsage,
				message: 'Memory usage is critically high',
				recommendation: 'Immediate cleanup recommended'
			};
		}

		if (memoryUsage > MEMORY_THRESHOLDS.WARNING) {
			return {
				status: 'warning',
				usage: memoryUsage,
				message: 'Memory usage is high',
				recommendation: 'Consider cleanup'
			};
		}

		return {
			status: 'ok',
			usage: memoryUsage,
			message: 'Memory usage is normal'
		};
	},

	/**
	 * Force garbage collection and cleanup
	 */
	forceCleanup() {
		globalMemoryProfiler.triggerMemoryCleanup(
			globalMemoryProfiler.getCurrentMemoryUsage()
		);
	},

	/**
	 * Get formatted memory report
	 * @returns {string} Formatted memory report
	 */
	getMemoryReport() {
		const stats = globalMemoryProfiler.getStats();
		const status = this.getMemoryStatus();

		return `
MaxiBlocks Memory Report
========================
Status: ${status.status.toUpperCase()}
Current Usage: ${(status.usage / 1024 / 1024).toFixed(2)}MB
Message: ${status.message}

Monitoring: ${stats.monitoring ? 'Active' : 'Inactive'}
Samples: ${stats.samples?.total || 0}
Alerts: ${stats.statistics?.alertCount || 0}
Trend: ${stats.trends?.trend || 'unknown'}

Thresholds:
- Warning: ${(MEMORY_THRESHOLDS.WARNING / 1024 / 1024).toFixed(2)}MB
- Critical: ${(MEMORY_THRESHOLDS.CRITICAL / 1024 / 1024).toFixed(2)}MB
		`.trim();
	}
};

export default {
	MemoryUsageTracker,
	PerformanceMonitor,
	globalMemoryProfiler,
	globalPerformanceMonitor,
	memoryUtils,
	initializeMemoryMonitoring,
	MEMORY_THRESHOLDS,
	MONITORING_CONFIG
};