/**
 * Memory Leak Detector
 * Detects potential memory leaks in components, listeners, and state
 *
 * @package
 */

import performanceMonitor from './index';
import listenerTracker from './listenerTracker';

/**
 * Leak Detector Class
 * Identifies potential memory leaks
 */
class LeakDetector {
	constructor() {
		this.detectionInterval = null;
		this.leaks = [];
		this.previousMemory = 0;
		this.memoryGrowthSamples = [];
	}

	/**
	 * Initialize leak detection
	 */
	init() {
		if (!window.maxiDebugPerformance) return;

		console.log(
			'%c[Leak Detector] Initializing...',
			'background: #E91E63; color: white; font-weight: bold; padding: 2px 4px;'
		);

		// Run detection every 30 seconds
		this.detectionInterval = setInterval(() => {
			this.detectLeaks();
		}, 30000);

		console.log(
			'%c[Leak Detector] Active',
			'background: #E91E63; color: white; font-weight: bold; padding: 2px 4px;'
		);
	}

	/**
	 * Detect potential memory leaks
	 */
	detectLeaks() {
		if (!window.maxiDebugPerformance) return;

		const detectedLeaks = [];

		// Detect memory growth leaks
		const memoryLeak = this.detectMemoryGrowth();
		if (memoryLeak) {
			detectedLeaks.push(memoryLeak);
		}

		// Detect component lifecycle leaks
		const componentLeaks = this.detectComponentLeaks();
		detectedLeaks.push(...componentLeaks);

		// Detect listener leaks
		const listenerLeaks = this.detectListenerLeaks();
		detectedLeaks.push(...listenerLeaks);

		// Detect Redux state leaks
		const stateLeaks = this.detectStateLeaks();
		detectedLeaks.push(...stateLeaks);

		// Detect timeout/interval leaks
		const timerLeaks = this.detectTimerLeaks();
		detectedLeaks.push(...timerLeaks);

		// Detect detached DOM leaks
		const domLeaks = this.detectDetachedDOMLeaks();
		detectedLeaks.push(...domLeaks);

		// Add new leaks
		detectedLeaks.forEach(leak => {
			// Check if leak already exists
			const exists = this.leaks.some(
				l =>
					l.type === leak.type &&
					l.description === leak.description &&
					performance.now() - l.timestamp < 60000 // Within last minute
			);

			if (!exists) {
				this.leaks.push({
					...leak,
					timestamp: performance.now(),
				});

				// Log warning
				console.warn(
					`%c[Leak Detector] ${leak.severity.toUpperCase()}: ${
						leak.type
					}`,
					'background: #f44336; color: white; font-weight: bold; padding: 2px 4px;',
					JSON.stringify({
						description: leak.description,
						recommendation: leak.recommendation,
					})
				);
			}
		});

		// Keep only last 50 leaks
		if (this.leaks.length > 50) {
			this.leaks = this.leaks.slice(-50);
		}

		return detectedLeaks;
	}

	/**
	 * Detect memory growth patterns
	 *
	 * @returns {object|null} Leak data or null
	 */
	detectMemoryGrowth() {
		if (!performance.memory) return null;

		const currentMemory = performance.memory.usedJSHeapSize;

		if (this.previousMemory > 0) {
			const growth = currentMemory - this.previousMemory;
			const growthMB = growth / 1024 / 1024;

			this.memoryGrowthSamples.push(growthMB);

			// Keep only last 10 samples
			if (this.memoryGrowthSamples.length > 10) {
				this.memoryGrowthSamples.shift();
			}

			// Check for consistent growth
			if (this.memoryGrowthSamples.length >= 5) {
				const positiveGrowth = this.memoryGrowthSamples.filter(
					g => g > 0
				);
				const avgGrowth =
					positiveGrowth.reduce((sum, g) => sum + g, 0) /
					positiveGrowth.length;

				// If average growth is > 2MB and consistent
				if (avgGrowth > 2 && positiveGrowth.length >= 4) {
					this.previousMemory = currentMemory;
					return {
						type: 'memory_growth',
						severity: 'high',
						description: `Consistent memory growth detected: ${avgGrowth.toFixed(
							2
						)}MB per 30 seconds`,
						recommendation:
							'Check for: uncleaned event listeners, growing arrays in state, detached DOM nodes, or unreleased resources',
						metrics: {
							currentMemory: Math.round(
								currentMemory / 1024 / 1024
							),
							avgGrowth: avgGrowth.toFixed(2),
							samples: this.memoryGrowthSamples.length,
						},
					};
				}
			}
		}

		this.previousMemory = currentMemory;
		return null;
	}

