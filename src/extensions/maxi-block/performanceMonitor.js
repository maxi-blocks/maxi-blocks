/**
 * Performance Monitor for MaxiBlocks
 *
 * Provides comprehensive performance tracking, optimization suggestions,
 * and real-time monitoring for MaxiBlocks components.
 */

import { globalMemoryProfiler, globalPerformanceMonitor } from './memoryProfiler';
import { styleCacheUtils } from '../styles/styleResolver';
import { cssCacheUtils } from '../styles/store/reducer';

/**
 * Performance thresholds (in milliseconds)
 */
export const PERFORMANCE_THRESHOLDS = {
	RENDER_TIME: {
		GOOD: 16, // 60fps
		ACCEPTABLE: 33, // 30fps
		POOR: 100 // 10fps
	},
	BLOCK_LOAD_TIME: {
		GOOD: 50,
		ACCEPTABLE: 100,
		POOR: 300
	},
	STYLE_GENERATION: {
		GOOD: 5,
		ACCEPTABLE: 20,
		POOR: 50
	}
};

/**
 * Performance issues severity levels
 */
export const SEVERITY_LEVELS = {
	LOW: 1,
	MEDIUM: 2,
	HIGH: 3,
	CRITICAL: 4
};

/**
 * Performance issue tracker
 */
class PerformanceIssueTracker {
	constructor() {
		this.issues = [];
		this.maxIssues = 100;
		this.issueTypes = new Map();
	}

	/**
	 * Report a performance issue
	 * @param {string} type - Issue type
	 * @param {number} severity - Severity level
	 * @param {Object} details - Issue details
	 */
	reportIssue(type, severity, details = {}) {
		const issue = {
			id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
			type,
			severity,
			details,
			timestamp: Date.now(),
			resolved: false
		};

		this.issues.push(issue);

		// Track issue types
		if (!this.issueTypes.has(type)) {
			this.issueTypes.set(type, 0);
		}
		this.issueTypes.set(type, this.issueTypes.get(type) + 1);

		// Limit issues history
		if (this.issues.length > this.maxIssues) {
			this.issues.shift();
		}

		// Log critical issues immediately
		if (severity >= SEVERITY_LEVELS.HIGH) {
			console.warn(`MaxiBlocks Performance Issue [${this.getSeverityName(severity)}]: ${type}`, details);
		}

		return issue.id;
	}

	/**
	 * Mark an issue as resolved
	 * @param {string} issueId - Issue ID
	 */
	resolveIssue(issueId) {
		const issue = this.issues.find(i => i.id === issueId);
		if (issue) {
			issue.resolved = true;
			issue.resolvedAt = Date.now();
		}
	}

	/**
	 * Get severity name
	 * @param {number} severity - Severity level
	 * @returns {string} Severity name
	 */
	getSeverityName(severity) {
		const names = {
			[SEVERITY_LEVELS.LOW]: 'LOW',
			[SEVERITY_LEVELS.MEDIUM]: 'MEDIUM',
			[SEVERITY_LEVELS.HIGH]: 'HIGH',
			[SEVERITY_LEVELS.CRITICAL]: 'CRITICAL'
		};
		return names[severity] || 'UNKNOWN';
	}

	/**
	 * Get unresolved issues
	 * @returns {Array} Unresolved issues
	 */
	getUnresolvedIssues() {
		return this.issues.filter(issue => !issue.resolved);
	}

	/**
	 * Get issues by severity
	 * @param {number} minSeverity - Minimum severity level
	 * @returns {Array} Issues at or above the severity level
	 */
	getIssuesBySeverity(minSeverity) {
		return this.issues.filter(issue => issue.severity >= minSeverity);
	}

	/**
	 * Get issue statistics
	 * @returns {Object} Issue statistics
	 */
	getStats() {
		const unresolved = this.getUnresolvedIssues();
		const critical = this.getIssuesBySeverity(SEVERITY_LEVELS.CRITICAL);
		const high = this.getIssuesBySeverity(SEVERITY_LEVELS.HIGH);

		return {
			total: this.issues.length,
			unresolved: unresolved.length,
			critical: critical.length,
			high: high.length,
			byType: Object.fromEntries(this.issueTypes),
			recent: this.issues.slice(-10)
		};
	}
}

/**
 * Block performance tracker
 */
class BlockPerformanceTracker {
	constructor() {
		this.blockMetrics = new Map();
		this.renderTimes = [];
		this.maxRenderTimes = 100;
	}

