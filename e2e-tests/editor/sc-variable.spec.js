/* eslint-disable no-return-await */
/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import { openPreviewPage, getBlockStyle } from '../utils';

describe('sc-variable', () => {
	it('Check sc-vars', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing Text Maxi', { delay: 100 });
		await page.waitForTimeout(150);

		const scVariable = await page.$eval(
			'#maxi-blocks-sc-vars-inline-css',
			content => content.innerHTML
		);

		expect(scVariable).toMatchSnapshot();

		await openPreviewPage(page);
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
