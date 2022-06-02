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

describe('Padding from Toolbar', () => {
	it('Test padding from toolbar', async () => {
		await createNewPost();
		await insertBlock('Button Maxi');

		await openSidebarTab(page, 'style', 'quick styles');

		// add icon
		await page.$eval(
			'.maxi-button-default-styles button[aria-label="Button shortcut 4"]',
			button => button.click()
		);

		// edit padding
		await page.$eval(
			'.components-popover__content .icon-toolbar .toolbar-item__padding-margin',
			button => button.click()
		);

		// change padding
		await page.$eval(
			'.components-popover__content .toolbar-item__padding-margin__popover input',
			button => button.focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('123');

		expect(
			await getAttributes('icon-padding-bottom-general')
		).toStrictEqual('123');

		// Check changes in sidebar

		const padding = await page.$eval(
			'.maxi-axis-control__icon-padding .maxi-axis-control__content__item__icon-padding input',
			input => input.value
		);

		expect(padding).toStrictEqual('123');
	});
});
