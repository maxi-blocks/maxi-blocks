/**
 * React Optimization Manager for MaxiBlocks
 *
 * Provides React 18-like concurrent features for WordPress/Gutenberg environment
 * without requiring React 18. Uses requestIdleCallback and priority queuing
 * to achieve non-blocking updates and smooth user experience.
 */

/**
 * Priority levels for different types of updates
 */
const PRIORITY_LEVELS = {
	IMMEDIATE: 0, // Critical updates (user interactions)
	HIGH: 1, // Important updates (visible changes)
	NORMAL: 2, // Regular updates (style changes)
	LOW: 3, // Background updates (non-visible changes)
	IDLE: 4, // Cleanup and optimization tasks
};

/**
 * Update queue item
 */
class UpdateTask {
	constructor(fn, priority = PRIORITY_LEVELS.NORMAL, context = null) {
		this.fn = fn;
		this.priority = priority;
		this.context = context;
		this.timestamp = Date.now();
		this.id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
	}
}

/**
 * React Optimization Manager
 * Provides concurrent-like behavior without React 18
 */
class ReactOptimizationManager {
	constructor() {
		// Priority queues for different update types
		this.updateQueues = new Map();
		this.isProcessing = false;
		this.frameScheduled = false;

		// Performance monitoring
		this.performanceMetrics = {
			tasksProcessed: 0,
			averageProcessingTime: 0,
			droppedFrames: 0,
		};

		// Initialize priority queues
		Object.values(PRIORITY_LEVELS).forEach(priority => {
			this.updateQueues.set(priority, []);
		});

		// Bind methods for proper context
		this.processUpdates = this.processUpdates.bind(this);
		this.processWithTimeSlicing = this.processWithTimeSlicing.bind(this);

		// Start the update loop
		this.scheduleUpdates();
	}

	/**
	 * Schedule a non-blocking update (similar to startTransition)
	 * @param {Function} updateFn - Function to execute
	 * @param {number} priority - Priority level (default: NORMAL)
	 * @param {Object} context - Optional context for debugging
	 */
	scheduleUpdate(updateFn, priority = PRIORITY_LEVELS.NORMAL, context = null) {
		if (typeof updateFn !== 'function') {
			console.warn('ReactOptimizationManager: Invalid update function');
			return;
		}

		const task = new UpdateTask(updateFn, priority, context);
		const queue = this.updateQueues.get(priority);

		if (queue) {
			queue.push(task);
			this.scheduleUpdates();
		}

		return task.id;
	}

	/**
	 * Schedule urgent update (runs immediately)
	 * @param {Function} updateFn - Function to execute immediately
	 */
	scheduleImmediateUpdate(updateFn) {
		if (typeof updateFn === 'function') {
			try {
				updateFn();
			} catch (error) {
				console.error('ReactOptimizationManager: Immediate update failed:', error);
			}
		}
	}

	/**
	 * Schedule high priority update (for visible changes)
	 * @param {Function} updateFn - Function to execute with high priority
	 * @param {Object} context - Optional context
	 */
	scheduleHighPriorityUpdate(updateFn, context = null) {
		return this.scheduleUpdate(updateFn, PRIORITY_LEVELS.HIGH, context);
	}

	/**
	 * Schedule low priority update (for background tasks)
	 * @param {Function} updateFn - Function to execute with low priority
	 * @param {Object} context - Optional context
	 */
	scheduleLowPriorityUpdate(updateFn, context = null) {
		return this.scheduleUpdate(updateFn, PRIORITY_LEVELS.LOW, context);
	}

	/**
	 * Schedule idle callback (for cleanup and optimization)
	 * @param {Function} updateFn - Function to execute when idle
	 * @param {Object} context - Optional context
	 */
	scheduleIdleUpdate(updateFn, context = null) {
		return this.scheduleUpdate(updateFn, PRIORITY_LEVELS.IDLE, context);
	}

	/**
	 * Schedule the update processing loop
	 */
	scheduleUpdates() {
		if (this.frameScheduled) return;

		this.frameScheduled = true;

		// Use requestAnimationFrame for smooth updates
		requestAnimationFrame(() => {
			this.frameScheduled = false;
			this.processUpdates();
		});
	}

	/**
	 * Process updates with time slicing
	 */
	processUpdates() {
		if (this.isProcessing) return;

		this.isProcessing = true;
		const startTime = performance.now();

		try {
			// Process updates with time slicing (5ms per frame max)
			this.processWithTimeSlicing(5);
		} catch (error) {
			console.error('ReactOptimizationManager: Update processing failed:', error);
		} finally {
			this.isProcessing = false;

			// Update performance metrics
			const processingTime = performance.now() - startTime;
			this.updatePerformanceMetrics(processingTime);

			// Schedule next frame if there are pending updates
			if (this.hasPendingUpdates()) {
				this.scheduleUpdates();
			}
		}
	}

