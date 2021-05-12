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

describe('font level', () => {
	beforeEach(async () => {
		await createNewPost();
	});
	it('checking the font level control', async () => {
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing level');
		await page.$eval('.toolbar-item__text-level', button => button.click());
		await page.waitForSelector(
			'.components-popover__content .maxi-font-level-control'
		);
		const fontLevelControl = await page.$$(
			'.components-popover__content .maxi-font-level-control .components-button.maxi-font-level-control__button'
		);

		const fontLevel = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'];

		for (let i = 0; i < fontLevelControl.length; i++) {
			const setting = fontLevelControl[i !== 6 ? i + 1 : 0];

			await setting.click();

			const attributes = await getBlockAttributes();

			expect(attributes.textLevel).toStrictEqual(fontLevel[i]);
		}
	});
});