	/**
	 * Start tracking a block's performance
	 * @param {string} blockId - Block unique ID
	 * @param {string} blockType - Block type
	 */
	startBlockTracking(blockId, blockType) {
		globalPerformanceMonitor.start(`block_${blockId}`);

		if (!this.blockMetrics.has(blockId)) {
			this.blockMetrics.set(blockId, {
				blockType,
				renderCount: 0,
				totalRenderTime: 0,
				averageRenderTime: 0,
				lastRenderTime: 0,
				issues: []
			});
		}
	}

	/**
	 * End tracking a block's performance
	 * @param {string} blockId - Block unique ID
	 * @returns {number} Render time
	 */
	endBlockTracking(blockId) {
		const renderTime = globalPerformanceMonitor.end(`block_${blockId}`);
		const metrics = this.blockMetrics.get(blockId);

		if (metrics) {
			metrics.renderCount++;
			metrics.totalRenderTime += renderTime;
			metrics.averageRenderTime = metrics.totalRenderTime / metrics.renderCount;
			metrics.lastRenderTime = renderTime;

			// Track overall render times
			this.renderTimes.push({
				blockId,
				blockType: metrics.blockType,
				renderTime,
				timestamp: Date.now()
			});

			// Limit render times history
			if (this.renderTimes.length > this.maxRenderTimes) {
				this.renderTimes.shift();
			}

			// Check for performance issues
			this.checkBlockPerformance(blockId, renderTime, metrics);
		}

		return renderTime;
	}

	/**
	 * Check block performance for issues
	 * @param {string} blockId - Block ID
	 * @param {number} renderTime - Current render time
	 * @param {Object} metrics - Block metrics
	 */
	checkBlockPerformance(blockId, renderTime, metrics) {
		const issues = [];

		// Check render time thresholds
		if (renderTime > PERFORMANCE_THRESHOLDS.RENDER_TIME.POOR) {
			issues.push({
				type: 'slow_render',
				severity: SEVERITY_LEVELS.HIGH,
				details: {
					blockId,
					blockType: metrics.blockType,
					renderTime,
					threshold: PERFORMANCE_THRESHOLDS.RENDER_TIME.POOR
				}
			});
		} else if (renderTime > PERFORMANCE_THRESHOLDS.RENDER_TIME.ACCEPTABLE) {
			issues.push({
				type: 'slow_render',
				severity: SEVERITY_LEVELS.MEDIUM,
				details: {
					blockId,
					blockType: metrics.blockType,
					renderTime,
					threshold: PERFORMANCE_THRESHOLDS.RENDER_TIME.ACCEPTABLE
				}
			});
		}

		// Check for consistently slow rendering
		if (metrics.renderCount >= 5 && metrics.averageRenderTime > PERFORMANCE_THRESHOLDS.RENDER_TIME.ACCEPTABLE) {
			issues.push({
				type: 'consistently_slow',
				severity: SEVERITY_LEVELS.HIGH,
				details: {
					blockId,
					blockType: metrics.blockType,
					averageRenderTime: metrics.averageRenderTime,
					renderCount: metrics.renderCount
				}
			});
		}

		// Store issues in metrics
		metrics.issues.push(...issues);

		return issues;
	}

	/**
	 * Get performance metrics for a block
	 * @param {string} blockId - Block ID
	 * @returns {Object} Block performance metrics
	 */
	getBlockMetrics(blockId) {
		return this.blockMetrics.get(blockId);
	}

	/**
	 * Get overall render performance statistics
	 * @returns {Object} Render performance stats
	 */
	getRenderStats() {
		if (this.renderTimes.length === 0) {
			return { noData: true };
		}

		const times = this.renderTimes.map(r => r.renderTime);
		const sum = times.reduce((a, b) => a + b, 0);

		return {
			total: this.renderTimes.length,
			average: sum / times.length,
			min: Math.min(...times),
			max: Math.max(...times),
			recent: this.renderTimes.slice(-10),
			byBlockType: this.getStatsByBlockType()
		};
	}

	/**
	 * Get statistics grouped by block type
	 * @returns {Object} Stats by block type
	 */
	getStatsByBlockType() {
		const stats = {};

		this.renderTimes.forEach(({ blockType, renderTime }) => {
			if (!stats[blockType]) {
				stats[blockType] = {
					count: 0,
					total: 0,
					average: 0,
					min: Infinity,
					max: 0
				};
			}

			const stat = stats[blockType];
			stat.count++;
			stat.total += renderTime;
			stat.average = stat.total / stat.count;
			stat.min = Math.min(stat.min, renderTime);
			stat.max = Math.max(stat.max, renderTime);
		});

		return stats;
	}
}

