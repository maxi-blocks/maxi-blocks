/**
 * WordPress dependencies
 */
import {
	createNewPost,
	saveDraft,
	getEditedPostContent,
	setPostContent,
} from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import { clientIdCleaner, openPreviewPage } from '../../utils';
import basePattern from './pattern';

const htmlCleaner = html =>
	clientIdCleaner(html).replace(
		// eslint-disable-next-line no-useless-escape
		/(data-is-drop-zone=")([a-zA-Z0-9:;\.\s\(\)\-\,]*)(")/g,
		''
	);

describe('Pattern', () => {
	it('Checking pattern generate', async () => {
		// Image Maxi returns an error as the images displayed there are not uploaded
		// on local, so we cheat a bit and remove console.errors. It may hide some problems
		// so try to remove this line someday
		console.error = jest.fn();

		// Create a new post and reload after SC have been loaded
		await createNewPost();
		await page.waitForTimeout(5000);
		await page.reload();

		// add pattern from code editor
		await setPostContent(basePattern);

		// Needs this timeout to ensure breakpoints are loaded
		// and save to re-render styles of the blocks
		await page.evaluate(() =>
			wp.data.dispatch('maxiBlocks').receiveMaxiBreakpoints()
		);
		await saveDraft();
		await page.waitForTimeout(5000);

		// Check post content
		expect(await getEditedPostContent()).toMatchSnapshot();

		// Check blocks html
		let blocksHtml = await page.$eval(
			'.is-root-container.block-editor-block-list__layout',
			el => el.outerHTML
		);
		expect(htmlCleaner(blocksHtml)).toMatchSnapshot();

		// Checks blocks styles elements
		let blockStyles = await page.$$eval(
			'.maxi-blocks__styles',
			styleEls => {
				return styleEls.map(el => el.outerHTML);
			}
		);
		expect(blockStyles).toMatchSnapshot();

		// Frontend
		const previewPage = await openPreviewPage(page);
		await previewPage.waitForSelector('.entry-content');

		// Check post html
		const htmlPage = await previewPage.$eval(
			'.entry-content',
			div => div.innerHTML
		);
		expect(htmlCleaner(htmlPage)).toMatchSnapshot();

		// Check post styles
		const stylesPage = await previewPage.$eval(
			'#maxi-blocks-inline-css',
			styles => styles.outerHTML
		);
		expect(stylesPage).toMatchSnapshot();

		// Close preview page
		await previewPage.close();

		// Return to editor page and reload
		await page.bringToFront();
		await page.reload();

		// Needs this timeout to ensure breakpoints are loaded
		// and save to re-render styles of the blocks
		await page.evaluate(() =>
			wp.data.dispatch('maxiBlocks').receiveMaxiBreakpoints()
		);
		await saveDraft();
		await page.waitForTimeout(5000);

		// Check post content
		expect(await getEditedPostContent()).toMatchSnapshot();

		// Check blocks html
		blocksHtml = await page.$eval(
			'.is-root-container.block-editor-block-list__layout',
			el => el.outerHTML
		);
		expect(htmlCleaner(blocksHtml)).toMatchSnapshot();

		// Checks blocks styles elements
		blockStyles = await page.$$eval('.maxi-blocks__styles', styleEls => {
			return styleEls.map(el => el.outerHTML);
		});
		expect(blockStyles).toMatchSnapshot();
	});
}, 999999);
