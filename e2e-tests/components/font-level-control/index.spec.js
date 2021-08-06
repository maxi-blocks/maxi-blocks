/* eslint-disable no-return-await */
/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import { getBlockAttributes } from '../../utils';

describe('FontLevelControl', () => {
	it('Checking the font level control', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing Text Maxi', { delay: 100 });
		await page.waitForTimeout(150);
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
			const text = attributes.textLevel;
			const paletteColor = attributes['palette-color-general'];

			expect(text).toStrictEqual(fontLevel[i]);
			expect(paletteColor).toStrictEqual(5);
		}
	});
});
