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
const escapeCssIdentifier = (targetDocument, value) => {
	const escaper =
		targetDocument?.defaultView?.CSS?.escape ||
		(typeof CSS !== 'undefined' ? CSS.escape : null);

	if (typeof escaper === 'function') {
		return escaper(value);
	}

	return String(value).replace(/[^a-zA-Z0-9_-]/g, '\\$&');
};

class DocumentStyleManager {
	constructor(targetDocument) {
		this.document = targetDocument;
		this.blockStyles = new Map(); // uniqueID -> styleContent
		this.consolidatedStyleElement = null;
		this.pendingUpdate = false;
		this.updateScheduled = false;
		this.lastCSS = ''; // Track last CSS to avoid redundant updates

		// CSSOM: Try to use CSSStyleSheet + adoptedStyleSheets for modern browsers
		this.adoptedSheet = null;
		this.usesAdoptedStyleSheets = false;

		this.initializeStyleInjection();
	}

	/**
	 * Initialize the style injection mechanism
	 * Uses adoptedStyleSheets for modern browsers, <style> element for fallback
	 */
	initializeStyleInjection() {
		// Check for adoptedStyleSheets support (modern browsers)
		if (
			typeof CSSStyleSheet !== 'undefined' &&
			'adoptedStyleSheets' in this.document
		) {
			try {
				this.adoptedSheet = new CSSStyleSheet();
				// Add to document's adopted stylesheets
				this.document.adoptedStyleSheets = [
					...this.document.adoptedStyleSheets,
					this.adoptedSheet,
				];
				this.usesAdoptedStyleSheets = true;
				return;
			} catch (e) {
				// Fall through to <style> element fallback
				console.warn(
					'[GlobalStyleManager] adoptedStyleSheets failed, using <style> fallback:',
					e
				);
			}
		}

		// Fallback: Use traditional <style> element
		this.initializeStyleElement();
	}

