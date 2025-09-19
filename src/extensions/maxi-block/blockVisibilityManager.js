/**
 * Block Visibility Manager for MaxiBlocks
 *
 * Tracks which blocks are visible in the viewport and manages
 * performance optimizations based on visibility. Foundation for
 * future virtualization features.
 */

/**
 * Internal dependencies
 */
import { scheduleNonBlockingUpdate, scheduleLowPriorityUpdate, PRIORITY_LEVELS } from './reactOptimizationManager';

/**
 * Visibility states for blocks
 */
export const VISIBILITY_STATES = {
	UNKNOWN: 'unknown',
	VISIBLE: 'visible',
	NEAR_VISIBLE: 'near-visible',
	HIDDEN: 'hidden',
	FAR_HIDDEN: 'far-hidden',
};

/**
 * Performance thresholds
 */
const PERFORMANCE_THRESHOLDS = {
	VIEWPORT_MARGIN: '100px', // How close to viewport to start tracking
	NEAR_MARGIN: '200px', // How close to consider "near visible"
	FAR_MARGIN: '500px', // How far to consider "far hidden"
	UPDATE_THROTTLE: 16, // Throttle updates to 60fps
	BATCH_SIZE: 10, // Process visibility updates in batches
};

/**
 * Block visibility information
 */
class BlockVisibilityInfo {
	constructor(uniqueID, element, config = {}) {
		this.uniqueID = uniqueID;
		this.element = element;
		this.state = VISIBILITY_STATES.UNKNOWN;
		this.lastUpdate = 0;
		this.intersectionRatio = 0;
		this.boundingRect = null;
		this.priority = config.priority || PRIORITY_LEVELS.NORMAL;
		this.blockType = config.blockType || 'unknown';
		this.estimatedHeight = config.estimatedHeight || 100;
		this.hasBeenVisible = false;
		this.timeVisible = 0;
		this.firstVisibleTime = null;
		this.callbacks = new Set();
	}

	updateVisibility(entry, timestamp = Date.now()) {
		this.lastUpdate = timestamp;
		this.intersectionRatio = entry.intersectionRatio;
		this.boundingRect = entry.boundingClientRect;

		const wasVisible = this.state === VISIBILITY_STATES.VISIBLE;
		const newState = this.calculateVisibilityState(entry);

		if (newState !== this.state) {
			this.state = newState;
			this.notifyCallbacks(newState, wasVisible);

			// Track visibility metrics
			if (newState === VISIBILITY_STATES.VISIBLE && !this.hasBeenVisible) {
				this.hasBeenVisible = true;
				this.firstVisibleTime = timestamp;
			}

			if (newState === VISIBILITY_STATES.VISIBLE) {
				this.timeVisible += timestamp - (this.firstVisibleTime || timestamp);
			}
		}
	}

	calculateVisibilityState(entry) {
		const { intersectionRatio, boundingClientRect } = entry;
		const { top, bottom } = boundingClientRect;
		const viewportHeight = window.innerHeight;

		if (intersectionRatio > 0) {
			return VISIBILITY_STATES.VISIBLE;
		}

		// Calculate distance from viewport
		const distanceFromViewport = Math.min(
			Math.abs(top),
			Math.abs(bottom - viewportHeight)
		);

		if (distanceFromViewport <= 200) {
			return VISIBILITY_STATES.NEAR_VISIBLE;
		}

		if (distanceFromViewport <= 500) {
			return VISIBILITY_STATES.HIDDEN;
		}

		return VISIBILITY_STATES.FAR_HIDDEN;
	}

	addCallback(callback) {
		this.callbacks.add(callback);
		return () => this.callbacks.delete(callback);
	}

	notifyCallbacks(newState, wasVisible) {
		this.callbacks.forEach(callback => {
			try {
				callback(this.uniqueID, newState, wasVisible, this);
			} catch (error) {
				console.error('BlockVisibilityManager: Callback error:', error);
			}
		});
	}

	getStats() {
		return {
			uniqueID: this.uniqueID,
			state: this.state,
			hasBeenVisible: this.hasBeenVisible,
			timeVisible: this.timeVisible,
			priority: this.priority,
			blockType: this.blockType,
			intersectionRatio: this.intersectionRatio,
			lastUpdate: this.lastUpdate,
		};
	}
}

/**
 * Block Visibility Manager
 * Manages visibility tracking for all blocks
 */
class BlockVisibilityManager {
	constructor() {
		this.blocks = new Map(); // uniqueID -> BlockVisibilityInfo
		this.observer = null;
		this.updateQueue = [];
		this.isProcessingUpdates = false;
		this.stats = {
			totalBlocks: 0,
			visibleBlocks: 0,
			nearVisibleBlocks: 0,
			hiddenBlocks: 0,
			farHiddenBlocks: 0,
			updateCount: 0,
		};

		this.initializeObserver();
	}

