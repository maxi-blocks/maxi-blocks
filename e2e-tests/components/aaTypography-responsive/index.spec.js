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
import { getBlockAttributes, changeResponsive, openSidebar } from '../../utils';

describe('OpacityControl', () => {
	it('Check responsive font-family', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing Text Maxi');
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

	it('Check responsive palette-opacity', async () => {
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

	it('Check responsive palette-color', async () => {
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
		await changeResponsive(page, 'xs');
		const paletteColorMStatus = await accordionPanel.$$eval(
			'.maxi-tabs-content .maxi-sc-color-palette__custom .maxi-radio-control__option input',
			select => select[1].checked
		);

		expect(paletteColorMStatus).toStrictEqual(true);
	});

	/*it('Check responsive color-general', async () => {
		debugger;
		await changeResponsive(page, 'base');
		const accordionPanel = await openSidebar(page, 'typography');

		await accordionPanel.$$eval(
			'.maxi-typography-control .maxi-sc-color-palette__custom .maxi-base-control__field input',
			button => button[0].click()
		);

		const attributes = await getBlockAttributes();
		const colorStatus = attributes['color-general'];

		expect(colorStatus).toStrictEqual('rgba(155,155,155,1)');

		// s
		await changeResponsive(page, 's');

		const colorInput = await accordionPanel.$(
			'.maxi-typography-control .maxi-typography-control__color .maxi-typography-control__color input'
		);

		await colorInput.focus();
		await pressKeyTimes('Backspace', '6');
		await page.keyboard.type('298c29');

		const inputValue = await accordionPanel.$eval(
			'.maxi-typography-control .maxi-typography-control__color .maxi-typography-control__color input',
			input => input.value
		);

		expect(inputValue).toStrictEqual('#298C29');

		const attributesS = await getBlockAttributes();
		const colorStatusS = attributesS['color-s'];

		expect(colorStatusS).toStrictEqual(false);*/

		// xs
		/* await changeResponsive(page, 'xs');
		const paletteColorXsStatus = await accordionPanel.$$eval(
			'.maxi-tabs-content .maxi-sc-color-palette__custom .maxi-radio-control__option input',
			select => select[0].checked
		);

		expect(paletteColorXsStatus).toStrictEqual(false);

		// m
		await changeResponsive(page, 'xs');
		const paletteColorMStatus = await accordionPanel.$$eval(
			'.maxi-tabs-content .maxi-sc-color-palette__custom .maxi-radio-control__option input',
			select => select[1].checked
		);

		expect(paletteColorMStatus).toStrictEqual(true); */
	});

	/// ////////////////////////////////////////////////////////////////////////////////////
	it('Check responsive font-size', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing Text Maxi');
		const accordionPanel = await openSidebar(page, 'typography');

		const input = await accordionPanel.$$(
			'.maxi-typography-control .maxi-typography-control__text-options-tabs .maxi-typography-control__size input'
		);

		await input[0].focus();
		await page.waitForTimeout(100);
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

		await page.waitForTimeout(100);
		await inputS[0].focus();
		await page.waitForTimeout(100);
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
		await page.waitForTimeout(100);
		await selector.select('em');

		const fontSizeUnit = await accordionPanel.$eval(
			'.maxi-typography-control .maxi-tabs-content .maxi-typography-control__size select',
			fontSizeSelector => fontSizeSelector.selectedIndex
		);

		expect(fontSizeUnit).toStrictEqual(1);

		// s
		await changeResponsive(page, 's');
		await page.waitForTimeout(100);
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
		await page.waitForTimeout(100);
		await pressKeyTimes('Backspace', '3');
		await page.keyboard.type('5');

		const heightNumber = await accordionPanel.$$eval(
			'.maxi-typography-control .maxi-typography-control__text-options-tabs .maxi-typography-control__line-height input',
			heightInput => heightInput[0].value
		);
		expect(heightNumber).toStrictEqual('25');
		// s
		await changeResponsive(page, 's');

		const inputS = await accordionPanel.$$(
			'.maxi-typography-control .maxi-typography-control__text-options-tabs .maxi-typography-control__line-height input'
		);

		await page.waitForTimeout(100);
		await inputS[0].focus();
		await page.waitForTimeout(100);
		await pressKeyTimes('Backspace', '1');
		await page.keyboard.type('3');

		const heightSNumber = await accordionPanel.$$eval(
			'.maxi-typography-control .maxi-typography-control__text-options-tabs .maxi-typography-control__line-height input',
			heightInput => heightInput[0].value
		);
		expect(heightSNumber).toStrictEqual('23');

		const attributes = await getBlockAttributes();
		const height = attributes['line-height-s'];

		expect(height).toStrictEqual(23);

		// xs
		await changeResponsive(page, 'xs');

		const heightXsNumber = await accordionPanel.$$eval(
			'.maxi-typography-control .maxi-typography-control__text-options-tabs .maxi-typography-control__line-height input',
			heightInput => heightInput[0].value
		);
		expect(heightXsNumber).toStrictEqual('23');

		// m
		await changeResponsive(page, 'm');

		const heightMNumber = await accordionPanel.$$eval(
			'.maxi-typography-control .maxi-typography-control__text-options-tabs .maxi-typography-control__line-height input',
			heightInput => heightInput[0].value
		);
		expect(heightMNumber).toStrictEqual('25');
	});

	it('Check responsive line-height-unit', async () => {
		const accordionPanel = await openSidebar(page, 'typography');

		const selector = await accordionPanel.$(
			'.maxi-typography-control .maxi-typography-control__line-height select'
		);

		await page.waitForTimeout(100);
		await selector.select('em');
		await page.waitForTimeout(100);

		const heightNumber = await accordionPanel.$eval(
			'.maxi-typography-control .maxi-typography-control__line-height select',
			heightSelector => heightSelector.selectedIndex
		);

		expect(heightNumber).toStrictEqual(1);

		// s
		await changeResponsive(page, 's');
		await page.waitForTimeout(100);
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
		await page.waitForTimeout(100);
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

		await page.waitForTimeout(100);
		await inputS[0].focus();
		await page.waitForTimeout(100);
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

		await page.waitForTimeout(100);
		await selector.select('em');

		const letterSpaceNumber = await accordionPanel.$eval(
			'.maxi-typography-control .maxi-tabs-content .maxi-typography-control__letter-spacing select',
			letterSpaceSelector => letterSpaceSelector.selectedIndex
		);
		expect(letterSpaceNumber).toStrictEqual(1);

		// s
		await changeResponsive(page, 's');
		await page.waitForTimeout(100);
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
	/// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	it('Check responsive font-weight', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing Text Maxi');
		const accordionPanel = await openSidebar(page, 'typography');

		const selector = await accordionPanel.$(
			'.maxi-typography-control .maxi-typography-control__weight select'
		);

		await selector.select('300');
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
		expect(weightSNumber).toStrictEqual(3);

		const attributes = await getBlockAttributes();
		const fontUnit = attributes['font-weight-s'];

		expect(fontUnit).toStrictEqual('500');

		// xs
		await changeResponsive(page, 'xs');

		const weightXsNumber = await accordionPanel.$eval(
			'.maxi-typography-control .maxi-typography-control__weight select',
			weightSelector => weightSelector.selectedIndex
		);
		expect(weightXsNumber).toStrictEqual(3);

		// m
		await changeResponsive(page, 'm');

		const weightMNumber = await accordionPanel.$eval(
			'.maxi-typography-control .maxi-typography-control__weight select',
			weightSelector => weightSelector.selectedIndex
		);
		expect(weightMNumber).toStrictEqual(2);
	});
	/// //////////////////////////////////////////////////////////////////
	it('Check responsive font-weight', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing Text Maxi');
		const accordionPanel = await openSidebar(page, 'typography');

		const selector = await accordionPanel.$(
			'.maxi-typography-control .maxi-typography-control__weight select'
		);

		await selector.select('300');
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
		expect(weightSNumber).toStrictEqual(3);

		const attributes = await getBlockAttributes();
		const fontUnit = attributes['font-weight-s'];

		expect(fontUnit).toStrictEqual('500');

		// xs
		await changeResponsive(page, 'xs');

		const weightXsNumber = await accordionPanel.$eval(
			'.maxi-typography-control .maxi-typography-control__weight select',
			weightSelector => weightSelector.selectedIndex
		);
		expect(weightXsNumber).toStrictEqual(3);

		// m
		await changeResponsive(page, 'm');

		const weightMNumber = await accordionPanel.$eval(
			'.maxi-typography-control .maxi-typography-control__weight select',
			weightSelector => weightSelector.selectedIndex
		);
		expect(weightMNumber).toStrictEqual(2);
	});

	it('Check responsive transform', async () => {
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing Text Maxi');
		const accordionPanel = await openSidebar(page, 'typography');

		const selector = await accordionPanel.$(
			'.maxi-typography-control .maxi-typography-control__transform select'
		);

		await selector.select('capitalize');
		await page.waitForTimeout(100);

		const transformType = await accordionPanel.$eval(
			'.maxi-typography-control .maxi-typography-control__transform select',
			weightSelector => weightSelector.selectedIndex
		);
		expect(transformType).toStrictEqual(0);

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
		expect(weightMNumber).toStrictEqual(0);
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
		// await page.waitForTimeout(500);
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
	/// //////////////////////////////////////////////////////////////////////

	/* it('Check Responsive color', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing Text Maxi');
		const accordionPanel = await openSidebar(page, 'typography');

		await accordionPanel.$$eval(
			'.maxi-typography-control .maxi-color-palette--light .maxi-sc-color-palette__custom .maxi-radio-control__option label',
			select => select[0].click()
		);

		await page.$eval(
			'.maxi-typography-control .maxi-typography-control__color .maxi-color-control .maxi-color-control__color input',
			input => input.focus()
		);

		expect(heightMNumber).toStrictEqual('1.555');
	}); */

	/* it('Check Responsive palette-color-status', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing Text Maxi');
		const accordionPanel = await openSidebar(page, 'typography');

		const customColor = await accordionPanel.$$(
			'.maxi-tabs-content .maxi-sc-color-palette__custom .maxi-radio-control__option label'
		);

		// general
		await customColor[0].click();
		const customColorCheck = await accordionPanel.$$eval(
			'.maxi-tabs-content .maxi-sc-color-palette__custom .maxi-radio-control__option input',
			select => select[0].checked
		);

		expect(customColorCheck).toStrictEqual(false); // revise

		 // s
		debugger;
		await changeResponsive(page, 's');
		await page.waitForTimeout(100);
		await customColor[1].click();
		await page.waitForTimeout(100);
		const customSColorCheck = await accordionPanel.$$eval(
			'.maxi-tabs-content .maxi-sc-color-palette__custom .maxi-radio-control__option input',
			select => select[1].checked
		);

		expect(customSColorCheck).toBeTruthy();

		const attributes = await getBlockAttributes();
		const color = attributes['palette-color-status-s'];

		expect(color).toStrictEqual(true); 

		// xs
		await changeResponsive(page, 'xs');
		const customXsColorCheck = await accordionPanel.$$eval(
			'.maxi-tabs-content .maxi-sc-color-palette__custom .maxi-radio-control__option input',
			select => select[1].checked
		);

		expect(customXsColorCheck).toBeTruthy();

		// m
		await changeResponsive(page, 'm');
		const customMColorCheck = await accordionPanel.$$eval(
			'.maxi-tabs-content .maxi-sc-color-palette__custom .maxi-radio-control__option input',
			select => select[0].checked
		);

		expect(customMColorCheck).toStrictEqual(false); // revise 
	}); */
	/* it('Check responsive color-status', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing Text Maxi');
		debugger;
		const accordionPanel = await openSidebar(page, 'typography');

		const customColor = await accordionPanel.$$(
			'.maxi-tabs-content .maxi-sc-color-palette__custom .maxi-radio-control__option label'
		);

		await customColor[0].click();
		await page.$eval(
			'.maxi-typography-control__color .maxi-color-control__color input',
			input => input.focus()
		);
		await page.waitForTimeout(100);
		const customColorCheck = await page.$(
			'.maxi-typography-control .maxi-typography-control__color .maxi-color-control__color input'
		);
		const value = await customColorCheck.value;
		await page.waitForTimeout(100);

		expect(value).toStrictEqual('#9B9B9B');
	}); */
	/* it('Check responsive text-shadow', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing Text Maxi');
		const accordionPanel = await openSidebar(page, 'typography');
		await accordionPanel.$$eval(
			'.maxi-typography-control .maxi-typography-control__text-shadow .maxi-radio-control__option label',
			button => button[0].click()
		);

		const textShadowStyles = await accordionPanel.$$(
			'.maxi-typography-control .maxi-typography-control__text-shadow .maxi-default-styles-control .maxi-default-styles-control__button'
		);

		await textShadowStyles[1].click();

		const expectedClass = await accordionPanel.$eval(
			'.maxi-typography-control__text-shadow .maxi-default-styles-control .maxi-default-styles-control__button--active span',
			content => content.className
		);
		expect(expectedClass).toStrictEqual(
			'maxi-textshadow-control__default maxi-textshadow-control__default__total'
		);

		// s
		await changeResponsive(page, 's');

		const textShadowStylesS = await accordionPanel.$$(
			'.maxi-typography-control .maxi-typography-control__text-shadow .maxi-default-styles-control .maxi-default-styles-control__button'
		);

		await textShadowStylesS[2].click();

		const expectedSClass = await accordionPanel.$eval(
			'.maxi-typography-control__text-shadow .maxi-default-styles-control .maxi-default-styles-control__button--active span',
			content => content.className
		);

		expect(expectedSClass).toStrictEqual(
			'maxi-textshadow-control__default maxi-textshadow-control__default__bottom'
		);

		const attributes = await getBlockAttributes();
		const decoration = attributes['text-shadow-s'];

		expect(decoration).toStrictEqual('5px 0px 3px #a2a2a2');

		debugger;
		// xs
		await changeResponsive(page, 'xs');

		const expectedXsClass = await accordionPanel.$eval(
			'.maxi-typography-control__text-shadow .maxi-default-styles-control .maxi-default-styles-control__button--active span',
			content => content.className
		);

		expect(expectedXsClass).toStrictEqual(
			'maxi-textshadow-control__default maxi-textshadow-control__default__bottom'
		);

		// m
		 await changeResponsive(page, 'm');

		const expectedMClass = await accordionPanel.$eval(
			'.maxi-typography-control__text-shadow .maxi-default-styles-control .maxi-default-styles-control__button--active span',
			content => content.className
		);

		expect(expectedMClass).toStrictEqual(
			'maxi-textshadow-control__default maxi-textshadow-control__default__total'
		); 
	}); */
});
