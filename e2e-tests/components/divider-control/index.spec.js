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
import { getBlockAttributes } from '../../utils';

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

		const dividerStyles = ['none', 'solid', 'dashed', 'dotted'];

		for (let i = 0; i < dividerStyles.length; i++) {
			const dividerStyle = dividerStyles[i];

			await page.$$eval(
				'.components-popover__content .toolbar-item__divider-line__popover .maxi-default-styles-control button',
				(buttons, i) => buttons[i].click(),
				i
			);

			const attributes = await getBlockAttributes();

			expect(attributes['divider-border-style']).toStrictEqual(
				dividerStyle
			);
		}
	});
});
