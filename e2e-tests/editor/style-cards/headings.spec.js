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

describe('StyleCards headings', () => {
	it('Check Headings', async () => {
		await createNewPost();
		await setBrowserViewport('large');
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
			accordion => accordion[4].click()
		);
		const styleCard = await page.$(
			'.components-popover__content .maxi-blocks-sc__type--heading'
		);
		const buttons = await styleCard.$$('.maxi-radio-control__option label');

		// ColorControl
		await buttons[0].click();
		await styleCard.$eval(
			'.maxi-color-control .maxi-color-control__color input',
			input => input.focus()
		);
		await pressKeyTimes('Backspace', '6');
		await page.keyboard.type('106D3C');

		// screen size L
		await styleCard.$$eval(
			'.maxi-typography-control .maxi-settingstab-control .maxi-tabs-control button',
			screenSize => screenSize[1].click()
		);
		// Size
		await styleCard.$eval(
			'.maxi-typography-control .maxi-settingstab-control .maxi-typography-control__size input',
			size => size.focus()
		);
		await pressKeyTimes('Backspace', '2');
		await page.keyboard.type('20');

		// Line Height
		await styleCard.$eval(
			'.maxi-typography-control .maxi-settingstab-control .maxi-typography-control__line-height input',
			size => size.focus()
		);
		await pressKeyTimes('Backspace', '4');
		await page.keyboard.type('0');

		// Letter Spacing
		await styleCard.$eval(
			'.maxi-typography-control .maxi-settingstab-control .maxi-typography-control__letter-spacing input',
			size => size.focus()
		);
		await page.keyboard.type('5');

		// Selectors

		// Weight
		const weightSelector = await styleCard.$(
			'.maxi-typography-control .maxi-typography-control__weight select'
		);

		// Transform
		const transformSelector = await styleCard.$(
			'.maxi-typography-control .maxi-typography-control__transform select'
		);

		// Style
		const styleSelector = await styleCard.$(
			'.maxi-typography-control .maxi-typography-control__font-style select'
		);

		// Decoration
		const decorationSelector = await styleCard.$(
			'.maxi-typography-control .maxi-typography-control__decoration select'
		);

		await weightSelector.select('300');
		await transformSelector.select('capitalize');
		await styleSelector.select('italic');
		await decorationSelector.select('overline');

		await page.waitForTimeout(1500); // Ensures SC is saved on the store
		const {
			value: {
				light: { styleCard: expectPresets },
			},
		} = await receiveSelectedMaxiStyle();

		expect(expectPresets).toMatchSnapshot();
	});
});
