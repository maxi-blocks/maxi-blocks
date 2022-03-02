/**
 * WordPress dependencies
 */
import {
	createNewPost,
	setBrowserViewport,
	pressKeyWithModifier,
} from '@wordpress/e2e-test-utils';

import { getStyleCardEditor, checkSCResult } from '../../utils';

describe('StyleCards ColorPresets', () => {
	it('Check Quick Pick Colour Presets', async () => {
		await createNewPost();
		await setBrowserViewport('large');

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
	});
});
