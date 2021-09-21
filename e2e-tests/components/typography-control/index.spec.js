/* eslint-disable no-await-in-loop */
/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	pressKeyTimes,
	pressKeyWithModifier,
} from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { getBlockAttributes, openSidebar, changeResponsive } from '../../utils';

describe('TypographyControl', () => {
	it.only('Checking the fontFamily', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing Text Maxi');
		const accordionPanel = await openSidebar(page, 'typography');

		// fontFamily
		const fontFamilySelector = await accordionPanel.$(
			'.maxi-typography-control .maxi-typography-control__font-family'
		);
		await fontFamilySelector.click();
		await page.keyboard.type('Montserrat');
		await page.keyboard.press('Enter');
		await page.waitForTimeout(100);

		const attributes = await getBlockAttributes();
		const fontFamily = attributes['font-family-general'];
		const expectedFontFamily = 'Montserrat';

		expect(fontFamily).toStrictEqual(expectedFontFamily);
	});
	it.only('Checking the responsive fontFamily', async () => {
		const accordionPanel = await openSidebar(page, 'typography');
		const closeAccordion = await page.$$(
			'.interface-interface-skeleton__sidebar .edit-post-sidebar__panel-tabs button'
		);
		const input = await page.$(
			'.maxi-typography-control .maxi-typography-control__font-family input'
		);
		await input.focus();
		await page.keyboard.type('Lato');
		await page.waitForTimeout(100);
		await page.keyboard.press('Enter');
		await page.waitForTimeout(100);
		const typographyInput = await page.$$eval(
			'.maxi-typography-control__font-family div div div',
			fontValue => fontValue[0].innerHTML
		);

		await page.waitForTimeout(100);
		expect(typographyInput).toStrictEqual('Lato');

		// s
		await changeResponsive(page, 's');
		await openSidebar(page, 'typography');

		await input.focus();
		await pressKeyTimes('Backspace', '4');
		await page.keyboard.type('Arial');
		await page.keyboard.press('Enter');

		const typographyInputS = await accordionPanel.$$eval(
			'.maxi-typography-control__font-family div div div',
			fontValue => fontValue[0].innerHTML
		);

		expect(typographyInputS).toStrictEqual('Arial');

		const attributes = await getBlockAttributes();
		const height = attributes['font-family-s'];

		expect(height).toStrictEqual('Arial');

		// xs
		await changeResponsive(page, 'xs');
		await openSidebar(page, 'typography');

		const typographyInputXs = await accordionPanel.$$eval(
			'.maxi-typography-control__font-family div div div',
			fontValue => fontValue[0].innerHTML
		);

		expect(typographyInputXs).toStrictEqual('Arial');

		// m
		await changeResponsive(page, 'm');
		await closeAccordion[2].click();
		await openSidebar(page, 'typography');

		const typographyInputM = await accordionPanel.$$eval(
			'.maxi-typography-control__font-family div div div',
			fontValue => fontValue[0].innerHTML
		);

		expect(typographyInputM).toStrictEqual('Lato');
	});

	it.only('Checking the fontColor', async () => {
		await changeResponsive(page, 'base');

		const accordionPanel = await openSidebar(page, 'typography');

		await accordionPanel.$eval(
			'.maxi-sc-color-palette__custom .maxi-radio-control__option label',
			select => select.click()
		);

		await accordionPanel.$eval(
			'.maxi-color-control .maxi-color-control__color input',
			select => select.focus()
		);

		await pressKeyTimes('Backspace', '6');
		await page.keyboard.type('FAFA03');
		await page.keyboard.press('Enter');

		await page.waitForTimeout(500);

		const colorAttributes = await getBlockAttributes();
		const color = colorAttributes['color-general'];
		const expectedColor = 'rgba(250,250,3,1)';

		expect(color).toStrictEqual(expectedColor);
	});

	it.only('Check responsive palette-opacity', async () => {
		debugger;
		const accordionPanel = await openSidebar(page, 'typography');

		const input = await accordionPanel.$(
			'.maxi-typography-control .maxi-color-palette-control .maxi-advanced-number-control input'
		);

		await input.focus();
		await page.waitForTimeout(100);
		await page.keyboard.type('80');
		await changeResponsive(page, 's');
		const opacityLevel = await page.$eval(
			'.maxi-typography-control .maxi-color-palette-control .maxi-advanced-number-control input',
			button => button.value
		);

		expect(opacityLevel).toStrictEqual('80');

		// responsive S
		await page.waitForTimeout(100);
		await changeResponsive(page, 's');

		await input.focus();
		await pressKeyTimes('Backspace', '2');
		await page.keyboard.type('55', { delay: 100 });

		const responsiveSOption = await page.$eval(
			'.maxi-typography-control .maxi-color-palette-control .maxi-advanced-number-control input',
			selectedStyle => selectedStyle.value
		);

		expect(responsiveSOption).toStrictEqual('55');

		const attributes = await getBlockAttributes();
		const opacity = attributes['palette-opacity-s'];

		expect(opacity).toStrictEqual(55);

		// responsive XS
		await page.waitForTimeout(100);
		await changeResponsive(page, 'xs');

		const responsiveXsOption = await page.$eval(
			'.maxi-typography-control .maxi-color-palette-control .maxi-advanced-number-control input',
			selectedStyle => selectedStyle.value
		);

		expect(responsiveXsOption).toStrictEqual('55');

		// responsive M
		await page.waitForTimeout(100);
		await changeResponsive(page, 'm');

		const responsiveMOption = await page.$eval(
			'.maxi-typography-control .maxi-color-palette-control .maxi-advanced-number-control input',
			selectedStyle => selectedStyle.value
		);

		expect(responsiveMOption).toStrictEqual('80');
	});

	it.only('Check responsive palette-color', async () => {
		await changeResponsive(page, 'base');
		const accordionPanel = await openSidebar(page, 'typography');

		const attributes = await getBlockAttributes();
		const colorStatus = attributes['palette-color-status-general'];

		expect(colorStatus).toStrictEqual(true);

		// s
		await changeResponsive(page, 's');

		const customColor = await accordionPanel.$$(
			'.maxi-tabs-content .maxi-sc-color-palette__custom .maxi-radio-control__option label'
		);

		await customColor[0].click();

		const paletteColorSStatus = await accordionPanel.$$eval(
			'.maxi-tabs-content .maxi-sc-color-palette__custom .maxi-radio-control__option input',
			select => select[0].checked
		);

		expect(paletteColorSStatus).toStrictEqual(true);

		const attributesS = await getBlockAttributes();
		const colorStatusS = attributesS['palette-color-status-s'];

		expect(colorStatusS).toStrictEqual(false);

		// xs
		await changeResponsive(page, 'xs');
		const paletteColorXsStatus = await accordionPanel.$$eval(
			'.maxi-tabs-content .maxi-sc-color-palette__custom .maxi-radio-control__option input',
			select => select[0].checked
		);

		expect(paletteColorXsStatus).toStrictEqual(false);

		// m
		await changeResponsive(page, 'm');
		const paletteColorMStatus = await accordionPanel.$$eval(
			'.maxi-tabs-content .maxi-sc-color-palette__custom .maxi-radio-control__option input',
			select => select[1].checked
		);

		expect(paletteColorMStatus).toStrictEqual(true);
	});

	it('Checking the typography-control', async () => {
		await changeResponsive(page, 'base');
		const accordionPanel = await openSidebar(page, 'typography');

		const weightSelector = await accordionPanel.$(
			'.maxi-typography-control__weight .maxi-base-control__field select'
		);
		await weightSelector.select('300');

		const transformSelector = await accordionPanel.$(
			'.maxi-typography-control__transform .maxi-base-control__field select'
		);
		await transformSelector.select('capitalize');

		const fontStyleSelector = await accordionPanel.$(
			'.maxi-typography-control__font-style .maxi-base-control__field select'
		);
		await fontStyleSelector.select('italic');

		const decorationSelector = await accordionPanel.$(
			'.maxi-typography-control__decoration .maxi-base-control__field select'
		);
		await decorationSelector.select('overline');

		const styleAttributes = await getBlockAttributes();
		const typographyAttributes = (({
			'font-style-general': fontStyle,
			'font-weight-general': fontWeight,
			'text-decoration-general': textDecoration,
			'text-transform-general': textTransform,
		}) => ({
			'font-style-general': fontStyle,
			'font-weight-general': fontWeight,
			'text-decoration-general': textDecoration,
			'text-transform-general': textTransform,
		}))(styleAttributes);

		const expectedAttributesTwo = {
			'font-style-general': 'italic',
			'font-weight-general': '300',
			'text-decoration-general': 'overline',
			'text-transform-general': 'capitalize',
		};

		expect(typographyAttributes).toStrictEqual(expectedAttributesTwo);
	});
	it('Check responsive font-weight', async () => {
		const accordionPanel = await openSidebar(page, 'typography');

		const selector = await accordionPanel.$(
			'.maxi-typography-control .maxi-typography-control__weight select'
		);

		await selector.select('400');
		await page.waitForTimeout(100);

		const weightNumber = await accordionPanel.$eval(
			'.maxi-typography-control .maxi-typography-control__weight select',
			weightSelector => weightSelector.selectedIndex
		);
		expect(weightNumber).toStrictEqual(2);

		// s
		await changeResponsive(page, 's');
		await page.waitForTimeout(100);
		const selectorS = await accordionPanel.$(
			'.maxi-typography-control .maxi-typography-control__weight select'
		);
		await selectorS.select('500');

		const weightSNumber = await accordionPanel.$eval(
			'.maxi-typography-control .maxi-typography-control__weight select',
			weightSelector => weightSelector.selectedIndex
		);
		expect(weightSNumber).toStrictEqual(4);

		const attributes = await getBlockAttributes();
		const fontUnit = attributes['font-weight-s'];

		expect(fontUnit).toStrictEqual('500');

		// xs
		await changeResponsive(page, 'xs');

		const weightXsNumber = await accordionPanel.$eval(
			'.maxi-typography-control .maxi-typography-control__weight select',
			weightSelector => weightSelector.selectedIndex
		);
		expect(weightXsNumber).toStrictEqual(4);

		// m
		await changeResponsive(page, 'm');

		const weightMNumber = await accordionPanel.$eval(
			'.maxi-typography-control .maxi-typography-control__weight select',
			weightSelector => weightSelector.selectedIndex
		);
		expect(weightMNumber).toStrictEqual(2);
	});

	it('Check responsive transform', async () => {
		const accordionPanel = await openSidebar(page, 'typography');

		const selector = await accordionPanel.$(
			'.maxi-typography-control .maxi-typography-control__transform select'
		);

		await selector.select('lowercase');
		await page.waitForTimeout(100);

		const transformType = await accordionPanel.$eval(
			'.maxi-typography-control .maxi-typography-control__transform select',
			weightSelector => weightSelector.selectedIndex
		);
		expect(transformType).toStrictEqual(3);

		// s
		await changeResponsive(page, 's');
		await page.waitForTimeout(100);
		const selectorS = await accordionPanel.$(
			'.maxi-typography-control .maxi-typography-control__transform select'
		);
		await selectorS.select('uppercase');

		const weightSNumber = await accordionPanel.$eval(
			'.maxi-typography-control .maxi-typography-control__transform select',
			weightSelector => weightSelector.selectedIndex
		);
		expect(weightSNumber).toStrictEqual(2);

		const attributes = await getBlockAttributes();
		const fontUnit = attributes['text-transform-s'];

		expect(fontUnit).toStrictEqual('uppercase');

		// xs
		await changeResponsive(page, 'xs');

		const weightXsNumber = await accordionPanel.$eval(
			'.maxi-typography-control .maxi-typography-control__transform select',
			weightSelector => weightSelector.selectedIndex
		);
		expect(weightXsNumber).toStrictEqual(2);

		// m
		await changeResponsive(page, 'm');

		const weightMNumber = await accordionPanel.$eval(
			'.maxi-typography-control .maxi-typography-control__transform select',
			weightSelector => weightSelector.selectedIndex
		);
		expect(weightMNumber).toStrictEqual(3);
	});

	it('Check responsive font-style', async () => {
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing Text Maxi');
		const accordionPanel = await openSidebar(page, 'typography');

		const selector = await accordionPanel.$(
			'.maxi-typography-control .maxi-typography-control__font-style select'
		);

		await selector.select('italic');
		await page.waitForTimeout(100);

		const fontStyleType = await accordionPanel.$eval(
			'.maxi-typography-control .maxi-typography-control__font-style select',
			weightSelector => weightSelector.selectedIndex
		);
		expect(fontStyleType).toStrictEqual(0);

		// s
		await changeResponsive(page, 's');
		await page.waitForTimeout(100);
		const selectorS = await accordionPanel.$(
			'.maxi-typography-control .maxi-typography-control__font-style select'
		);
		await selectorS.select('oblique');

		const weightSNumber = await accordionPanel.$eval(
			'.maxi-typography-control .maxi-typography-control__font-style select',
			weightSelector => weightSelector.selectedIndex
		);
		expect(weightSNumber).toStrictEqual(2);

		const attributes = await getBlockAttributes();
		const fontUnit = attributes['font-style-s'];

		expect(fontUnit).toStrictEqual('oblique');

		// xs
		await changeResponsive(page, 'xs');

		const weightXsNumber = await accordionPanel.$eval(
			'.maxi-typography-control .maxi-typography-control__font-style select',
			weightSelector => weightSelector.selectedIndex
		);
		expect(weightXsNumber).toStrictEqual(2);

		// m
		await changeResponsive(page, 'm');

		const weightMNumber = await accordionPanel.$eval(
			'.maxi-typography-control .maxi-typography-control__font-style select',
			weightSelector => weightSelector.selectedIndex
		);
		expect(weightMNumber).toStrictEqual(0);
	});

	it('Check responsive text-decoration', async () => {
		const accordionPanel = await openSidebar(page, 'typography');

		const selector = await accordionPanel.$(
			'.maxi-typography-control .maxi-typography-control__decoration select'
		);
		await page.waitForTimeout(500);
		await selector.select('overline');
		await page.waitForTimeout(500);

		const textDecoration = await page.$eval(
			'.maxi-typography-control .maxi-typography-control__decoration select',
			decorationSelector => decorationSelector.selectedIndex
		);

		expect(textDecoration).toStrictEqual(1);

		// s
		await changeResponsive(page, 's');
		await page.waitForTimeout(100);
		const selectorS = await accordionPanel.$(
			'.maxi-typography-control .maxi-typography-control__decoration select'
		);
		await selectorS.select('underline');

		const decorationSSelection = await accordionPanel.$eval(
			'.maxi-typography-control .maxi-typography-control__decoration select',
			decorationSelector => decorationSelector.selectedIndex
		);
		expect(decorationSSelection).toStrictEqual(3);

		const attributes = await getBlockAttributes();
		const decoration = attributes['text-decoration-s'];

		expect(decoration).toStrictEqual('underline');

		// xs
		await changeResponsive(page, 'xs');

		const decorationXsSelection = await accordionPanel.$eval(
			'.maxi-typography-control .maxi-typography-control__decoration select',
			decorationSelector => decorationSelector.selectedIndex
		);
		expect(decorationXsSelection).toStrictEqual(3);

		// m
		await changeResponsive(page, 'm');

		const decorationMSelection = await accordionPanel.$eval(
			'.maxi-typography-control .maxi-typography-control__decoration select',
			decorationSelector => decorationSelector.selectedIndex
		);
		expect(decorationMSelection).toStrictEqual(1);
	});
	it('Check text-shadow', async () => {
		await changeResponsive(page, 'base');

		const accordionPanel = await openSidebar(page, 'typography');

		await accordionPanel.$$eval(
			'.maxi-typography-control .maxi-textshadow-control .maxi-base-control__field label',
			select => select[1].click()
		);

		await accordionPanel.$$(
			'.maxi-textshadow-control.maxi-typography-control__text-shadow .maxi-default-styles-control'
		);

		const shadowStyles = [
			'none',
			'0px 0px 5px #a2a2a2',
			'5px 0px 3px #a2a2a2',
			'2px 4px 0px #a2a2a2',
		];

		for (let i = 0; i < shadowStyles.length; i += 1) {
			const setting = shadowStyles[i];

			await accordionPanel.$$eval(
				'.maxi-textshadow-control.maxi-typography-control__text-shadow .maxi-default-styles-control button',
				(buttons, i) => buttons[i].click(),
				i
			);
			await page.waitForTimeout(200);

			const shadowAttributes = await getBlockAttributes();
			const textShadow = shadowAttributes['text-shadow-general'];
			expect(textShadow).toStrictEqual(setting);
		}
	});

	it('Check tabs-control', async () => {
		const accordionPanel = await openSidebar(page, 'typography');

		await accordionPanel.$$eval(
			'.maxi-tabs-content .maxi-typography-control__text-options-tabs .maxi-tabs-content input',
			select => select[0].focus()
		);
		await pressKeyTimes('Backspace', '1');
		await page.waitForTimeout(200);

		await page.keyboard.type('9');
		await page.waitForTimeout(200);

		// line-height
		await accordionPanel.$$eval(
			'.maxi-tabs-content .maxi-typography-control__text-options-tabs .maxi-tabs-content input',
			select => select[2].focus()
		);
		await pressKeyWithModifier('primary', 'a');
		await page.waitForTimeout(200);

		await page.keyboard.type('4');
		await page.waitForTimeout(200);

		// letter-spacing
		await accordionPanel.$$eval(
			'.maxi-tabs-content .maxi-typography-control__text-options-tabs .maxi-tabs-content input',
			select => select[4].focus()
		);
		await page.keyboard.type('10');
		await page.waitForTimeout(200);

		const stylesAttributes = await getBlockAttributes();

		const expectedResult = (({
			'line-height-m': lineHeight,
			'letter-spacing-m': letterSpacing,
			'font-size-m': fontSize,
		}) => ({
			'line-height-m': lineHeight,
			'letter-spacing-m': letterSpacing,
			'font-size-m': fontSize,
		}))(stylesAttributes);

		const expectedAttributes = {
			'line-height-m': 4,
			'letter-spacing-m': 10,
			'font-size-m': 19,
		};

		expect(expectedResult).toStrictEqual(expectedAttributes);
	});
});
