/**
 * Redux Store Monitor
 * Tracks Redux store operations, action dispatches, and state size
 *
 * @package
 */

import performanceMonitor from './index';

/**
 * Store Monitor Class
 * Monitors WordPress data store operations
 */
class StoreMonitor {
	constructor() {
		this.actionHistory = [];
		this.selectorCalls = {};
		this.stateSnapshots = [];
		this.unsubscribers = [];
	}

	/**
	 * Initialize store monitoring
	 * Subscribes to maxiBlocks store and other relevant stores
	 */
	init() {
		if (!window.maxiDebugPerformance) return;

		console.log(
			'%c[Store Monitor] Initializing...',
			'background: #673AB7; color: white; font-weight: bold; padding: 2px 4px;'
		);

		// Note: We cannot wrap dispatch/select as they are read-only getters
		// Instead, we'll use subscribe to monitor store changes
		// And track actions via other means if needed in the future

		// Subscribe to store changes
		this.subscribeToStores();

		console.log(
			'%c[Store Monitor] Active (limited tracking mode)',
			'background: #673AB7; color: white; font-weight: bold; padding: 2px 4px;'
		);
		console.log(
			'%c[Store Monitor] Note: Direct action/selector tracking disabled due to WordPress data API restrictions',
			'color: #FF9800;'
		);
	}

	/**
	 * Track store changes via subscribe
	 * Since we cannot wrap dispatch/select, we monitor state changes
	 */
	trackStoreChange(storeName) {
		if (!window.maxiDebugPerformance) return;

		const changeData = {
			store: storeName,
			timestamp: performance.now(),
		};

		// Track as a generic "change" action
		const actionData = {
			store: storeName,
			type: 'STATE_CHANGE',
			timestamp: performance.now(),
		};

		this.actionHistory.push(actionData);

		// Update performance monitor
		if (performanceMonitor.isEnabled()) {
			performanceMonitor.metrics.store.actions.push(actionData);

			// Keep only last 1000 actions
			if (performanceMonitor.metrics.store.actions.length > 1000) {
				performanceMonitor.metrics.store.actions.shift();
			}
		}
	}

	/**
	 * Subscribe to store changes to track state size
	 */
	subscribeToStores() {
		if (!window.wp || !window.wp.data) return;

		const { subscribe } = window.wp.data;

		// Subscribe to maxiBlocks store changes
		const unsubscribeMaxi = subscribe(() => {
			if (!window.maxiDebugPerformance) return;

			// Track the change
			this.trackStoreChange('maxiBlocks');

			// Sample state size every 10 seconds
			const now = performance.now();
			const lastSnapshot =
				this.stateSnapshots[this.stateSnapshots.length - 1];

			if (!lastSnapshot || now - lastSnapshot.timestamp > 10000) {
				this.captureStateSnapshot();
			}
		}, 'maxiBlocks');

		this.unsubscribers.push(unsubscribeMaxi);

		// Also subscribe to core stores for general monitoring
		const storesToMonitor = ['core', 'core/block-editor', 'core/editor'];

		storesToMonitor.forEach(storeName => {
			try {
				const unsubscribe = subscribe(() => {
					if (!window.maxiDebugPerformance) return;
					this.trackStoreChange(storeName);
				}, storeName);
				this.unsubscribers.push(unsubscribe);
			} catch (error) {
				// Store might not exist, ignore
			}
		});
	}

