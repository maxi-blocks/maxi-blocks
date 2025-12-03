/**
 * DOM Tracker
 * Tracks DOM operations, node count, and orphaned elements
 *
 * @package
 */

import performanceMonitor from './index';

/**
 * DOM Tracker Class
 * Monitors DOM mutations and element counts
 */
class DOMTracker {
	constructor() {
		this.observer = null;
		this.mutations = [];
		this.styleInjections = [];
		this.iframeOperations = [];
		this.detachedNodes = new WeakSet();
	}

	/**
	 * Initialize DOM tracking
	 */
	init() {
		if (!window.maxiDebugPerformance) return;

		console.log(
			'%c[DOM Tracker] Initializing...',
			'background: #009688; color: white; font-weight: bold; padding: 2px 4px;'
		);

		// Track DOM mutations
		this.startMutationObserver();

		// Track style injections
		this.trackStyleInjections();

		// Track iframe operations
		this.trackIframeOperations();

		console.log(
			'%c[DOM Tracker] Active',
			'background: #009688; color: white; font-weight: bold; padding: 2px 4px;'
		);
	}

	/**
	 * Start mutation observer for DOM changes
	 */
	startMutationObserver() {
		if (this.observer) return;

		this.observer = new MutationObserver(mutations => {
			this.processMutations(mutations);
		});

		// Observe the entire document
		this.observer.observe(document.body, {
			childList: true,
			subtree: true,
			attributes: false,
		});

		console.log(
			'%c[DOM Tracker] MutationObserver started',
			'color: #009688;'
		);
	}

	/**
	 * Process mutation records
	 *
	 * @param {Array} mutations - MutationRecord array
	 */
	processMutations(mutations) {
		if (!window.maxiDebugPerformance) return;

		const now = performance.now();
		let addedNodes = 0;
		let removedNodes = 0;
		let maxiBlocksAdded = 0;
		let maxiBlocksRemoved = 0;

		mutations.forEach(mutation => {
			// Count added nodes
			mutation.addedNodes.forEach(node => {
				if (node.nodeType === Node.ELEMENT_NODE) {
					addedNodes++;
					if (
						node.classList &&
						node.classList.contains('maxi-block')
					) {
						maxiBlocksAdded++;
					}
				}
			});

			// Count removed nodes
			mutation.removedNodes.forEach(node => {
				if (node.nodeType === Node.ELEMENT_NODE) {
					removedNodes++;
					if (
						node.classList &&
						node.classList.contains('maxi-block')
					) {
						maxiBlocksRemoved++;
					}
					// Track as potentially orphaned
					this.detachedNodes.add(node);
				}
			});
		});

		// Record mutation summary
		if (addedNodes > 0 || removedNodes > 0) {
			const mutationSummary = {
				timestamp: now,
				addedNodes,
				removedNodes,
				maxiBlocksAdded,
				maxiBlocksRemoved,
				mutationCount: mutations.length,
			};

			this.mutations.push(mutationSummary);

			// Keep only last 100 mutations
			if (this.mutations.length > 100) {
				this.mutations.shift();
			}

			// Warn about excessive mutations
			if (mutations.length > 50) {
				console.warn(
					`%c[DOM Tracker] High mutation count: ${mutations.length} mutations`,
					'background: #FF9800; color: white; font-weight: bold; padding: 2px 4px;'
				);
			}
		}
	}

	/**
	 * Track style injections
	 * Wraps addBlockStyles and removeBlockStyles if available
	 */
	trackStyleInjections() {
		// This will be called from the globalStyleManager integration
		console.log(
			'%c[DOM Tracker] Style injection tracking ready',
			'color: #009688;'
		);
	}

	/**
	 * Record a style injection
	 *
	 * @param {string} blockId   - Block unique ID
	 * @param {string} operation - 'add' or 'remove'
	 * @param {number} size      - Approximate size in bytes
	 */
	recordStyleInjection(blockId, operation, size = 0) {
		if (!window.maxiDebugPerformance) return;

		const injection = {
			timestamp: performance.now(),
			blockId,
			operation,
			size,
		};

		this.styleInjections.push(injection);

		// Keep only last 200 injections
		if (this.styleInjections.length > 200) {
			this.styleInjections.shift();
		}

		console.log(
			`%c[DOM Tracker] Style ${operation}: ${blockId} (${size} bytes)`,
			'color: #009688;'
		);
	}

	/**
	 * Track iframe operations
	 */
	trackIframeOperations() {
		// Track when FSE iframes are added/removed
		const checkIframes = () => {
			if (!window.maxiDebugPerformance) return;

			const iframes = document.querySelectorAll('iframe');
			const fseIframes = document.querySelectorAll(
				'iframe.edit-site-visual-editor__editor-canvas'
			);

			this.iframeOperations.push({
				timestamp: performance.now(),
				totalIframes: iframes.length,
				fseIframes: fseIframes.length,
			});

			// Keep only last 50 samples
			if (this.iframeOperations.length > 50) {
				this.iframeOperations.shift();
			}
		};

		// Check every 5 seconds
		setInterval(checkIframes, 5000);
		checkIframes();
	}

