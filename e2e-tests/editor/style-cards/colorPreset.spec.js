/**
 * WordPress dependencies
 */
import { createNewPost, pressKeyWithModifier } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import { getStyleCardEditor, checkSCResult, copySCToEdit } from '../../utils';

describe('StyleCards ColorPresets', () => {
	it('Check Quick Pick Colour Presets', async () => {
		await createNewPost();

		await getStyleCardEditor({
			page,
			accordion: 'color',
		});
		await copySCToEdit(page, `copy - ${Date.now()}`);

		// ColorControl check palette-color
		await page.$$eval(
			'.maxi-accordion-control__item__panel .maxi-style-cards__quick-color-presets .maxi-style-cards__quick-color-presets__box',
			buttons => buttons[3].click()
		);

		const colorInput = await page.$eval(
			'.maxi-style-cards-control__sc__color-4-light input',
			input => input.value
		);

		expect(colorInput).toStrictEqual('#ff4a17)');

		// ColorControl check custom-color
		await page.$eval(
			'.maxi-color-control .maxi-color-control__color input',
			input => input.focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('#106D3C', { delay: 350 });

		const customColor = await page.$eval(
			'.maxi-color-control .maxi-color-control__color input',
			input => {
				input.blur();
				return input.value;
			}
		);

		expect(customColor).toStrictEqual('#106D3C');

		await page.waitForTimeout(150);
		expect(await checkSCResult(page)).toMatchSnapshot();

		// Test reset
		await page.$eval(
			'.maxi-blocks-sc__type--color button.maxi-style-cards__quick-color-presets__reset-button',
			button => button.click()
		);

		const colorInput2 = await page.$eval(
			'.maxi-color-control .maxi-color-control__color input',
			input => input.value
		);

		await page.waitForTimeout(150);
		expect(colorInput2).toStrictEqual('var(--maxi-primary-color)');

		expect(await checkSCResult(page)).toMatchSnapshot();
	});
});
