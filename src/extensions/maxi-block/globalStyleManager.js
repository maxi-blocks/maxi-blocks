/* eslint-disable max-classes-per-file */
/**
 * Global Style Manager for MaxiBlocks
 *
 * Batches individual block styles into consolidated style tags
 * to reduce DOM overhead from hundreds of individual <style> elements
 * to just 1-3 consolidated ones.
 *
 * Backend-only optimization - keeps database per-block structure intact.
 */
import {
	incrementRepeaterAggregate,
	measureRepeaterAggregate,
} from '@extensions/repeater/perf';

const STYLE_SHARD_COUNT = 4;
const getStyleElementId = shardIndex =>
	shardIndex === 0
		? 'maxi-blocks__consolidated-styles'
		: `maxi-blocks__consolidated-styles-${shardIndex}`;
const shouldIncludeDebugComments = () =>
	typeof window !== 'undefined' &&
	!!window.localStorage &&
	window.localStorage.getItem('maxiBlocks-debug') === 'true';
const getStyleShardIndex = uniqueID => {
	let hash = 0;

	for (let index = 0; index < uniqueID.length; index += 1) {
		hash = (hash * 31 + uniqueID.charCodeAt(index)) % 2147483647;
	}

	return hash % STYLE_SHARD_COUNT;
};

/**
 * Manages styles for a specific document
 */
class DocumentStyleManager {
	constructor(targetDocument) {
		this.document = targetDocument;
		this.blockStyleShards = Array.from(
			{ length: STYLE_SHARD_COUNT },
			() => new Map()
		);
		this.styleElements = new Map();
		this.dirtyShards = new Set();
		this.updateScheduled = false;
	}

	/**
	 * Initialize the consolidated style element
	 */
	initializeStyleElement(shardIndex) {
		const styleId = getStyleElementId(shardIndex);
		let styleElement = this.styleElements.get(shardIndex);

		if (!styleElement) {
			styleElement = this.document.getElementById(styleId);
		}

		if (!styleElement) {
			styleElement = this.document.createElement('style');
			styleElement.id = styleId;
			styleElement.setAttribute('data-maxi-blocks', 'consolidated');
			styleElement.setAttribute('data-maxi-blocks-shard', shardIndex);
			let inserted = false;

			for (
				let nextShardIndex = shardIndex + 1;
				nextShardIndex < STYLE_SHARD_COUNT;
				nextShardIndex += 1
			) {
				const nextStyleElement =
					this.styleElements.get(nextShardIndex) ||
					this.document.getElementById(
						getStyleElementId(nextShardIndex)
					);

				if (nextStyleElement?.parentNode === this.document.head) {
					this.document.head.insertBefore(
						styleElement,
						nextStyleElement
					);
					inserted = true;
					break;
				}
			}

			if (!inserted) {
				this.document.head.appendChild(styleElement);
			}
			incrementRepeaterAggregate(
				'globalStyleManager.createdStyleElement',
				1
			);
		}

		this.styleElements.set(shardIndex, styleElement);

		return styleElement;
	}

	/**
	 * Add or update block styles
	 * @param {string} uniqueID     - Block unique identifier
	 * @param {string} styleContent - CSS content for the block
	 */
	addBlockStyles(uniqueID, styleContent) {
		const shardIndex = getStyleShardIndex(uniqueID);
		const shardStyles = this.blockStyleShards[shardIndex];

		if (shardStyles.get(uniqueID) === styleContent) {
			incrementRepeaterAggregate('globalStyleManager.noopStyleUpdate', 1);
			return;
		}

		shardStyles.set(uniqueID, styleContent);
		this.dirtyShards.add(shardIndex);
		this.scheduleUpdate();
	}

	/**
	 * Remove block styles
	 * @param {string} uniqueID - Block unique identifier
	 */
	removeBlockStyles(uniqueID) {
		const shardIndex = getStyleShardIndex(uniqueID);
		const shardStyles = this.blockStyleShards[shardIndex];

		if (shardStyles.has(uniqueID)) {
			shardStyles.delete(uniqueID);
			this.dirtyShards.add(shardIndex);
			this.scheduleUpdate();
		}
	}

