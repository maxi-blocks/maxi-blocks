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

describe('Divider line from Toolbar', () => {
	it('Test divider line from toolbar', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Divider Maxi');

		await updateAllBlockUniqueIds(page);

		// Wait for toolbar to be visible
		await page.waitForSelector('.toolbar-wrapper');

		// edit divider line
		await page.$eval(
			'.toolbar-wrapper .toolbar-item__button.toolbar-item__divider-line',
			button => button.click()
		);

		// select divider line style
		await page.waitForSelector(
			'.toolbar-item__divider-line__popover .maxi-default-styles-control button'
		);
		await page.$$eval(
			'.toolbar-item__divider-line__popover .maxi-default-styles-control button',
			button => button[2].click()
		);

		// change weight
		await page.$eval(
			'.toolbar-item__divider-line__popover .divider-border__weight-wrap input',
			input => input.focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('12', { delay: 350 });

		await page.waitForTimeout(200);

		// change line size
		await page.$$eval(
			'.toolbar-item__divider-line__popover .maxi-advanced-number-control input',
			input => input[2].focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('45', { delay: 350 });

		const expectDivider = {
			'divider-border-style-xl': 'dashed',
			'divider-border-top-width-xl': 12,
			'divider-width-xl': 45,
		};

		const dividerResult = await getAttributes([
			'divider-border-style-xl',
			'divider-border-top-width-xl',
			'divider-width-xl',
		]);

		expect(dividerResult).toStrictEqual(expectDivider);

		// Check changes in sidebar

		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'line settings'
		);

		const borderLine = await accordionPanel.$eval(
			'.maxi-tabs-content .maxi-base-control__field select',
			select => select.value
		);

		expect(borderLine).toStrictEqual('dashed');

		const lineSize = await accordionPanel.$$eval(
			'.maxi-tabs-content .maxi-base-control.maxi-advanced-number-control input',
			input => input[2].value
		);
		expect(lineSize).toStrictEqual('45');

		const lineWeight = await accordionPanel.$$eval(
			'.maxi-tabs-content .maxi-base-control.maxi-advanced-number-control input',
			input => input[4].value
		);
		expect(lineWeight).toStrictEqual('12');
	});
});
