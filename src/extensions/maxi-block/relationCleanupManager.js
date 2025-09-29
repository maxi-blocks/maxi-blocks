/**
 * Relation Cleanup Manager for MaxiBlocks
 *
 * Provides cleanup operations for relation instances
 * with basic scheduling and error handling.
 */

/* eslint-disable no-plusplus, no-await-in-loop, class-methods-use-this */

/**
 * Priority levels for cleanup operations
 */
export const CLEANUP_PRIORITY = {
	LOW: 1,
	NORMAL: 2,
	HIGH: 3,
	CRITICAL: 4,
};

/**
 * Relation Cleanup Manager
 * Simplified version focusing on essential cleanup functionality
 */
export class RelationCleanupManager {
	constructor() {
		this.cleanupQueue = [];
		this.isProcessing = false;
		this.stats = {
			totalCleanups: 0,
			successfulCleanups: 0,
			failedCleanups: 0,
		};
	}

	/**
	 * Schedule cleanup for a single relation instance
	 * @param {Object} instance - Relation instance to cleanup
	 * @param {number} index    - Instance index
	 * @param {number} priority - Cleanup priority
	 */
	scheduleInstanceCleanup(
		instance,
		index,
		priority = CLEANUP_PRIORITY.NORMAL
	) {
		this.cleanupQueue.push({
			type: 'single',
			instance,
			index,
			priority,
			timestamp: Date.now(),
		});

		this.cleanupQueue.sort((a, b) => b.priority - a.priority);
		this.processQueue();
	}

	/**
	 * Schedule batch cleanup for multiple instances
	 * @param {Array}  instances - Array of relation instances
	 * @param {number} priority  - Cleanup priority
	 */
	scheduleBatchCleanup(instances, priority = CLEANUP_PRIORITY.NORMAL) {
		// Validate input and filter out falsy entries
		if (!Array.isArray(instances)) {
			return;
		}

		const validInstances = instances.filter(instance => instance);
		if (validInstances.length === 0) {
			return;
		}

		this.cleanupQueue.push({
			type: 'batch',
			instances: validInstances,
			priority,
			timestamp: Date.now(),
		});

		this.cleanupQueue.sort((a, b) => b.priority - a.priority);
		this.processQueue();
	}

	/**
	 * Process the cleanup queue
	 */
	async processQueue() {
		if (this.isProcessing || this.cleanupQueue.length === 0) {
			return;
		}

		this.isProcessing = true;

		// Continue processing until queue is completely empty
		while (this.cleanupQueue.length > 0) {
			// Process current batch of tasks
			while (this.cleanupQueue.length > 0) {
				const task = this.cleanupQueue.shift();

				try {
					if (task.type === 'single') {
						await this.performSingleInstanceCleanup(
							task.instance,
							task.index
						);
					} else if (task.type === 'batch') {
						await this.performBatchCleanup(task.instances);
					}

					this.stats.successfulCleanups++;
				} catch (error) {
					this.stats.failedCleanups++;
					console.error('MaxiBlocks: Cleanup task failed:', error);
				}

				this.stats.totalCleanups++;
			}

			// Re-check for any tasks that arrived while we were processing
			// This handles the race condition where tasks arrive after the inner loop
			// completes but before isProcessing is set to false
		}

		this.isProcessing = false;
	}

	/**
	 * Perform cleanup of a single instance
	 * @param {Object} instance - Relation instance
	 * @param {number} index    - Instance index
	 */
	async performSingleInstanceCleanup(instance, index) {
		const cleanupSteps = [
			() => this.removeRelationSubscriber(instance),
			() => this.removeEventListeners(instance),
			() => this.clearObserver(instance),
			() => this.nullifyReferences(instance),
		];

		for (const step of cleanupSteps) {
			try {
				await step();
			} catch (error) {
				console.warn(
					`MaxiBlocks: Cleanup step failed for instance ${index}:`,
					error
				);
			}
		}
	}