	/**
	 * Detect component lifecycle leaks
	 *
	 * @returns {Array} Leak data array
	 */
	detectComponentLeaks() {
		const leaks = [];

		if (!performanceMonitor.isEnabled()) return leaks;

		const { mounted, unmounted, active } =
			performanceMonitor.metrics.components;

		// Check for mount/unmount imbalance
		const imbalance = mounted - unmounted;
		if (imbalance > 50 && mounted > 100) {
			leaks.push({
				type: 'component_lifecycle',
				severity: 'medium',
				description: `Component mount/unmount imbalance: ${imbalance} more mounted than unmounted (${mounted} mounted, ${unmounted} unmounted)`,
				recommendation:
					'Check componentWillUnmount methods for proper cleanup. Ensure all subscriptions, timers, and event listeners are removed.',
				metrics: { mounted, unmounted, active, imbalance },
			});
		}

		// Check for excessive active components
		if (active > 100) {
			leaks.push({
				type: 'component_count',
				severity: 'low',
				description: `High number of active components: ${active}`,
				recommendation:
					'Consider lazy loading or virtualization for large component trees.',
				metrics: { active },
			});
		}

		return leaks;
	}

	/**
	 * Detect listener leaks
	 *
	 * @returns {Array} Leak data array
	 */
	detectListenerLeaks() {
		const leaks = [];
		const listenerLeaksData = listenerTracker.detectLeaks();

		if (listenerLeaksData.length > 0) {
			leaks.push({
				type: 'event_listeners',
				severity: 'high',
				description: `${listenerLeaksData.length} long-lived listeners detected (> 5 minutes old)`,
				recommendation:
					'Ensure all event listeners are removed in cleanup functions or componentWillUnmount.',
				metrics: {
					count: listenerLeaksData.length,
					types: listenerLeaksData.reduce((acc, leak) => {
						acc[leak.type] = (acc[leak.type] || 0) + 1;
						return acc;
					}, {}),
				},
			});
		}

		// Check total listener count
		if (performanceMonitor.isEnabled()) {
			const totalListeners = performanceMonitor.metrics.listeners.total;
			if (totalListeners > 200) {
				leaks.push({
					type: 'listener_count',
					severity: 'medium',
					description: `High number of active listeners: ${totalListeners}`,
					recommendation:
						'Review listener usage. Consider using event delegation or consolidating listeners.',
					metrics: {
						total: totalListeners,
						mutationObservers:
							performanceMonitor.metrics.listeners
								.mutationObservers,
						eventListeners:
							performanceMonitor.metrics.listeners.eventListeners,
						subscriptions:
							performanceMonitor.metrics.listeners.subscriptions,
					},
				});
			}
		}

		return leaks;
	}

	/**
	 * Detect Redux state leaks
	 *
	 * @returns {Array} Leak data array
	 */
	detectStateLeaks() {
		const leaks = [];

		if (!performanceMonitor.isEnabled()) return leaks;

		const stateSnapshots = performanceMonitor.metrics.store.stateSize;
		if (stateSnapshots.length >= 2) {
			const first = stateSnapshots[0];
			const last = stateSnapshots[stateSnapshots.length - 1];

			if (first && last) {
				const growth = last.sizeKB - first.sizeKB;
				const growthPercent = (growth / first.sizeKB) * 100;

				// State growing significantly
				if (growth > 100 && growthPercent > 50) {
					leaks.push({
						type: 'redux_state',
						severity: 'medium',
						description: `Redux state size growing: ${
							first.sizeKB
						}KB → ${last.sizeKB}KB (${growthPercent.toFixed(
							1
						)}% increase)`,
						recommendation:
							'Check for: accumulating arrays, unremoved deprecated blocks, or cached data not being cleared.',
						metrics: {
							initialSize: first.sizeKB,
							currentSize: last.sizeKB,
							growth,
							growthPercent: growthPercent.toFixed(1),
						},
					});
				}
			}
		}

		return leaks;
	}

