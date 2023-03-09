/**
 * WordPress dependencies
 */
import { createNewPost, pressKeyWithModifier } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import { getAttributes, insertMaxiBlock } from '../../../../utils';

describe('Text generator', () => {
	it('Check text generator', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Text Maxi');

		// Wait for toolbar to be visible
		await page.waitForSelector('.toolbar-wrapper');

		// open more settings
		await page.$eval(
			'.toolbar-wrapper .toolbar-item__more-settings button',
			button => button.click()
		);

		await page.$eval('.maxi-text-generator__generator button', button =>
			button.click()
		);

		// Words per sentence
		await page.$eval(
			'.components-popover__content .toolbar-item__text-generator-blocks__popover .maxi-advanced-number-control .maxi-advanced-number-control__value',
			input => input.focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('1');
		await page.waitForTimeout(150);

		// sentences
		await page.$$eval(
			'.components-popover__content .toolbar-item__text-generator-blocks__popover .maxi-advanced-number-control .maxi-advanced-number-control__value',
			input => input[1].focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('1');
		await page.waitForTimeout(150);

		await page.$eval(
			'.components-popover__content .toolbar-item__text-generator-blocks__popover .maxi-components-button',
			button => button.click()
		);
		expect(await getAttributes('content')).toStrictEqual('Lorem.');
	});
});
