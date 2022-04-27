/* eslint-disable no-await-in-loop */
/* eslint-disable no-return-await */
/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	saveDraft,
} from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import { openPreviewPage } from '../utils';

describe.skip('sc-variable', () => {
	it('Check sc-vars', async () => {
		await createNewPost();
		await insertBlock('Divider Maxi');

		await page.waitForTimeout(5000);
		await saveDraft();
		await page.waitForTimeout(5000);

		await page.evaluate(() => window.location.reload());

		await page.waitForTimeout(5000);
		await page.waitForSelector('#maxi-blocks-sc-vars-inline-css');

		const scVariable = await page.$eval(
			'#maxi-blocks-sc-vars-inline-css',
			content => content.innerText
		);

		expect(scVariable).toMatchSnapshot();

		const previewPage = await openPreviewPage(page);
		await previewPage.waitForSelector('.entry-content');

		await page.waitForSelector('#maxi-blocks-sc-vars-inline-css');

		const scVariableFront = await page.$eval(
			'#maxi-blocks-sc-vars-inline-css',
			content => content.innerText
		);

		expect(scVariableFront).toMatchSnapshot();
	});
});
