/**
 * WordPress dependencies
 */
import { createNewPost, pressKeyWithModifier } from '@wordpress/e2e-test-utils';

import {
	getStyleCardEditor,
	checkSCResult,
	changeResponsive,
} from '../../utils';

describe('StyleCards ColorPresets', () => {
	it('Check Quick Pick Colour Presets', async () => {
		await createNewPost();

		await getStyleCardEditor({
			page,
			accordion: 'color',
		});

		// ColorControl check palette-color
		await page.$$eval(
			'.maxi-accordion-control__item__panel .maxi-style-cards__quick-color-presets .maxi-style-cards__quick-color-presets__box',
			buttons => buttons[3].click()
		);

		const colorInput = await page.$eval(
			'.maxi-style-cards-control__sc__color-4-light input',
			input => input.value
		);

		expect(colorInput).toStrictEqual('#FF4A17');

		// ColorControl check custom-color
		await page.$eval(
			'.maxi-color-control .maxi-color-control__color input',
			input => input.focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('106D3C');

		const customColor = await page.$eval(
			'.maxi-color-control .maxi-color-control__color input',
			input => input.value
		);

		expect(customColor).toStrictEqual('106D3C');

		await page.waitForTimeout(150);
		expect(await checkSCResult(page)).toMatchSnapshot();

		// Test reset
		await page.$eval(
			'.maxi-blocks-sc__type--color button.maxi-style-cards__quick-color-presets__reset-button',
			button => {
				button.focus();
				button.click();
			}
		);

		const colorInput2 = await page.$eval(
			'.maxi-color-control .maxi-color-control__color input',
			input => input.value
		);

		await page.waitForTimeout(150);
		expect(colorInput2).toStrictEqual('#FF4A17');

		expect(await checkSCResult(page)).toMatchSnapshot();
	});

	it('Should work on responsive', async () => {
		await changeResponsive(page, 'm');

		// ColorControl check palette-color
		await page.$$eval(
			'.maxi-accordion-control__item__panel .maxi-style-cards__quick-color-presets .maxi-style-cards__quick-color-presets__box',
			buttons => buttons[3].click()
		);

		const colorInput = await page.$eval(
			'.maxi-style-cards-control__sc__color-4-light input',
			input => input.value
		);

		expect(colorInput).toStrictEqual('#FF4A17');

		// ColorControl check custom-color
		await page.$eval(
			'.maxi-color-control .maxi-color-control__color input',
			input => input.focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('106D3C');

		const customColor = await page.$eval(
			'.maxi-color-control .maxi-color-control__color input',
			input => input.value
		);

		expect(customColor).toStrictEqual('106D3C');

		await page.waitForTimeout(150);
		expect(await checkSCResult(page)).toMatchSnapshot();

		// Test reset
		await page.$eval(
			'.maxi-accordion-control__item__panel button',
			button => {
				button.focus();
				button.click();
			}
		);

		const colorInput2 = await page.$eval(
			'.maxi-color-control .maxi-color-control__color input',
			input => input.value
		);

		expect(colorInput2).toStrictEqual('#FF4A17');

		await page.waitForTimeout(150);
		expect(await checkSCResult(page)).toMatchSnapshot();
	});
});