	initializeObserver() {
		if (typeof IntersectionObserver === 'undefined') {
			console.warn('BlockVisibilityManager: IntersectionObserver not supported');
			return;
		}

		// Create observers for different visibility zones
		this.observer = new IntersectionObserver(
			this.handleIntersection.bind(this),
			{
				// Watch for blocks entering and leaving viewport area
				rootMargin: PERFORMANCE_THRESHOLDS.VIEWPORT_MARGIN,
				threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0], // Multiple thresholds for granular tracking
			}
		);

		// Additional observer for far distances
		this.farObserver = new IntersectionObserver(
			this.handleFarIntersection.bind(this),
			{
				rootMargin: PERFORMANCE_THRESHOLDS.FAR_MARGIN,
				threshold: 0,
			}
		);
	}

	/**
	 * Register a block for visibility tracking
	 * @param {string} uniqueID - Block unique identifier
	 * @param {Element} element - DOM element to track
	 * @param {Object} config - Configuration options
	 * @returns {Function} - Cleanup function
	 */
	registerBlock(uniqueID, element, config = {}) {
		if (!this.observer || !element) {
			console.warn('BlockVisibilityManager: Cannot register block', uniqueID);
			return () => {};
		}

		// Create visibility info
		const blockInfo = new BlockVisibilityInfo(uniqueID, element, config);
		this.blocks.set(uniqueID, blockInfo);

		// Start observing
		this.observer.observe(element);
		this.farObserver?.observe(element);

		// Update stats
		this.stats.totalBlocks++;
		this.updateGlobalStats();

		// Return cleanup function
		return () => this.unregisterBlock(uniqueID);
	}

	/**
	 * Unregister a block from visibility tracking
	 * @param {string} uniqueID - Block unique identifier
	 */
	unregisterBlock(uniqueID) {
		const blockInfo = this.blocks.get(uniqueID);
		if (!blockInfo) return;

		// Stop observing
		if (this.observer && blockInfo.element) {
			this.observer.unobserve(blockInfo.element);
			this.farObserver?.unobserve(blockInfo.element);
		}

		// Remove from tracking
		this.blocks.delete(uniqueID);

		// Update stats
		this.stats.totalBlocks--;
		this.updateGlobalStats();
	}

	/**
	 * Add callback for visibility changes
	 * @param {string} uniqueID - Block unique identifier
	 * @param {Function} callback - Callback function
	 * @returns {Function} - Cleanup function
	 */
	addVisibilityCallback(uniqueID, callback) {
		const blockInfo = this.blocks.get(uniqueID);
		if (blockInfo) {
			return blockInfo.addCallback(callback);
		}
		return () => {};
	}

	/**
	 * Get visibility state for a block
	 * @param {string} uniqueID - Block unique identifier
	 * @returns {string} - Visibility state
	 */
	getBlockVisibility(uniqueID) {
		const blockInfo = this.blocks.get(uniqueID);
		return blockInfo ? blockInfo.state : VISIBILITY_STATES.UNKNOWN;
	}

	/**
	 * Get all visible blocks
	 * @returns {Array} - Array of visible block IDs
	 */
	getVisibleBlocks() {
		return Array.from(this.blocks.values())
			.filter(block => block.state === VISIBILITY_STATES.VISIBLE)
			.map(block => block.uniqueID);
	}

	/**
	 * Get blocks by visibility state
	 * @param {string} state - Visibility state to filter by
	 * @returns {Array} - Array of block IDs
	 */
	getBlocksByState(state) {
		return Array.from(this.blocks.values())
			.filter(block => block.state === state)
			.map(block => block.uniqueID);
	}

	/**
	 * Handle intersection observer entries
	 * @param {Array} entries - Intersection observer entries
	 */
	handleIntersection(entries) {
		const timestamp = Date.now();

		// Queue updates for batch processing
		entries.forEach(entry => {
			const element = entry.target;
			const uniqueID = this.getBlockIdFromElement(element);

			if (uniqueID) {
				this.updateQueue.push({
					uniqueID,
					entry,
					timestamp,
					type: 'main'
				});
			}
		});

		this.scheduleUpdateProcessing();
	}

	/**
	 * Handle far intersection observer entries
	 * @param {Array} entries - Far intersection observer entries
	 */
	handleFarIntersection(entries) {
		const timestamp = Date.now();

		entries.forEach(entry => {
			const element = entry.target;
			const uniqueID = this.getBlockIdFromElement(element);

			if (uniqueID && !entry.isIntersecting) {
				this.updateQueue.push({
					uniqueID,
					entry,
					timestamp,
					type: 'far'
				});
			}
		});

		this.scheduleUpdateProcessing();
	}

	/**
	 * Get block ID from DOM element
	 * @param {Element} element - DOM element
	 * @returns {string|null} - Block unique ID
	 */
	getBlockIdFromElement(element) {
		// Try various methods to get the block ID
		const uniqueID = element.dataset?.maxiBlockId ||
			element.querySelector('[data-maxi-block-id]')?.dataset?.maxiBlockId ||
			element.closest('[data-maxi-block-id]')?.dataset?.maxiBlockId;

		return uniqueID || null;
	}

	/**
	 * Schedule update processing with throttling
	 */
	scheduleUpdateProcessing() {
		if (this.isProcessingUpdates) return;

		scheduleNonBlockingUpdate(() => {
			this.processUpdateQueue();
		}, {
			priority: PRIORITY_LEVELS.LOW,
			context: { type: 'visibilityUpdates', queueSize: this.updateQueue.length }
		});
	}

	/**
	 * Process queued visibility updates
	 */
	processUpdateQueue() {
		if (this.updateQueue.length === 0) return;

		this.isProcessingUpdates = true;
		const startTime = Date.now();

		try {
			// Process updates in batches
			const batchSize = Math.min(PERFORMANCE_THRESHOLDS.BATCH_SIZE, this.updateQueue.length);
			const batch = this.updateQueue.splice(0, batchSize);

			batch.forEach(({ uniqueID, entry, timestamp, type }) => {
				const blockInfo = this.blocks.get(uniqueID);
				if (blockInfo) {
					blockInfo.updateVisibility(entry, timestamp);
				}
			});

			this.stats.updateCount += batch.length;
			this.updateGlobalStats();

			// If there are more updates, schedule next batch
			if (this.updateQueue.length > 0) {
				this.scheduleUpdateProcessing();
			}

		} catch (error) {
			console.error('BlockVisibilityManager: Update processing error:', error);
		} finally {
			this.isProcessingUpdates = false;
		}
	}

	/**
	 * Update global visibility statistics
	 */
	updateGlobalStats() {
		const states = {
			visibleBlocks: 0,
			nearVisibleBlocks: 0,
			hiddenBlocks: 0,
			farHiddenBlocks: 0,
		};

		this.blocks.forEach(block => {
			switch (block.state) {
				case VISIBILITY_STATES.VISIBLE:
					states.visibleBlocks++;
					break;
				case VISIBILITY_STATES.NEAR_VISIBLE:
					states.nearVisibleBlocks++;
					break;
				case VISIBILITY_STATES.HIDDEN:
					states.hiddenBlocks++;
					break;
				case VISIBILITY_STATES.FAR_HIDDEN:
					states.farHiddenBlocks++;
					break;
			}
		});

		Object.assign(this.stats, states);
	}

	/**
	 * Get performance statistics
	 * @returns {Object} - Performance statistics
	 */
	getStats() {
		return {
			...this.stats,
			queueSize: this.updateQueue.length,
			isProcessing: this.isProcessingUpdates,
			observerActive: !!this.observer,
		};
	}

	/**
	 * Get detailed block statistics
	 * @returns {Array} - Array of block statistics
	 */
	getDetailedStats() {
		return Array.from(this.blocks.values()).map(block => block.getStats());
	}

	/**
	 * Cleanup all observers and data
	 */
	destroy() {
		if (this.observer) {
			this.observer.disconnect();
			this.observer = null;
		}

		if (this.farObserver) {
			this.farObserver.disconnect();
			this.farObserver = null;
		}

		this.blocks.clear();
		this.updateQueue.length = 0;
		this.isProcessingUpdates = false;
	}
}

