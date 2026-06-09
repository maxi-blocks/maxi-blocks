/**
 * WordPress dependencies
 */
import { dispatch, select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { debugIB, summarizeRelations } from './debug';

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
	}

	/**
	 * Add a relation update to the batch queue
	 *
	 * @param {string} blockTriggerClientId - The block whose relations need updating
	 * @param {Array}  newRelations         - The new relations array
	 */
	addUpdate(blockTriggerClientId, newRelations) {
		// Store the update (will overwrite if same block is updated multiple times)
		this.pendingUpdates.set(blockTriggerClientId, { newRelations });
		debugIB('batch-relations-updater.add-update', {
			blockTriggerClientId,
			pendingCount: this.pendingUpdates.size,
			newRelations: summarizeRelations(newRelations),
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

		const updatesToProcess = Array.from(this.pendingUpdates.entries());
		this.pendingUpdates.clear();
		this.flushScheduled = false;
		debugIB('batch-relations-updater.flush', {
			updateCount: updatesToProcess.length,
			blockTriggerClientIds: updatesToProcess.map(
				([clientId]) => clientId
			),
		});

		const editor = dispatch('core/block-editor');
		const blockEditor = select('core/block-editor');

		// Process all updates in sequence (they'll be batched by React)
		// Mark each update as non-persistent to exclude from undo history
		for (const [
			blockTriggerClientId,
			{ newRelations },
		] of updatesToProcess) {
			try {
				// Verify the block still exists
				const blockAttributes =
					blockEditor.getBlockAttributes(blockTriggerClientId);
				if (blockAttributes) {
					debugIB('batch-relations-updater.apply-update', {
						blockTriggerClientId,
						previousRelations: summarizeRelations(
							blockAttributes.relations
						),
						nextRelations: summarizeRelations(newRelations),
					});

					// Mark this specific update as non-persistent
					editor.__unstableMarkNextChangeAsNotPersistent();
					editor.updateBlockAttributes(blockTriggerClientId, {
						relations: newRelations,
					});
				} else {
					debugIB('batch-relations-updater.missing-trigger-block', {
						blockTriggerClientId,
						nextRelations: summarizeRelations(newRelations),
					});
				}
			} catch (error) {
				debugIB('batch-relations-updater.apply-error', {
					blockTriggerClientId,
					message: error?.message,
				});

				// eslint-disable-next-line no-console
				console.error(
					`[MaxiBlocks Relations] Error updating relations for ${blockTriggerClientId}:`,
					error
				);
			}
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
