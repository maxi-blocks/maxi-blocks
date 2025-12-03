/**
 * MaxiBlocks Performance Monitor
 * Development-only system for tracking memory, CPU, and performance metrics
 *
 * @package
 */

/**
 * Performance Monitor Class
 * Central tracking system for all performance metrics
 */
class PerformanceMonitor {
	constructor() {
		this.enabled = false;
		this.startTime = null;
		this.metrics = {
			memory: [],
			cpu: [],
			components: {
				mounted: 0,
				unmounted: 0,
				active: 0,
				byType: {},
				renders: {},
			},
			listeners: {
				total: 0,
				mutationObservers: 0,
				eventListeners: 0,
				subscriptions: 0,
				active: [],
			},
			store: {
				actions: [],
				stateSize: [],
				selectorCalls: {},
			},
			dom: {
				nodeCount: [],
				maxiBlockElements: [],
				orphanedNodes: 0,
			},
			api: {
				calls: [],
				failedCalls: 0,
				totalPayloadSize: 0,
			},
			warnings: [],
		};
		this.samplingInterval = null;
		this.reportInterval = null;
	}

	/**
	 * Initialize the performance monitor
	 *
	 * @returns {boolean} Success status
	 */
	init() {
		console.log(
			'%c[MaxiBlocks Performance Monitor] Initializing...',
			'background: #4CAF50; color: white; font-weight: bold; padding: 2px 4px;'
		);

		this.enabled = true;
		this.startTime = performance.now();

		// Start memory and CPU sampling
		this.startSampling();

		// Setup periodic reporting
		this.startPeriodicReporting();

		// Expose API to window
		window.maxiPerformance = {
			report: () => this.generateReport(),
			export: () => this.exportReport(),
			stop: () => this.stop(),
			start: () => this.init(),
			getMetrics: () => this.metrics,
			clearWarnings: () => {
				this.metrics.warnings = [];
			},
		};

		console.log(
			'%c[MaxiBlocks Performance Monitor] Active',
			'background: #4CAF50; color: white; font-weight: bold; padding: 2px 4px;',
			'\nUse window.maxiPerformance.report() to see metrics'
		);

		return true;
	}

	/**
	 * Start sampling memory and CPU metrics
	 */
	startSampling() {
		// Sample every 5 seconds
		this.samplingInterval = setInterval(() => {
			this.sampleMemory();
			this.sampleCPU();
			this.sampleDOM();
			this.detectIssues();
		}, 5000);
	}

	/**
	 * Sample current memory usage
	 */
	sampleMemory() {
		if (!performance.memory) {
			return;
		}

		const memoryData = {
			timestamp: performance.now() - this.startTime,
			usedJSHeapSize: performance.memory.usedJSHeapSize,
			totalJSHeapSize: performance.memory.totalJSHeapSize,
			jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
			usedMB: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
		};

		this.metrics.memory.push(memoryData);

		// Keep only last 100 samples
		if (this.metrics.memory.length > 100) {
			this.metrics.memory.shift();
		}
	}

	/**
	 * Sample CPU performance using Performance API
	 */
	sampleCPU() {
		const entries = performance.getEntriesByType('measure');
		const recentEntries = entries.filter(
			entry => entry.startTime > this.startTime
		);

		if (recentEntries.length > 0) {
			const totalDuration = recentEntries.reduce(
				(sum, entry) => sum + entry.duration,
				0
			);
			const avgDuration =
				recentEntries.length > 0
					? totalDuration / recentEntries.length
					: 0;

			this.metrics.cpu.push({
				timestamp: performance.now() - this.startTime,
				measureCount: recentEntries.length,
				totalDuration,
				avgDuration,
			});
		}

		// Keep only last 100 samples
		if (this.metrics.cpu.length > 100) {
			this.metrics.cpu.shift();
		}
	}