// Global singleton instance
let visibilityManagerInstance = null;

/**
 * Get the global visibility manager instance
 * @returns {BlockVisibilityManager} - The singleton instance
 */
export const getVisibilityManager = () => {
	if (!visibilityManagerInstance) {
		visibilityManagerInstance = new BlockVisibilityManager();

		// Add cleanup on page unload
		if (typeof window !== 'undefined') {
			window.addEventListener('beforeunload', () => {
				if (visibilityManagerInstance) {
					visibilityManagerInstance.destroy();
					visibilityManagerInstance = null;
				}
			});
		}
	}

	return visibilityManagerInstance;
};

/**
 * Utility function to register a block for visibility tracking
 * @param {string} uniqueID - Block unique identifier
 * @param {Element} element - DOM element
 * @param {Object} config - Configuration options
 * @returns {Function} - Cleanup function
 */
export const registerBlockVisibility = (uniqueID, element, config = {}) => {
	const manager = getVisibilityManager();
	return manager.registerBlock(uniqueID, element, config);
};

/**
 * Utility function to add visibility callback
 * @param {string} uniqueID - Block unique identifier
 * @param {Function} callback - Callback function
 * @returns {Function} - Cleanup function
 */
export const addVisibilityCallback = (uniqueID, callback) => {
	const manager = getVisibilityManager();
	return manager.addVisibilityCallback(uniqueID, callback);
};

/**
 * Utility function to get block visibility
 * @param {string} uniqueID - Block unique identifier
 * @returns {string} - Visibility state
 */
export const getBlockVisibility = (uniqueID) => {
	const manager = getVisibilityManager();
	return manager.getBlockVisibility(uniqueID);
};

export { BlockVisibilityManager, BlockVisibilityInfo };
export default BlockVisibilityManager;