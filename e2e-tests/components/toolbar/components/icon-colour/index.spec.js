/**
 * WordPress dependencies
 */
import { createNewPost } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	getAttributes,
	modalMock,
	openSidebarTab,
	insertMaxiBlock,
} from '../../../../utils';

describe('Icon colour', () => {
	it('Check icon colour', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Icon Maxi');

		// generate icon
		await modalMock(page, { type: 'svg' });
		await page.$eval('button[aria-label="Close"]', button =>
			button.click()
		);
		await page.waitForTimeout(200);

		// edit color
		await page.$$eval(
			'.toolbar-wrapper .toolbar-item__button.toolbar-item__background',
			button => button[1].click()
		);

		// select color
		await page.$eval(
			'.components-popover__content .toolbar-item__svg-color__popover .maxi-color-control__palette button[data-item="3"]',
			colors => colors.click()
		);

		expect(await getAttributes('svg-line-palette-color')).toStrictEqual(3);

		// Check changes in sidebar
		await openSidebarTab(page, 'style', 'icon colour');

		const color = await page.$$eval(
			'.maxi-color-control .maxi-color-control__palette-label .maxi-color-control__palette-container .maxi-color-control__palette-box--active',
			button => button[1].getAttribute('data-item')
		);

		expect(color).toStrictEqual('3');
	});
});
