/**
 * WordPress dependencies
 */
import { dispatch, select } from '@wordpress/data';

/**
 * Batch Relations Updater
 *
 * Collects updateRelationsRemotely calls and batches them to reduce React re-renders.
 * Instead of N individual updateBlockAttributes calls (each taking 300ms+),
 * we collect them and execute in a single microtask, allowing React to batch the updates.
 *
 * Performance improvement: 300ms × N updates → ~300ms for all updates batched
 */

class BatchRelationsUpdater {
	constructor() {
		this.pendingUpdates = new Map(); // Map<triggerClientId, updateData>
		this.flushScheduled = false;
		this.BATCH_DELAY = 0; // Use microtask (immediate) to batch within same event loop
	}

	/**
	 * Add a relation update to the batch queue
	 *
	 * @param {string} blockTriggerClientId - The block whose relations need updating
	 * @param {Array}  newRelations         - The new relations array
	 * @param {Object} performanceData      - Performance metrics for logging
	 */
	addUpdate(blockTriggerClientId, newRelations, performanceData) {
		// Store the update (will overwrite if same block is updated multiple times)
		this.pendingUpdates.set(blockTriggerClientId, {
			newRelations,
			performanceData,
		});

		// Schedule flush if not already scheduled
		if (!this.flushScheduled) {
			this.flushScheduled = true;
			// Use queueMicrotask for immediate batching within same tick
			queueMicrotask(() => {
				this.flush();
			});
		}
	}

	/**
	 * Flush all pending relation updates to Redux store
	 * This executes all updates in a single batch, allowing React to optimize re-renders
	 */
	flush() {
		if (this.pendingUpdates.size === 0) {
			this.flushScheduled = false;
			return;
		}

		const batchStartTime = performance.now();
		const updatesToProcess = Array.from(this.pendingUpdates.entries());
		this.pendingUpdates.clear();
		this.flushScheduled = false;

		const editor = dispatch('core/block-editor');
		const blockEditor = select('core/block-editor');

		// Mark all updates as non-persistent upfront
		editor.__unstableMarkNextChangeAsNotPersistent();

		// Process all updates in sequence (they'll be batched by React)
		let totalProcessingTime = 0;
		let successCount = 0;
		const updateTimes = [];

		for (const [
			blockTriggerClientId,
			{ newRelations },
		] of updatesToProcess) {
			const updateStart = performance.now();

			try {
				// Verify the block still exists
				const blockAttributes =
					blockEditor.getBlockAttributes(blockTriggerClientId);
				if (blockAttributes) {
					const attrUpdateStart = performance.now();
					editor.updateBlockAttributes(blockTriggerClientId, {
						relations: newRelations,
					});
					const attrUpdateDuration =
						performance.now() - attrUpdateStart;

					updateTimes.push({
						clientId: blockTriggerClientId,
						duration: attrUpdateDuration,
					});

					successCount += 1;
				}
			} catch (error) {
				// eslint-disable-next-line no-console
				console.error(
					`[MaxiBlocks Relations] Error updating relations for ${blockTriggerClientId}:`,
					error
				);
			}

			totalProcessingTime += performance.now() - updateStart;
		}

		const batchTotalTime = performance.now() - batchStartTime;

		// Log batch performance if it was slow
		if (batchTotalTime > 20) {
			const slowUpdates = updateTimes.filter(u => u.duration > 20);

			// eslint-disable-next-line no-console
			console.log(
				'[MaxiBlocks Relations] Batched relation updates',
				JSON.stringify({
					batchTotalTime: `${batchTotalTime.toFixed(2)}ms`,
					updatesProcessed: successCount,
					totalUpdates: updatesToProcess.length,
					avgTimePerUpdate: `${(
						totalProcessingTime / updatesToProcess.length
					).toFixed(2)}ms`,
					slowUpdatesCount: slowUpdates.length,
					...(slowUpdates.length > 0 && {
						slowUpdates: slowUpdates.map(u => ({
							clientId: u.clientId,
							duration: `${u.duration.toFixed(2)}ms`,
						})),
					}),
				})
			);
		}
	}

	/**
	 * Force immediate flush (for testing or critical operations)
	 */
	forceFlush() {
		this.flush();
	}

	/**
	 * Get the number of pending updates
	 *
	 * @returns {number} Count of pending updates
	 */
	getPendingCount() {
		return this.pendingUpdates.size;
	}
}

// Singleton instance
const batchRelationsUpdater = new BatchRelationsUpdater();

export default batchRelationsUpdater;
