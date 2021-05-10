/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-return-await */
/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	getEditedPostContent,
} from '@wordpress/e2e-test-utils';

describe('divider control', () => {
	beforeEach(async () => {
		await createNewPost();
	});
	it('checking the style selector', async () => {
		await insertBlock('Divider Maxi');
		await page.$eval('.toolbar-item__divider-line', button =>
			button.click()
		);
		await page.waitForSelector(
			'.components-popover__content .toolbar-item__divider-line__popover .maxi-default-styles-control'
		);
		await page.$$eval(
			'.components-popover__content .toolbar-item__divider-line__popover .maxi-default-styles-control .components-button.maxi-default-styles-control__button',
			settings => settings[2].click()
		);

		expect(await getEditedPostContent()).toMatchSnapshot();
	});
	it('checking the line size', async () => {
		await insertBlock('Divider Maxi');
		await page.$eval('.toolbar-item__divider-line', button =>
			button.click()
		);
		await page.waitForSelector(
			'.components-popover__content .toolbar-item__divider-line__popover .components-base-control.maxi-size-control .components-base-control__field'
		);
		const dividerLineSettings = Array.from(
			await page.$$(
				'.components-popover__content .toolbar-item__divider-line__popover .components-base-control.maxi-size-control .components-base-control__field .maxi-size-control__value'
			)
		);

		for (let i = 0; i < dividerLineSettings.length; i++) {
			const setting = dividerLineSettings[i];

			await setting.focus();
			await page.keyboard.press('ArrowUp');
		}

		expect(await getEditedPostContent()).toMatchSnapshot();
	});
});
