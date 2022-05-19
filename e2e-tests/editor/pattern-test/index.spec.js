/**
 * WordPress dependencies
 */
import {
	createNewPost,
	saveDraft,
	getEditedPostContent,
	setPostContent,
	getBlockStyle,
	openPreviewPage,
} from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import basePattern from './pattern';

describe('Pattern', () => {
	it('Checking pattern generate', async () => {
		await createNewPost();

		// add pattern from code editor
		await setPostContent(basePattern);
		await page.waitForTimeout(1500);

		// save changes
		await saveDraft();

		const previewPage = await openPreviewPage(page);
		await previewPage.waitForSelector('.entry-content');
		await page.waitForTimeout(1500);

		expect(await getEditedPostContent()).toMatchSnapshot();
		/* const htmlPage = await page.$eval(
			'.is-root-container.block-editor-block-list__layout',
			div => div.outerHtml
		);

		expect(htmlPage).toMatchSnapshot(); */
		// expect(await getBlockStyle(page)).toMatchSnapshot();
		// Checkeas frontend

		// Reload + snapshot again (snapshot de conteniido(html) y de styles)
	});
});
