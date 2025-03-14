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

describe('Divider color from Toolbar', () => {
	it('Test divider color from toolbar', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Divider Maxi');

		await updateAllBlockUniqueIds(page);

		// Wait for toolbar to be visible
		await page.waitForSelector('.toolbar-wrapper');

		// edit divider color
		await page.$eval(
			'.toolbar-wrapper .toolbar-item__button.toolbar-item__divider',
			button => button.click()
		);

		// select background color
		await page.waitForSelector(
			'.components-popover__content .maxi-color-palette-control button[data-item="6"]'
		);
		await page.$eval(
			'.components-popover__content .maxi-color-palette-control button[data-item="6"]',
			button => button.click()
		);

		// change opacity
		await page.$eval(
			'.components-popover__content .maxi-opacity-control input',
			input => input.focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('44', { delay: 350 });

		const expectDivider = {
			'divider-border-palette-color-xl': 6,
			'divider-border-palette-opacity-xl': 0.44,
		};

		const dividerResult = await getAttributes([
			'divider-border-palette-color-xl',
			'divider-border-palette-opacity-xl',
		]);

		expect(dividerResult).toStrictEqual(expectDivider);

		// Check changes in sidebar
		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'line settings'
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

		expect(opacity).toStrictEqual('44');
	});
});
