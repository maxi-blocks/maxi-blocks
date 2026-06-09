/**
 * Iframe-aware DOM access utilities for WP 7.0+ compatibility.
 *
 * In WP 7.0 the post editor renders inside an iframe (name="editor-canvas")
 * when all blocks use Block API v3+. Block DOM elements (e.g. [data-block])
 * live inside that iframe, while the admin chrome (sidebar, toolbar, modals)
 * stays in the parent frame.
 *
 * These helpers let code transparently query the correct document regardless
 * of whether the editor is iframed or not.
 */

/**
 * Returns the editor canvas iframe element, or null when the editor is not iframed.
 *
 * @returns {HTMLIFrameElement|null}
 */
export const getEditorCanvasIframe = () => {
	if (typeof document === 'undefined') return null;
	return (
		document.querySelector('iframe[name="editor-canvas"]') ||
		document.querySelector('iframe.edit-site-visual-editor__editor-canvas') ||
		null
	);
};

/**
 * Returns the Document that contains block DOM elements.
 * Falls back to the current document when the editor is not iframed.
 *
 * @returns {Document}
 */
export const getEditorCanvasDocument = () => {
	const iframe = getEditorCanvasIframe();
	if (iframe) {
		try {
			if (iframe.contentDocument) return iframe.contentDocument;
		} catch (_e) {
			// Cross-origin — fall through
		}
	}
	return document;
};

/**
 * Returns the Window that contains block DOM elements.
 * Falls back to the current window when the editor is not iframed.
 *
 * @returns {Window}
 */
export const getEditorCanvasWindow = () => {
	const iframe = getEditorCanvasIframe();
	if (iframe) {
		try {
			if (iframe.contentWindow) return iframe.contentWindow;
		} catch (_e) {
			// Cross-origin — fall through
		}
	}
	return window;
};

/**
 * querySelector inside the editor canvas (iframe or parent).
 *
 * @param {string} selector
 * @returns {Element|null}
 */
export const queryEditorCanvas = selector => {
	const doc = getEditorCanvasDocument();
	return doc.querySelector(selector);
};

/**
 * querySelectorAll inside the editor canvas (iframe or parent).
 *
 * @param {string} selector
 * @returns {NodeList}
 */
export const queryAllEditorCanvas = selector => {
	const doc = getEditorCanvasDocument();
	return doc.querySelectorAll(selector);
};

/**
 * Collects Document objects from both the parent frame and the editor canvas iframe.
 * Useful for queries that might target elements in either frame (e.g. toolbars
 * that can appear in the parent or inside the iframe depending on WP version).
 *
 * @returns {Document[]}
 */
export const getAllEditorDocuments = () => {
	const docs = [document];
	const iframe = getEditorCanvasIframe();
	if (iframe) {
		try {
			if (iframe.contentDocument && iframe.contentDocument !== document) {
				docs.push(iframe.contentDocument);
			}
		} catch (_e) {
			// Cross-origin — skip
		}
	}
	return docs;
};

/**
 * Collects Window objects from both the parent frame and the editor canvas iframe.
 *
 * @returns {Window[]}
 */
export const getAllEditorWindows = () => {
	const wins = [window];
	const iframe = getEditorCanvasIframe();
	if (iframe) {
		try {
			if (iframe.contentWindow && iframe.contentWindow !== window) {
				wins.push(iframe.contentWindow);
			}
		} catch (_e) {
			// Cross-origin — skip
		}
	}
	return wins;
};