/**
 * Optimization suggestion engine
 */
class OptimizationSuggestionEngine {
	constructor() {
		this.suggestions = [];
		this.appliedOptimizations = new Set();
	}

	/**
	 * Analyze performance data and generate suggestions
	 * @param {Object} performanceData - Performance data to analyze
	 * @returns {Array} Optimization suggestions
	 */
	generateSuggestions(performanceData) {
		this.suggestions = [];

		// Analyze memory usage
		this.analyzeMemoryUsage(performanceData.memory);

		// Analyze render performance
		this.analyzeRenderPerformance(performanceData.render);

		// Analyze cache efficiency
		this.analyzeCacheEfficiency(performanceData.cache);

		// Analyze block-specific issues
		this.analyzeBlockIssues(performanceData.blocks);

		return this.suggestions;
	}

	/**
	 * Analyze memory usage patterns
	 * @param {Object} memoryData - Memory usage data
	 */
	analyzeMemoryUsage(memoryData) {
		if (!memoryData || !memoryData.current) return;

		const usage = memoryData.current.performance?.usedJSHeapSize || memoryData.current.estimated.total;
		const threshold = memoryData.thresholds;

		if (usage > threshold.WARNING) {
			this.suggestions.push({
				type: 'memory_optimization',
				priority: usage > threshold.CRITICAL ? 'high' : 'medium',
				title: 'High Memory Usage Detected',
				description: 'Memory usage is above recommended levels. Consider enabling automatic cleanup.',
				actions: [
					'Enable automatic cache cleanup',
					'Reduce cache size limits',
					'Implement lazy loading for blocks'
				],
				impact: 'Reduces memory usage and prevents browser slowdowns'
			});
		}

		if (memoryData.trends?.trend === 'increasing') {
			this.suggestions.push({
				type: 'memory_leak',
				priority: 'high',
				title: 'Potential Memory Leak Detected',
				description: 'Memory usage is continuously increasing over time.',
				actions: [
					'Run memory leak detection',
					'Check for uncleared event listeners',
					'Review relation instance cleanup'
				],
				impact: 'Prevents memory leaks and improves long-term performance'
			});
		}
	}

	/**
	 * Analyze render performance
	 * @param {Object} renderData - Render performance data
	 */
	analyzeRenderPerformance(renderData) {
		if (!renderData || renderData.noData) return;

		if (renderData.average > PERFORMANCE_THRESHOLDS.RENDER_TIME.POOR) {
			this.suggestions.push({
				type: 'render_optimization',
				priority: 'high',
				title: 'Slow Rendering Performance',
				description: 'Block rendering is taking longer than optimal.',
				actions: [
					'Enable React.memo for block components',
					'Optimize re-render triggers',
					'Use virtualization for large lists'
				],
				impact: 'Improves user experience and editor responsiveness'
			});
		}

		// Check for specific slow block types
		Object.entries(renderData.byBlockType || {}).forEach(([blockType, stats]) => {
			if (stats.average > PERFORMANCE_THRESHOLDS.RENDER_TIME.ACCEPTABLE) {
				this.suggestions.push({
					type: 'block_specific_optimization',
					priority: 'medium',
					title: `Optimize ${blockType} Block Performance`,
					description: `${blockType} blocks are rendering slower than average.`,
					actions: [
						`Review ${blockType} component implementation`,
						'Optimize attribute processing',
						'Consider memoization for expensive calculations'
					],
					impact: `Improves ${blockType} block performance`
				});
			}
		});
	}

	/**
	 * Analyze cache efficiency
	 * @param {Object} cacheData - Cache performance data
	 */
	analyzeCacheEfficiency(cacheData) {
		if (!cacheData) return;

		// Check style cache efficiency
		if (cacheData.style && parseFloat(cacheData.style.hitRate) < 70) {
			this.suggestions.push({
				type: 'cache_optimization',
				priority: 'medium',
				title: 'Low Cache Hit Rate',
				description: 'Style cache hit rate is below optimal levels.',
				actions: [
					'Increase cache size limits',
					'Optimize cache key generation',
					'Review cache invalidation strategy'
				],
				impact: 'Reduces style recalculation and improves performance'
			});
		}

		// Check for cache memory usage
		if (cacheData.css && cacheData.css.totalCacheSize > 1000) {
			this.suggestions.push({
				type: 'cache_size_optimization',
				priority: 'low',
				title: 'Large Cache Size',
				description: 'Cache size is growing large. Consider cleanup strategies.',
				actions: [
					'Implement cache size limits',
					'Add periodic cache cleanup',
					'Optimize cached data structure'
				],
				impact: 'Reduces memory usage while maintaining performance'
			});
		}
	}

