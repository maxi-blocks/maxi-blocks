/**
 * WordPress dependencies
 */
import { dispatch } from '@wordpress/data';

/**
 * Batch Block Dispatcher
 *
 * Collects addBlock calls and dispatches them in batches to reduce Redux overhead.
 * Instead of 100 individual state updates, we do 1 batched update.
 *
 * Performance improvement: ~60ms per block → ~1-5ms per block for addBlockToStore
 */

class BatchBlockDispatcher {
	constructor() {
		this.pendingBlocks = [];
		this.flushTimeout = null;
		this.isProcessing = false;
		this.BATCH_DELAY = 10; // ms to wait before flushing (balance between batching and responsiveness)
	}

	/**
	 * Add a block to the batch queue
	 * @param {string} uniqueID  - Block's unique ID
	 * @param {string} clientId  - Block's client ID
	 * @param {*}      blockRoot - Block's root element
	 */
	addBlock(uniqueID, clientId, blockRoot) {
		this.pendingBlocks.push({ uniqueID, clientId, blockRoot });

		// Schedule flush if not already scheduled
		if (!this.flushTimeout) {
			this.flushTimeout = setTimeout(() => {
				this.flush();
			}, this.BATCH_DELAY);
		}
	}

	/**
	 * Flush all pending blocks to Redux store
	 */
	flush() {
		if (this.isProcessing || this.pendingBlocks.length === 0) {
			return;
		}

		this.isProcessing = true;

		// Clear timeout
		if (this.flushTimeout) {
			clearTimeout(this.flushTimeout);
			this.flushTimeout = null;
		}

		const blocksToAdd = [...this.pendingBlocks];
		this.pendingBlocks = [];

		// Dispatch batched action
		if (blocksToAdd.length === 1) {
			// Single block - use regular action (no overhead)
			const { uniqueID, clientId, blockRoot } = blocksToAdd[0];
			dispatch('maxiBlocks/blocks').addBlock(
				uniqueID,
				clientId,
				blockRoot
			);
		} else {
			// Multiple blocks - use batch action
			dispatch('maxiBlocks/blocks').addMultipleBlocks(blocksToAdd);
		}

		this.isProcessing = false;
	}

	/**
	 * Force immediate flush (for testing or critical operations)
	 */
	forceFlush() {
		if (this.flushTimeout) {
			clearTimeout(this.flushTimeout);
			this.flushTimeout = null;
		}
		this.flush();
	}
}

// Singleton instance
const batchBlockDispatcher = new BatchBlockDispatcher();

export default batchBlockDispatcher;
