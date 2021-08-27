/* eslint-disable no-await-in-loop */
/* eslint-disable no-return-await */
/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	pressKeyTimes,
} from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import { getBlockAttributes, openSidebar, changeResponsive } from '../../utils';

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

		for (let i = 0; i < fontLevelControl.length; i += 1) {
			const setting = fontLevelControl[i !== 6 ? i + 1 : 0];

			await setting.click();

			// Ensures is clicked
			await setting.evaluate(el => {
				const isSelected = el.getAttribute('aria-pressed') === 'true';

				if (!isSelected) el.click();
			});

			const attributes = await getBlockAttributes();
			const text = attributes.textLevel;
			const paletteColor = attributes['palette-color-general'];

			expect(text).toStrictEqual(fontLevel[i]);
			expect(paletteColor).toStrictEqual(5);
		}
	});
	it('Check Responsive font level control', async () => {
		const accordionPanel = await openSidebar(page, 'typography');
		await changeResponsive(page, 's');
		await page.$eval('.maxi-text-block', block => block.focus());

		const dottedButton = await page.$eval(
			'.maxi-typography-control__text-options-tabs .maxi-tabs-content .maxi-typography-control__size input',
			button => button.value
		);

		expect(dottedButton).toStrictEqual('16');

		// responsive S
		await changeResponsive(page, 's');

		const input = await accordionPanel.$(
			'.maxi-typography-control__text-options-tabs .maxi-tabs-content .maxi-typography-control__size input'
		);
		await input.focus();
		await pressKeyTimes('Backspace', '1');
		await page.keyboard.type('9', { delay: 100 });

		const responsiveSOption = await page.$eval(
			'.maxi-typography-control__text-options-tabs .maxi-tabs-content .maxi-typography-control__size input',
			selectedStyle => selectedStyle.value
		);

		expect(responsiveSOption).toStrictEqual('19');

		// responsive XS
		await changeResponsive(page, 'xs');

		const responsiveXsOption = await page.$eval(
			'.maxi-typography-control__text-options-tabs .maxi-tabs-content .maxi-typography-control__size input',
			selectedStyle => selectedStyle.value
		);

		expect(responsiveXsOption).toStrictEqual('19');

		// responsive M
		await changeResponsive(page, 'm');

		const responsiveMOption = await page.$eval(
			'.maxi-typography-control__text-options-tabs .maxi-tabs-content .maxi-typography-control__size input',
			selectedStyle => selectedStyle.value
		);

		expect(responsiveMOption).toStrictEqual('16');
	});
});
