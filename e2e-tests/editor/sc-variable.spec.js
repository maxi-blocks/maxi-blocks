/* eslint-disable no-await-in-loop */
/* eslint-disable no-return-await */
/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import { openPreviewPage } from '../utils';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

describe('sc-variable', () => {
	it('Check sc-vars', async () => {
		await createNewPost();

		await page.waitForSelector('#maxi-blocks-sc-vars-inline-css');
		let scVariable = '';

		do {
			await page.waitForTimeout(300);

			scVariable = await page.$eval(
				'#maxi-blocks-sc-vars-inline-css',
				content => content.innerHTML
			);
		} while (isEmpty(scVariable));

		expect(scVariable).toMatchSnapshot();

		await insertBlock('Divider Maxi');

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
