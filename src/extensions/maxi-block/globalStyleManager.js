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

/**
 * Manages styles for a specific document
 */
class DocumentStyleManager {
	constructor(targetDocument) {
		this.document = targetDocument;
		this.blockStyles = new Map(); // uniqueID -> styleContent
		this.consolidatedStyleElement = null;
		this.pendingUpdate = false;
		this.updateScheduled = false;

		// Create the consolidated style element
		this.initializeStyleElement();
	}

	/**
	 * Initialize the consolidated style element
	 */
	initializeStyleElement() {
		const styleId = 'maxi-blocks__consolidated-styles';
		this.consolidatedStyleElement = this.document.getElementById(styleId);

		if (!this.consolidatedStyleElement) {
			this.consolidatedStyleElement =
				this.document.createElement('style');
			this.consolidatedStyleElement.id = styleId;
			this.consolidatedStyleElement.setAttribute(
				'data-maxi-blocks',
				'consolidated'
			);
			this.document.head.appendChild(this.consolidatedStyleElement);
		}
	}

	/**
	 * Add or update block styles
	 * @param {string} uniqueID     - Block unique identifier
	 * @param {string} styleContent - CSS content for the block
	 */
	addBlockStyles(uniqueID, styleContent) {
		// Store the styles
		this.blockStyles.set(uniqueID, styleContent);

		// Schedule update
		this.scheduleUpdate();
	}

	/**
	 * Remove block styles
	 * @param {string} uniqueID - Block unique identifier
	 */
	removeBlockStyles(uniqueID) {
		if (this.blockStyles.has(uniqueID)) {
			this.blockStyles.delete(uniqueID);
			this.scheduleUpdate();
		}
	}

	/**
	 * Schedule a batched update
	 */
	scheduleUpdate() {
		if (this.updateScheduled) return;

		this.updateScheduled = true;

		// Use requestAnimationFrame for optimal performance
		requestAnimationFrame(() => {
			this.flush();
			this.updateScheduled = false;
		});
	}

	/**
	 * Flush all pending updates to the DOM
	 */
	flush() {
		if (!this.consolidatedStyleElement) {
			this.initializeStyleElement();
		}

		// Build consolidated CSS
		const consolidatedCSS = this.buildConsolidatedCSS();

		// Update the style element only if content changed
		if (this.consolidatedStyleElement.textContent !== consolidatedCSS) {
			this.consolidatedStyleElement.textContent = consolidatedCSS;
		}
	}

	/**
	 * Build the consolidated CSS from all block styles
	 * @returns {string} - Consolidated CSS content
	 */
	buildConsolidatedCSS() {
		if (this.blockStyles.size === 0) {
			return '';
		}

		const cssChunks = [];
		const processedRules = new Set(); // For deduplication

		// Add header comment for debugging
		cssChunks.push('/* MaxiBlocks Consolidated Styles - Generated */');

		// Process each block's styles
		for (const [uniqueID, styleContent] of this.blockStyles.entries()) {
			if (!styleContent || typeof styleContent !== 'string') {
				// Skip invalid content - using empty block to avoid continue statement
			} else {
				// Add block identifier comment for debugging
				cssChunks.push(`\n/* Block: ${uniqueID} */`);

				// Basic deduplication - skip exact duplicate rules
				const trimmedContent = styleContent.trim();
				if (!processedRules.has(trimmedContent)) {
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
		return {
			blockCount: this.blockStyles.size,
			consolidatedLength:
				this.consolidatedStyleElement?.textContent?.length || 0,
			elementExists: !!this.consolidatedStyleElement,
		};
	}

	/**
	 * Destroy this document manager
	 */
	destroy() {
		// Remove the consolidated style element
		if (
			this.consolidatedStyleElement &&
			this.consolidatedStyleElement.parentNode
		) {
			this.consolidatedStyleElement.remove();
		}

		// Clear all data
		this.blockStyles.clear();
		this.consolidatedStyleElement = null;
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
	 * @param {Document} targetDocument - Target document (default: document)
	 */
	addBlockStyles(uniqueID, styleContent, targetDocument = document) {
		const manager = this.getDocumentManager(targetDocument);
		manager.addBlockStyles(uniqueID, styleContent);
	}

	/**
	 * Remove block styles
	 * @param {string}   uniqueID       - Block unique identifier
	 * @param {Document} targetDocument - Target document (default: document)
	 */
	removeBlockStyles(uniqueID, targetDocument = document) {
		const manager = this.getDocumentManager(targetDocument);
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

		// Add cleanup on page unload
		if (typeof window !== 'undefined') {
			window.addEventListener('beforeunload', () => {
				if (globalStyleManagerInstance) {
					globalStyleManagerInstance.destroy();
					globalStyleManagerInstance = null;
				}
			});
		}
	}

	return globalStyleManagerInstance;
};

/**
 * Utility function to add block styles
 * @param {string}   uniqueID       - Block unique identifier
 * @param {string}   styleContent   - CSS content
 * @param {Document} targetDocument - Target document
 */
export const addBlockStyles = (
	uniqueID,
	styleContent,
	targetDocument = document
) => {
	const manager = getGlobalStyleManager();
	manager.addBlockStyles(uniqueID, styleContent, targetDocument);
};

/**
 * Utility function to remove block styles
 * @param {string}   uniqueID       - Block unique identifier
 * @param {Document} targetDocument - Target document
 */
export const removeBlockStyles = (uniqueID, targetDocument = document) => {
	const manager = getGlobalStyleManager();
	manager.removeBlockStyles(uniqueID, targetDocument);
};

export default GlobalStyleManager;