	/**
	 * Analyze block-specific performance issues
	 * @param {Object} blockData - Block performance data
	 */
	analyzeBlockIssues(blockData) {
		if (!blockData) return;

		// Find blocks with consistent performance issues
		Object.entries(blockData).forEach(([blockId, metrics]) => {
			if (metrics.issues && metrics.issues.length > 3) {
				this.suggestions.push({
					type: 'problematic_block',
					priority: 'high',
					title: `Block ${blockId} Has Multiple Issues`,
					description: 'This block is experiencing multiple performance problems.',
					actions: [
						'Review block implementation',
						'Check for memory leaks',
						'Optimize attribute updates',
						'Consider block restructuring'
					],
					impact: 'Fixes problematic block and improves overall performance'
				});
			}
		});
	}

	/**
	 * Mark an optimization as applied
	 * @param {string} optimizationType - Type of optimization applied
	 */
	markOptimizationApplied(optimizationType) {
		this.appliedOptimizations.add(optimizationType);
	}

	/**
	 * Get suggestions that haven't been applied
	 * @returns {Array} Unapplied suggestions
	 */
	getUnappliedSuggestions() {
		return this.suggestions.filter(suggestion =>
			!this.appliedOptimizations.has(suggestion.type)
		);
	}
}

/**
 * Main performance monitor class
 */
export class MaxiBlocksPerformanceMonitor {
	constructor() {
		this.issueTracker = new PerformanceIssueTracker();
		this.blockTracker = new BlockPerformanceTracker();
		this.suggestionEngine = new OptimizationSuggestionEngine();
		this.isMonitoring = false;
		this.monitoringInterval = null;
		this.reportHistory = [];
	}

	/**
	 * Start performance monitoring
	 */
	startMonitoring() {
		if (this.isMonitoring) return;

		this.isMonitoring = true;
		globalMemoryProfiler.startMonitoring();

		// Generate performance reports periodically
		this.monitoringInterval = setInterval(() => {
			this.generatePerformanceReport();
		}, 30000); // Every 30 seconds

		console.log('MaxiBlocks Performance Monitor: Started monitoring');
	}

	/**
	 * Stop performance monitoring
	 */
	stopMonitoring() {
		if (!this.isMonitoring) return;

		this.isMonitoring = false;
		globalMemoryProfiler.stopMonitoring();

		if (this.monitoringInterval) {
			clearInterval(this.monitoringInterval);
			this.monitoringInterval = null;
		}

		console.log('MaxiBlocks Performance Monitor: Stopped monitoring');
	}

	/**
	 * Track block performance
	 * @param {string} blockId - Block ID
	 * @param {string} blockType - Block type
	 * @returns {Function} End tracking function
	 */
	trackBlock(blockId, blockType) {
		this.blockTracker.startBlockTracking(blockId, blockType);

		return () => {
			const renderTime = this.blockTracker.endBlockTracking(blockId);

			// Check for performance issues
			const issues = this.blockTracker.checkBlockPerformance(blockId, renderTime,
				this.blockTracker.getBlockMetrics(blockId)
			);

			// Report issues to issue tracker
			issues.forEach(issue => {
				this.issueTracker.reportIssue(issue.type, issue.severity, issue.details);
			});

			return renderTime;
		};
	}

	/**
	 * Generate comprehensive performance report
	 * @returns {Object} Performance report
	 */
	generatePerformanceReport() {
		const report = {
			timestamp: Date.now(),
			memory: globalMemoryProfiler.getStats(),
			render: this.blockTracker.getRenderStats(),
			cache: {
				style: styleCacheUtils.getStats(),
				css: cssCacheUtils.getStats()
			},
			issues: this.issueTracker.getStats(),
			blocks: Object.fromEntries(this.blockTracker.blockMetrics),
			performance: globalPerformanceMonitor.getAllStats()
		};

		// Generate optimization suggestions
		report.suggestions = this.suggestionEngine.generateSuggestions(report);

		// Store in history
		this.reportHistory.push(report);
		if (this.reportHistory.length > 10) {
			this.reportHistory.shift();
		}

		return report;
	}