	/**
	 * Schedule a batched update
	 */
	scheduleUpdate() {
		if (this.updateScheduled) {
			incrementRepeaterAggregate(
				'globalStyleManager.scheduleUpdateAlreadyPending',
				1
			);
			return;
		}

		this.updateScheduled = true;
		incrementRepeaterAggregate('globalStyleManager.scheduleUpdate', 1);

		// Use document-specific requestAnimationFrame for iframe compatibility
		const requestFrame =
			this.document?.defaultView?.requestAnimationFrame ||
			requestAnimationFrame;

		requestFrame(() => {
			this.flush();
			this.updateScheduled = false;

			if (this.dirtyShards.size) {
				this.scheduleUpdate();
			}
		});
	}

	/**
	 * Flush all pending updates to the DOM
	 */
	flush() {
		if (!this.dirtyShards.size) {
			return;
		}

		const dirtyShards = Array.from(this.dirtyShards).sort((a, b) => a - b);
		this.dirtyShards.clear();

		measureRepeaterAggregate('globalStyleManager.flush', () => {
			incrementRepeaterAggregate(
				'globalStyleManager.flushShardCount',
				dirtyShards.length
			);

			dirtyShards.forEach(shardIndex => {
				const styleElement = this.initializeStyleElement(shardIndex);
				const shardStyles = this.blockStyleShards[shardIndex];

				incrementRepeaterAggregate(
					'globalStyleManager.flushBlockCount',
					shardStyles.size
				);

				const consolidatedCSS = measureRepeaterAggregate(
					'globalStyleManager.buildConsolidatedCSS',
					() => this.buildConsolidatedCSS(shardStyles)
				);

				if (styleElement.textContent !== consolidatedCSS) {
					measureRepeaterAggregate(
						'globalStyleManager.writeStyleElement',
						() => {
							styleElement.textContent = consolidatedCSS;
						}
					);
				} else {
					incrementRepeaterAggregate(
						'globalStyleManager.skipUnchangedWrite',
						1
					);
				}
			});
		});
	}

	/**
	 * Build the consolidated CSS from all block styles
	 * @returns {string} - Consolidated CSS content
	 */
	// eslint-disable-next-line class-methods-use-this
	buildConsolidatedCSS(blockStyles) {
		if (blockStyles.size === 0) {
			return '';
		}

		const cssChunks = [];
		const processedRules = new Set(); // For deduplication
		const includeDebugComments = shouldIncludeDebugComments();

		if (includeDebugComments) {
			cssChunks.push('/* MaxiBlocks Consolidated Styles - Generated */');
		}

		// Process each block's styles
		for (const [uniqueID, styleContent] of blockStyles.entries()) {
			if (!styleContent || typeof styleContent !== 'string') {
				// Skip invalid content - using empty block to avoid continue statement
			} else {
				// Basic deduplication - skip exact duplicate rules
				const trimmedContent = styleContent.trim();
				if (!processedRules.has(trimmedContent)) {
					if (includeDebugComments) {
						cssChunks.push(`\n/* Block: ${uniqueID} */`);
					}
					cssChunks.push(trimmedContent);
					processedRules.add(trimmedContent);
				}
			}
		}

		return cssChunks.join('\n');
	}

	/**
	 * Get stats about current styles
	 * @returns {Object} - Statistics object
	 */
	getStats() {
		const blockCount = this.blockStyleShards.reduce(
			(total, shardStyles) => total + shardStyles.size,
			0
		);
		const consolidatedLength = Array.from(
			this.styleElements.values()
		).reduce(
			(total, styleElement) =>
				total + (styleElement?.textContent?.length || 0),
			0
		);

		return {
			blockCount,
			consolidatedLength,
			elementExists: this.styleElements.size > 0,
			elementCount: this.styleElements.size,
		};
	}

	/**
	 * Destroy this document manager
	 */
	destroy() {
		this.styleElements.forEach(styleElement => {
			if (styleElement?.parentNode) {
				styleElement.remove();
			}
		});

		this.blockStyleShards.forEach(shardStyles => shardStyles.clear());
		this.styleElements.clear();
		this.dirtyShards.clear();
		this.document = null;
	}
}

/**
 * Manages batched style injection for optimal performance
 */
class GlobalStyleManager {
	constructor() {
		// Map of target documents to their style managers
		this.documentManagers = new Map();

		// Cleanup interval to prevent memory leaks
		this.cleanupInterval = setInterval(() => this.cleanup(), 300000); // 5 minutes
	}

