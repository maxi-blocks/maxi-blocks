/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import { getAttributes, modalMock, openSidebarTab } from '../../../../utils';

describe('Icon background', () => {
	it('Check icon background', async () => {
		await createNewPost();
		await insertBlock('Icon Maxi');

		// generate icon
		await modalMock(page, { type: 'svg' });
		await page.waitForTimeout(150);

		await page.$eval('button[aria-label="Close dialog"]', button =>
			button.click()
		);

		// edit divider line
		await page.$eval(
			'.toolbar-wrapper .toolbar-item__button.toolbar-item__background',
			button => button.click()
		);

		// select color
		await page.$eval(
			'.components-popover__content .toolbar-item__svg-color__popover .maxi-color-control__palette button[data-item="5"]',
			colors => colors.click()
		);

		expect(await getAttributes('svg-fill-palette-color')).toStrictEqual(5);

		// Check changes in sidebar

		await openSidebarTab(page, 'style', 'icon colour');

		const color = await page.$eval(
			'.maxi-color-control .maxi-color-control__palette-label .maxi-color-control__palette-container .maxi-color-control__palette-box--active',
			button => button.getAttribute('data-item')
		);

		expect(color).toStrictEqual('5');
	});
});
