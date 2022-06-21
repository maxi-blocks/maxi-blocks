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
import { getAttributes, modalMock, openSidebarTab } from '../../../../utils';

describe('Icon size', () => {
	it('Check icon size', async () => {
		await createNewPost();
		await insertBlock('Icon Maxi');

		// generate icon
		await modalMock(page, { type: 'svg' });
		await page.waitForTimeout(150);

		// edit color
		await page.$eval(
			'.toolbar-wrapper .toolbar-item__button.toolbar-item__svg-size',
			button => button.click()
		);

		// change width
		await page.$eval(
			'.toolbar-item__svg-size__popover .maxi-advanced-number-control input',
			input => input.focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('132');

		expect(await getAttributes('svg-width-general')).toStrictEqual('132');

		// Check changes in sidebar
		await openSidebarTab(page, 'style', 'height width');

		const iconWidth = await page.$eval(
			'.maxi-tabs-content .maxi-advanced-number-control input',
			input => input.value
		);

		expect(iconWidth).toStrictEqual('132');
	});
});
