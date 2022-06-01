/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */

describe.skip('Button helper', () => {
	it('Check button helper', async () => {
		await createNewPost();
		await insertBlock('Button Maxi');

		// helper button
		await page.$eval(
			'.toolbar-wrapper .toolbar-item.toolbar-item__help',
			button => button.click()
		);
	});
});
