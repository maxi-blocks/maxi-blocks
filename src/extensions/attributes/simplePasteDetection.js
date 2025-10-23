/**
 * WordPress dependencies
 */
import { subscribe, select, dispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import uniqueIDGenerator from './uniqueIDGenerator';
import { getCustomLabel } from '@extensions/maxi-block';
import propagateNewUniqueID from '@extensions/maxi-block/propagateNewUniqueID';

/**
 * Simple paste detection that regenerates unique IDs for pasted blocks
 * Only triggers on Ctrl+V/Cmd+V operations
 */

let previousBlockClientIds = [];
let recentPasteOperation = false;
let isProcessing = false; // Prevent concurrent processing
const recentlyProcessedBlocks = new Set(); // Track recently processed blocks to prevent interference

// More persistent protection using localStorage and timestamps
const PROTECTION_DURATION = 30000; // 30 seconds
const STORAGE_KEY = 'maxiBlocksPasteProtection';

const addBlockToProtection = clientId => {
	recentlyProcessedBlocks.add(clientId);

	// Also store in localStorage with timestamp for persistence
	try {
		const protection = JSON.parse(
			localStorage.getItem(STORAGE_KEY) || '{}'
		);
		protection[clientId] = Date.now();
		localStorage.setItem(STORAGE_KEY, JSON.stringify(protection));
	} catch (error) {
		// Ignore localStorage errors
	}
};

const isBlockProtected = clientId => {
	// Check in-memory Set first
	if (recentlyProcessedBlocks.has(clientId)) {
		return true;
	}

	// Check localStorage as backup
	try {
		const protection = JSON.parse(
			localStorage.getItem(STORAGE_KEY) || '{}'
		);
		const timestamp = protection[clientId];
		if (timestamp && Date.now() - timestamp < PROTECTION_DURATION) {
			// Re-add to in-memory Set if found in localStorage
			recentlyProcessedBlocks.add(clientId);
			return true;
		}
	} catch (error) {
		// Ignore localStorage errors
	}

	return false;
};

const cleanupProtection = () => {
	try {
		const protection = JSON.parse(
			localStorage.getItem(STORAGE_KEY) || '{}'
		);
		const now = Date.now();
		const cleaned = {};

		Object.entries(protection).forEach(([clientId, timestamp]) => {
			if (now - timestamp < PROTECTION_DURATION) {
				cleaned[clientId] = timestamp;
			}
		});

		localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
	} catch (error) {
		// Ignore localStorage errors
	}
};

// Create a global flag system for cross-module communication
if (typeof window !== 'undefined') {
	window.maxiBlocksPasteDetection = {
		recentlyProcessedBlocks,
		isRecentlyProcessedByPaste: isBlockProtected,
	};
}

// Detect paste operations (Ctrl+V/Cmd+V)
const detectPasteOperations = () => {
	const handleKeyDown = event => {
		// Detect Ctrl+V (Windows/Linux) or Cmd+V (Mac)
		if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
			recentPasteOperation = true;
		}
	};

	const handlePaste = () => {
		recentPasteOperation = true;
	};

	// Listen for paste operations globally
	document.addEventListener('keydown', handleKeyDown);
	document.addEventListener('paste', handlePaste);
};

// Wait for initial page load to complete before tracking
setTimeout(() => {
	const blockEditor = select('core/block-editor');
	if (blockEditor) {
		previousBlockClientIds =
			blockEditor.getClientIdsWithDescendants() || [];
	}

	// Clean up old protection entries on page load
	cleanupProtection();
}, 2000);

// Initialize paste detection
detectPasteOperations();

subscribe(() => {
	// Only proceed if a recent paste operation was detected and we're not already processing
	if (!recentPasteOperation || isProcessing) return;

	const blockEditor = select('core/block-editor');
	if (!blockEditor) return;

	const currentBlockClientIds = blockEditor.getClientIdsWithDescendants();
	if (!currentBlockClientIds) return;

	// Detect new blocks (pasted blocks)
	const previousSet = new Set(previousBlockClientIds);
	const newBlocks = currentBlockClientIds.filter(
		clientId => !previousSet.has(clientId)
	);

	if (newBlocks.length > 0) {
		// Set processing flag to prevent concurrent execution
		isProcessing = true;

		// Process all blocks at once
		const blocksToProcess = [];

		newBlocks.forEach(clientId => {
			const block = blockEditor.getBlock(clientId);
			if (
				block &&
				block.name.startsWith('maxi-blocks/') &&
				block.attributes.uniqueID
			) {
				blocksToProcess.push({
					clientId,
					block,
					oldUniqueID: block.attributes.uniqueID,
					newUniqueID: uniqueIDGenerator({
						blockName: block.name,
					}),
				});
			}
		});

		// Process all blocks in a single batch
		if (blocksToProcess.length > 0) {
			const { updateBlockAttributes } = dispatch('core/block-editor');

			blocksToProcess.forEach(
				({ clientId, block, oldUniqueID, newUniqueID }) => {
					// Mark this block as recently processed to prevent interference
					addBlockToProtection(clientId);

					// Update the block with new unique ID
					propagateNewUniqueID(
						oldUniqueID,
						newUniqueID,
						clientId,
						false, // repeaterStatus
						null, // repeaterRowClientId
						block.attributes['background-layers']
					);

					// Update block attributes
					updateBlockAttributes(clientId, {
						uniqueID: newUniqueID,
						customLabel: getCustomLabel(
							block.attributes.customLabel,
							newUniqueID
						),
					});
				}
			);

			// Force style injection after unique ID changes
			setTimeout(() => {
				blocksToProcess.forEach(
					({ clientId, oldUniqueID, newUniqueID }) => {
						try {
							// Get the block element to trigger style injection
							const blockElement = document.querySelector(
								`[data-block="${clientId}"]`
							);
							if (blockElement) {
								// Force the MaxiBlockComponent to re-inject styles
								const event = new CustomEvent(
									'maxi-force-style-injection',
									{
										detail: {
											uniqueID: newUniqueID,
											oldUniqueID,
										},
									}
								);
								blockElement.dispatchEvent(event);
							}

							// Also force a component update to ensure styles are applied
							const { updateBlockAttributes } =
								dispatch('core/block-editor');
							updateBlockAttributes(clientId, {
								'data-force-style-update': Date.now(),
							});
						} catch (error) {
							// Ignore errors in style injection
						}
					}
				);
			}, 300); // Longer delay to ensure DOM is ready
		}

		// Reset flags after processing
		recentPasteOperation = false;
		isProcessing = false;

		// Protection is now handled by localStorage with timestamps
		// No need for setTimeout - cleanup happens automatically via isBlockProtected checks
	}

	previousBlockClientIds = currentBlockClientIds;
});

// Export function to check if a block was recently processed by paste detection
const isRecentlyProcessedByPaste = clientId => {
	return recentlyProcessedBlocks.has(clientId);
};

export default isRecentlyProcessedByPaste;