	/**
	 * Sample DOM metrics
	 */
	sampleDOM() {
		const totalNodes = document.querySelectorAll('*').length;
		const maxiBlocks = document.querySelectorAll('.maxi-block').length;

		this.metrics.dom.nodeCount.push({
			timestamp: performance.now() - this.startTime,
			count: totalNodes,
		});

		this.metrics.dom.maxiBlockElements.push({
			timestamp: performance.now() - this.startTime,
			count: maxiBlocks,
		});

		// Keep only last 100 samples
		if (this.metrics.dom.nodeCount.length > 100) {
			this.metrics.dom.nodeCount.shift();
		}
		if (this.metrics.dom.maxiBlockElements.length > 100) {
			this.metrics.dom.maxiBlockElements.shift();
		}
	}

	/**
	 * Detect potential issues and add warnings
	 */
	detectIssues() {
		const warnings = [];

		// Check memory growth
		if (this.metrics.memory.length >= 2) {
			const first = this.metrics.memory[0];
			const last = this.metrics.memory[this.metrics.memory.length - 1];
			const memoryGrowth = last.usedMB - first.usedMB;
			const timeElapsed = (last.timestamp - first.timestamp) / 1000 / 60; // minutes

			if (timeElapsed > 0) {
				const growthRate = memoryGrowth / timeElapsed; // MB per minute

				if (growthRate > 5) {
					warnings.push({
						type: 'memory_leak',
						severity: 'high',
						message: `High memory growth rate: ${growthRate.toFixed(
							2
						)} MB/min`,
						timestamp: performance.now() - this.startTime,
					});
				}
			}
		}

		// Check for too many active listeners
		if (this.metrics.listeners.total > 200) {
			warnings.push({
				type: 'listener_leak',
				severity: 'medium',
				message: `High number of active listeners: ${this.metrics.listeners.total}`,
				timestamp: performance.now() - this.startTime,
			});
		}

		// Check for component mount/unmount imbalance
		const componentImbalance =
			this.metrics.components.mounted - this.metrics.components.unmounted;
		if (componentImbalance > 50 && this.metrics.components.mounted > 100) {
			warnings.push({
				type: 'component_leak',
				severity: 'medium',
				message: `Component mount/unmount imbalance: ${componentImbalance} more mounted than unmounted`,
				timestamp: performance.now() - this.startTime,
			});
		}

		// Add new warnings
		warnings.forEach(warning => {
			// Only add if not already present
			const exists = this.metrics.warnings.some(
				w =>
					w.type === warning.type &&
					w.message === warning.message &&
					performance.now() - this.startTime - w.timestamp < 30000 // Within last 30 seconds
			);

			if (!exists) {
				this.metrics.warnings.push(warning);
				console.warn(
					`%c[MaxiBlocks Performance] ${warning.severity.toUpperCase()}: ${
						warning.message
					}`,
					'background: #FF9800; color: white; font-weight: bold; padding: 2px 4px;'
				);
			}
		});
	}

	/**
	 * Start periodic console reporting
	 */
	startPeriodicReporting() {
		// Report every 30 seconds
		this.reportInterval = setInterval(() => {
			this.generateConsoleDashboard();
		}, 30000);
	}

