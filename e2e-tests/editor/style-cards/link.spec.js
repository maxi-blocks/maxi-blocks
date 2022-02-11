/**
 * WordPress dependencies
 */
import { createNewPost, setBrowserViewport } from '@wordpress/e2e-test-utils';

import { getStyleCardEditor } from '../../utils';

const receiveSelectedMaxiStyle = async () => {
	return page.evaluate(() => {
		return wp.data
			.select('maxiBlocks/style-cards')
			.receiveMaxiSelectedStyleCard();
	});
};
describe('SC Link', () => {
	it('Checking link accordion', async () => {
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
			'.maxi-color-palette-control .maxi-color-control__palette-container button',
			buttons => buttons[3].click()
		);
		await page.waitForTimeout(300);

		const colorInput = await page.$eval(
			'.maxi-color-palette-control .maxi-color-control__palette-container .maxi-color-control__palette-box--active',
			input => input.ariaLabel
		);

		await page.waitForTimeout(300);

		expect(colorInput).toStrictEqual('Pallet box colour 4');

		await inputs[0].click();

		await page.waitForTimeout(300);

		// ColorControl Global Hover Colour
		await inputs[1].click();
		await page.waitForTimeout(300);

		await page.$$eval(
			'.maxi-color-palette-control .maxi-color-control__palette-container button',
			buttons => buttons[4].click()
		);
		await page.waitForTimeout(300);

		const colorHoverInput = await page.$eval(
			'.maxi-color-palette-control .maxi-color-control__palette-container .maxi-color-control__palette-box--active',
			input => input.ariaLabel
		);
		await page.waitForTimeout(300);

		expect(colorHoverInput).toStrictEqual('Pallet box colour 5');
		await inputs[1].click();

		await page.waitForTimeout(1500); // Ensures SC is saved on the store
		const {
			value: {
				light: { styleCard: expectPresets },
			},
		} = await receiveSelectedMaxiStyle();

		expect(expectPresets).toMatchSnapshot();
	});
});
