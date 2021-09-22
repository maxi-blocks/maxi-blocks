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

const receiveSavedMaxiStyle = async () => {
	return page.evaluate(() => {
		return wp.data
			.select('maxiBlocks/style-cards')
			.receiveSavedMaxiStyleCards();
	});
};

describe('StyleCards', () => {
	beforeEach(async () => {
		await createNewPost();
		await page.$eval('.maxi-toolbar-layout button', button =>
			button.click()
		);

		await page.$$eval(
			'.maxi-responsive-selector .action-buttons__button',
			button => button[1].click()
		);
	});

	it('Check Quick Pick Colour Presets', async () => {
		await page.waitForTimeout(500);
		await page.$$eval(
			'.maxi-accordion-control__item .maxi-accordion-tab div',
			accordion => accordion[0].click()
		);
		const styleCard = await page.$(
			'.components-popover__content .maxi-blocks-sc__type--quick-color'
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

	it('Check Button', async () => {
		await page.waitForTimeout(500);
		await page.$$eval(
			'.maxi-accordion-control__item .maxi-accordion-tab div',
			accordion => accordion[1].click()
		);
		const styleCard = await page.$(
			'.components-popover__content .maxi-blocks-sc__type--button'
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
		const weightOptions = await styleCard.$(
			'.maxi-typography-control .maxi-typography-control__weight select'
		);

		// Transform
		const transformOptions = await styleCard.$(
			'.maxi-typography-control .maxi-typography-control__transform select'
		);

		// Style
		const styleOptions = await styleCard.$(
			'.maxi-typography-control .maxi-typography-control__font-style select'
		);

		// Decoration
		const decorationOptions = await styleCard.$(
			'.maxi-typography-control .maxi-typography-control__decoration select'
		);

		await weightOptions.select('300');
		await transformOptions.select('capitalize');
		await styleOptions.select('italic');
		await decorationOptions.select('overline');

		await page.waitForTimeout(1500); // Ensures SC is saved on the store
		const {
			value: {
				light: { styleCard: expectPresets },
			},
		} = await receiveSelectedMaxiStyle();

		expect(expectPresets).toMatchSnapshot();
	});

	it('Check Paragraph', async () => {
		await page.waitForTimeout(500);
		await page.$$eval(
			'.maxi-accordion-control__item .maxi-accordion-tab div',
			accordion => accordion[2].click()
		);
		const styleCard = await page.$(
			'.components-popover__content .maxi-blocks-sc__type--p'
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
		const weightOptions = await styleCard.$(
			'.maxi-typography-control .maxi-typography-control__weight select'
		);

		// Transform
		const transformOptions = await styleCard.$(
			'.maxi-typography-control .maxi-typography-control__transform select'
		);

		// Style
		const styleOptions = await styleCard.$(
			'.maxi-typography-control .maxi-typography-control__font-style select'
		);

		// Decoration
		const decorationOptions = await styleCard.$(
			'.maxi-typography-control .maxi-typography-control__decoration select'
		);

		await weightOptions.select('300');
		await transformOptions.select('capitalize');
		await styleOptions.select('italic');
		await decorationOptions.select('overline');

		await page.waitForTimeout(1500); // Ensures SC is saved on the store
		const {
			value: {
				light: { styleCard: expectPresets },
			},
		} = await receiveSelectedMaxiStyle();

		expect(expectPresets).toMatchSnapshot();
	});

	it('Check Link', async () => {
		await page.waitForTimeout(500);
		await page.$$eval(
			'.maxi-accordion-control__item .maxi-accordion-tab div',
			accordion => accordion[3].click()
		);

		const styleCard = await page.$(
			'.components-popover__content .maxi-blocks-sc__type--link'
		);

		const buttons = await styleCard.$$('.maxi-radio-control__option label');

		// Use Global Link Colour

		// button
		await buttons[0].click();

		// ColorControl
		await styleCard.$eval('.maxi-color-control__color input', input =>
			input.focus()
		);
		await pressKeyTimes('Backspace', '6');
		await page.keyboard.type('106D3C');

		// Use Global Link Hover Colour
		// button
		await buttons[1].click();
		await buttons[2].click();

		// ColorControl
		await styleCard.$eval('.maxi-color-control__color input', input =>
			input.focus()
		);
		await pressKeyTimes('Backspace', '6');
		await page.keyboard.type('106D3C');

		// Use Global Link Active Colour
		// button
		await buttons[3].click();
		await buttons[4].click();

		// ColorControl
		await styleCard.$eval('.maxi-color-control__color input', input =>
			input.focus()
		);
		await pressKeyTimes('Backspace', '6');
		await page.keyboard.type('106D3C');

		// Use Global Link Visited Colour
		// button
		await buttons[5].click();
		await buttons[6].click();

		// ColorControl
		await styleCard.$eval('.maxi-color-control__color input', input =>
			input.focus()
		);
		await pressKeyTimes('Backspace', '6');
		await page.keyboard.type('106D3C');

		await buttons[7].click();

		await page.waitForTimeout(1500); // Ensures SC is saved on the store
		const {
			value: {
				light: { styleCard: expectPresets },
			},
		} = await receiveSelectedMaxiStyle();

		expect(expectPresets).toMatchSnapshot();
	});

	it('Check Headings', async () => {
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

	/* it('Check Hover', async () => {
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

	it('Check SVG Icon', async () => {
		await page.waitForTimeout(500);
		await page.$$eval(
			'.maxi-accordion-control__item .maxi-accordion-tab div',
			accordion => accordion[6].click()
		);
		const styleCard = await page.$(
			'.components-popover__content .maxi-blocks-sc__type--icon'
		);

		const buttons = await styleCard.$$('.maxi-radio-control__option label');
		// Use Global SVG Icon Colour
		// button
		await buttons[0].click();
		// ColorControl
		await styleCard.$eval(
			'.maxi-color-control .maxi-color-control__color input',
			input => input.focus()
		);
		await pressKeyTimes('Backspace', '6');
		await page.keyboard.type('106D3C');

		// Use Global Fill Colour
		// button
		await buttons[1].click();
			await buttons[2].click();

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

it('Check Divider', async () => {
		await page.waitForTimeout(500);
		await page.$$eval(
			'.maxi-accordion-control__item .maxi-accordion-tab div',
			accordion => accordion[7].click()
		);
		const styleCard = await page.$(
			'.components-popover__content .maxi-blocks-sc__type--divider'
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

	// Save Style
	it('Check Save', async () => {
		await page.waitForTimeout(500);
		await page.$$eval(
			'.maxi-accordion-control__item .maxi-accordion-tab div',
			accordion => accordion[7].click()
		);
		const styleCard = await page.$(
			'.components-popover__content .maxi-blocks-sc__type--divider'
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

		// Style Card Name
		await page.$eval(
			'.components-popover__content .maxi-style-cards__sc__save input',
			input => input.focus()
		);
		await page.keyboard.type('Test Name');

		await page.$eval(
			'.components-popover__content .maxi-style-cards__sc__save button',
			input => input.click()
		);

		await page.waitForTimeout(1500); // Ensures SC is saved on the store

		const expectPresets = await receiveSavedMaxiStyle();

		expect(expectPresets).toMatchSnapshot();
	});

	// Change Style card
	it('Change Style Card', async () => {
		await page.waitForTimeout(500);

		await page.$$eval(
			'.maxi-accordion-control__item .maxi-accordion-tab div',
			accordion => accordion[7].click()
		);

		const styleCard = await page.$(
			'.components-popover__content .maxi-blocks-sc__type--divider'
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

		// create SC
		await page.$eval(
			'.components-popover__content .maxi-style-cards__sc__save input',
			input => input.focus()
		);
		await page.keyboard.type('Test Name');

		await page.$eval(
			'.components-popover__content .maxi-style-cards__sc__save button',
			input => input.click()
		);

		// change SC

		const selector = await page.$(
			'.components-popover__content .maxi-style-cards__sc__more-sc .maxi-style-cards__sc__more-sc--select select'
		);

		await selector.select('sc_maxi');

		// expect

		await page.waitForTimeout(1500); // Ensures SC is saved on the store

		const expectPresets = await receiveSavedMaxiStyle();

		expect(expectPresets).toMatchSnapshot();
	});

	// Delete Style card
	it('Delete Style Card', async () => {
		await page.waitForTimeout(500);

		await page.$$eval(
			'.maxi-accordion-control__item .maxi-accordion-tab div',
			accordion => accordion[7].click()
		);

		const styleCard = await page.$(
			'.components-popover__content .maxi-blocks-sc__type--divider'
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

		// create SC
		await page.$eval(
			'.components-popover__content .maxi-style-cards__sc__save input',
			input => input.focus()
		);
		await page.keyboard.type('Test Name');

		await page.$eval(
			'.components-popover__content .maxi-style-cards__sc__save button',
			input => input.click()
		);

		// button
		await page.$eval(
			'.components-popover__content .maxi-style-cards__sc__more-sc .maxi-style-cards__sc__more-sc--delete',
			button => button.click()
		);

		// Style Card Name

		await page.waitForTimeout(1500); // Ensures SC is saved on the store

		const expectPresets = await receiveSavedMaxiStyle();

		expect(expectPresets).toMatchSnapshot();
	});

	//
	it('Dark Style Preset', async () => {
		await page.waitForTimeout(500);

		// select Dark Style
		await page.$$eval(
			'.components-popover__content .maxi-settingstab-control .maxi-tabs-control button',
			button => button[1].click()
		);

		// Divider
		await page.$$eval(
			'.maxi-accordion-control__item .maxi-accordion-tab div',
			accordion => accordion[7].click()
		);
		const styleCard = await page.$(
			'.components-popover__content .maxi-blocks-sc__type--divider'
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
				dark: { styleCard: expectPresets },
			},
		} = await receiveSelectedMaxiStyle();

		expect(expectPresets).toMatchSnapshot();
	}); */
});
