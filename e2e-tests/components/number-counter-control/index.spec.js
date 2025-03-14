/**
 * WordPress dependencies
 */
import {
	createNewPost,
	pressKeyTimes,
	pressKeyWithModifier,
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
	addResponsiveTest,
	insertMaxiBlock,
	updateAllBlockUniqueIds,
} from '../../utils';

describe('NumberCounterControl', () => {
	it('Check number counter control', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Number Counter Maxi');
		await updateAllBlockUniqueIds(page);
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
		await inputs[2].focus();
		await pressKeyTimes('Backspace', '1');
		await page.waitForTimeout(500);
		await page.keyboard.type('20', { delay: 350 });

		// End Number
		await inputs[3].focus();
		await pressKeyWithModifier('ctrl', 'a');
		await page.keyboard.type('50', { delay: 350 });
		await page.waitForTimeout(500);

		// Duration
		await inputs[4].focus();
		await page.keyboard.type('0');

		// Stroke
		await inputs[5].focus();
		await pressKeyTimes('Backspace', '2');
		await page.waitForTimeout(350);
		await page.keyboard.type('50', { delay: 350 });

		// Title Font Size
		await inputs[6].focus();
		await pressKeyTimes('Backspace', '2');
		await page.waitForTimeout(350);
		await page.keyboard.type('19', { delay: 350 });

		// expect
		const numberResult = await getAttributes([
			'number-counter-width-xl',
			'number-counter-width-unit-xl',
			'number-counter-duration',
			'number-counter-end',
			'number-counter-start',
			'number-counter-stroke',
			'number-counter-title-font-size-xl',
		]);

		const expectAttributes = {
			'number-counter-width-xl': '31',
			'number-counter-width-unit-xl': '%',
			'number-counter-duration': 10,
			'number-counter-end': 50,
			'number-counter-start': 20,
			'number-counter-stroke': 50,
			'number-counter-title-font-size-xl': 19,
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
			'number-counter-text-palette-color-xl',
			'number-counter-circle-bar-palette-color-xl',
			'number-counter-circle-background-palette-color',
		]);

		const expectedColorAttributes = {
			'number-counter-text-palette-color-xl': 4,
			'number-counter-circle-bar-palette-color-xl': 2,
			'number-counter-circle-background-palette-color': 3,
		};

		expect(colorResult).toStrictEqual(expectedColorAttributes);

		// font family
		const fontFamilySelector = await accordionPanel.$(
			'.maxi-number-counter-control .maxi-typography-control__font-family'
		);
		await fontFamilySelector.click();
		await page.keyboard.type('Montserrat', { delay: 350 });
		await page.keyboard.press('Enter');
		await page.waitForTimeout(100);

		expect(await getAttributes('font-family-xl')).toStrictEqual(
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
			await getAttributes('number-counter-width-auto-xl')
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
	it('Check number counter font size and font family responsive', async () => {
		const responsiveFontSize = await addResponsiveTest({
			page,
			instance: '.maxi-number-counter-control__font-size input',
			needFocus: true,
			baseExpect: '19',
			xsExpect: '33',
			newValue: '33',
		});
		expect(responsiveFontSize).toBeTruthy();

		// font family
		await changeResponsive(page, 'base');

		const typographyInput = await page.$eval(
			'.maxi-typography-control__font-family div div div',
			fontValue => fontValue.innerHTML
		);
		await page.waitForTimeout(400);

		expect(typographyInput).toStrictEqual('Montserrat');

		// s
		await changeResponsive(page, 's');

		await page.$eval('.maxi-typography-control__font-family input', input =>
			input.focus()
		);
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('Arial', { delay: 350 });
		await page.keyboard.press('Enter');

		const typographyInputS = await page.$eval(
			'.maxi-typography-control__font-family div div div',
			fontValue => fontValue.innerHTML
		);
		expect(typographyInputS).toStrictEqual('Arial');

		expect(await getAttributes('font-family-s')).toStrictEqual('Arial');

		// xs
		await changeResponsive(page, 'xs');

		const typographyInputXs = await page.$eval(
			'.maxi-typography-control__font-family div div div',
			fontValue => fontValue.innerHTML
		);

		expect(typographyInputXs).toStrictEqual('Arial');

		// m
		await changeResponsive(page, 'm');

		const typographyInputM = await page.$eval(
			'.maxi-typography-control__font-family div div div',
			fontValue => fontValue.innerHTML
		);

		expect(typographyInputM).toStrictEqual('Montserrat');
	});
	it('Check number counter text-color and circle-bar-color responsive', async () => {
		// change responsive s
		await changeResponsive(page, 's');

		const colorsS = await page.$$(
			'.maxi-color-palette-control .maxi-color-control__palette'
		);

		// Text color
		await colorsS[0].$$eval('button', click => click[4].click());
		await page.waitForTimeout(400);

		// Circle Bar Color
		await colorsS[2].$$eval('button', click => click[2].click());
		await page.waitForTimeout(400);

		// expect
		const colorResult = await getAttributes([
			'number-counter-text-palette-color-s',
			'number-counter-circle-bar-palette-color-s',
		]);

		const expectedColorAttributes = {
			'number-counter-text-palette-color-s': 5,
			'number-counter-circle-bar-palette-color-s': 3,
		};

		expect(colorResult).toStrictEqual(expectedColorAttributes);

		// change responsive xs
		await changeResponsive(page, 'xs');

		const xsTextColor = await colorsS[0].$eval(
			'.maxi-color-control__palette-container .maxi-color-control__palette-box--active',
			select => select.getAttribute('data-item')
		);

		expect(xsTextColor).toStrictEqual('5');

		const xsCircleBarColor = await colorsS[2].$eval(
			'.maxi-color-control__palette-container .maxi-color-control__palette-box--active',
			select => select.getAttribute('data-item')
		);

		expect(xsCircleBarColor).toStrictEqual('3');

		// change responsive m
		await changeResponsive(page, 'm');
		const colorsM = await page.$$(
			'.maxi-color-palette-control .maxi-color-control__palette'
		);
		await page.waitForTimeout(1500);

		const mTextColor = await colorsM[0].$eval(
			'.maxi-color-control__palette-container .maxi-color-control__palette-box--active',
			select => select.getAttribute('data-item')
		);

		expect(mTextColor).toStrictEqual('4');

		const mCircleBarColor = await colorsM[2].$eval(
			'.maxi-color-control__palette-container .maxi-color-control__palette-box--active',
			select => select.getAttribute('data-item')
		);

		expect(mCircleBarColor).toStrictEqual('2');
	});
});
