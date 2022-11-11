/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import { getAttributes } from '../../../../utils';

describe('Text subscript', () => {
	it('Check text subscript', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');

		// Wait for toolbar to be visible
		await page.waitForSelector('.toolbar-wrapper');

		// open editor
		await page.$eval(
			'.toolbar-item__typography-control .toolbar-item__button',
			button => button.click()
		);

		// select subscript
		await page.$eval(
			'.toolbar-item__popover__font-options__wrap_family .toolbar-item__typography-control__extra-text-options .toolbar-item__subscript',
			button => button.click()
		);

		expect(await getAttributes('vertical-align-general')).toStrictEqual(
			'sub'
		);
	});
});
