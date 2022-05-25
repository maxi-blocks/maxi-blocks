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
import { getBlockAttributes, openSidebarTab } from '../../../../utils';

describe('Background color from Toolbar', () => {
	it('Test background color from toolbar', async () => {
		await createNewPost();
		await insertBlock('Group Maxi');

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
		await page.keyboard.type('66');

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