	/**
	 * Count total DOM nodes
	 *
	 * @returns {number} Total node count
	 */
	getTotalNodeCount() {
		return document.querySelectorAll('*').length;
	}

	/**
	 * Count MaxiBlocks elements
	 *
	 * @returns {number} MaxiBlocks element count
	 */
	getMaxiBlockCount() {
		return document.querySelectorAll('.maxi-block').length;
	}

	/**
	 * Detect orphaned nodes
	 * Nodes that were removed but might still be in memory
	 *
	 * @returns {number} Estimated orphaned nodes
	 */
	detectOrphanedNodes() {
		// This is an approximation - actual orphaned nodes are hard to detect
		// We count nodes that were removed but might still be referenced
		let orphanedCount = 0;

		// Check for detached MaxiBlocks elements
		const detachedMaxiBlocks = document.querySelectorAll(
			'.maxi-block[data-block]'
		);
		detachedMaxiBlocks.forEach(block => {
			if (!document.body.contains(block)) {
				orphanedCount++;
			}
		});

		// Update performance monitor
		if (performanceMonitor.isEnabled()) {
			performanceMonitor.metrics.dom.orphanedNodes = orphanedCount;
		}

		return orphanedCount;
	}

	/**
	 * Get mutation statistics
	 *
	 * @returns {Object} Mutation stats
	 */
	getMutationStats() {
		const totalMutations = this.mutations.reduce(
			(sum, m) => sum + m.mutationCount,
			0
		);
		const totalAdded = this.mutations.reduce(
			(sum, m) => sum + m.addedNodes,
			0
		);
		const totalRemoved = this.mutations.reduce(
			(sum, m) => sum + m.removedNodes,
			0
		);

		return {
			totalMutations,
			totalAdded,
			totalRemoved,
			netChange: totalAdded - totalRemoved,
		};
	}

	/**
	 * Get style injection statistics
	 *
	 * @returns {Object} Style stats
	 */
	getStyleStats() {
		const additions = this.styleInjections.filter(
			s => s.operation === 'add'
		);
		const removals = this.styleInjections.filter(
			s => s.operation === 'remove'
		);
		const totalSize = this.styleInjections.reduce(
			(sum, s) => sum + s.size,
			0
		);

		return {
			totalInjections: this.styleInjections.length,
			additions: additions.length,
			removals: removals.length,
			totalSize,
			averageSize:
				this.styleInjections.length > 0
					? totalSize / this.styleInjections.length
					: 0,
		};
	}

	/**
	 * Generate DOM tracking report
	 *
	 * @returns {Object} Report data
	 */
	report() {
		const nodeCount = this.getTotalNodeCount();
		const maxiBlockCount = this.getMaxiBlockCount();
		const orphanedNodes = this.detectOrphanedNodes();
		const mutationStats = this.getMutationStats();
		const styleStats = this.getStyleStats();
		const latestIframe =
			this.iframeOperations[this.iframeOperations.length - 1];

		const reportData = {
			nodes: {
				total: nodeCount,
				maxiBlocks: maxiBlockCount,
				orphaned: orphanedNodes,
			},
			mutations: mutationStats,
			styles: styleStats,
			iframes: {
				total: latestIframe ? latestIframe.totalIframes : 0,
				fse: latestIframe ? latestIframe.fseIframes : 0,
			},
		};

		console.log(
			'%c=== DOM Tracker Report ===',
			'background: #009688; color: white; font-weight: bold; padding: 4px 8px;'
		);
		console.log(`Total DOM Nodes: ${reportData.nodes.total}`);
		console.log(`MaxiBlocks Elements: ${reportData.nodes.maxiBlocks}`);
		console.log(`Orphaned Nodes: ${reportData.nodes.orphaned}`);
		console.log(
			`DOM Mutations: ${reportData.mutations.totalMutations} (Net: ${
				reportData.mutations.netChange >= 0 ? '+' : ''
			}${reportData.mutations.netChange})`
		);
		console.log(
			`Style Injections: ${reportData.styles.totalInjections} (${reportData.styles.totalSize} bytes total)`
		);
		console.log(
			`Iframes: ${reportData.iframes.total} (FSE: ${reportData.iframes.fse})`
		);
		console.log(
			'%c=========================',
			'background: #009688; color: white; font-weight: bold; padding: 4px 8px;'
		);

		return reportData;
	}

	/**
	 * Cleanup - disconnect observer
	 */
	cleanup() {
		if (this.observer) {
			this.observer.disconnect();
			this.observer = null;
		}
	}
}

// Create singleton instance
const domTracker = new DOMTracker();

export default domTracker;
