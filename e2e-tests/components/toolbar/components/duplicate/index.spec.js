/**
 * WordPress dependencies
 */
import { createNewPost } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import { insertMaxiBlock, updateAllBlockUniqueIds } from '../../../../utils';

describe.skip('Button duplicate', () => {
	it('Check button duplicate', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Button Maxi');

		await updateAllBlockUniqueIds(page);

		// duplicate button
		await page.$eval(
			'.toolbar-wrapper .toolbar-item.toolbar-item__duplicate button',
			button => button.click()
		);

		const blocks = await page.$('.block-editor-block-list__layout');
	});
});