	/**
	 * Capture state snapshot for size tracking
	 */
	captureStateSnapshot() {
		if (!window.wp || !window.wp.data) return;

		try {
			const { select } = window.wp.data;

			// Get maxiBlocks state
			const maxiState = select('maxiBlocks');
			if (!maxiState) return;

			// Calculate approximate state size
			const stateString = JSON.stringify({
				settings: maxiState.receiveMaxiSettings?.() || {},
				breakpoints: maxiState.receiveMaxiBreakpoints?.() || {},
				deviceType: maxiState.receiveMaxiDeviceType?.() || 'general',
			});

			const stateSize = new Blob([stateString]).size;

			const snapshot = {
				timestamp: performance.now(),
				size: stateSize,
				sizeKB: Math.round(stateSize / 1024),
			};

			this.stateSnapshots.push(snapshot);

			// Update performance monitor
			if (performanceMonitor.isEnabled()) {
				performanceMonitor.metrics.store.stateSize.push(snapshot);

				// Keep only last 100 snapshots
				if (performanceMonitor.metrics.store.stateSize.length > 100) {
					performanceMonitor.metrics.store.stateSize.shift();
				}
			}

			// Warn if state is growing too large
			if (stateSize > 500000) {
				// > 500KB
				console.warn(
					`%c[Store Monitor] Large state detected: ${snapshot.sizeKB}KB`,
					'background: #FF9800; color: white; font-weight: bold; padding: 2px 4px;'
				);
			}
		} catch (error) {
			console.warn(
				'[Store Monitor] Error capturing state snapshot:',
				error
			);
		}
	}

	/**
	 * Get store change frequency over last N seconds
	 *
	 * @param {number} seconds - Time window in seconds
	 * @returns {number} Changes per second
	 */
	getActionFrequency(seconds = 1) {
		const cutoff = performance.now() - seconds * 1000;
		const recentChanges = this.actionHistory.filter(
			a => a.timestamp > cutoff
		);
		return recentChanges.length / seconds;
	}

	/**
	 * Get most active stores
	 *
	 * @param {number} limit - Number of stores to return
	 * @returns {Array} Top stores by change frequency
	 */
	getTopActions(limit = 10) {
		const storeCounts = {};

		this.actionHistory.forEach(change => {
			const key = change.store;
			storeCounts[key] = (storeCounts[key] || 0) + 1;
		});

		return Object.entries(storeCounts)
			.map(([store, count]) => ({ action: store, count }))
			.sort((a, b) => b.count - a.count)
			.slice(0, limit);
	}

	/**
	 * Get selector tracking status
	 *
	 * @param {number} limit - Number of selectors to return
	 * @returns {Array} Empty array (direct selector tracking not available)
	 */
	getTopSelectors(limit = 10) {
		// Direct selector tracking is not available due to WordPress API restrictions
		return [];
	}

	/**
	 * Generate store monitoring report
	 *
	 * @returns {Object} Report data
	 */
	report() {
		const latestState = this.stateSnapshots[this.stateSnapshots.length - 1];
		const frequency = this.getActionFrequency(1);
		const topStores = this.getTopActions(5);

		const reportData = {
			storeChanges: {
				total: this.actionHistory.length,
				perSecond: frequency.toFixed(2),
				topStores,
			},
			state: {
				currentSize: latestState
					? `${latestState.sizeKB}KB`
					: 'unknown',
				snapshots: this.stateSnapshots.length,
			},
			note: 'Direct action/selector tracking unavailable due to WordPress API restrictions',
		};

		console.log(
			'%c=== Store Monitor Report ===',
			'background: #673AB7; color: white; font-weight: bold; padding: 4px 8px;'
		);
		console.log(
			`Total Store Changes: ${reportData.storeChanges.total} (${reportData.storeChanges.perSecond}/sec)`
		);
		console.log(`State Size: ${reportData.state.currentSize}`);
		console.log(
			'%cMost Active Stores:',
			'color: #673AB7; font-weight: bold;'
		);
		topStores.forEach(s => {
			console.log(`  ${s.action}: ${s.count} changes`);
		});
		console.log(
			'%cNote: Direct action/selector tracking not available',
			'color: #FF9800;'
		);
		console.log(
			'%c===========================',
			'background: #673AB7; color: white; font-weight: bold; padding: 4px 8px;'
		);

		return reportData;
	}

	/**
	 * Cleanup - unsubscribe from stores
	 */
	cleanup() {
		this.unsubscribers.forEach(unsubscribe => {
			try {
				unsubscribe();
			} catch (error) {
				console.warn('[Store Monitor] Error unsubscribing:', error);
			}
		});
		this.unsubscribers = [];
	}
}

// Create singleton instance
const storeMonitor = new StoreMonitor();

export default storeMonitor;
