/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	pressKeyWithModifier,
} from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import { getAttributes } from '../../../../utils';

describe('Text generator', () => {
	it('Check text generator', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');

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
			'.components-popover__content .toolbar-item__text-generator-blocks__popover .maxi-text-control input',
			input => input.focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('1');
		await page.waitForTimeout(150);

		// sentences
		await page.$$eval(
			'.components-popover__content .toolbar-item__text-generator-blocks__popover .maxi-text-control input',
			input => input[1].focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('1');
		await page.waitForTimeout(150);

		await page.$eval(
			'.components-popover__content .toolbar-item__text-generator-blocks__popover button',
			button => button.click()
		);
		expect(await getAttributes('content')).toStrictEqual('Lorem.');
	});
});
