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

describe('Border from Toolbar', () => {
	it('Test border from toolbar', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Button Maxi');
		await updateAllBlockUniqueIds(page);

		// Wait for toolbar to be visible
		await page.waitForSelector('.toolbar-wrapper');

		// edit border maxi
		await page.$eval(
			'.toolbar-wrapper .toolbar-item__button.toolbar-item__border',
			button => button.click()
		);

		// select border
		await page.$$eval(
			'.components-popover__content .maxi-border-control .maxi-default-styles-control button',
			button => button[1].click()
		);

		// change border width
		await page.$eval(
			'.toolbar-item__border__popover .maxi-axis-control__button-border .maxi-axis-control__content__item input',
			input => input.focus()
		);
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('59', { delay: 350 });

		// change color
		await page.$eval(
			'.maxi-border-control .maxi-color-control__palette-container button[data-item="8"]',
			button => button.click()
		);

		// change opacity
		await page.$eval(
			'.maxi-border-control .maxi-opacity-control input',
			input => input.focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('66', { delay: 350 });

		const expectBorder = {
			'button-border-style-xl': 'solid',
			'button-border-palette-color-xl': 8,
			'button-border-palette-opacity-xl': 0.66,
			'button-border-bottom-width-xl': 59,
		};

		const borderResult = await getAttributes([
			'button-border-style-xl',
			'button-border-palette-color-xl',
			'button-border-palette-opacity-xl',
			'button-border-bottom-width-xl',
		]);

		expect(borderResult).toStrictEqual(expectBorder);

		// Check changes in sidebar

		const accordionPanel = await openSidebarTab(page, 'style', 'border');

		const borderLine = await accordionPanel.$eval(
			'.maxi-border-control .maxi-border-control__type select',
			select => select.value
		);

		expect(borderLine).toStrictEqual('solid');

		const lineSize = await accordionPanel.$eval(
			'.maxi-axis-control__content__item__border-width input',
			input => input.value
		);
		expect(lineSize).toStrictEqual('59');

		const lineWeight = await accordionPanel.$eval(
			'.maxi-axis-control__content__item__border-radius input',
			input => input.value
		);
		expect(lineWeight).toStrictEqual('10');
	});
});
