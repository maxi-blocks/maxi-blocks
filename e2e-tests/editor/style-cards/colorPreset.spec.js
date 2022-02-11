/**
 * WordPress dependencies
 */
import {
	createNewPost,
	setBrowserViewport,
	pressKeyWithModifier,
} from '@wordpress/e2e-test-utils';

import { editColorControl, getStyleCardEditor } from '../../utils';

const receiveSelectedMaxiStyle = async () => {
	return page.evaluate(() => {
		return wp.data
			.select('maxiBlocks/style-cards')
			.receiveMaxiSelectedStyleCard();
	});
};

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

		await page.$$eval(
			'.maxi-color-palette-control .maxi-color-control__palette-container button',
			input => input[2].click()
		);

		const colorInput = await page.$eval(
			'.maxi-color-palette-control .maxi-color-control__palette-container .maxi-color-control__palette-box--active',
			input => input.ariaLabel
		);

		expect(colorInput).toStrictEqual('Pallet box colour 3');

		// ColorControl check custom-color
		await page.$(
			'.maxi-color-control .maxi-color-control__color input',
			input => input.focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('106D3C');

		await page.waitForTimeout(1500); // Ensures SC is saved on the store
		const {
			value: {
				light: { styleCard: expectPresets },
			},
		} = await receiveSelectedMaxiStyle();

		expect(expectPresets).toMatchSnapshot();
	});
});
