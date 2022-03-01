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
describe('SC svg icon', () => {
	it('Checking svg icon accordion', async () => {
		await createNewPost();
		await setBrowserViewport('large');

		await getStyleCardEditor({
			page,
			accordion: 'SVG',
		});

		// Global Line Colour
		await page.$eval(
			'.maxi-blocks-sc__type--SVG .maxi-style-cards-control__toggle-line-global input',
			button => button.click()
		);

		await page.$$eval(
			'.maxi-color-control__palette .maxi-color-control__palette-container button',
			button => button[4].click()
		);

		// Global Fill Colour
		await page.$eval(
			'.maxi-blocks-sc__type--SVG .maxi-style-cards-control__toggle-fill-global input',
			button => button.click()
		);

		await page.$$eval(
			'.maxi-color-control__palette .maxi-color-control__palette-container button',
			button => button[4].click()
		);

		await page.waitForTimeout(1500); // Ensures SC is saved on the store
		const {
			value: {
				light: { styleCard: expectPresets },
			},
		} = await receiveSelectedMaxiStyle();

		expect(expectPresets).toMatchSnapshot();
	});
});
