/**
 * WordPress dependencies
 */
import { createNewPost, pressKeyTimes } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { getBlockAttributes } from '../../utils';
const receiveMaxiStyle = await page.evaluate(() => {
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

		expect(className).toStrictEqual(additionalClass);
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

		await expect(className).toStrictEqual(additionalClass);
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

		await expect(className).toStrictEqual(additionalClass);
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

		// Use Global Link Hover Colour
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

		// Use Global Link Active Colour
		// button
		await buttons[3].click();
		await buttons[4].click();

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

		// Use Global Link Visited Colour
		// button
		await buttons[4].click();
		await buttons[5].click();

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

		await expect(className).toStrictEqual(additionalClass);
	});
	/// ///////////////////////////////////////////////////////////

	it('Check Headings', async () => {
		const styleCardAccordions = await page.$$(
			'.maxi-accordion-control__item .maxi-accordion-tab div'
		);
		await styleCardAccordions[2].click();
		const styleCard = await page.$(
			'.components-popover__content .maxi-blocks-sc__type--headings'
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

		await expect(className).toStrictEqual(additionalClass);
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
		expect(className).toStrictEqual(additionalClass);
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

		await expect(className).toStrictEqual(additionalClass);
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

		await expect(className).toStrictEqual(additionalClass);
	});
});
