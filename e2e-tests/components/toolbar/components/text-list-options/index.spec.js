/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import { getAttributes } from '../../../../utils';

describe('Text list options', () => {
	it('Check text list options', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing Text Maxi', { delay: 100 });

		// open editor
		await page.$eval(
			'.toolbar-wrapper .toolbar-item__list-options',
			button => button.click()
		);

		// select number list
		await page.$eval(
			'.components-popover__content .toolbar-item__popover__list-options .toolbar-item__popover__list-options__button.has-icon',
			button => button.click()
		);

		expect(await getAttributes('list-palette-status')).toStrictEqual(true);

		// select dotted list
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing Text Maxi', { delay: 100 });

		// open editor
		await page.$eval(
			'.toolbar-wrapper .toolbar-item__list-options',
			button => button.click()
		);

		await page.$$eval(
			'.components-popover__content .toolbar-item__popover__list-options .toolbar-item__popover__list-options__button.has-icon',
			button => button[1].click()
		);

		expect(await getAttributes('list-palette-status')).toStrictEqual(true);
	});
});