	/**
	 * Get current performance status
	 * @returns {Object} Performance status
	 */
	getPerformanceStatus() {
		const report = this.generatePerformanceReport();
		const criticalIssues = this.issueTracker.getIssuesBySeverity(SEVERITY_LEVELS.CRITICAL);
		const highIssues = this.issueTracker.getIssuesBySeverity(SEVERITY_LEVELS.HIGH);

		let status = 'good';
		let message = 'Performance is optimal';

		if (criticalIssues.length > 0) {
			status = 'critical';
			message = `${criticalIssues.length} critical performance issues detected`;
		} else if (highIssues.length > 0) {
			status = 'warning';
			message = `${highIssues.length} high-priority performance issues detected`;
		} else if (report.render.average > PERFORMANCE_THRESHOLDS.RENDER_TIME.ACCEPTABLE) {
			status = 'warning';
			message = 'Render performance is below optimal';
		}

		return {
			status,
			message,
			report,
			suggestions: report.suggestions.slice(0, 5) // Top 5 suggestions
		};
	}

	/**
	 * Export performance data
	 * @returns {Object} Exportable performance data
	 */
	exportData() {
		return {
			config: {
				thresholds: PERFORMANCE_THRESHOLDS,
				severityLevels: SEVERITY_LEVELS
			},
			reportHistory: this.reportHistory,
			currentStatus: this.getPerformanceStatus(),
			exportedAt: Date.now()
		};
	}

	/**
	 * Reset all performance data
	 */
	reset() {
		this.issueTracker = new PerformanceIssueTracker();
		this.blockTracker = new BlockPerformanceTracker();
		this.suggestionEngine = new OptimizationSuggestionEngine();
		this.reportHistory = [];
		globalPerformanceMonitor.clear();
		globalMemoryProfiler.reset();
	}
}

// Global performance monitor instance
export const globalMaxiPerformanceMonitor = new MaxiBlocksPerformanceMonitor();

/**
 * Performance monitoring utilities
 */
export const performanceUtils = {
	/**
	 * Start monitoring (convenience function)
	 */
	startMonitoring() {
		globalMaxiPerformanceMonitor.startMonitoring();
	},

	/**
	 * Stop monitoring (convenience function)
	 */
	stopMonitoring() {
		globalMaxiPerformanceMonitor.stopMonitoring();
	},

	/**
	 * Get performance status
	 * @returns {Object} Current performance status
	 */
	getStatus() {
		return globalMaxiPerformanceMonitor.getPerformanceStatus();
	},

	/**
	 * Track a block's performance
	 * @param {string} blockId - Block ID
	 * @param {string} blockType - Block type
	 * @returns {Function} End tracking function
	 */
	trackBlock(blockId, blockType) {
		return globalMaxiPerformanceMonitor.trackBlock(blockId, blockType);
	},

	/**
	 * Get formatted performance report
	 * @returns {string} Formatted performance report
	 */
	getFormattedReport() {
		const status = this.getStatus();
		const report = status.report;

		return `
MaxiBlocks Performance Report
============================
Status: ${status.status.toUpperCase()}
Message: ${status.message}

Memory Usage: ${report.memory.current ? (report.memory.current.performance?.usedJSHeapSize / 1024 / 1024).toFixed(2) + 'MB' : 'Unknown'}
Average Render Time: ${report.render.average ? report.render.average.toFixed(2) + 'ms' : 'No data'}
Cache Hit Rate: ${report.cache.style?.hitRate || 'Unknown'}

Critical Issues: ${report.issues.critical}
High Priority Issues: ${report.issues.high}
Total Issues: ${report.issues.total}

Top Suggestions:
${status.suggestions.map((s, i) => `${i + 1}. ${s.title} (${s.priority})`).join('\n')}
		`.trim();
	}
};

// Initialize monitoring in development
if (process.env.NODE_ENV === 'development') {
	globalMaxiPerformanceMonitor.startMonitoring();
}

// Expose to window for debugging
if (typeof window !== 'undefined') {
	window.MaxiBlocksPerformanceMonitor = globalMaxiPerformanceMonitor;
	window.MaxiBlocksPerformanceUtils = performanceUtils;
}

export default {
	MaxiBlocksPerformanceMonitor,
	globalMaxiPerformanceMonitor,
	performanceUtils,
	PERFORMANCE_THRESHOLDS,
	SEVERITY_LEVELS
};