/* eslint-disable no-return-await */
/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import { openPreviewPage } from '../utils';

describe('sc-variable', () => {
	it('Check sc-vars', async () => {
		await createNewPost();
		await page.waitForSelector('#maxi-blocks-sc-vars-inline-css');

		const scVariable = await page.$eval(
			'#maxi-blocks-sc-vars-inline-css',
			content => content.innerHTML
		);

		expect(scVariable).toMatchSnapshot();

		await insertBlock('Text Maxi');

		const previewPage = await openPreviewPage(page);
		await previewPage.waitForSelector('.entry-content');

		await page.waitForSelector('#maxi-blocks-sc-vars-inline-css');

		const scVariableFront = await page.$eval(
			'#maxi-blocks-sc-vars-inline-css',
			content => content.innerHTML
		);

		expect(scVariableFront).toMatchSnapshot();
	});
});
