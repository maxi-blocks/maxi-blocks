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
import {
	openSidebarTab,
	getBlockStyle,
	getAttributes,
	editAdvancedNumberControl,
	changeResponsive,
} from '../../utils';

describe('NumberCounterControl', () => {
	it('Check number counter control', async () => {
		await createNewPost();
		await insertBlock('Number Counter Maxi');
		const accordionPanel = await openSidebarTab(page, 'style', 'number');

		// Start Animation
		const animation = await accordionPanel.$(
			'.maxi-number-counter-control__start-animation .maxi-base-control__field select'
		);

		await animation.select('view-scroll');

		expect(
			await getAttributes('number-counter-start-animation')
		).toStrictEqual('view-scroll');

		// Width, Start Number, End Number, Duration, Radius, Stroke, Title Font Size
		const inputs = await accordionPanel.$$(
			'.maxi-base-control.maxi-advanced-number-control .maxi-advanced-number-control__value'
		);

		const widthUnitSelect = await accordionPanel.$(
			'.maxi-number-counter-control__width .maxi-dimensions-control__units .maxi-base-control__field select'
		);
		await widthUnitSelect.select('%');

		// number width
		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-number-counter-control__width '),
			newNumber: '31',
			newValue: '%',
		});

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
		await page.keyboard.type('0');

		// Stroke
		await inputs[4].focus();
		await pressKeyTimes('Backspace', '2');
		await page.keyboard.type('50');

		// Title Font Size
		await inputs[5].focus();
		await pressKeyTimes('Backspace', '2');
		await page.keyboard.type('19');

		// expect
		const numberResult = await getAttributes([
			'number-counter-width-general',
			'number-counter-width-unit-general',
			'number-counter-duration',
			'number-counter-end',
			'number-counter-start',
			'number-counter-stroke',
			'number-counter-title-font-size-general',
		]);

		const expectAttributes = {
			'number-counter-width-general': 31,
			'number-counter-width-unit-general': '%',
			'number-counter-duration': 10,
			'number-counter-end': 50,
			'number-counter-start': 20,
			'number-counter-stroke': 50,
			'number-counter-title-font-size-general': 19,
		};

		expect(numberResult).toStrictEqual(expectAttributes);

		// Show Percentage Sign
		await accordionPanel.$eval(
			'.maxi-number-counter-control .maxi-toggle-switch.number-counter-percentage-sign-status .maxi-base-control__label',
			click => click.click()
		);

		expect(
			await getAttributes('number-counter-percentage-sign-status')
		).toStrictEqual(true);

		// Rounded Bar
		await accordionPanel.$eval(
			'.maxi-number-counter-control .maxi-toggle-switch.number-counter-rounded-status .maxi-base-control__label',
			click => click.click()
		);

		expect(
			await getAttributes('number-counter-rounded-status')
		).toStrictEqual(true);

		// Hide Circle
		await accordionPanel.$eval(
			'.maxi-number-counter-control .maxi-toggle-switch.number-counter-circle-status .maxi-base-control__label',
			click => click.click()
		);

		expect(
			await getAttributes('number-counter-circle-status')
		).toStrictEqual(true);

		// Text colour, Circle Background Colour, Circle Bar Colour
		// Return circle to be shown
		await accordionPanel.$eval(
			'.maxi-number-counter-control .maxi-toggle-switch.number-counter-circle-status .maxi-base-control__label',
			click => click.click()
		);

		const colors = await accordionPanel.$$(
			'.maxi-color-palette-control .maxi-color-control__palette'
		);

		// Text colour
		await colors[0].$$eval('button', click => click[3].click());

		// Circle Background Colour
		await colors[1].$$eval('button', click => click[2].click());

		// Circle Bar Colour
		await colors[2].$$eval('button', click => click[1].click());

		// expect
		const colorResult = await getAttributes([
			'number-counter-text-palette-color-general',
			'number-counter-circle-bar-palette-color-general',
			'number-counter-circle-background-palette-color',
		]);

		const expectedColorAttributes = {
			'number-counter-text-palette-color-general': 4,
			'number-counter-circle-bar-palette-color-general': 2,
			'number-counter-circle-background-palette-color': 3,
		};

		expect(colorResult).toStrictEqual(expectedColorAttributes);

		// font family
		const fontFamilySelector = await accordionPanel.$(
			'.maxi-number-counter-control .maxi-typography-control__font-family'
		);
		await fontFamilySelector.click();
		await page.keyboard.type('Montserrat');
		await page.keyboard.press('Enter');
		await page.waitForTimeout(100);

		expect(await getAttributes('font-family-general')).toStrictEqual(
			'Montserrat'
		);

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Check number counter width responsive', async () => {
		// responsive s
		await changeResponsive(page, 's');

		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-number-counter-control__width '),
			newNumber: '45',
			newValue: 'px',
		});

		// responsive xs
		await changeResponsive(page, 'xs');
		const responsiveXsOption = await page.$eval(
			'.maxi-number-counter-control__width input',
			select => select.value
		);

		expect(responsiveXsOption).toBe('45');

		const responsiveXsValue = await page.$eval(
			'.maxi-number-counter-control__width select',
			select => select.value
		);
		expect(responsiveXsValue).toBe('px');

		// responsive m
		await changeResponsive(page, 'm');
		const responsiveMOption = await page.$eval(
			'.maxi-number-counter-control__width input',
			select => select.value
		);

		expect(responsiveMOption).toBe('31');

		const responsiveMValue = await page.$eval(
			'.maxi-number-counter-control__width select',
			select => select.value
		);
		expect(responsiveMValue).toBe('%');
	});
	it('Check number counter auto width responsive', async () => {
		// responsive base
		await changeResponsive(page, 'base');
		await page.$eval(
			'.maxi-number-counter-control .maxi-toggle-switch input',
			button => button.click()
		);

		expect(
			await getAttributes('number-counter-width-auto-general')
		).toStrictEqual(true);

		// responsive s
		await changeResponsive(page, 's');
		await page.$eval(
			'.maxi-number-counter-control .maxi-toggle-switch input',
			button => button.click()
		);
		expect(
			await getAttributes('number-counter-width-auto-s')
		).toStrictEqual(false);

		// responsive M
		await changeResponsive(page, 'xs');
		const responsiveMOption = await page.$eval(
			'.maxi-base-control.maxi-toggle-switch.maxi-toggle-switch--is-checked input',
			select => select.checked
		);

		expect(responsiveMOption).toBe(true);

		// responsive xs
		await changeResponsive(page, 'xs');
		const responsiveXsOption = await page.$eval(
			'.maxi-number-counter-control .maxi-toggle-switch input',
			select => select.checked
		);

		expect(responsiveXsOption).toBe(false);
	});
});
