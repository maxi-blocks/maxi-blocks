/**
 * Enhanced Relation Cleanup Manager for MaxiBlocks
 *
 * Provides proactive cleanup scheduling, memory leak detection,
 * and efficient batch cleanup operations for relation instances.
 */

/**
 * Priority levels for cleanup operations
 */
export const CLEANUP_PRIORITY = {
	LOW: 1,
	NORMAL: 2,
	HIGH: 3,
	CRITICAL: 4
};

/**
 * Cleanup scheduler with priority queue
 */
class CleanupScheduler {
	constructor() {
		this.queue = [];
		this.isRunning = false;
		this.stats = {
			totalScheduled: 0,
			totalCompleted: 0,
			totalFailed: 0,
			averageExecutionTime: 0,
			lastRun: null
		};
	}

	/**
	 * Schedule a cleanup operation
	 * @param {Function} cleanupFn - Cleanup function to execute
	 * @param {number} priority - Priority level (CLEANUP_PRIORITY)
	 * @param {Object} context - Context information for debugging
	 */
	schedule(cleanupFn, priority = CLEANUP_PRIORITY.NORMAL, context = {}) {
		this.queue.push({
			cleanupFn,
			priority,
			context,
			scheduledAt: Date.now(),
			id: `cleanup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
		});

		// Sort by priority (higher priority first)
		this.queue.sort((a, b) => b.priority - a.priority);
		this.stats.totalScheduled++;

		// Auto-start processing if not running
		if (!this.isRunning) {
			this.processQueue();
		}
	}

	/**
	 * Process the cleanup queue
	 */
	async processQueue() {
		if (this.isRunning || this.queue.length === 0) {
			return;
		}

		this.isRunning = true;
		this.stats.lastRun = Date.now();

		while (this.queue.length > 0) {
			const task = this.queue.shift();
			const startTime = performance.now();

			try {
				await task.cleanupFn();
				this.stats.totalCompleted++;

				const executionTime = performance.now() - startTime;
				this.updateAverageExecutionTime(executionTime);

			} catch (error) {
				this.stats.totalFailed++;
				console.error(`MaxiBlocks Cleanup: Failed to execute cleanup task ${task.id}:`, error);
				console.error('Task context:', task.context);
			}
		}

		this.isRunning = false;
	}

	/**
	 * Update average execution time
	 * @param {number} executionTime - Latest execution time
	 */
	updateAverageExecutionTime(executionTime) {
		const totalExecutions = this.stats.totalCompleted;
		this.stats.averageExecutionTime =
			(this.stats.averageExecutionTime * (totalExecutions - 1) + executionTime) / totalExecutions;
	}

	/**
	 * Get scheduler statistics
	 * @returns {Object} Statistics object
	 */
	getStats() {
		return {
			...this.stats,
			queueLength: this.queue.length,
			isRunning: this.isRunning,
			successRate: this.stats.totalScheduled > 0
				? ((this.stats.totalCompleted / this.stats.totalScheduled) * 100).toFixed(2) + '%'
				: '0%'
		};
	}

	/**
	 * Clear the queue and reset stats
	 */
	reset() {
		this.queue = [];
		this.isRunning = false;
		this.stats = {
			totalScheduled: 0,
			totalCompleted: 0,
			totalFailed: 0,
			averageExecutionTime: 0,
			lastRun: null
		};
	}
}

/**
 * Memory leak detector for relation instances
 */
class MemoryLeakDetector {
	constructor() {
		this.trackedReferences = new WeakMap();
		this.suspiciousInstances = new Map();
		this.detectionHistory = [];
		this.maxHistorySize = 100;
	}

	/**
	 * Track a relation instance for memory leak detection
	 * @param {Object} instance - Relation instance to track
	 * @param {string} identifier - Unique identifier for the instance
	 */
	trackInstance(instance, identifier) {
		const trackingData = {
			identifier,
			createdAt: Date.now(),
			lastAccessed: Date.now(),
			accessCount: 0,
			suspicionLevel: 0
		};

		this.trackedReferences.set(instance, trackingData);
	}

	/**
	 * Update access information for a tracked instance
	 * @param {Object} instance - Relation instance
	 */
	updateAccess(instance) {
		const trackingData = this.trackedReferences.get(instance);
		if (trackingData) {
			trackingData.lastAccessed = Date.now();
			trackingData.accessCount++;
		}
	}

	/**
	 * Detect potential memory leaks
	 * @param {Array} allInstances - All current relation instances
	 * @returns {Array} Array of suspicious instances
	 */
	detectLeaks(allInstances) {
		const now = Date.now();
		const suspiciousThreshold = 5 * 60 * 1000; // 5 minutes
		const suspicious = [];

		allInstances.forEach(instance => {
			const trackingData = this.trackedReferences.get(instance);
			if (!trackingData) return;

			const timeSinceLastAccess = now - trackingData.lastAccessed;
			const ageInMinutes = (now - trackingData.createdAt) / (60 * 1000);

			// Check for various leak indicators
			let suspicionScore = 0;

			// Long time since last access
			if (timeSinceLastAccess > suspiciousThreshold) {
				suspicionScore += 2;
			}

			// Very old instance with low access count
			if (ageInMinutes > 10 && trackingData.accessCount < 5) {
				suspicionScore += 3;
			}

			// High access count but very old (potential circular reference)
			if (ageInMinutes > 15 && trackingData.accessCount > 100) {
				suspicionScore += 2;
			}

			// Check for circular references
			if (this.hasCircularReference(instance)) {
				suspicionScore += 5;
			}

			if (suspicionScore > 3) {
				trackingData.suspicionLevel = suspicionScore;
				suspicious.push({
					instance,
					trackingData,
					suspicionScore
				});

				this.suspiciousInstances.set(trackingData.identifier, {
					...trackingData,
					detectedAt: now,
					suspicionScore
				});
			}
		});

		// Update detection history
		this.detectionHistory.push({
			timestamp: now,
			suspiciousCount: suspicious.length,
			totalInstances: allInstances.length
		});

		// Limit history size
		if (this.detectionHistory.length > this.maxHistorySize) {
			this.detectionHistory = this.detectionHistory.slice(-this.maxHistorySize);
		}

		return suspicious;
	}

	/**
	 * Simple circular reference detection
	 * @param {Object} instance - Instance to check
	 * @returns {boolean} True if circular reference detected
	 */
	hasCircularReference(instance) {
		const visited = new WeakSet();

		const checkObject = (obj, depth = 0) => {
			if (depth > 10) return true; // Prevent infinite recursion
			if (!obj || typeof obj !== 'object') return false;
			if (visited.has(obj)) return true;

			visited.add(obj);

			for (const key in obj) {
				if (obj.hasOwnProperty(key)) {
					const value = obj[key];
					if (typeof value === 'object' && value !== null) {
						if (checkObject(value, depth + 1)) {
							return true;
						}
					}
				}
			}

			return false;
		};

		try {
			return checkObject(instance);
		} catch (error) {
			// If we can't check (e.g., due to getters), assume it's suspicious
			return true;
		}
	}

	/**
	 * Get detection statistics
	 * @returns {Object} Detection statistics
	 */
	getStats() {
		const recentDetections = this.detectionHistory.slice(-10);
		const averageSuspicious = recentDetections.length > 0
			? recentDetections.reduce((sum, d) => sum + d.suspiciousCount, 0) / recentDetections.length
			: 0;

		return {
			currentSuspiciousCount: this.suspiciousInstances.size,
			averageSuspiciousCount: averageSuspicious.toFixed(2),
			totalDetectionRuns: this.detectionHistory.length,
			lastDetectionRun: this.detectionHistory.length > 0
				? this.detectionHistory[this.detectionHistory.length - 1].timestamp
				: null
		};
	}

	/**
	 * Clear all tracking data
	 */
	reset() {
		this.suspiciousInstances.clear();
		this.detectionHistory = [];
	}
}

/**
 * Enhanced Relation Cleanup Manager
 */
export class RelationCleanupManager {
	constructor() {
		this.scheduler = new CleanupScheduler();
		this.leakDetector = new MemoryLeakDetector();
		this.cleanupHistory = [];
		this.maxHistorySize = 50;
		this.isAutoCleanupEnabled = true;
		this.autoCleanupInterval = 30000; // 30 seconds
		this.autoCleanupTimer = null;

		this.startAutoCleanup();
	}

	/**
	 * Schedule cleanup for a single relation instance
	 * @param {Object} instance - Relation instance to cleanup
	 * @param {number} index - Instance index
	 * @param {number} priority - Cleanup priority
	 */
	scheduleInstanceCleanup(instance, index, priority = CLEANUP_PRIORITY.NORMAL) {
		const cleanupFn = async () => {
			return this.performSingleInstanceCleanup(instance, index);
		};

		this.scheduler.schedule(cleanupFn, priority, {
			type: 'singleInstance',
			index,
			instanceId: instance?.id || 'unknown'
		});
	}

	/**
	 * Schedule batch cleanup for multiple instances
	 * @param {Array} instances - Array of relation instances
	 * @param {number} priority - Cleanup priority
	 */
	scheduleBatchCleanup(instances, priority = CLEANUP_PRIORITY.NORMAL) {
		const cleanupFn = async () => {
			return this.performBatchCleanup(instances);
		};

		this.scheduler.schedule(cleanupFn, priority, {
			type: 'batchCleanup',
			instanceCount: instances.length
		});
	}

	/**
	 * Perform cleanup of a single instance with enhanced error handling
	 * @param {Object} instance - Relation instance
	 * @param {number} index - Instance index
	 */
	async performSingleInstanceCleanup(instance, index) {
		const startTime = Date.now();
		const cleanupSteps = [
			{
				name: 'removeRelationSubscriber',
				action: () => this.removeRelationSubscriber(instance)
			},
			{
				name: 'removeEventListeners',
				action: () => this.removeEventListeners(instance)
			},
			{
				name: 'clearObserver',
				action: () => this.clearObserver(instance)
			},
			{
				name: 'nullifyReferences',
				action: () => this.nullifyReferences(instance)
			}
		];

		const errors = [];

		for (const step of cleanupSteps) {
			try {
				await step.action();
			} catch (error) {
				errors.push({
					step: step.name,
					error: error.message || error
				});
			}
		}

		const executionTime = Date.now() - startTime;

		// Record cleanup attempt
		this.cleanupHistory.push({
			timestamp: startTime,
			type: 'single',
			index,
			executionTime,
			success: errors.length === 0,
			errors
		});

		// Limit history size
		if (this.cleanupHistory.length > this.maxHistorySize) {
			this.cleanupHistory = this.cleanupHistory.slice(-this.maxHistorySize);
		}

		if (errors.length > 0) {
			throw new Error(`Cleanup partially failed for instance ${index}: ${JSON.stringify(errors)}`);
		}
	}

	/**
	 * Perform batch cleanup of multiple instances
	 * @param {Array} instances - Array of instances to cleanup
	 */
	async performBatchCleanup(instances) {
		const startTime = Date.now();
		const results = [];

		// Process in batches of 10 to avoid blocking
		const batchSize = 10;
		for (let i = 0; i < instances.length; i += batchSize) {
			const batch = instances.slice(i, i + batchSize);

			const batchPromises = batch.map(async (instance, batchIndex) => {
				const actualIndex = i + batchIndex;
				try {
					await this.performSingleInstanceCleanup(instance, actualIndex);
					return { index: actualIndex, success: true };
				} catch (error) {
					return { index: actualIndex, success: false, error };
				}
			});

			const batchResults = await Promise.allSettled(batchPromises);
			results.push(...batchResults.map(r => r.value || { success: false, error: r.reason }));

			// Allow other tasks to run between batches
			if (i + batchSize < instances.length) {
				await new Promise(resolve => setTimeout(resolve, 0));
			}
		}

		const executionTime = Date.now() - startTime;
		const successCount = results.filter(r => r.success).length;

		// Record batch cleanup attempt
		this.cleanupHistory.push({
			timestamp: startTime,
			type: 'batch',
			totalInstances: instances.length,
			successCount,
			executionTime,
			success: successCount === instances.length
		});

		if (successCount < instances.length) {
			const failedCount = instances.length - successCount;
			console.warn(`MaxiBlocks: Batch cleanup completed with ${failedCount} failures out of ${instances.length} instances`);
		}
	}

	/**
	 * Enhanced cleanup step implementations
	 */
	removeRelationSubscriber(instance) {
		if (instance?.relationSubscriber && typeof instance.relationSubscriber === 'function') {
			try {
				instance.relationSubscriber();
				instance.relationSubscriber = null;
			} catch (error) {
				console.warn('Failed to remove relation subscriber:', error);
			}
		}
	}

	removeEventListeners(instance) {
		if (instance?.element && instance.element.removeEventListener) {
			// Remove common event listeners
			const commonEvents = ['click', 'change', 'input', 'focus', 'blur', 'resize'];
			commonEvents.forEach(eventType => {
				try {
					// We can't remove specific listeners without the reference,
					// but we can try to clone the element to remove all listeners
					if (instance.element.cloneNode) {
						const newElement = instance.element.cloneNode(true);
						if (instance.element.parentNode) {
							instance.element.parentNode.replaceChild(newElement, instance.element);
							instance.element = newElement;
						}
					}
				} catch (error) {
					// Silently continue if we can't remove listeners
				}
			});
		}
	}

	clearObserver(instance) {
		if (instance?.observer) {
			try {
				if (typeof instance.observer.disconnect === 'function') {
					instance.observer.disconnect();
				}
				if (typeof instance.observer.unobserve === 'function' && instance.element) {
					instance.observer.unobserve(instance.element);
				}
				instance.observer = null;
			} catch (error) {
				console.warn('Failed to clear observer:', error);
			}
		}
	}

	nullifyReferences(instance) {
		const propertiesToNullify = [
			'element', 'observer', 'callback', 'handlers', 'references',
			'parent', 'children', 'data', 'cache', 'state'
		];

		propertiesToNullify.forEach(prop => {
			try {
				if (instance.hasOwnProperty(prop)) {
					instance[prop] = null;
				}
			} catch (error) {
				// Some properties might be read-only, continue anyway
			}
		});
	}

	/**
	 * Run memory leak detection
	 * @param {Array} allInstances - All current relation instances
	 * @returns {Array} Suspicious instances
	 */
	detectMemoryLeaks(allInstances) {
		return this.leakDetector.detectLeaks(allInstances);
	}

	/**
	 * Start automatic cleanup process
	 */
	startAutoCleanup() {
		if (this.autoCleanupTimer) {
			clearInterval(this.autoCleanupTimer);
		}

		if (this.isAutoCleanupEnabled) {
			this.autoCleanupTimer = setInterval(() => {
				// This would be called by the main component with current instances
				this.scheduler.processQueue();
			}, this.autoCleanupInterval);
		}
	}

	/**
	 * Stop automatic cleanup process
	 */
	stopAutoCleanup() {
		if (this.autoCleanupTimer) {
			clearInterval(this.autoCleanupTimer);
			this.autoCleanupTimer = null;
		}
	}

	/**
	 * Get comprehensive statistics
	 * @returns {Object} Statistics from all components
	 */
	getStats() {
		const recentCleanups = this.cleanupHistory.slice(-10);
		const averageExecutionTime = recentCleanups.length > 0
			? recentCleanups.reduce((sum, c) => sum + c.executionTime, 0) / recentCleanups.length
			: 0;

		const successRate = this.cleanupHistory.length > 0
			? (this.cleanupHistory.filter(c => c.success).length / this.cleanupHistory.length * 100).toFixed(2)
			: 100;

		return {
			scheduler: this.scheduler.getStats(),
			leakDetector: this.leakDetector.getStats(),
			cleanup: {
				totalCleanups: this.cleanupHistory.length,
				averageExecutionTime: averageExecutionTime.toFixed(2) + 'ms',
				successRate: successRate + '%',
				isAutoCleanupEnabled: this.isAutoCleanupEnabled,
				autoCleanupInterval: this.autoCleanupInterval
			}
		};
	}

	/**
	 * Reset all components
	 */
	reset() {
		this.scheduler.reset();
		this.leakDetector.reset();
		this.cleanupHistory = [];
		this.stopAutoCleanup();
		this.startAutoCleanup();
	}

	/**
	 * Cleanup the manager itself
	 */
	destroy() {
		this.stopAutoCleanup();
		this.reset();
	}
}

// Global instance
export const globalCleanupManager = new RelationCleanupManager();

export default RelationCleanupManager;