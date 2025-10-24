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
			// Reset after 2 seconds to prevent interference with other operations
			setTimeout(() => {
				recentPasteOperation = false;
			}, 2000);
		}
	};

	const handlePaste = () => {
		recentPasteOperation = true;
		// Reset after 2 seconds to prevent interference with other operations
		setTimeout(() => {
			recentPasteOperation = false;
		}, 2000);
	};

	// Listen for paste operations globally
	document.addEventListener('keydown', handleKeyDown);
	document.addEventListener('paste', handlePaste);
};

// Monitor code editor for block insertions
const setupCodeEditorMonitoring = () => {
	// Monitor for code editor mode switches and content changes
	let lastBlockCount = 0;
	let codeEditorCheckInterval = null;

	const checkForCodeEditorChanges = () => {
		const blockEditor = select('core/block-editor');
		if (!blockEditor) return;

		const currentBlocks = blockEditor.getClientIdsWithDescendants() || [];
		const currentBlockCount = currentBlocks.length;

		// If block count increased significantly, it might be a code editor insertion
		if (currentBlockCount > lastBlockCount) {
			const newBlockCount = currentBlockCount - lastBlockCount;

			// Trigger processing for code editor insertions
			if (newBlockCount > 0) {
				// Set flag to indicate this might be from code editor
				recentPasteOperation = true;

				// Process after a short delay to let blocks settle
				setTimeout(() => {
					processBlockChanges();
				}, 500);
			}
		}

		lastBlockCount = currentBlockCount;
	};

	// Check periodically for code editor changes
	codeEditorCheckInterval = setInterval(checkForCodeEditorChanges, 1000);

	// Also listen for editor mode changes
	const editorModeObserver = () => {
		// When switching from code to visual editor, check for new blocks
		setTimeout(checkForCodeEditorChanges, 1000);
	};

	// Listen for clicks on editor mode switcher
	document.addEventListener('click', event => {
		const { target } = event;
		if (
			target &&
			(target.classList.contains('editor-post-switch-to-draft') ||
				target.textContent?.includes('Visual') ||
				target.textContent?.includes('Code'))
		) {
			setTimeout(editorModeObserver, 500);
		}
	});
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

	// Set up code editor monitoring
	setupCodeEditorMonitoring();
}, 2000);

// Initialize paste detection
detectPasteOperations();

// Throttle the subscribe callback to prevent performance issues
let subscribeTimeout = null;

subscribe(() => {
	// Process block changes regardless of paste detection to catch code editor insertions
	// But still use paste detection to optimize processing
	if (isProcessing) {
		return;
	}

	// Throttle to prevent excessive calls during rapid operations (like code editor)
	if (subscribeTimeout) {
		clearTimeout(subscribeTimeout);
	}

	subscribeTimeout = setTimeout(() => {
		// Quick check: only process if block count changed
		const blockEditor = select('core/block-editor');
		if (!blockEditor) {
			subscribeTimeout = null;
			return;
		}

		const currentBlockClientIds = blockEditor.getClientIdsWithDescendants();
		if (!currentBlockClientIds) {
			subscribeTimeout = null;
			return;
		}

		// Only process if there are new blocks
		const previousSet = new Set(previousBlockClientIds);
		const newBlocks = currentBlockClientIds.filter(
			clientId => !previousSet.has(clientId)
		);

		if (newBlocks.length > 0) {
			processBlockChanges();
		}

		subscribeTimeout = null;
	}, 100); // 100ms throttle
});

const processBlockChanges = () => {
	const blockEditor = select('core/block-editor');
	if (!blockEditor) {
		return;
	}

	const currentBlockClientIds = blockEditor.getClientIdsWithDescendants();
	if (!currentBlockClientIds) {
		return;
	}

	// Detect new blocks (pasted blocks)
	const previousSet = new Set(previousBlockClientIds);
	const newBlocks = currentBlockClientIds.filter(
		clientId => !previousSet.has(clientId)
	);

	// Process new blocks from any source (paste OR code editor)
	if (newBlocks.length > 0) {
		// Additional safety: Limit processing to reasonable batch sizes to prevent freezing
		if (newBlocks.length > 50) {
			// If too many blocks, skip processing to prevent performance issues
			recentPasteOperation = false;
			isProcessing = false;
			previousBlockClientIds = currentBlockClientIds;
			return;
		}

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
				// Check if this unique ID might be a duplicate (from code editor or cross-page paste)
				const oldUniqueID = block.attributes.uniqueID;

				// Always regenerate IDs for newly inserted blocks to prevent conflicts
				const newUniqueID = uniqueIDGenerator({
					blockName: block.name,
				});

				blocksToProcess.push({
					clientId,
					block,
					oldUniqueID,
					newUniqueID,
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
};

// Export function to check if a block was recently processed by paste detection
const isRecentlyProcessedByPaste = clientId => {
	return recentlyProcessedBlocks.has(clientId);
};

export default isRecentlyProcessedByPaste;