	/**
	 * Perform batch cleanup of multiple instances
	 * @param {Array} instances - Array of instances to cleanup
	 */
	async performBatchCleanup(instances) {
		const batchSize = 10;

		for (let i = 0; i < instances.length; i += batchSize) {
			const batch = instances.slice(i, i + batchSize);

			const batchPromises = batch.map(async (instance, batchIndex) => {
				const actualIndex = i + batchIndex;
				try {
					await this.performSingleInstanceCleanup(
						instance,
						actualIndex
					);
					return { success: true };
				} catch (error) {
					return { success: false, error };
				}
			});

			await Promise.allSettled(batchPromises);

			// Allow other tasks to run between batches
			if (i + batchSize < instances.length) {
				await new Promise(resolve => {
					setTimeout(resolve, 0);
				});
			}
		}
	}

	/**
	 * Basic memory leak detection
	 * @param {Array} allInstances - All current relation instances
	 * @returns {Array} Array of suspicious instances
	 */
	detectMemoryLeaks(allInstances) {
		// Simple heuristic: instances that have been around too long
		const now = Date.now();
		const suspiciousThreshold = 10 * 60 * 1000; // 10 minutes

		return allInstances.filter(instance => {
			if (!instance || !instance.createdAt) {
				return false;
			}

			const age = now - instance.createdAt;
			return age > suspiciousThreshold;
		});
	}

	/**
	 * Cleanup step implementations
	 */
	removeRelationSubscriber(instance) {
		if (
			instance?.relationSubscriber &&
			typeof instance.relationSubscriber === 'function'
		) {
			try {
				instance.relationSubscriber();
				instance.relationSubscriber = null;
			} catch (error) {
				console.warn('Failed to remove relation subscriber:', error);
			}
		}
	}

	removeEventListeners(instance) {
		if (!instance?.element) {
			return;
		}

		try {
			// First try to remove tracked event listeners if available
			if (instance.handlers && Array.isArray(instance.handlers)) {
				instance.handlers.forEach(handler => {
					try {
						if (handler.type && handler.listener) {
							instance.element.removeEventListener(
								handler.type,
								handler.listener,
								handler.options
							);
						}
					} catch (error) {
						console.warn('Failed to remove tracked event listener:', error);
					}
				});
				instance.handlers = [];
			} else if (instance.element.removeEventListener && instance.element.cloneNode) {
				// Fall back to cloning as last resort
				const newElement = instance.element.cloneNode(true);
				if (instance.element.parentNode) {
					instance.element.parentNode.replaceChild(
						newElement,
						instance.element
					);
					instance.element = newElement;
				}
			}

			// Clean up any stored DOM references
			const domProps = ['element', 'container', 'wrapper', 'target'];
			domProps.forEach(prop => {
				if (instance[prop] && instance[prop] !== instance.element) {
					instance[prop] = null;
				}
			});
		} catch (error) {
			console.warn('Failed to remove event listeners:', error);
		}
	}

	clearObserver(instance) {
		if (instance?.observer) {
			try {
				if (typeof instance.observer.disconnect === 'function') {
					instance.observer.disconnect();
				}
				if (
					typeof instance.observer.unobserve === 'function' &&
					instance.element
				) {
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
			'element',
			'observer',
			'callback',
			'handlers',
			'references',
			'parent',
			'children',
			'data',
			'cache',
			'state',
		];

		propertiesToNullify.forEach(prop => {
			try {
				if (Object.prototype.hasOwnProperty.call(instance, prop)) {
					instance[prop] = null;
				}
			} catch (error) {
				// Some properties might be read-only, continue anyway
			}
		});
	}

	/**
	 * Get cleanup statistics
	 * @returns {Object} Statistics object
	 */
	getStats() {
		const successRate =
			this.stats.totalCleanups > 0
				? (
						(this.stats.successfulCleanups /
							this.stats.totalCleanups) *
						100
				  ).toFixed(2)
				: '100';

		return {
			...this.stats,
			successRate: `${successRate}%`,
			queueLength: this.cleanupQueue.length,
			isProcessing: this.isProcessing,
		};
	}

	/**
	 * Reset the manager
	 */
	reset() {
		this.cleanupQueue = [];
		this.isProcessing = false;
		this.stats = {
			totalCleanups: 0,
			successfulCleanups: 0,
			failedCleanups: 0,
		};
	}

	/**
	 * Cleanup the manager itself
	 */
	destroy() {
		this.reset();
	}
}

// Global instance
export const globalCleanupManager = new RelationCleanupManager();

export default RelationCleanupManager;
