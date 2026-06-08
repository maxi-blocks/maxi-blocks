/**
 * Returns the Puppeteer Frame for the block editor canvas.
 *
 * With Block API v3 the editor renders inside an iframe
 * (iframe[name="editor-canvas"]). Queries for block DOM elements
 * (e.g. `.maxi-divider-block`) must be run against that frame,
 * not against `page` / the parent document.
 *
 * Falls back to the main frame when no editor iframe exists
 * (older WordPress versions without iframe editor).
 *
 * @param {import('puppeteer-core').Page} page
 * @return {Promise<import('puppeteer-core').Frame>}
 */
const getEditorFrame = async page => {
	const iframeHandle = await page.$('iframe[name="editor-canvas"]');
	if (iframeHandle) {
		const frame = await iframeHandle.contentFrame();
		if (frame) return frame;
	}
	return page.mainFrame();
};

export default getEditorFrame;
