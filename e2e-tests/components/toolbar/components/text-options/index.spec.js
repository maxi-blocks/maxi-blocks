/**
 * WordPress dependencies
 */
import { createNewPost, pressKeyWithModifier } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	getAttributes,
	openSidebarTab,
	insertMaxiBlock,
} from '../../../../utils';

describe('Text options', () => {
	it('Check text options', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Text Maxi');

		// Wait for toolbar to be visible
		await page.waitForSelector('.toolbar-wrapper');

		// open editor
		await page.$eval(
			'.toolbar-item__typography-control .toolbar-item__button',
			button => button.click()
		);

		// edit size
		await page.$eval(
			'.toolbar-item__typography-control__typography-tabs .toolbar-item__popover__font-options__wrap_inputs .maxi-typography-control__size input',
			button => button.focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('19');

		expect(await getAttributes('_fs-g')).toStrictEqual(19);

		// line height
		await page.$eval(
			'.toolbar-item__typography-control__typography-tabs .toolbar-item__popover__font-options__wrap_inputs .maxi-typography-control__line-height input',
			button => button.focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('24');

		expect(await getAttributes('line-height-g')).toStrictEqual(24);

		// letter spacing
		await page.$eval(
			'.toolbar-item__typography-control__typography-tabs .toolbar-item__popover__font-options__wrap_inputs .maxi-typography-control__letter-spacing input',
			button => button.focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('12');

		expect(await getAttributes('_ls-g')).toStrictEqual(12);

		// font family
		const fontFamily = await page.$(
			'.toolbar-item__popover__font-options__wrap_family .toolbar-item__popover__font-options__font__selector input'
		);
		await fontFamily.click();
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('Lato');
		await page.keyboard.press('Enter');

		expect(await getAttributes('font-family-g')).toStrictEqual('Lato');

		// text alignment center
		await page.$eval(
			'.toolbar-item__typography-control__extra-text-options .maxi-alignment-control .maxi-tabs-control__button-center',
			button => button.click()
		);

		expect(await getAttributes('_ta-g')).toStrictEqual('center');

		// text alignment right
		await page.$eval(
			'.toolbar-item__typography-control__extra-text-options .maxi-alignment-control .maxi-tabs-control__button-right',
			button => button.click()
		);

		expect(await getAttributes('_ta-g')).toStrictEqual('right');

		// text alignment justify
		await page.$eval(
			'.toolbar-item__typography-control__extra-text-options .maxi-alignment-control .maxi-tabs-control__button-justify',
			button => button.click()
		);

		expect(await getAttributes('_ta-g')).toStrictEqual('justify');

		// Check changes in sidebar
		await openSidebarTab(page, 'style', 'typography');

		const fontFamilyExpect = await page.$eval(
			'.maxi-typography-control .maxi-typography-control__font-family',
			input => input.outerText
		);

		expect(fontFamilyExpect).toStrictEqual('Lato');

		const size = await page.$eval(
			'.maxi-typography-control__size input',
			input => input.value
		);

		expect(size).toStrictEqual('19');

		const lineHeight = await page.$eval(
			'.maxi-typography-control__line-height input',
			input => input.value
		);

		expect(lineHeight).toStrictEqual('24');

		const letterSpacing = await page.$eval(
			'.maxi-typography-control__letter-spacing input',
			input => input.value
		);

		expect(letterSpacing).toStrictEqual('12');

		await openSidebarTab(page, 'style', 'alignment');

		const alignment = await page.$eval(
			'.maxi-alignment-control .maxi-tabs-control__button-justify',
			button => button.ariaPressed
		);

		expect(alignment).toStrictEqual('true');
	});
});
