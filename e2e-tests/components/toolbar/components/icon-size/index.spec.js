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

		await page.$eval('button[aria-label="Close dialog"]', button =>
			button.click()
		);

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

		// change force responsive
		await page.$eval(
			'.toolbar-item__svg-size__popover .maxi-base-control .maxi-toggle-switch__toggle input',
			input => input.click()
		);

		expect(await getAttributes('svg-responsive-general')).toStrictEqual(
			false
		);

		// Check changes in sidebar
		await openSidebarTab(page, 'style', 'height width');

		const iconWidth = await page.$eval(
			'.maxi-tabs-content .maxi-advanced-number-control input',
			input => input.value
		);

		expect(iconWidth).toStrictEqual('132');
	});
});