	/**
	 * Get or create a document-specific style manager
	 * @param {Document} targetDocument - The document to manage styles for
	 * @returns {DocumentStyleManager} - Document-specific style manager
	 */
	getDocumentManager(targetDocument) {
		if (!this.documentManagers.has(targetDocument)) {
			this.documentManagers.set(
				targetDocument,
				new DocumentStyleManager(targetDocument)
			);
		}
		return this.documentManagers.get(targetDocument);
	}

	/**
	 * Add or update block styles
	 * @param {string}   uniqueID       - Block unique identifier
	 * @param {string}   styleContent   - CSS content for the block
	 * @param {Document} targetDocument - Target document
	 */
	addBlockStyles(uniqueID, styleContent, targetDocument) {
		const resolvedDocument =
			targetDocument === undefined
				? typeof document !== 'undefined'
					? document
					: null
				: targetDocument;
		if (!resolvedDocument) return;

		const manager = this.getDocumentManager(resolvedDocument);
		manager.addBlockStyles(uniqueID, styleContent);
	}

	/**
	 * Remove block styles
	 * @param {string}   uniqueID       - Block unique identifier
	 * @param {Document} targetDocument - Target document
	 */
	removeBlockStyles(uniqueID, targetDocument) {
		const resolvedDocument =
			targetDocument === undefined
				? typeof document !== 'undefined'
					? document
					: null
				: targetDocument;
		if (!resolvedDocument) return;

		const manager = this.getDocumentManager(resolvedDocument);
		manager.removeBlockStyles(uniqueID);
	}

	/**
	 * Force flush all pending style updates
	 */
	flushAll() {
		for (const manager of this.documentManagers.values()) {
			manager.flush();
		}
	}

	/**
	 * Clean up inactive document managers
	 */
	cleanup() {
		for (const [doc, manager] of this.documentManagers.entries()) {
			// Check if document is still connected
			if (!doc.body || !doc.body.isConnected) {
				manager.destroy();
				this.documentManagers.delete(doc);
			}
		}
	}

	/**
	 * Destroy the global manager
	 */
	destroy() {
		if (this.cleanupInterval) {
			clearInterval(this.cleanupInterval);
			this.cleanupInterval = null;
		}

		for (const manager of this.documentManagers.values()) {
			manager.destroy();
		}

		this.documentManagers.clear();
	}
}

// Global singleton instance
let globalStyleManagerInstance = null;

/**
 * Get the global style manager instance
 * @returns {GlobalStyleManager} - The singleton instance
 */
export const getGlobalStyleManager = () => {
	if (!globalStyleManagerInstance) {
		globalStyleManagerInstance = new GlobalStyleManager();

		// Note: We intentionally don't add a beforeunload handler here.
		// The beforeunload event fires when WordPress shows "Reload site?" dialog,
		// and if the user clicks Cancel, the styles would already be destroyed.
		// Memory cleanup is handled by the periodic cleanup interval instead,
		// and true page unloads will garbage collect everything anyway.
	}

	return globalStyleManagerInstance;
};

export const __unstableResetGlobalStyleManager = () => {
	if (globalStyleManagerInstance) {
		globalStyleManagerInstance.destroy();
		globalStyleManagerInstance = null;
	}
};

/**
 * Utility function to add block styles
 * @param {string}   uniqueID       - Block unique identifier
 * @param {string}   styleContent   - CSS content
 * @param {Document} targetDocument - Target document
 */
export const addBlockStyles = (uniqueID, styleContent, targetDocument) => {
	const resolvedDocument =
		targetDocument === undefined
			? typeof document !== 'undefined'
				? document
				: null
			: targetDocument;
	if (!resolvedDocument) return;

	const manager = getGlobalStyleManager();
	manager.addBlockStyles(uniqueID, styleContent, resolvedDocument);
};

/**
 * Utility function to remove block styles
 * @param {string}   uniqueID       - Block unique identifier
 * @param {Document} targetDocument - Target document
 */
export const removeBlockStyles = (uniqueID, targetDocument) => {
	const resolvedDocument =
		targetDocument === undefined
			? typeof document !== 'undefined'
				? document
				: null
			: targetDocument;
	if (!resolvedDocument) return;

	const manager = getGlobalStyleManager();
	manager.removeBlockStyles(uniqueID, resolvedDocument);
};

export default GlobalStyleManager;
