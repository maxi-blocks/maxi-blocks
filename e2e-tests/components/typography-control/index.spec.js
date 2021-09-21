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
	it('Checking the FontFamily', async () => {
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

		const attributes = await getBlockAttributes();
		const fontFamily = attributes['font-family-general'];
		const expectedFontFamily = 'Montserrat';

		expect(fontFamily).toStrictEqual(expectedFontFamily);
	});
	it('Checking the responsive FontFamily', async () => {
		const accordionPanel = await openSidebar(page, 'typography');
		const closeAccordion = await page.$$(
			'.interface-interface-skeleton__sidebar .edit-post-sidebar__panel-tabs button'
		);
		const input = await page.$(
			'.maxi-typography-control .maxi-typography-control__font-family input'
		);

		await input.focus();
		await page.keyboard.type('Lato');
		await page.keyboard.press('Enter');

		const typographyInput = await page.$$eval(
			'.maxi-typography-control__font-family div div div',
			fontValue => fontValue[0].innerHTML
		);

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

	it('Checking the FontColor', async () => {
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
		await page.waitForTimeout(250);

		const colorAttributes = await getBlockAttributes();
		const color = colorAttributes['color-general'];
		const expectedColor = 'rgba(250,250,3,1)';

		expect(color).toStrictEqual(expectedColor);
	});

	it('Check responsive PaletteOpacity', async () => {
		const accordionPanel = await openSidebar(page, 'typography');
		await accordionPanel.$$eval(
			'.maxi-sc-color-palette__custom .maxi-radio-control__option label',
			select => select[1].click()
		);
		const input = await accordionPanel.$(
			'.maxi-typography-control .maxi-color-palette-control .maxi-advanced-number-control input'
		);

		await input.focus();
		await page.keyboard.type('80');
		await changeResponsive(page, 's');

		const opacityLevel = await page.$eval(
			'.maxi-typography-control .maxi-color-palette-control .maxi-advanced-number-control input',
			button => button.value
		);

		expect(opacityLevel).toStrictEqual('80');

		// responsive S
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
		await changeResponsive(page, 'xs');

		const responsiveXsOption = await page.$eval(
			'.maxi-typography-control .maxi-color-palette-control .maxi-advanced-number-control input',
			selectedStyle => selectedStyle.value
		);

		expect(responsiveXsOption).toStrictEqual('55');

		// responsive M
		await changeResponsive(page, 'm');

		const responsiveMOption = await page.$eval(
			'.maxi-typography-control .maxi-color-palette-control .maxi-advanced-number-control input',
			selectedStyle => selectedStyle.value
		);

		expect(responsiveMOption).toStrictEqual('80');
	});

	it('Check responsive PaletteColor', async () => {
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

	it('Checking the Weight, Transform, Style and Decoration', async () => {
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
	it('Check responsive FontWeight', async () => {
		const accordionPanel = await openSidebar(page, 'typography');
		const selector = await accordionPanel.$(
			'.maxi-typography-control .maxi-typography-control__weight select'
		);

		await selector.select('400');

		const weightNumber = await accordionPanel.$eval(
			'.maxi-typography-control .maxi-typography-control__weight select',
			weightSelector => weightSelector.selectedIndex
		);
		expect(weightNumber).toStrictEqual(2);

		// s
		await changeResponsive(page, 's');
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

	it('Check responsive Transform', async () => {
		const accordionPanel = await openSidebar(page, 'typography');
		const selector = await accordionPanel.$(
			'.maxi-typography-control .maxi-typography-control__transform select'
		);

		await selector.select('lowercase');

		const transformType = await accordionPanel.$eval(
			'.maxi-typography-control .maxi-typography-control__transform select',
			transformSelector => transformSelector.selectedIndex
		);

		expect(transformType).toStrictEqual(3);

		// s
		await changeResponsive(page, 's');
		const selectorS = await accordionPanel.$(
			'.maxi-typography-control .maxi-typography-control__transform select'
		);
		await selectorS.select('uppercase');

		const TransformSNumber = await accordionPanel.$eval(
			'.maxi-typography-control .maxi-typography-control__transform select',
			TransformSelector => TransformSelector.selectedIndex
		);

		expect(TransformSNumber).toStrictEqual(2);

		const attributes = await getBlockAttributes();
		const fontUnit = attributes['text-transform-s'];

		expect(fontUnit).toStrictEqual('uppercase');

		// xs
		await changeResponsive(page, 'xs');

		const TransformXsNumber = await accordionPanel.$eval(
			'.maxi-typography-control .maxi-typography-control__transform select',
			TransformSelector => TransformSelector.selectedIndex
		);

		expect(TransformXsNumber).toStrictEqual(2);

		// m
		await changeResponsive(page, 'm');

		const transformMNumber = await accordionPanel.$eval(
			'.maxi-typography-control .maxi-typography-control__transform select',
			transformSelector => transformSelector.selectedIndex
		);

		expect(transformMNumber).toStrictEqual(3);
	});

	it('Check responsive Style', async () => {
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing Text Maxi');
		const accordionPanel = await openSidebar(page, 'typography');
		const selector = await accordionPanel.$(
			'.maxi-typography-control .maxi-typography-control__font-style select'
		);

		await selector.select('italic');

		const fontStyleType = await accordionPanel.$eval(
			'.maxi-typography-control .maxi-typography-control__font-style select',
			styleSelector => styleSelector.selectedIndex
		);
		expect(fontStyleType).toStrictEqual(0);

		// s
		await changeResponsive(page, 's');
		const selectorS = await accordionPanel.$(
			'.maxi-typography-control .maxi-typography-control__font-style select'
		);
		await selectorS.select('oblique');

		const styleSNumber = await accordionPanel.$eval(
			'.maxi-typography-control .maxi-typography-control__font-style select',
			styleSelector => styleSelector.selectedIndex
		);

		expect(styleSNumber).toStrictEqual(2);

		const attributes = await getBlockAttributes();
		const fontUnit = attributes['font-style-s'];

		expect(fontUnit).toStrictEqual('oblique');

		// xs
		await changeResponsive(page, 'xs');

		const styleXsNumber = await accordionPanel.$eval(
			'.maxi-typography-control .maxi-typography-control__font-style select',
			styleSelector => styleSelector.selectedIndex
		);
		expect(styleXsNumber).toStrictEqual(2);

		// m
		await changeResponsive(page, 'm');

		const styleMNumber = await accordionPanel.$eval(
			'.maxi-typography-control .maxi-typography-control__font-style select',
			styleSelector => styleSelector.selectedIndex
		);
		expect(styleMNumber).toStrictEqual(0);
	});

	it('Check responsive Decoration', async () => {
		const accordionPanel = await openSidebar(page, 'typography');
		const selector = await accordionPanel.$(
			'.maxi-typography-control .maxi-typography-control__decoration select'
		);

		await selector.select('overline');

		const textDecoration = await page.$eval(
			'.maxi-typography-control .maxi-typography-control__decoration select',
			decorationSelector => decorationSelector.selectedIndex
		);

		expect(textDecoration).toStrictEqual(1);

		// s
		await changeResponsive(page, 's');

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
	it('Check TextShadow', async () => {
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

	it('Check Size, LineHeight and LetterSpacing', async () => {
		const accordionPanel = await openSidebar(page, 'typography');
		await accordionPanel.$$eval(
			'.maxi-tabs-content .maxi-typography-control__text-options-tabs .maxi-tabs-content input',
			select => select[0].focus()
		);

		await pressKeyTimes('Backspace', '1');
		await page.keyboard.type('9');

		// line-height
		await accordionPanel.$$eval(
			'.maxi-tabs-content .maxi-typography-control__text-options-tabs .maxi-tabs-content input',
			select => select[2].focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('4');

		// letter-spacing
		await accordionPanel.$$eval(
			'.maxi-tabs-content .maxi-typography-control__text-options-tabs .maxi-tabs-content input',
			select => select[4].focus()
		);
		await page.keyboard.type('10');

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

	it('Check responsive FontSize', async () => {
		const accordionPanel = await openSidebar(page, 'typography');
		const input = await accordionPanel.$$(
			'.maxi-typography-control .maxi-typography-control__text-options-tabs .maxi-typography-control__size input'
		);

		await input[0].focus();
		await pressKeyTimes('Backspace', '1');
		await page.keyboard.type('9');

		const sizeNumber = await accordionPanel.$$eval(
			'.maxi-typography-control .maxi-typography-control__text-options-tabs .maxi-typography-control__size input',
			sizeInput => sizeInput[0].value
		);

		expect(sizeNumber).toStrictEqual('19');

		// s
		await changeResponsive(page, 's');
		const inputS = await accordionPanel.$$(
			'.maxi-typography-control .maxi-typography-control__text-options-tabs .maxi-typography-control__size input'
		);

		await inputS[0].focus();
		await pressKeyTimes('Backspace', '1');
		await page.keyboard.type('1');

		const sizeSNumber = await accordionPanel.$$eval(
			'.maxi-typography-control .maxi-typography-control__text-options-tabs .maxi-typography-control__size input',
			sizeInput => sizeInput[0].value
		);
		expect(sizeSNumber).toStrictEqual('11');

		const attributes = await getBlockAttributes();
		const size = attributes['font-size-s'];

		expect(size).toStrictEqual(11);

		// xs
		await changeResponsive(page, 'xs');
		const sizeXsNumber = await accordionPanel.$$eval(
			'.maxi-typography-control .maxi-typography-control__text-options-tabs .maxi-typography-control__size input',
			sizeInput => sizeInput[0].value
		);

		expect(sizeXsNumber).toStrictEqual('11');

		// m
		await changeResponsive(page, 'm');
		const sizeMNumber = await accordionPanel.$$eval(
			'.maxi-typography-control .maxi-typography-control__text-options-tabs .maxi-typography-control__size input',
			sizeInput => sizeInput[0].value
		);

		expect(sizeMNumber).toStrictEqual('19');
	});

	it('Check responsive font-size-unit', async () => {
		const accordionPanel = await openSidebar(page, 'typography');
		const selector = await accordionPanel.$(
			'.maxi-typography-control .maxi-tabs-content .maxi-typography-control__size select'
		);

		await selector.select('em');

		const fontSizeUnit = await accordionPanel.$eval(
			'.maxi-typography-control .maxi-tabs-content .maxi-typography-control__size select',
			fontSizeSelector => fontSizeSelector.selectedIndex
		);

		expect(fontSizeUnit).toStrictEqual(1);

		// s
		await changeResponsive(page, 's');
		const selectorS = await accordionPanel.$(
			'.maxi-typography-control .maxi-tabs-content .maxi-typography-control__size select'
		);

		await selectorS.select('%');

		const weightSNumber = await accordionPanel.$eval(
			'.maxi-typography-control .maxi-tabs-content .maxi-typography-control__size select',
			fontSizeSelector => fontSizeSelector.selectedIndex
		);

		expect(weightSNumber).toStrictEqual(3);

		const attributes = await getBlockAttributes();
		const fontUnit = attributes['font-size-unit-s'];

		expect(fontUnit).toStrictEqual('%');

		// xs
		await changeResponsive(page, 'xs');
		const weightXsNumber = await accordionPanel.$eval(
			'.maxi-typography-control .maxi-tabs-content .maxi-typography-control__size select',
			fontSizeSelector => fontSizeSelector.selectedIndex
		);

		expect(weightXsNumber).toStrictEqual(3);

		// m
		await changeResponsive(page, 'm');
		const weightMNumber = await accordionPanel.$eval(
			'.maxi-typography-control .maxi-tabs-content .maxi-typography-control__size select',
			fontSizeSelector => fontSizeSelector.selectedIndex
		);

		expect(weightMNumber).toStrictEqual(1);
	});
	it('Check responsive line-height', async () => {
		const accordionPanel = await openSidebar(page, 'typography');
		const input = await accordionPanel.$$(
			'.maxi-typography-control .maxi-typography-control__text-options-tabs .maxi-typography-control__line-height input'
		);

		await input[0].focus();
		await page.keyboard.type('5');

		const heightNumber = await accordionPanel.$$eval(
			'.maxi-typography-control .maxi-typography-control__text-options-tabs .maxi-typography-control__line-height input',
			heightInput => heightInput[0].value
		);

		expect(heightNumber).toStrictEqual('45');

		// s
		await changeResponsive(page, 's');
		const inputS = await accordionPanel.$$(
			'.maxi-typography-control .maxi-typography-control__text-options-tabs .maxi-typography-control__line-height input'
		);

		await inputS[0].focus();
		await pressKeyTimes('Backspace', '1');
		await page.keyboard.type('3');

		const heightSNumber = await accordionPanel.$$eval(
			'.maxi-typography-control .maxi-typography-control__text-options-tabs .maxi-typography-control__line-height input',
			heightInput => heightInput[0].value
		);

		expect(heightSNumber).toStrictEqual('43');

		const attributes = await getBlockAttributes();
		const height = attributes['line-height-s'];

		expect(height).toStrictEqual(43);

		// xs
		await changeResponsive(page, 'xs');
		const heightXsNumber = await accordionPanel.$$eval(
			'.maxi-typography-control .maxi-typography-control__text-options-tabs .maxi-typography-control__line-height input',
			heightInput => heightInput[0].value
		);

		expect(heightXsNumber).toStrictEqual('43');

		// m
		await changeResponsive(page, 'm');
		const heightMNumber = await accordionPanel.$$eval(
			'.maxi-typography-control .maxi-typography-control__text-options-tabs .maxi-typography-control__line-height input',
			heightInput => heightInput[0].value
		);

		expect(heightMNumber).toStrictEqual('45');
	});

	it('Check responsive line-height-unit', async () => {
		const accordionPanel = await openSidebar(page, 'typography');
		const selector = await accordionPanel.$(
			'.maxi-typography-control .maxi-typography-control__line-height select'
		);

		await selector.select('em');

		const heightNumber = await accordionPanel.$eval(
			'.maxi-typography-control .maxi-typography-control__line-height select',
			heightSelector => heightSelector.selectedIndex
		);

		expect(heightNumber).toStrictEqual(1);

		// s
		await changeResponsive(page, 's');
		const selectorS = await accordionPanel.$(
			'.maxi-typography-control .maxi-typography-control__line-height select'
		);

		await selectorS.select('%');

		const heightSNumber = await accordionPanel.$eval(
			'.maxi-typography-control .maxi-typography-control__line-height select',
			heightSelector => heightSelector.selectedIndex
		);

		expect(heightSNumber).toStrictEqual(3);

		const attributes = await getBlockAttributes();
		const fontUnit = attributes['line-height-unit-s'];

		expect(fontUnit).toStrictEqual('%');

		// xs
		await changeResponsive(page, 'xs');
		const heightXsNumber = await accordionPanel.$eval(
			'.maxi-typography-control .maxi-tabs-content .maxi-typography-control__line-height select',
			heightInput => heightInput.selectedIndex
		);

		expect(heightXsNumber).toStrictEqual(3);

		// m
		await changeResponsive(page, 'm');
		const heightMNumber = await accordionPanel.$eval(
			'.maxi-typography-control .maxi-tabs-content .maxi-typography-control__line-height select',
			heightInput => heightInput.selectedIndex
		);

		expect(heightMNumber).toStrictEqual(1);
	});

	it('Check responsive letter-spacing', async () => {
		const accordionPanel = await openSidebar(page, 'typography');

		const input = await accordionPanel.$$(
			'.maxi-typography-control .maxi-typography-control__text-options-tabs .maxi-typography-control__letter-spacing input'
		);

		await input[0].focus();
		await pressKeyTimes('Backspace', '2');
		await page.keyboard.type('2');

		const heightNumber = await accordionPanel.$$eval(
			'.maxi-typography-control .maxi-typography-control__text-options-tabs .maxi-typography-control__letter-spacing input',
			heightInput => heightInput[0].value
		);

		expect(heightNumber).toStrictEqual('2');

		// s
		await changeResponsive(page, 's');

		const inputS = await accordionPanel.$$(
			'.maxi-typography-control .maxi-typography-control__text-options-tabs .maxi-typography-control__letter-spacing input'
		);

		await inputS[0].focus();
		await page.keyboard.type('3');

		const heightSNumber = await accordionPanel.$$eval(
			'.maxi-typography-control .maxi-typography-control__text-options-tabs .maxi-typography-control__letter-spacing input',
			heightInput => heightInput[0].value
		);
		expect(heightSNumber).toStrictEqual('23');

		const attributes = await getBlockAttributes();
		const height = attributes['letter-spacing-s'];

		expect(height).toStrictEqual(23);

		// xs
		await changeResponsive(page, 'xs');

		const heightXsNumber = await accordionPanel.$$eval(
			'.maxi-typography-control .maxi-typography-control__text-options-tabs .maxi-typography-control__letter-spacing input',
			heightInput => heightInput[0].value
		);
		expect(heightXsNumber).toStrictEqual('23');

		// m
		await changeResponsive(page, 'm');

		const heightMNumber = await accordionPanel.$$eval(
			'.maxi-typography-control .maxi-typography-control__text-options-tabs .maxi-typography-control__letter-spacing input',
			heightInput => heightInput[0].value
		);
		expect(heightMNumber).toStrictEqual('2');
	});

	it('Check responsive letter-spacing-unit', async () => {
		await insertBlock('Text Maxi');
		const accordionPanel = await openSidebar(page, 'typography');

		const selector = await accordionPanel.$(
			'.maxi-typography-control .maxi-tabs-content .maxi-typography-control__letter-spacing select'
		);

		await selector.select('em');

		const letterSpaceNumber = await accordionPanel.$eval(
			'.maxi-typography-control .maxi-tabs-content .maxi-typography-control__letter-spacing select',
			letterSpaceSelector => letterSpaceSelector.selectedIndex
		);
		expect(letterSpaceNumber).toStrictEqual(1);

		// s
		await changeResponsive(page, 's');
		const selectorS = await accordionPanel.$(
			'.maxi-typography-control .maxi-tabs-content .maxi-typography-control__letter-spacing select'
		);
		await selectorS.select('vw');

		const letterSpaceSNumber = await accordionPanel.$eval(
			'.maxi-typography-control .maxi-tabs-content .maxi-typography-control__letter-spacing select',
			letterSpaceSelector => letterSpaceSelector.selectedIndex
		);
		expect(letterSpaceSNumber).toStrictEqual(2);

		const attributes = await getBlockAttributes();
		const fontUnit = attributes['letter-spacing-unit-s'];

		expect(fontUnit).toStrictEqual('vw');

		// xs
		await changeResponsive(page, 'xs');

		const letterSpaceXsNumber = await accordionPanel.$eval(
			'.maxi-typography-control .maxi-tabs-content .maxi-typography-control__letter-spacing select',
			letterSpaceSelector => letterSpaceSelector.selectedIndex
		);
		expect(letterSpaceXsNumber).toStrictEqual(2);

		// m
		await changeResponsive(page, 'm');

		const letterSpaceMNumber = await accordionPanel.$eval(
			'.maxi-typography-control .maxi-tabs-content .maxi-typography-control__letter-spacing select',
			letterSpaceSelector => letterSpaceSelector.selectedIndex
		);
		expect(letterSpaceMNumber).toStrictEqual(1);
	});
});
