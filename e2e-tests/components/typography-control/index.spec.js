/* eslint-disable no-await-in-loop */
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
	getAttributes,
	openSidebarTab,
	changeResponsive,
	editColorControl,
	addTypographyOptions,
	addTypographyStyle,
	addResponsiveTest,
	getBlockStyle,
	insertMaxiBlock,
	updateAllBlockUniqueIds,
} from '../../utils';

describe('TypographyControl', () => {
	beforeAll(async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Text Maxi');
		await updateAllBlockUniqueIds(page);
		await page.keyboard.type('Testing Text Maxi', { delay: 100 });
	});

	it('Checking the font family', async () => {
		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'typography'
		);

		// fontFamily
		const fontFamilySelector = await accordionPanel.$(
			'.maxi-typography-control .maxi-typography-control__font-family'
		);
		await fontFamilySelector.click();
		await page.keyboard.type('Montserrat', { delay: 350 });
		await page.keyboard.press('Enter');

		expect(await getAttributes('font-family-xl')).toStrictEqual(
			'Montserrat'
		);
	});

	it('Checking the responsive font family', async () => {
		let accordionPanel = await openSidebarTab(page, 'style', 'typography');

		const typographyInput = await page.$$eval(
			'.maxi-typography-control__font-family div div div',
			fontValue => fontValue[0].innerHTML
		);
		await page.waitForTimeout(200);

		expect(typographyInput).toStrictEqual('Montserrat');

		// s
		await changeResponsive(page, 's');
		accordionPanel = await openSidebarTab(page, 'style', 'typography');

		await accordionPanel.$eval(
			'.maxi-typography-control .maxi-typography-control__font-family input',
			input => input.focus()
		);
		await pressKeyTimes('Backspace', '4');
		await page.keyboard.type('Arial', { delay: 350 });
		await page.keyboard.press('Enter');

		const typographyInputS = await accordionPanel.$$eval(
			'.maxi-typography-control__font-family div div div',
			fontValue => fontValue[0].innerHTML
		);
		expect(typographyInputS).toStrictEqual('Arial');

		expect(await getAttributes('font-family-s')).toStrictEqual('Arial');

		// xs
		await changeResponsive(page, 'xs');
		await openSidebarTab(page, 'style', 'typography');

		const typographyInputXs = await accordionPanel.$$eval(
			'.maxi-typography-control__font-family div div div',
			fontValue => fontValue[0].innerHTML
		);

		expect(typographyInputXs).toStrictEqual('Arial');

		// m
		await changeResponsive(page, 'm');
		await openSidebarTab(page, 'style', 'typography');

		const typographyInputM = await accordionPanel.$$eval(
			'.maxi-typography-control__font-family div div div',
			fontValue => fontValue[0].innerHTML
		);

		expect(typographyInputM).toStrictEqual('Montserrat');
	});

	it('Checking the font color', async () => {
		await changeResponsive(page, 'base');
		await openSidebarTab(page, 'style', 'typography');

		await editColorControl({
			page,
			instance: await page.$('.maxi-typography-control__color'),
			paletteStatus: false,
			customColor: '#FAFA03',
		});

		await page.waitForTimeout(500);

		expect(await getAttributes('color-xl')).toStrictEqual('rgb(250,250,3)');

		// Check responsive palette opacity
		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'typography'
		);

		await accordionPanel.$$eval(
			'.maxi-color-control .maxi-toggle-switch .maxi-base-control__label',
			select => select[0].click()
		);

		await page.waitForTimeout(300);
	});

	it('Check responsive palette color', async () => {
		await changeResponsive(page, 'base');
		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'typography'
		);

		expect(await getAttributes('palette-status-xl')).toStrictEqual(true);

		// s
		await changeResponsive(page, 's');

		await accordionPanel.$eval(
			'.maxi-color-control .maxi-toggle-switch .maxi-base-control__label',
			select => select.click()
		);

		await page.waitForTimeout(200);

		expect(await getAttributes('palette-status-s')).toStrictEqual(false);

		// xs
		await changeResponsive(page, 'xs');

		await accordionPanel.$eval(
			'.maxi-color-control .maxi-toggle-switch .maxi-base-control__label',
			select => select.click()
		);

		await page.waitForTimeout(200);

		expect(await getAttributes('palette-status-s')).toStrictEqual(false);

		// m
		await changeResponsive(page, 'm');
		await accordionPanel.$eval(
			'.maxi-color-control .maxi-toggle-switch .maxi-base-control__label',
			select => select.click()
		);

		await page.waitForTimeout(200);

		expect(await getAttributes('palette-status-s')).toStrictEqual(
			undefined
		);
	});

	it('Checking the Weight, Transform, Style, Decoration and Orientation', async () => {
		await changeResponsive(page, 'base');
		await openSidebarTab(page, 'style', 'typography');

		await addTypographyStyle({
			instance: page,
			decoration: 'overline',
			weight: '300',
			transform: 'capitalize',
			style: 'italic',
			orientation: 'mixed',
			direction: 'ltr',
			indent: '44',
			whiteSpace: 'pre',
			wordSpacing: '20',
			bottomGap: '15',
		});

		await page.waitForTimeout(200);

		const typographyResult = await getAttributes([
			'font-style-xl',
			'font-weight-xl',
			'text-decoration-xl',
			'text-transform-xl',
			'text-orientation-xl',
			'text-direction-xl',
			'text-indent-xl',
			'white-space-xl',
			'word-spacing-xl',
			'bottom-gap-xl',
		]);

		const expectedAttributesTwo = {
			'font-style-xl': 'italic',
			'font-weight-xl': '300',
			'text-decoration-xl': 'overline',
			'text-transform-xl': 'capitalize',
			'text-orientation-xl': 'mixed',
			'text-direction-xl': 'ltr',
			'text-indent-xl': 44,
			'white-space-xl': 'pre',
			'word-spacing-xl': 20,
			'bottom-gap-xl': 15,
		};

		expect(typographyResult).toStrictEqual(expectedAttributesTwo);

		// check responsive font-weight
		const responsiveFontWeight = await addResponsiveTest({
			page,
			instance:
				'.maxi-typography-control .maxi-typography-control__weight select',
			selectInstance:
				'.maxi-typography-control .maxi-typography-control__weight select',
			needSelectIndex: true,
			baseExpect: '300',
			xsExpect: '500',
			newValue: '500',
		});
		await page.waitForTimeout(200);

		expect(responsiveFontWeight).toBeTruthy();

		// check responsive transform
		const responsiveTextTransform = await addResponsiveTest({
			page,
			instance:
				'.maxi-typography-control .maxi-typography-control__transform select',
			selectInstance:
				'.maxi-typography-control .maxi-typography-control__transform select',
			needSelectIndex: true,
			baseExpect: 'capitalize',
			xsExpect: 'uppercase',
			newValue: 'uppercase',
		});
		await page.waitForTimeout(200);

		expect(responsiveTextTransform).toBeTruthy();

		// check responsive font-style
		const responsiveFontStyle = await addResponsiveTest({
			page,
			instance:
				'.maxi-typography-control .maxi-typography-control__font-style select',
			selectInstance:
				'.maxi-typography-control .maxi-typography-control__font-style select',
			needSelectIndex: true,
			baseExpect: 'italic',
			xsExpect: 'oblique',
			newValue: 'oblique',
		});
		await page.waitForTimeout(200);

		expect(responsiveFontStyle).toBeTruthy();

		// check responsive text-decoration
		const responsiveTextDecoration = await addResponsiveTest({
			page,
			instance:
				'.maxi-typography-control .maxi-typography-control__decoration select',
			selectInstance:
				'.maxi-typography-control .maxi-typography-control__decoration select',
			needSelectIndex: true,
			baseExpect: 'overline',
			xsExpect: 'underline',
			newValue: 'underline',
		});
		await page.waitForTimeout(200);

		expect(responsiveTextDecoration).toBeTruthy();

		// check responsive text-indent
		const responsiveTextIndent = await addResponsiveTest({
			page,
			instance:
				'.maxi-typography-control .maxi-typography-control__text-indent .maxi-advanced-number-control__value',
			needFocus: true,
			baseExpect: '44',
			xsExpect: '88',
			newValue: '88',
		});
		await page.waitForTimeout(200);

		expect(responsiveTextIndent).toBeTruthy();

		// check responsive white-space
		const responsiveWhiteSpace = await addResponsiveTest({
			page,
			instance:
				'.maxi-typography-control .maxi-typography-control__white-space select',
			selectInstance:
				'.maxi-typography-control .maxi-typography-control__white-space select',
			needSelectIndex: true,
			baseExpect: 'pre',
			xsExpect: 'pre-wrap',
			newValue: 'pre-wrap',
		});
		await page.waitForTimeout(200);

		expect(responsiveWhiteSpace).toBeTruthy();

		// check responsive word-spacing
		const responsiveWordSpacing = await addResponsiveTest({
			page,
			instance:
				'.maxi-typography-control .maxi-typography-control__word-spacing .maxi-advanced-number-control__value',
			needFocus: true,
			baseExpect: '20',
			xsExpect: '40',
			newValue: '40',
		});
		await page.waitForTimeout(200);

		expect(responsiveWordSpacing).toBeTruthy();

		// check responsive bottom-gap
		const responsiveBottomGap = await addResponsiveTest({
			page,
			instance:
				'.maxi-typography-control .maxi-typography-control__bottom-gap .maxi-advanced-number-control__value',
			needFocus: true,
			baseExpect: '15',
			xsExpect: '30',
			newValue: '30',
		});
		await page.waitForTimeout(200);

		expect(responsiveBottomGap).toBeTruthy();

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Check showed value on TypographyControl on custom format', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Text Maxi');
		await updateAllBlockUniqueIds(page);
		await page.keyboard.type('Testing Text Maxi');

		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');
		await pressKeyWithModifier('shift', 'ArrowLeft');

		const accordion = await openSidebarTab(page, 'style', 'typography');

		await accordion.$$eval('.maxi-typography-control__size input', select =>
			select[0].focus()
		);
		await pressKeyWithModifier('ctrl', 'a');
		await page.keyboard.type('50');
		await page.waitForTimeout(350);

		let result = await accordion.$eval(
			'.maxi-typography-control__size input',
			input => input.value
		);

		expect(result).toStrictEqual('50');

		await page.$eval('.maxi-text-block__content', block => block.focus());

		await pressKeyTimes('ArrowLeft', '4');

		await page.waitForTimeout(100);

		result = await accordion.$eval(
			'.maxi-typography-control__size input',
			input => input.placeholder
		);

		expect(result).toStrictEqual('16');
	});
});
