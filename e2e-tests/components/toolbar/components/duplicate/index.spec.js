/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */

describe.skip('Button duplicate', () => {
	it('Check button duplicate', async () => {
		await createNewPost();
		await insertBlock('Button Maxi');

		// duplicate button
		await page.$eval(
			'.toolbar-wrapper .toolbar-item.toolbar-item__duplicate button',
			button => button.click()
		);

		const blocks = await page.$('.block-editor-block-list__layout');
	});
});
