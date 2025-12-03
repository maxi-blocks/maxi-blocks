/**
 * API Tracker
 * Tracks REST API calls, font loading, and network operations
 *
 * @package
 */

import performanceMonitor from './index';

/**
 * API Tracker Class
 * Monitors API calls and network requests
 */
class APITracker {
	constructor() {
		this.calls = [];
		this.fontLoads = [];
		this.failedCalls = 0;
		this.totalPayloadSize = 0;
		this.originalFetch = null;
		this.originalXHROpen = null;
	}

	/**
	 * Initialize API tracking
	 */
	init() {
		if (!window.maxiDebugPerformance) return;

		console.log(
			'%c[API Tracker] Initializing...',
			'background: #FF5722; color: white; font-weight: bold; padding: 2px 4px;'
		);

		// Wrap fetch API
		this.wrapFetch();

		// Wrap XMLHttpRequest
		this.wrapXHR();

		// Track font loads
		this.trackFontLoads();

		console.log(
			'%c[API Tracker] Active',
			'background: #FF5722; color: white; font-weight: bold; padding: 2px 4px;'
		);
	}

	/**
	 * Wrap fetch API to track calls
	 */
	wrapFetch() {
		if (this.originalFetch) return;

		// Store reference with proper binding
		this.originalFetch = window.fetch.bind(window);

		// Create wrapper that maintains proper context
		const self = this;
		window.fetch = function (...args) {
			const startTime = performance.now();
			const url = args[0];
			const options = args[1] || {};

			// Track request
			const callId = self.trackAPICall({
				url: typeof url === 'string' ? url : url.url,
				method: options.method || 'GET',
				type: 'fetch',
				startTime,
			});

			// Call original fetch with proper context (window)
			return self.originalFetch
				.apply(window, args)
				.then(response => {
					const duration = performance.now() - startTime;

					// Clone response to read body
					const clonedResponse = response.clone();

					// Try to get response size
					clonedResponse
						.blob()
						.then(blob => {
							self.updateAPICall(callId, {
								duration,
								status: response.status,
								success: response.ok,
								size: blob.size,
							});
						})
						.catch(() => {
							self.updateAPICall(callId, {
								duration,
								status: response.status,
								success: response.ok,
								size: 0,
							});
						});

					return response;
				})
				.catch(error => {
					const duration = performance.now() - startTime;
					self.updateAPICall(callId, {
						duration,
						success: false,
						error: error.message,
					});
					throw error;
				});
		};

		console.log('%c[API Tracker] Wrapped fetch', 'color: #FF5722;');
	}

	/**
	 * Wrap XMLHttpRequest to track calls
	 */
	wrapXHR() {
		if (this.originalXHROpen) return;

		const self = this;
		this.originalXHROpen = XMLHttpRequest.prototype.open;

		XMLHttpRequest.prototype.open = function (...args) {
			const startTime = performance.now();
			const method = args[0];
			const url = args[1];

			// Track request
			const callId = self.trackAPICall({
				url,
				method,
				type: 'xhr',
				startTime,
			});

			// Add load listener
			this.addEventListener('load', function () {
				const duration = performance.now() - startTime;
				self.updateAPICall(callId, {
					duration,
					status: this.status,
					success: this.status >= 200 && this.status < 300,
					size: this.responseText ? this.responseText.length : 0,
				});
			});

			// Add error listener
			this.addEventListener('error', function () {
				const duration = performance.now() - startTime;
				self.updateAPICall(callId, {
					duration,
					success: false,
					error: 'Network error',
				});
			});

			// Call original open
			return self.originalXHROpen.apply(this, args);
		};

		console.log(
			'%c[API Tracker] Wrapped XMLHttpRequest',
			'color: #FF5722;'
		);
	}

	/**
	 * Track an API call
	 *
	 * @param {Object} callData - Call data
	 * @returns {string} Call ID
	 */
	trackAPICall(callData) {
		if (!window.maxiDebugPerformance) return null;

		const callId = `api-${Date.now()}-${Math.random()
			.toString(36)
			.substr(2, 9)}`;
		const call = {
			id: callId,
			timestamp: performance.now(),
			...callData,
			completed: false,
		};

		this.calls.push(call);

		// Keep only last 500 calls
		if (this.calls.length > 500) {
			this.calls.shift();
		}

		return callId;
	}

	/**
	 * Update an API call with completion data
	 *
	 * @param {string} callId     - Call ID
	 * @param {Object} updateData - Update data
	 */
	updateAPICall(callId, updateData) {
		if (!window.maxiDebugPerformance || !callId) return;

		const call = this.calls.find(c => c.id === callId);
		if (!call) return;

		Object.assign(call, updateData, { completed: true });

		// Update metrics
		if (!updateData.success) {
			this.failedCalls++;
			if (performanceMonitor.isEnabled()) {
				performanceMonitor.metrics.api.failedCalls++;
			}
		}

		if (updateData.size) {
			this.totalPayloadSize += updateData.size;
			if (performanceMonitor.isEnabled()) {
				performanceMonitor.metrics.api.totalPayloadSize +=
					updateData.size;
			}
		}

		// Update performance monitor
		if (performanceMonitor.isEnabled()) {
			performanceMonitor.metrics.api.calls.push(call);

			// Keep only last 500 calls in monitor
			if (performanceMonitor.metrics.api.calls.length > 500) {
				performanceMonitor.metrics.api.calls.shift();
			}
		}

		// Log slow or failed calls
		if (!updateData.success) {
			console.warn(
				`%c[API Tracker] Failed: ${call.method} ${call.url}`,
				'background: #f44336; color: white; font-weight: bold; padding: 2px 4px;',
				JSON.stringify({
					duration: updateData.duration,
					error: updateData.error,
				})
			);
		} else if (updateData.duration > 1000) {
			console.warn(
				`%c[API Tracker] Slow: ${call.method} ${
					call.url
				} (${updateData.duration.toFixed(2)}ms)`,
				'background: #FF9800; color: white; font-weight: bold; padding: 2px 4px;',
				JSON.stringify({
					duration: updateData.duration,
					size: updateData.size,
				})
			);
		}

		// Detect MaxiBlocks API calls
		if (call.url.includes('maxi-blocks')) {
			console.log(
				`%c[API Tracker] MaxiBlocks API: ${call.method} ${call.url}`,
				'color: #FF5722;',
				JSON.stringify({
					duration: updateData.duration,
					size: updateData.size,
					status: updateData.status,
				})
			);
		}
	}

