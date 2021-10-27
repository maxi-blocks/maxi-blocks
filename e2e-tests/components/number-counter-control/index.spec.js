/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	pressKeyTimes,
} from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { getBlockAttributes, openSidebar, getBlockStyle } from '../../utils';

describe('NumberCounterControl', () => {
	it('Check number counter control', async () => {
		await createNewPost();
		await insertBlock('Number Counter Maxi');
		const accordionPanel = await openSidebar(page, 'number');

		// Start Animation
		const animation = await accordionPanel.$(
			'.maxi-number-counter-control__start-animation .maxi-base-control__field select'
		);

		await animation.select('view-scroll');

		const expectAnimation = 'view-scroll';
		const animationAttributes = await getBlockAttributes();
		const styleAttribute =
			animationAttributes['number-counter-start-animation'];

		expect(styleAttribute).toStrictEqual(expectAnimation);

		// Width, Start Number, End Number, Duration, Radius, Stroke, Title Font Size
		const inputs = await accordionPanel.$$(
			'.maxi-base-control.maxi-advanced-number-control .maxi-advanced-number-control__value'
		);

		const widthUnitSelect = await accordionPanel.$(
			'.maxi-number-counter-control__width .maxi-dimensions-control__units .maxi-base-control__field select'
		);
		await widthUnitSelect.select('%');

		// Width
		await inputs[0].focus();
		await pressKeyTimes('Backspace', '3');
		await page.keyboard.type('100');

		// Start Number
		await inputs[1].focus();
		await pressKeyTimes('Backspace', '1');
		await page.keyboard.type('20');

		// End Number
		await inputs[2].focus();
		await pressKeyTimes('Backspace', '3');
		await page.keyboard.type('50');

		// Duration
		await inputs[3].focus();
		await page.keyboard.type('00');

		// Stroke
		await inputs[4].focus();
		await pressKeyTimes('Backspace', '2');
		await page.keyboard.type('50');

		// Title Font Size
		await inputs[5].focus();
		await pressKeyTimes('Backspace', '2');
		await page.keyboard.type('1');

		// expect
		const styleAttributes = await getBlockAttributes();
		const numberCounterAttributes = (({
			'width-general': width,
			'width-unit-general': widthUnit,
			'number-counter-duration': counterDuration,
			'number-counter-end': counterEnd,
			'number-counter-start': counterStart,
			'number-counter-stroke': counterStroke,
			'number-counter-title-font-size': counterTitle,
		}) => ({
			'width-general': width,
			'width-unit-general': widthUnit,
			'number-counter-duration': counterDuration,
			'number-counter-end': counterEnd,
			'number-counter-start': counterStart,
			'number-counter-stroke': counterStroke,
			'number-counter-title-font-size': counterTitle,
		}))(styleAttributes);

		const expectedAttributes = {
			'width-general': 100,
			'width-unit-general': '%',
			'number-counter-duration': 100,
			'number-counter-end': 50,
			'number-counter-start': 20,
			'number-counter-stroke': 50,
			'number-counter-title-font-size': 321,
		};

		expect(numberCounterAttributes).toStrictEqual(expectedAttributes);

		// Show Percentage Sign
		await accordionPanel.$eval(
			'.maxi-number-counter-control .maxi-toggle-switch.number-counter-percentage-sign-status .maxi-base-control__label',
			click => click.click()
		);

		const showPercentage = true;
		const percentageAttributes = await getBlockAttributes();
		const showPercentageAttribute =
			percentageAttributes['number-counter-percentage-sign-status'];

		expect(showPercentageAttribute).toStrictEqual(showPercentage);

		// Rounded Bar
		await accordionPanel.$eval(
			'.maxi-number-counter-control .maxi-toggle-switch.number-counter-rounded-status .maxi-base-control__label',
			click => click.click()
		);

		const roundedBar = true;
		const roundedAttributes = await getBlockAttributes();
		const roundedBarAttribute =
			roundedAttributes['number-counter-rounded-status'];

		expect(roundedBarAttribute).toStrictEqual(roundedBar);

		// Hide Circle
		await accordionPanel.$eval(
			'.maxi-number-counter-control .maxi-toggle-switch.number-counter-circle-status .maxi-base-control__label',
			click => click.click()
		);

		const hideCircle = true;
		const circleAttributes = await getBlockAttributes();
		const hideCircleAttribute =
			circleAttributes['number-counter-circle-status'];

		expect(hideCircleAttribute).toStrictEqual(hideCircle);

		// Text colour, Circle Background Colour, Circle Bar Colour

		const colors = await accordionPanel.$$(
			'.maxi-color-palette-control .maxi-sc-color-palette'
		);

		// Text colour
		await colors[0].$$eval('div', click => click[3].click());

		// Circle Background Colour
		await colors[1].$$eval('div', click => click[2].click());

		// Circle Bar Colour
		await colors[2].$$eval('div', click => click[1].click());

		// expect
		const colorAttributes = await getBlockAttributes();
		const colorsAttributes = (({
			'number-counter-palette-text-color': textColor,
			'number-counter-palette-circle-bar-color': circleColor,
			'number-counter-palette-circle-background-color': backgroundColor,
		}) => ({
			'number-counter-palette-text-color': textColor,
			'number-counter-palette-circle-bar-color': circleColor,
			'number-counter-palette-circle-background-color': backgroundColor,
		}))(colorAttributes);

		const expectedColorAttributes = {
			'number-counter-palette-text-color': 4,
			'number-counter-palette-circle-bar-color': 2,
			'number-counter-palette-circle-background-color': 3,
		};

		expect(colorsAttributes).toStrictEqual(expectedColorAttributes);

		// font family
		const fontFamilySelector = await accordionPanel.$(
			'.maxi-number-counter-control .maxi-typography-control__font-family'
		);
		await fontFamilySelector.click();
		await page.keyboard.type('Montserrat');
		await page.keyboard.press('Enter');
		await page.waitForTimeout(100);

		const attributes = await getBlockAttributes();
		const fontFamily = attributes['number-counter-title-font-family'];
		const expectedFontFamily = 'Montserrat';

		expect(fontFamily).toStrictEqual(expectedFontFamily);

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
