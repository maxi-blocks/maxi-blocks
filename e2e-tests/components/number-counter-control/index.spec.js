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
import { getBlockAttributes, openSidebar } from '../../utils';

describe('NumberCounterControl', () => {
	it('Check number counter control', async () => {
		await createNewPost();
		await insertBlock('Number Counter Maxi');
		const accordionPanel = await openSidebar(page, 'number');

		// Start Animation
		const animation = await accordionPanel.$(
			'.maxi-number-counter-control .components-base-control__field select'
		);

		await animation.select('view-scroll');

		const expectAnimation = 'view-scroll';
		const animationAttributes = await getBlockAttributes();
		const styleAttribute =
			animationAttributes['number-counter-start-animation'];

		expect(styleAttribute).toStrictEqual(expectAnimation);

		// Start Number, End Number, Duration, Radius, Stroke, Title Font Size
		const inputs = await accordionPanel.$$(
			'.maxi-base-control.maxi-advanced-number-control .maxi-advanced-number-control__value'
		);

		// Start Number
		await inputs[0].focus();
		await page.keyboard.type('20');

		// End Number
		await inputs[1].focus();
		await pressKeyTimes('Backspace', '3');
		await page.keyboard.type('50');

		// Duration
		await inputs[2].focus();
		await page.keyboard.type('00');

		// Radius
		await inputs[3].focus();
		await pressKeyTimes('Backspace', '1');
		await page.keyboard.type('90');

		// Stroke
		await inputs[4].focus();
		await pressKeyTimes('Backspace', '2');
		await page.keyboard.type('50');

		// Title Font Size
		await inputs[5].focus();
		await pressKeyTimes('Backspace', '2');
		await page.keyboard.type('32');

		// expect
		const styleAttributes = await getBlockAttributes();
		const numberCounterAttributes = (({
			'number-counter-duration': counterDuration,
			'number-counter-end': counterEnd,
			'number-counter-radius': counterRadius,
			'number-counter-start': counterStart,
			'number-counter-stroke': counterStroke,
			'number-counter-title-font-size': counterTitle,
		}) => ({
			'number-counter-duration': counterDuration,
			'number-counter-end': counterEnd,
			'number-counter-radius': counterRadius,
			'number-counter-start': counterStart,
			'number-counter-stroke': counterStroke,
			'number-counter-title-font-size': counterTitle,
		}))(styleAttributes);

		const expectedAttributes = {
			'number-counter-duration': 100,
			'number-counter-end': 50,
			'number-counter-radius': 999,
			'number-counter-start': 20,
			'number-counter-stroke': 50,
			'number-counter-title-font-size': 999,
		};

		expect(numberCounterAttributes).toStrictEqual(expectedAttributes);

		// buttons
		const buttons = await accordionPanel.$$(
			'.maxi-fancy-radio-control .maxi-base-control__field label'
		);

		// Show Percentage Sign
		await buttons[4].click();

		const showPercentage = true;
		const percentageAttributes = await getBlockAttributes();
		const showPercentageAttribute =
			percentageAttributes['number-counter-percentage-sign-status'];

		expect(showPercentageAttribute).toStrictEqual(showPercentage);

		// Rounded Bar
		await buttons[10].click();

		const roundedBar = true;
		const roundedAttributes = await getBlockAttributes();
		const roundedBarAttribute =
			roundedAttributes['number-counter-rounded-status'];

		expect(roundedBarAttribute).toStrictEqual(roundedBar);

		// Hide Circle
		await buttons[7].click();

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

		const attributes = await getBlockAttributes();
		const fontFamily = attributes['number-counter-title-font-family'];
		const expectedFontFamily = 'Montserrat';

		expect(fontFamily).toStrictEqual(expectedFontFamily);
	});
});