	/**
	 * Process updates with time slicing to prevent blocking
	 * @param {number} maxTimeSlice - Maximum time to spend processing (ms)
	 */
	processWithTimeSlicing(maxTimeSlice = 5) {
		const startTime = performance.now();
		let tasksProcessed = 0;

		// Process updates by priority (highest first)
		for (const priority of Object.values(PRIORITY_LEVELS).sort((a, b) => a - b)) {
			const queue = this.updateQueues.get(priority);
			if (!queue || queue.length === 0) continue;

			// Process tasks until time slice is exhausted
			while (queue.length > 0 && (performance.now() - startTime) < maxTimeSlice) {
				const task = queue.shift();
				if (task) {
					try {
						task.fn();
						tasksProcessed++;
					} catch (error) {
						console.error('ReactOptimizationManager: Task execution failed:', error, task);
					}
				}
			}

			// Break if time slice is exhausted
			if ((performance.now() - startTime) >= maxTimeSlice) {
				break;
			}
		}

		this.performanceMetrics.tasksProcessed += tasksProcessed;
	}

	/**
	 * Check if there are pending updates
	 * @returns {boolean} - True if there are pending updates
	 */
	hasPendingUpdates() {
		for (const queue of this.updateQueues.values()) {
			if (queue.length > 0) return true;
		}
		return false;
	}

	/**
	 * Get the total number of pending updates
	 * @returns {number} - Number of pending updates
	 */
	getPendingUpdateCount() {
		let total = 0;
		for (const queue of this.updateQueues.values()) {
			total += queue.length;
		}
		return total;
	}

	/**
	 * Update performance metrics
	 * @param {number} processingTime - Time spent processing updates
	 */
	updatePerformanceMetrics(processingTime) {
		const { tasksProcessed, averageProcessingTime } = this.performanceMetrics;

		// Calculate running average
		this.performanceMetrics.averageProcessingTime =
			(averageProcessingTime * 0.9) + (processingTime * 0.1);

		// Track dropped frames (> 16ms processing time)
		if (processingTime > 16) {
			this.performanceMetrics.droppedFrames++;
		}
	}

	/**
	 * Get performance statistics
	 * @returns {Object} - Performance metrics
	 */
	getPerformanceStats() {
		return {
			...this.performanceMetrics,
			pendingUpdates: this.getPendingUpdateCount(),
			isProcessing: this.isProcessing,
		};
	}

	/**
	 * Clear all pending updates
	 */
	clearPendingUpdates() {
		for (const queue of this.updateQueues.values()) {
			queue.length = 0;
		}
	}

	/**
	 * Destroy the optimization manager
	 */
	destroy() {
		this.clearPendingUpdates();
		this.isProcessing = false;
		this.frameScheduled = false;
	}
}

// Global singleton instance
let optimizationManagerInstance = null;

/**
 * Get the global optimization manager instance
 * @returns {ReactOptimizationManager} - The singleton instance
 */
export const getOptimizationManager = () => {
	if (!optimizationManagerInstance) {
		optimizationManagerInstance = new ReactOptimizationManager();

		// Add cleanup on page unload
		if (typeof window !== 'undefined') {
			window.addEventListener('beforeunload', () => {
				if (optimizationManagerInstance) {
					optimizationManagerInstance.destroy();
					optimizationManagerInstance = null;
				}
			});
		}
	}

	return optimizationManagerInstance;
};

/**
 * Utility function to schedule non-blocking updates (similar to startTransition)
 * @param {Function} updateFn - Function to execute
 * @param {Object} options - Options object
 * @param {number} options.priority - Priority level
 * @param {Object} options.context - Optional context
 */
export const scheduleNonBlockingUpdate = (updateFn, options = {}) => {
	const manager = getOptimizationManager();
	const { priority = PRIORITY_LEVELS.NORMAL, context = null } = options;
	return manager.scheduleUpdate(updateFn, priority, context);
};

/**
 * Utility function for immediate updates (user interactions)
 * @param {Function} updateFn - Function to execute immediately
 */
export const scheduleImmediateUpdate = (updateFn) => {
	const manager = getOptimizationManager();
	return manager.scheduleImmediateUpdate(updateFn);
};

/**
 * Utility function for high priority updates (visible changes)
 * @param {Function} updateFn - Function to execute with high priority
 * @param {Object} context - Optional context
 */
export const scheduleHighPriorityUpdate = (updateFn, context = null) => {
	const manager = getOptimizationManager();
	return manager.scheduleHighPriorityUpdate(updateFn, context);
};

/**
 * Utility function for low priority updates (background tasks)
 * @param {Function} updateFn - Function to execute with low priority
 * @param {Object} context - Optional context
 */
export const scheduleLowPriorityUpdate = (updateFn, context = null) => {
	const manager = getOptimizationManager();
	return manager.scheduleLowPriorityUpdate(updateFn, context);
};

export { PRIORITY_LEVELS };
export default ReactOptimizationManager;