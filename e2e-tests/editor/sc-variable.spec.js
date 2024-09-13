/* eslint-disable no-await-in-loop */
/* eslint-disable no-return-await */
/**
 * WordPress dependencies
 */
import { createNewPost, saveDraft } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	openPreviewPage,
	insertMaxiBlock,
	updateAllBlockUniqueIds,
} from '../utils';

describe('sc-variable', () => {
	it('Check sc-vars', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Divider Maxi');
		await updateAllBlockUniqueIds(page);

		await page.waitForTimeout(2000);
		await saveDraft();
		await page.waitForTimeout(2000);

		await page.evaluate(() => window.location.reload());

		await page.waitForTimeout(2000);
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