	/**
	 * Initialize the consolidated style element (fallback for older browsers)
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

		// Use document-specific requestAnimationFrame for iframe compatibility
		const requestFrame =
			this.document?.defaultView?.requestAnimationFrame ||
			requestAnimationFrame;

		requestFrame(() => {
			this.flush();
			this.updateScheduled = false;
		});
	}

	/**
	 * Flush all pending updates using CSSOM or DOM
	 */
	flush() {
		if (!this.document?.body || !this.document.body.isConnected) {
			return;
		}

		// Build consolidated CSS
		const consolidatedCSS = this.buildConsolidatedCSS();

		// Skip if CSS hasn't changed
		if (consolidatedCSS === this.lastCSS) {
			return;
		}
		this.lastCSS = consolidatedCSS;

		// CSSOM path: Use replaceSync for fast updates (no re-parsing of entire stylesheet)
		if (this.usesAdoptedStyleSheets && this.adoptedSheet) {
			try {
				this.adoptedSheet.replaceSync(consolidatedCSS);
				return;
			} catch (e) {
				// If replaceSync fails, fall through to <style> element
				console.warn(
					'[GlobalStyleManager] replaceSync failed, falling back to <style>:',
					e
				);
				this.usesAdoptedStyleSheets = false;
			}
		}

		// DOM path: Update <style> element
		if (!this.consolidatedStyleElement) {
			this.initializeStyleElement();
		}
		this.consolidatedStyleElement.textContent = consolidatedCSS;
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
	 * Remove stale style entries based on DOM/editor state.
	 * OPTIMIZED: Uses editor state as primary source, batch DOM query as fallback.
	 * Avoids O(n) individual DOM queries.
	 * @param {Set<string>|null} activeUniqueIDs - Unique IDs present in editor.
	 */
	pruneStaleEntries(activeUniqueIDs) {
		let didRemove = false;
		const hasEditorState = activeUniqueIDs instanceof Set;

		// Fast path: Use editor state as source of truth
		if (hasEditorState) {
			for (const uniqueID of this.blockStyles.keys()) {
				if (!activeUniqueIDs.has(uniqueID)) {
					this.blockStyles.delete(uniqueID);
					didRemove = true;
				}
			}
		} else {
			// Fallback: Batch DOM query - one querySelectorAll, build Set, then compare
			// Much faster than O(n) individual querySelector calls
			try {
				const allBlockEls = this.document?.querySelectorAll(
					'.maxi-block[data-block]'
				);
				const domUniqueIDs = new Set();

				if (allBlockEls) {
					allBlockEls.forEach(el => {
						// Extract uniqueID from class list (format: maxi-xxx-u)
						const classes = el.className.split(/\s+/);
						const uniqueIDClass = classes.find(
							c => c.endsWith('-u') && c.startsWith('maxi-')
						);
						if (uniqueIDClass) {
							domUniqueIDs.add(uniqueIDClass);
						}
					});
				}

				for (const uniqueID of this.blockStyles.keys()) {
					if (!domUniqueIDs.has(uniqueID)) {
						this.blockStyles.delete(uniqueID);
						didRemove = true;
					}
				}
			} catch (error) {
				// DOM query failed - skip pruning this cycle
				console.warn(
					'[GlobalStyleManager] DOM query failed during prune:',
					error
				);
			}
		}

		if (didRemove) {
			this.scheduleUpdate();
		}
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
	 * Check whether a document is detached or unavailable.
	 * @param {Document} targetDocument - Document to check.
	 * @returns {boolean} - True if detached.
	 */
	isDocumentDetached(targetDocument) {
		return (
			!targetDocument ||
			!targetDocument.body ||
			!targetDocument.body.isConnected ||
			!targetDocument.defaultView
		);
	}

	/**
	 * Collect unique IDs from the editor state when available.
	 * @returns {Set<string>|null} - Set of active unique IDs or null.
	 */
	getEditorUniqueIDs() {
		const select = globalThis?.wp?.data?.select;
		if (typeof select !== 'function') {
			return null;
		}

		const editorStore = select('core/block-editor');
		if (!editorStore?.getBlocks) {
			return null;
		}

		const blocks = editorStore.getBlocks() || [];
		const uniqueIDs = new Set();
		const stack = [...blocks];

		while (stack.length) {
			const block = stack.pop();
			if (!block) continue;

			const uniqueID = block?.attributes?.uniqueID;
			if (uniqueID) {
				uniqueIDs.add(uniqueID);
			}

			if (block.innerBlocks?.length) {
				stack.push(...block.innerBlocks);
			}
		}

		return uniqueIDs;
	}

	/**
	 * Get or create a document-specific style manager
	 * @param {Document} targetDocument - The document to manage styles for
	 * @returns {DocumentStyleManager} - Document-specific style manager
	 */
	getDocumentManager(targetDocument) {
		if (this.isDocumentDetached(targetDocument)) {
			const existingManager = this.documentManagers.get(targetDocument);
			if (existingManager) {
				existingManager.destroy();
				this.documentManagers.delete(targetDocument);
			}
			return null;
		}

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
		if (!manager) return;
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
		if (!manager) return;
		manager.removeBlockStyles(uniqueID);
	}

	/**
	 * Remove block styles from ALL tracked documents
	 * @param {string} uniqueID - Block unique identifier
	 */
	removeBlockStylesEverywhere(uniqueID) {
		for (const [doc, manager] of this.documentManagers.entries()) {
			if (this.isDocumentDetached(doc)) {
				manager.destroy();
				this.documentManagers.delete(doc);
				continue;
			}
			manager.removeBlockStyles(uniqueID);
		}
	}

	/**
	 * Force flush all pending style updates
	 */
	flushAll() {
		for (const [doc, manager] of this.documentManagers.entries()) {
			if (this.isDocumentDetached(doc)) {
				manager.destroy();
				this.documentManagers.delete(doc);
				continue;
			}
			manager.flush();
		}
	}

	/**
	 * Clean up inactive document managers
	 */
	cleanup() {
		const activeUniqueIDs = this.getEditorUniqueIDs();

		for (const [doc, manager] of this.documentManagers.entries()) {
			// Check if document is still connected
			if (this.isDocumentDetached(doc)) {
				manager.destroy();
				this.documentManagers.delete(doc);
				continue;
			}

			manager.pruneStaleEntries(activeUniqueIDs);
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

		// Cleanup on page unload to prevent memory leaks
		if (
			typeof window !== 'undefined' &&
			typeof window.addEventListener === 'function'
		) {
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

/**
 * Utility function to remove block styles from ALL tracked documents
 * @param {string} uniqueID - Block unique identifier
 */
export const removeBlockStylesEverywhere = uniqueID => {
	const manager = getGlobalStyleManager();
	manager.removeBlockStylesEverywhere(uniqueID);
};

export default GlobalStyleManager;
