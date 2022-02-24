/* eslint-disable no-await-in-loop */
/* eslint-disable no-return-await */
/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import { getBlockAttributes, getBlockStyle } from '../../utils';

describe('DividerControl', () => {
	it.skip('Checking the style selector', async () => {
		await createNewPost();
		await insertBlock('Divider Maxi');
		await page.$eval('.toolbar-item__divider-line', button =>
			button.click()
		);

		await page.waitForSelector(
			'.components-popover__content .toolbar-item__divider-line__popover .maxi-default-styles-control'
		);

		const dividerStyles = ['none', 'solid', 'dashed', 'dotted'];

		for (let i = 0; i < dividerStyles.length; i += 1) {
			const dividerStyle = dividerStyles[i];

			await page.$$eval(
				'.components-popover__content .toolbar-item__divider-line__popover .maxi-default-styles-control button',
				(buttons, i) => buttons[i].click(),
				i
			);

			await page.waitForTimeout(500);

			const attributes = await getBlockAttributes();
			const borderStyle = attributes['divider-border-style-general'];

			expect(borderStyle).toStrictEqual(dividerStyle);
		}

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
