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

describe('Background color from Toolbar', () => {
	it('Test background color from toolbar', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Button Maxi');
		await updateAllBlockUniqueIds(page);

		// Wait for toolbar to be visible
		await page.waitForSelector('.toolbar-wrapper');

		// edit background color maxi
		await page.$eval(
			'.toolbar-wrapper .toolbar-item__button.toolbar-item__background',
			button => button.click()
		);

		// select background color
		await page.$eval(
			'.components-popover__content .maxi-color-palette-control button[data-item="3"]',
			button => button.click()
		);

		// change opacity
		await page.$eval(
			'.components-popover__content .maxi-opacity-control input',
			input => input.focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('22', { delay: 350 });

		const expectBackgroundColor = {
			'button-background-palette-color-xl': 3,
			'button-background-palette-opacity-xl': 0.22,
		};

		const backgroundColorResult = await getAttributes([
			'button-background-palette-color-xl',
			'button-background-palette-opacity-xl',
		]);

		expect(backgroundColorResult).toStrictEqual(expectBackgroundColor);

		// Check changes in sidebar

		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'button background'
		);

		const color = await page.$eval(
			'.maxi-color-control .maxi-color-control__palette-label .maxi-color-control__palette-container .maxi-color-control__palette-box--active',
			button => button.getAttribute('data-item')
		);

		expect(color).toStrictEqual('3');

		const opacity = await accordionPanel.$eval(
			'.maxi-opacity-control input',
			input => input.value
		);

		expect(opacity).toStrictEqual('22');
	});
});
