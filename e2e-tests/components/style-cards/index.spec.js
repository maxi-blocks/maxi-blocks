/**
 * WordPress dependencies
 */
import { createNewPost, pressKeyTimes } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { getBlockAttributes } from '../../utils';

const receiveMaxiStyle = async () =>
	page.evaluate(() => {
		return wp.data
			.select('maxiBlocks/style-cards')
			.receiveMaxiSelectedStyleCard();
	});
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
		const styleCardAccordions = await page.$$(
			'.maxi-accordion-control__item .maxi-accordion-tab div'
		);
		await styleCardAccordions[0].click();
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

		const expectPresets = receiveMaxiStyle();

		expect(expectPresets).toMatchSnapshot();
	});
	/// //////////////////////////////////////////////////////////////////////////
	it('Check Button', async () => {
		const styleCardAccordions = await page.$$(
			'.maxi-accordion-control__item .maxi-accordion-tab div'
		);
		await styleCardAccordions[2].click();
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

		// Opacity
		await styleCard.$eval('.maxi-color-control input', input =>
			input.focus()
		);
		await pressKeyTimes('Backspace', '3');
		await page.keyboard.type('50');
		await buttons[1];

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
			'.maxi-typography-control .maxi-settingstab-control .maxi-typography-control__height input',
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
		await styleCard.$eval(
			'.maxi-typography-control .maxi-settingstab-control .maxi-typography-control__weight select',
			selector => selector.select('300')
		);

		// Transform
		await styleCard.$eval(
			'.maxi-typography-control .maxi-settingstab-control .maxi-typography-control__transform select',
			selector => selector.select('capitalize')
		);

		// Style
		await styleCard.$eval(
			'.maxi-typography-control .maxi-settingstab-control .maxi-typography-control__style select',
			selector => selector.select('italic')
		);

		// Decoration
		await styleCard.$eval(
			'.maxi-typography-control .maxi-settingstab-control .maxi-typography-control__decoration select',
			selector => selector.select('overline')
		);

		const expectPresets = receiveMaxiStyle();

		expect(expectPresets).toMatchSnapshot();
	});
	/// ///////////////////////////////////////////////////////////
	it('Check Paragraph', async () => {
		const styleCardAccordions = await page.$$(
			'.maxi-accordion-control__item .maxi-accordion-tab div'
		);
		await styleCardAccordions[2].click();
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

		// Opacity
		await styleCard.$eval('.maxi-color-control input', input =>
			input.focus()
		);
		await pressKeyTimes('Backspace', '3');
		await page.keyboard.type('50');
		await buttons[1];

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

		const expectPresets = receiveMaxiStyle();

		expect(expectPresets).toMatchSnapshot();
	});
	/// ///////////////////////////////////////////////////////////

	it('Check Link', async () => {
		const styleCardAccordions = await page.$$(
			'.maxi-accordion-control__item .maxi-accordion-tab div'
		);
		await styleCardAccordions[3].click();
		const styleCard = await page.$(
			'.components-popover__content .maxi-blocks-sc__type--link'
		);

		const buttons = await styleCard.$$('.maxi-radio-control__option label');
		// Use Global Link Colour
		// button
		await buttons[0].click();
		// ColorControl
		await styleCard.$$eval(
			'.maxi-color-control .maxi-color-control__color input',
			input => input[2].focus()
		);
		await pressKeyTimes('Backspace', '6');
		await page.keyboard.type('106D3C');

		// Opacity
		await styleCard.$eval('.maxi-color-control input', input =>
			input.focus()
		);
		await pressKeyTimes('Backspace', '3');
		await page.keyboard.type('50');

		// Use Global Link Hover Colour
		// button
		await buttons[1].click();
		await buttons[2].click();

		// ColorControl
		await styleCard.$$eval(
			'.maxi-color-control .maxi-color-control__color input',
			input => input[2].focus()
		);
		await pressKeyTimes('Backspace', '6');
		await page.keyboard.type('106D3C');

		// Opacity
		await styleCard.$eval('.maxi-color-control input', input =>
			input.focus()
		);
		await pressKeyTimes('Backspace', '3');
		await page.keyboard.type('50');

		// Use Global Link Active Colour
		// button
		await buttons[3].click();
		await buttons[4].click();

		// ColorControl
		await styleCard.$$eval(
			'.maxi-color-control .maxi-color-control__color input',
			input => input[2].focus()
		);
		await pressKeyTimes('Backspace', '6');
		await page.keyboard.type('106D3C');

		// Opacity
		await styleCard.$eval('.maxi-color-control input', input =>
			input.focus()
		);
		await pressKeyTimes('Backspace', '3');
		await page.keyboard.type('50');

		// Use Global Link Visited Colour
		// button
		await buttons[4].click();
		await buttons[5].click();

		// ColorControl
		await styleCard.$$eval(
			'.maxi-color-control .maxi-color-control__color input',
			input => input[2].focus()
		);
		await pressKeyTimes('Backspace', '6');
		await page.keyboard.type('106D3C');

		// Opacity
		await styleCard.$eval('.maxi-color-control input', input =>
			input.focus()
		);
		await pressKeyTimes('Backspace', '3');
		await page.keyboard.type('50');

		const expectPresets = receiveMaxiStyle();

		expect(expectPresets).toMatchSnapshot();
	});
	/// ///////////////////////////////////////////////////////////

	it('Check Headings', async () => {
		const styleCardAccordions = await page.$$(
			'.maxi-accordion-control__item .maxi-accordion-tab div'
		);
		await styleCardAccordions[4].click();
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

		// Opacity
		await styleCard.$eval('.maxi-color-control input', input =>
			input.focus()
		);
		await pressKeyTimes('Backspace', '3');
		await page.keyboard.type('50');
		await buttons[1];

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

		const expectPresets = receiveMaxiStyle();

		expect(expectPresets).toMatchSnapshot();
	});
	/// ///////////////////////////////////////////////////////////

	it('Check Hover', async () => {
		const styleCardAccordions = await page.$$(
			'.maxi-accordion-control__item .maxi-accordion-tab div'
		);
		await styleCardAccordions[5].click();
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

		// Opacity
		await styleCard.$eval('.maxi-color-control input', input =>
			input.focus()
		);
		await pressKeyTimes('Backspace', '3');
		await page.keyboard.type('50');

		const expectPresets = receiveMaxiStyle();

		expect(expectPresets).toMatchSnapshot();
	});
	/// ///////////////////////////////////////////////////////////

	it('Check SVG Icon', async () => {
		const styleCardAccordions = await page.$$(
			'.maxi-accordion-control__item .maxi-accordion-tab div'
		);
		await styleCardAccordions[6].click();
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

		// Opacity
		await styleCard.$eval('.maxi-color-control input', input =>
			input.focus()
		);
		await pressKeyTimes('Backspace', '3');
		await page.keyboard.type('50');

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

		// Opacity
		await styleCard.$eval('.maxi-color-control input', input =>
			input.focus()
		);
		await pressKeyTimes('Backspace', '3');
		await page.keyboard.type('50');

		const expectPresets = receiveMaxiStyle();

		expect(expectPresets).toMatchSnapshot();
	});
	/// ///////////////////////////////////////////////////////////

	it('Check Divider', async () => {
		const styleCardAccordions = await page.$$(
			'.maxi-accordion-control__item .maxi-accordion-tab div'
		);
		await styleCardAccordions[7].click();
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

		// Opacity
		await styleCard.$eval('.maxi-color-control input', input =>
			input.focus()
		);
		await pressKeyTimes('Backspace', '3');
		await page.keyboard.type('50');

		const expectPresets = receiveMaxiStyle();

		expect(expectPresets).toMatchSnapshot();
	});
});
