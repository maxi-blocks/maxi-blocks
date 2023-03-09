/**
 * WordPress dependencies
 */
import { createNewPost } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import { insertMaxiBlock } from '../../../../utils';

describe.skip('Button helper', () => {
	it('Check button helper', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Button Maxi');

		// helper button
		await page.$eval(
			'.toolbar-wrapper .toolbar-item.toolbar-item__help',
			button => button.click()
		);
	});
});
