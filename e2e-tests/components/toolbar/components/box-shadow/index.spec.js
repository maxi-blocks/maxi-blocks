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
	updateAllBlockUniqueIds,
} from '../../../../utils';

describe('Box shadow from Toolbar', () => {
	it('Test box shadow from toolbar', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Button Maxi');
		await updateAllBlockUniqueIds(page);

		// Wait for toolbar to be visible
		await page.waitForSelector('.toolbar-wrapper');

		// edit box-shadow maxi
		await page.$eval(
			'.toolbar-wrapper .toolbar-item__button.toolbar-item__box-shadow',
			button => button.click()
		);

		// select box-shadow
		await page.$$eval(
			'.components-popover__content .maxi-shadow-control .maxi-default-styles-control button',
			button => button[1].click()
		);

		// change box-shadow spread
		await page.$eval(
			'.toolbar-item__box-shadow__popover .maxi-shadow-control .maxi-advanced-number-control input',
			input => input.focus()
		);
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('77', { delay: 350 });

		// change color
		await page.$eval(
			'.toolbar-item__box-shadow__popover .maxi-color-control__palette-container button[data-item="6"]',
			button => button.click()
		);

		// change opacity
		await page.$eval(
			'.toolbar-item__box-shadow__popover .maxi-opacity-control input',
			input => input.focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('66', { delay: 350 });

		const expectBoxShadow = {
			'button-box-shadow-palette-color-xl': 6,
			'button-box-shadow-palette-opacity-xl': 0.66,
			'button-box-shadow-blur-xl': 50,
			'button-box-shadow-spread-xl': 77,
		};

		const boxShadowResult = await getAttributes([
			'button-box-shadow-palette-color-xl',
			'button-box-shadow-palette-opacity-xl',
			'button-box-shadow-blur-xl',
			'button-box-shadow-spread-xl',
		]);

		expect(boxShadowResult).toStrictEqual(expectBoxShadow);

		// Check changes in sidebar

		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'box shadow'
		);

		const color = await page.$eval(
			'.maxi-color-control .maxi-color-control__palette-label .maxi-color-control__palette-container .maxi-color-control__palette-box--active',
			button => button.getAttribute('data-item')
		);

		expect(color).toStrictEqual('6');

		const opacity = await accordionPanel.$eval(
			'.maxi-opacity-control input',
			input => input.value
		);

		expect(opacity).toStrictEqual('66');
	});
});