	/**
	 * Generate console dashboard
	 */
	generateConsoleDashboard() {
		const latestMemory =
			this.metrics.memory[this.metrics.memory.length - 1];
		const memoryUsed = latestMemory ? latestMemory.usedMB : 0;

		// Calculate memory growth rate
		let growthRate = 0;
		if (this.metrics.memory.length >= 2) {
			const first = this.metrics.memory[0];
			const last = this.metrics.memory[this.metrics.memory.length - 1];
			const memoryGrowth = last.usedMB - first.usedMB;
			const timeElapsed = (last.timestamp - first.timestamp) / 1000 / 60;
			growthRate = timeElapsed > 0 ? memoryGrowth / timeElapsed : 0;
		}

		// Calculate average render time
		const renderTimes = Object.values(this.metrics.components.renders);
		const avgRenderTime =
			renderTimes.length > 0
				? renderTimes.reduce((sum, r) => sum + r.totalTime, 0) /
				  renderTimes.reduce((sum, r) => sum + r.count, 0)
				: 0;

		// Calculate actions per second
		const recentActions = this.metrics.store.actions.filter(
			a => performance.now() - this.startTime - a.timestamp < 1000
		);

		console.log(
			'%c=== MaxiBlocks Performance Monitor ===',
			'background: #2196F3; color: white; font-weight: bold; padding: 4px 8px; font-size: 14px;'
		);
		console.log(
			`Memory: ${memoryUsed} MB (${
				growthRate >= 0 ? '+' : ''
			}${growthRate.toFixed(2)} MB/min)`
		);
		console.log(
			`Active Blocks: ${this.metrics.components.active} (${this.metrics.components.mounted} mounted, ${this.metrics.components.unmounted} unmounted)`
		);
		console.log(
			`Event Listeners: ${this.metrics.listeners.total} (${this.metrics.listeners.mutationObservers} MutationObservers, ${this.metrics.listeners.subscriptions} subscriptions)`
		);
		console.log(
			`Redux Actions/sec: ${recentActions.length} (${this.metrics.store.actions.length} total)`
		);
		console.log(`Render Time (avg): ${avgRenderTime.toFixed(2)}ms`);
		console.log(`Warnings: ${this.metrics.warnings.length}`);

		if (this.metrics.warnings.length > 0) {
			console.log(
				'%cRecent Warnings:',
				'color: #FF9800; font-weight: bold;'
			);
			this.metrics.warnings.slice(-5).forEach(warning => {
				console.log(
					`  [${warning.severity.toUpperCase()}] ${warning.type}: ${
						warning.message
					}`
				);
			});
		}

		console.log(
			'%c=====================================',
			'background: #2196F3; color: white; font-weight: bold; padding: 4px 8px;'
		);
	}

	/**
	 * Generate full performance report
	 *
	 * @returns {Object} Performance report
	 */
	generateReport() {
		const report = {
			session: {
				startTime: this.startTime,
				duration: performance.now() - this.startTime,
				durationMinutes:
					(performance.now() - this.startTime) / 1000 / 60,
			},
			memory: {
				current: this.metrics.memory[this.metrics.memory.length - 1],
				initial: this.metrics.memory[0],
				samples: this.metrics.memory.length,
				trend: this.calculateTrend(this.metrics.memory, 'usedMB'),
			},
			components: {
				...this.metrics.components,
				topRenders: this.getTopRenderers(),
			},
			listeners: this.metrics.listeners,
			store: {
				totalActions: this.metrics.store.actions.length,
				topActions: this.getTopActions(),
				stateSize:
					this.metrics.store.stateSize[
						this.metrics.store.stateSize.length - 1
					],
			},
			dom: {
				currentNodes:
					this.metrics.dom.nodeCount[
						this.metrics.dom.nodeCount.length - 1
					],
				currentMaxiBlocks:
					this.metrics.dom.maxiBlockElements[
						this.metrics.dom.maxiBlockElements.length - 1
					],
			},
			api: {
				totalCalls: this.metrics.api.calls.length,
				failedCalls: this.metrics.api.failedCalls,
				totalPayloadSize: this.metrics.api.totalPayloadSize,
				avgPayloadSize:
					this.metrics.api.calls.length > 0
						? this.metrics.api.totalPayloadSize /
						  this.metrics.api.calls.length
						: 0,
			},
			warnings: this.metrics.warnings,
			recommendations: this.generateRecommendations(),
		};

		console.log(
			'%c[MaxiBlocks Performance Report]',
			'background: #2196F3; color: white; font-weight: bold; padding: 2px 4px;',
			JSON.stringify(report, null, 2)
		);

		return report;
	}

	/**
	 * Calculate trend for a metric
	 *
	 * @param {Array}  data - Data array
	 * @param {string} key  - Key to analyze
	 * @returns {string} Trend description
	 */
	calculateTrend(data, key) {
		if (data.length < 2) {
			return 'insufficient_data';
		}

		const first = data[0][key];
		const last = data[data.length - 1][key];
		const change = last - first;
		const percentChange = (change / first) * 100;

		if (percentChange > 10) return 'increasing';
		if (percentChange < -10) return 'decreasing';
		return 'stable';
	}

