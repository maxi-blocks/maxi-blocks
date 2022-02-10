/**
 * WordPress dependencies
 */
import { createNewPost, setBrowserViewport } from '@wordpress/e2e-test-utils';

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

		const colorInput = await page.$eval(
			'.maxi-color-control .maxi-color-control__color input',
			input => input.value
		);

		expect(colorInput).toStrictEqual('#FF4A17');

		// ColorControl check custom-color
		await editColorControl({
			page,
			instance: await page.$(
				'.maxi-color-control .maxi-color-control__color input'
			),
			paletteStatus: false,
			customColor: '106D3C',
		});

		await page.waitForTimeout(1500); // Ensures SC is saved on the store
		const {
			value: {
				light: { styleCard: expectPresets },
			},
		} = await receiveSelectedMaxiStyle();

		expect(expectPresets).toMatchSnapshot();
	});
});