	/**
	 * Detect timer leaks (setTimeout/setInterval)
	 *
	 * @returns {Array} Leak data array
	 */
	detectTimerLeaks() {
		const leaks = [];

		// Check for high number of pending timers
		// This is an estimation based on setTimeout/setInterval tracking
		// Note: We can't directly count active timers in browser, so this is heuristic

		// Check performance marks for timer-related operations
		const marks = performance.getEntriesByType('mark');
		const timerMarks = marks.filter(m => m.name.includes('timer'));

		if (timerMarks.length > 100) {
			leaks.push({
				type: 'timers',
				severity: 'low',
				description: `Potential timer leak: ${timerMarks.length} timer-related performance marks`,
				recommendation:
					'Ensure all setTimeout and setInterval calls are cleared in cleanup functions.',
				metrics: { marksCount: timerMarks.length },
			});
		}

		return leaks;
	}

	/**
	 * Detect detached DOM node leaks
	 *
	 * @returns {Array} Leak data array
	 */
	detectDetachedDOMLeaks() {
		const leaks = [];

		if (!performanceMonitor.isEnabled()) return leaks;

		const { orphanedNodes } = performanceMonitor.metrics.dom;

		if (orphanedNodes > 10) {
			leaks.push({
				type: 'detached_dom',
				severity: 'medium',
				description: `${orphanedNodes} potentially orphaned DOM nodes detected`,
				recommendation:
					'Detached nodes may be held in memory by event listeners or JavaScript references. Ensure proper cleanup.',
				metrics: { orphanedNodes },
			});
		}

		return leaks;
	}

	/**
	 * Generate leak detection report
	 *
	 * @returns {Object} Report data
	 */
	report() {
		const recentLeaks = this.leaks.filter(
			l => performance.now() - l.timestamp < 60000
		); // Last minute

		const leaksByType = this.leaks.reduce((acc, leak) => {
			acc[leak.type] = (acc[leak.type] || 0) + 1;
			return acc;
		}, {});

		const leaksBySeverity = this.leaks.reduce((acc, leak) => {
			acc[leak.severity] = (acc[leak.severity] || 0) + 1;
			return acc;
		}, {});

		const reportData = {
			totalLeaks: this.leaks.length,
			recentLeaks: recentLeaks.length,
			byType: leaksByType,
			bySeverity: leaksBySeverity,
			details: recentLeaks.slice(-10), // Last 10 recent leaks
		};

		console.log(
			'%c=== Leak Detector Report ===',
			'background: #E91E63; color: white; font-weight: bold; padding: 4px 8px;'
		);
		console.log(
			`Total Leaks Detected: ${reportData.totalLeaks} (${reportData.recentLeaks} in last minute)`
		);
		console.log('%cBy Type:', 'color: #E91E63; font-weight: bold;');
		Object.entries(leaksByType).forEach(([type, count]) => {
			console.log(`  ${type}: ${count}`);
		});
		console.log('%cBy Severity:', 'color: #E91E63; font-weight: bold;');
		Object.entries(leaksBySeverity).forEach(([severity, count]) => {
			console.log(`  ${severity}: ${count}`);
		});

		if (recentLeaks.length > 0) {
			console.log(
				'%cRecent Leaks:',
				'color: #f44336; font-weight: bold;'
			);
			recentLeaks.slice(-5).forEach(leak => {
				console.log(
					`  [${leak.severity.toUpperCase()}] ${leak.type}: ${
						leak.description
					}`
				);
			});
		}

		console.log(
			'%c===========================',
			'background: #E91E63; color: white; font-weight: bold; padding: 4px 8px;'
		);

		return reportData;
	}

	/**
	 * Get all detected leaks
	 *
	 * @returns {Array} All leaks
	 */
	getAllLeaks() {
		return this.leaks;
	}

	/**
	 * Clear leak history
	 */
	clearLeaks() {
		this.leaks = [];
		console.log(
			'%c[Leak Detector] Leak history cleared',
			'background: #4CAF50; color: white; font-weight: bold; padding: 2px 4px;'
		);
	}

	/**
	 * Cleanup - stop detection
	 */
	cleanup() {
		if (this.detectionInterval) {
			clearInterval(this.detectionInterval);
			this.detectionInterval = null;
		}
	}
}

// Create singleton instance
const leakDetector = new LeakDetector();

export default leakDetector;
