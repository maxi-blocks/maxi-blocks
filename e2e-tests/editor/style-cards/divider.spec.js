/**
 * WordPress dependencies
 */
import { createNewPost, setBrowserViewport } from '@wordpress/e2e-test-utils';

import { addTypographyOptions, getStyleCardEditor } from '../../utils';

const receiveSelectedMaxiStyle = async () => {
	return page.evaluate(() => {
		return wp.data
			.select('maxiBlocks/style-cards')
			.receiveMaxiSelectedStyleCard();
	});
};
describe('SC Link', () => {
	it('Checking divider accordion', async () => {
		await createNewPost();
		await setBrowserViewport('large');

		await getStyleCardEditor({
			page,
			accordion: 'link',
		});

		const inputs = await page.$$(
			'.maxi-blocks-sc__type--link .maxi-accordion-control__item__panel .maxi-toggle-switch'
		);

		await inputs[0].click();

		// ColorControl Global Link Colour
		await page.$$eval(
			'.maxi-accordion-control__item__panel .maxi-style-cards__quick-color-presets .maxi-style-cards__quick-color-presets__box',
			buttons => buttons[3].click()
		);

		const colorInput = await page.$eval(
			'.maxi-color-control .maxi-color-control__color input',
			input => input.value
		);

		expect(colorInput).toStrictEqual('#2A17FF');

		await inputs[0].click();

		await page.waitForTimeout(150);

		// ColorControl Global Hover Colour
		await inputs[1].click();
		await page.$$eval(
			'.maxi-accordion-control__item__panel .maxi-style-cards__quick-color-presets .maxi-style-cards__quick-color-presets__box',
			buttons => buttons[3].click()
		);

		const colorInput = await page.$eval(
			'.maxi-color-control .maxi-color-control__color input',
			input => input.value
		);

		expect(colorInput).toStrictEqual('#2A17FF');

		await page.waitForTimeout(1500); // Ensures SC is saved on the store
		const {
			value: {
				light: { styleCard: expectPresets },
			},
		} = await receiveSelectedMaxiStyle();

		expect(expectPresets).toMatchSnapshot();
	});
});
