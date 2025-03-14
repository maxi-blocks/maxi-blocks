/**
 * WordPress dependencies
 */
import { createNewPost } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	getAttributes,
	insertMaxiBlock,
	updateAllBlockUniqueIds,
} from '../../../../utils';

describe.skip('Image size', () => {
	it('Check image size', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Image Maxi');

		await updateAllBlockUniqueIds(page);

		// open settings
		await page.$eval(
			'.toolbar-item__typography-control .toolbar-item__more-settings button',
			button => button.click()
		);

		// change size
		await page.$eval(
			'.toolbar-item__popover__font-options__wrap_family .toolbar-item__typography-control__extra-text-options .toolbar-item__bold',
			button => button.click()
		);

		expect(await getAttributes('font-weight-xl')).toStrictEqual(700);
	});
});
