/* eslint-disable no-await-in-loop */
/* eslint-disable no-return-await */
/**
 * WordPress dependencies
 */
import { createNewPost } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	getBlockAttributes,
	getBlockStyle,
	insertMaxiBlock,
	updateAllBlockUniqueIds,
} from '../../utils';

describe('FontLevelControl', () => {
	it('Checking the font level control', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Text Maxi');
		await updateAllBlockUniqueIds(page);
		await page.keyboard.type('Testing Text Maxi', { delay: 100 });
		await page.waitForTimeout(150);
		await page.$eval('.toolbar-item__text-level', button => button.click());

		await page.waitForTimeout(150);

		await page.waitForSelector(
			'.components-popover__content .maxi-font-level-control'
		);
		await page.waitForTimeout(150);
		const fontLevelControl = await page.$$(
			'.components-popover__content .maxi-font-level-control .components-button.maxi-font-level-control__button'
		);

		await page.waitForTimeout(150);

		const fontLevel = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

		for (let i = 0; i < fontLevelControl.length; i += 1) {
			const setting = fontLevelControl[i];

			await setting.click();

			// Ensures is clicked
			await setting.evaluate(el => {
				const isSelected = el.getAttribute('aria-pressed') === 'true';

				if (!isSelected) el.click();
			});

			const attributes = await getBlockAttributes();
			const text = attributes.textLevel;
			const paletteColor = attributes['palette-color-xl'];

			expect(text).toStrictEqual(fontLevel[i]);
			expect(paletteColor).toStrictEqual(fontLevel[i] === 'p' ? 3 : 5);
		}

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
