/**
 * WordPress dependencies
 */
import {
	createNewPost,
	setBrowserViewport,
	insertBlock,
} from '@wordpress/e2e-test-utils';

import { getStyleCardEditor } from '../../utils';

const receiveSelectedMaxiStyle = async () => {
	return page.evaluate(() => {
		return wp.data
			.select('maxiBlocks/style-cards')
			.receiveMaxiSelectedStyleCard();
	});
};
describe('SC Divider', () => {
	it('Checking divider accordion', async () => {
		await createNewPost();
		await insertBlock('Divider Maxi');

		await setBrowserViewport('large');

		await getStyleCardEditor({
			page,
			accordion: 'divider',
		});
		await page.$$eval(
			'.maxi-blocks-sc__type--link .maxi-accordion-control__item__panel .maxi-toggle-switch',
			input => input[0].click()
		);

		// ColorControl Global Link Colour
		await page.$$eval(
			'.maxi-color-palette-control .maxi-color-control__palette-container button',
			buttons => buttons[3].click()
		);

		const colorInput = await page.$eval(
			'.maxi-color-palette-control .maxi-color-control__palette-container .maxi-color-control__palette-box--active',
			input => input.ariaLabel
		);
		expect(colorInput).toStrictEqual('Pallet box colour 4');

		await page.waitForTimeout(1500); // Ensures SC is saved on the store
		const {
			value: {
				light: { styleCard: expectPresets },
			},
		} = await receiveSelectedMaxiStyle();

		expect(expectPresets).toMatchSnapshot();
	});
});
