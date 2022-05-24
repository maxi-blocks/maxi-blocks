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
import { getAttributes, openSidebarTab } from '../../../../utils';

describe('Border from Toolbar', () => {
	it('Test border from toolbar', async () => {
		await createNewPost();
		await insertBlock('Button Maxi');

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
		await page.keyboard.type('59');

		// change color
		await page.$$eval(
			'.maxi-border-control .maxi-color-control__palette-container button',
			button => button[7].click()
		);

		// change opacity
		await page.$eval(
			'.maxi-border-control .maxi-opacity-control input',
			input => input.focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('66');

		const expectBorder = {
			'button-border-style-general': 'solid',
			'button-border-palette-color-general': 8,
			'button-border-palette-opacity-general': 0.66,
			'button-border-bottom-width-general': 59,
		};

		const borderResult = await getAttributes([
			'button-border-style-general',
			'button-border-palette-color-general',
			'button-border-palette-opacity-general',
			'button-border-bottom-width-general',
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
