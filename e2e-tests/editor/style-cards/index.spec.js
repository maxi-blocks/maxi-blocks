/**
 * WordPress dependencies
 */
import { createNewPost, pressKeyTimes } from '@wordpress/e2e-test-utils';

const receiveSelectedMaxiStyle = async () => {
	return page.evaluate(() => {
		return wp.data
			.select('maxiBlocks/style-cards')
			.receiveMaxiSelectedStyleCard();
	});
};

describe('StyleCards, ColorPresets', () => {
	it('Check Hover', async () => {
		await createNewPost();

		await page.$eval('.maxi-toolbar-layout button', button =>
			button.click()
		);

		await page.$$eval(
			'.maxi-responsive-selector .action-buttons__button',
			button => button[1].click()
		);
		await page.waitForTimeout(500);

		await page.$$eval(
			'.maxi-accordion-control__item .maxi-accordion-tab div',
			accordion => accordion[5].click()
		);
		const styleCard = await page.$(
			'.components-popover__content .maxi-blocks-sc__type--hover'
		);

		// button
		await styleCard.$eval('.maxi-radio-control__option label', button =>
			button.click()
		);

		// ColorControl
		await styleCard.$eval(
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
