/**
 * WordPress dependencies
 */
import { createNewPost, pressKeyWithModifier } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	getBlockAttributes,
	openSidebarTab,
	insertMaxiBlock,
	updateAllBlockUniqueIds,
} from '../../../../utils';

describe('Background color from Toolbar', () => {
	it('Test background color from toolbar', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Group Maxi');

		await updateAllBlockUniqueIds(page);
		// Wait for toolbar to be visible
		await page.waitForSelector('.toolbar-wrapper');

		// edit background color maxi
		await page.$eval(
			'.toolbar-wrapper .toolbar-item__button.toolbar-item__background',
			button => button.click()
		);

		await page.$eval(
			'.toolbar-item__background__popover .maxi-toggle-switch__toggle input',
			button => button.click()
		);

		// select background color
		await page.$eval(
			'.components-popover__content .maxi-color-palette-control button[data-item="5"]',
			button => button.click()
		);

		// change opacity
		await page.$eval(
			'.components-popover__content .maxi-opacity-control input',
			input => input.focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('66', { delay: 350 });

		const layerExpect = await getBlockAttributes();
		expect(layerExpect['background-layers']).toMatchSnapshot();

		// Check changes in sidebar

		await openSidebarTab(page, 'style', 'background layer');

		const color = await page.$eval(
			'.maxi-list-item-control__ignore-move .maxi-color-control .maxi-color-control__palette-box--active',
			button => button.getAttribute('data-item')
		);

		expect(color).toStrictEqual('5');

		const opacity = await page.$eval(
			'.maxi-list-item-control__ignore-move .maxi-color-control .maxi-opacity-control input',
			input => input.value
		);

		expect(opacity).toStrictEqual('66');
	});
});