	/**
	 * Track font loads
	 */
	trackFontLoads() {
		// Monitor document.fonts if available
		if (!document.fonts) return;

		document.fonts.addEventListener('loadingdone', event => {
			if (!window.maxiDebugPerformance) return;

			event.fontfaces.forEach(fontFace => {
				const fontLoad = {
					timestamp: performance.now(),
					family: fontFace.family,
					weight: fontFace.weight,
					style: fontFace.style,
					status: fontFace.status,
				};

				this.fontLoads.push(fontLoad);

				console.log(
					`%c[API Tracker] Font loaded: ${fontFace.family}`,
					'color: #FF5722;',
					JSON.stringify(fontLoad)
				);
			});

			// Keep only last 100 font loads
			if (this.fontLoads.length > 100) {
				this.fontLoads.shift();
			}
		});

		console.log(
			'%c[API Tracker] Font loading tracking active',
			'color: #FF5722;'
		);
	}

	/**
	 * Get API call statistics
	 *
	 * @returns {Object} Stats
	 */
	getStats() {
		const completed = this.calls.filter(c => c.completed);
		const successful = completed.filter(c => c.success);
		const failed = completed.filter(c => !c.success);

		const durations = completed
			.filter(c => c.duration)
			.map(c => c.duration);
		const avgDuration =
			durations.length > 0
				? durations.reduce((sum, d) => sum + d, 0) / durations.length
				: 0;
		const maxDuration = durations.length > 0 ? Math.max(...durations) : 0;

		const sizes = completed.filter(c => c.size).map(c => c.size);
		const totalSize = sizes.reduce((sum, s) => sum + s, 0);
		const avgSize = sizes.length > 0 ? totalSize / sizes.length : 0;

		return {
			total: this.calls.length,
			completed: completed.length,
			successful: successful.length,
			failed: failed.length,
			avgDuration,
			maxDuration,
			totalSize,
			avgSize,
			fontLoads: this.fontLoads.length,
		};
	}

	/**
	 * Get slow API calls
	 *
	 * @param {number} threshold - Duration threshold in ms
	 * @returns {Array} Slow calls
	 */
	getSlowCalls(threshold = 500) {
		return this.calls
			.filter(c => c.completed && c.duration > threshold)
			.sort((a, b) => b.duration - a.duration)
			.slice(0, 10);
	}

	/**
	 * Get MaxiBlocks API calls
	 *
	 * @returns {Array} MaxiBlocks calls
	 */
	getMaxiBlocksCalls() {
		return this.calls.filter(c => c.url && c.url.includes('maxi-blocks'));
	}

	/**
	 * Generate API tracking report
	 *
	 * @returns {Object} Report data
	 */
	report() {
		const stats = this.getStats();
		const slowCalls = this.getSlowCalls();
		const maxiCalls = this.getMaxiBlocksCalls();

		const reportData = {
			stats,
			slowCalls: slowCalls.map(c => ({
				url: c.url,
				method: c.method,
				duration: c.duration,
				size: c.size,
			})),
			maxiBlocksCalls: maxiCalls.length,
			fontLoads: this.fontLoads.length,
		};

		console.log(
			'%c=== API Tracker Report ===',
			'background: #FF5722; color: white; font-weight: bold; padding: 4px 8px;'
		);
		console.log(
			`Total API Calls: ${stats.total} (${stats.successful} success, ${stats.failed} failed)`
		);
		console.log(
			`Average Duration: ${stats.avgDuration.toFixed(
				2
			)}ms (Max: ${stats.maxDuration.toFixed(2)}ms)`
		);
		console.log(
			`Total Payload: ${(stats.totalSize / 1024).toFixed(2)}KB (Avg: ${(
				stats.avgSize / 1024
			).toFixed(2)}KB)`
		);
		console.log(`MaxiBlocks API Calls: ${maxiCalls.length}`);
		console.log(`Fonts Loaded: ${stats.fontLoads}`);

		if (slowCalls.length > 0) {
			console.log(
				'%cSlowest Calls:',
				'color: #FF5722; font-weight: bold;'
			);
			slowCalls.slice(0, 5).forEach(call => {
				console.log(
					`  ${call.method} ${call.url}: ${call.duration.toFixed(
						2
					)}ms`
				);
			});
		}

		console.log(
			'%c=========================',
			'background: #FF5722; color: white; font-weight: bold; padding: 4px 8px;'
		);

		return reportData;
	}

	/**
	 * Cleanup - restore original functions
	 */
	cleanup() {
		if (this.originalFetch) {
			// Restore with proper binding
			window.fetch = this.originalFetch.bind(window);
			this.originalFetch = null;
		}

		if (this.originalXHROpen) {
			XMLHttpRequest.prototype.open = this.originalXHROpen;
			this.originalXHROpen = null;
		}
	}
}

// Create singleton instance
const apiTracker = new APITracker();

export default apiTracker;