	/**
	 * Get top rendering components
	 *
	 * @returns {Array} Top renderers
	 */
	getTopRenderers() {
		return Object.entries(this.metrics.components.renders)
			.map(([type, data]) => ({
				type,
				count: data.count,
				totalTime: data.totalTime,
				avgTime: data.totalTime / data.count,
			}))
			.sort((a, b) => b.totalTime - a.totalTime)
			.slice(0, 10);
	}

	/**
	 * Get top Redux actions
	 *
	 * @returns {Array} Top actions
	 */
	getTopActions() {
		const actionCounts = {};
		this.metrics.store.actions.forEach(action => {
			actionCounts[action.type] = (actionCounts[action.type] || 0) + 1;
		});

		return Object.entries(actionCounts)
			.map(([type, count]) => ({ type, count }))
			.sort((a, b) => b.count - a.count)
			.slice(0, 10);
	}

	/**
	 * Generate recommendations based on metrics
	 *
	 * @returns {Array} Recommendations
	 */
	generateRecommendations() {
		const recommendations = [];

		// Memory recommendations
		if (this.metrics.memory.length >= 2) {
			const memoryTrend = this.calculateTrend(
				this.metrics.memory,
				'usedMB'
			);
			if (memoryTrend === 'increasing') {
				recommendations.push({
					category: 'memory',
					priority: 'high',
					message:
						'Memory usage is increasing. Check for memory leaks in components and event listeners.',
				});
			}
		}

		// Listener recommendations
		if (this.metrics.listeners.total > 150) {
			recommendations.push({
				category: 'listeners',
				priority: 'medium',
				message:
					'High number of event listeners detected. Ensure proper cleanup in componentWillUnmount.',
			});
		}

		// Component recommendations
		const imbalance =
			this.metrics.components.mounted - this.metrics.components.unmounted;
		if (imbalance > 30 && this.metrics.components.mounted > 50) {
			recommendations.push({
				category: 'components',
				priority: 'medium',
				message:
					'Component mount/unmount imbalance detected. Check for components not properly unmounting.',
			});
		}

		// Render recommendations
		const topRenderers = this.getTopRenderers();
		if (topRenderers.length > 0 && topRenderers[0].count > 100) {
			recommendations.push({
				category: 'rendering',
				priority: 'medium',
				message: `Component "${topRenderers[0].type}" is rendering frequently (${topRenderers[0].count} times). Consider optimization with React.memo or useMemo.`,
			});
		}

		return recommendations;
	}

	/**
	 * Export report as downloadable JSON
	 *
	 * @returns {string} Download URL
	 */
	exportReport() {
		const report = this.generateReport();
		const blob = new Blob([JSON.stringify(report, null, 2)], {
			type: 'application/json',
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `maxi-performance-report-${Date.now()}.json`;
		a.click();
		URL.revokeObjectURL(url);

		console.log(
			'%c[MaxiBlocks Performance] Report exported',
			'background: #4CAF50; color: white; font-weight: bold; padding: 2px 4px;'
		);

		return url;
	}

	/**
	 * Stop monitoring
	 */
	stop() {
		this.enabled = false;
		if (this.samplingInterval) {
			clearInterval(this.samplingInterval);
		}
		if (this.reportInterval) {
			clearInterval(this.reportInterval);
		}

		console.log(
			'%c[MaxiBlocks Performance Monitor] Stopped',
			'background: #f44336; color: white; font-weight: bold; padding: 2px 4px;'
		);
	}

	/**
	 * Check if monitor is enabled
	 *
	 * @returns {boolean} Enabled status
	 */
	isEnabled() {
		return this.enabled;
	}
}

// Create singleton instance
const performanceMonitor = new PerformanceMonitor();

export default performanceMonitor;
