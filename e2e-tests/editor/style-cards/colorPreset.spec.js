/**
 * WordPress dependencies
 */
import {
	createNewPost,
	pressKeyTimes,
	setBrowserViewport,
} from '@wordpress/e2e-test-utils';

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

		await page.$eval('.maxi-toolbar-layout button', button =>
			button.click()
		);

		await page.$eval(
			'.maxi-responsive-selector .style-card-button',
			button => button.click()
		);
		await page.waitForTimeout(500);

		await page.$eval(
			'.maxi-blocks-sc__type--quick-color-presets .maxi-accordion-control__item__button',
			accordion => accordion.click()
		);

		// ColorControl
		await page.$eval(
			'.maxi-color-control .maxi-color-control__color input',
			input => input.focus()
		);
		await pressKeyTimes('Backspace', '6');
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
