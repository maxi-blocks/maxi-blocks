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
import {
	getAttributes,
	openSidebarTab,
	changeResponsive,
	editColorControl,
	addTypographyOptions,
	addTypographyStyle,
	addResponsiveTest,
	getBlockStyle,
} from '../../utils';

describe('TypographyControl', () => {
	beforeAll(async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
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
		await page.keyboard.type('Montserrat');
		await page.keyboard.press('Enter');

		expect(await getAttributes('font-family-general')).toStrictEqual(
			'Montserrat'
		);
	});

	it('Checking the responsive font family', async () => {
		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'typography'
		);
		const input = await page.$(
			'.maxi-typography-control .maxi-typography-control__font-family input'
		);

		const typographyInput = await page.$$eval(
			'.maxi-typography-control__font-family div div div',
			fontValue => fontValue[0].innerHTML
		);
		await page.waitForTimeout(200);

		expect(typographyInput).toStrictEqual('Montserrat');

		// s
		await changeResponsive(page, 's');
		await openSidebarTab(page, 'style', 'typography');

		await input.focus();
		await pressKeyTimes('Backspace', '4');
		await page.keyboard.type('Arial');
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

		expect(await getAttributes('color-general')).toStrictEqual(
			'rgb(250,250,3)'
		);

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
	});

	it('Check responsive palette color', async () => {
		await changeResponsive(page, 'base');
		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'typography'
		);

		expect(await getAttributes('palette-status-general')).toStrictEqual(
			true
		);

		// s
		await changeResponsive(page, 's');

		await accordionPanel.$eval(
			'.maxi-color-control .maxi-toggle-switch .maxi-base-control__label',
			select => select.click()
		);

		expect(await getAttributes('palette-status-s')).toStrictEqual(false);

		// xs
		await changeResponsive(page, 'xs');

		await accordionPanel.$eval(
			'.maxi-color-control .maxi-toggle-switch .maxi-base-control__label',
			select => select.click()
		);

		expect(await getAttributes('palette-status-s')).toStrictEqual(false);

		// m
		await changeResponsive(page, 'm');
		await accordionPanel.$eval(
			'.maxi-color-control .maxi-toggle-switch .maxi-base-control__label',
			select => select.click()
		);

		expect(await getAttributes('palette-status-s')).toStrictEqual(false);
	});

	it('Checking the Weight, Transform, Style and Decoration', async () => {
		await changeResponsive(page, 'base');
		await openSidebarTab(page, 'style', 'typography');

		await addTypographyStyle({
			page,
			decoration: 'overline',
			weight: '300',
			transform: 'capitalize',
			style: 'italic',
		});

		const typographyResult = await getAttributes([
			'font-style-general',
			'font-weight-general',
			'text-decoration-general',
			'text-transform-general',
		]);

		const expectedAttributesTwo = {
			'font-style-general': 'italic',
			'font-weight-general': '300',
			'text-decoration-general': 'overline',
			'text-transform-general': 'capitalize',
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
		expect(responsiveTextDecoration).toBeTruthy();

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Check Size, line height and letter spacing', async () => {
		await changeResponsive(page, 'xl');
		await addTypographyOptions({
			page,
			instance: await openSidebarTab(page, 'style', 'typography'),
			size: '19',
			lineHeight: '22',
			letterSpacing: '10',
		});

		const attributeResult = await getAttributes([
			'line-height-xl',
			'letter-spacing-xl',
			'font-size-xl',
		]);

		const expectedAttributes = {
			'line-height-xl': 22,
			'letter-spacing-xl': 10,
			'font-size-xl': 19,
		};

		expect(attributeResult).toStrictEqual(expectedAttributes);

		// test size control
		const responsiveSizeControl = await addResponsiveTest({
			page,
			instance:
				'.maxi-typography-control .maxi-typography-control__text-options-tabs .maxi-typography-control__size input',
			needFocus: true,
			baseExpect: '19',
			xsExpect: '11',
			newValue: '11',
		});
		expect(responsiveSizeControl).toBeTruthy();

		// Check responsive font-size-unit
		const responsiveSizeUnit = await addResponsiveTest({
			page,
			instance:
				'.maxi-typography-control .maxi-tabs-content .maxi-typography-control__size select',
			selectInstance:
				'.maxi-typography-control .maxi-tabs-content .maxi-typography-control__size select',
			needSelectIndex: true,
			baseExpect: 'px',
			xsExpect: 'em',
			newValue: 'em',
		});
		expect(responsiveSizeUnit).toBeTruthy();

		// test line-height
		const accordion = await openSidebarTab(page, 'style', 'typography');
		const input = await accordion.$$(
			'.maxi-typography-control .maxi-typography-control__text-options-tabs .maxi-typography-control__line-height input'
		);

		await input[0].focus();

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('45');

		const responsiveLineHeight = await addResponsiveTest({
			page,
			instance:
				'.maxi-typography-control .maxi-typography-control__text-options-tabs .maxi-typography-control__line-height input',
			needFocus: true,
			baseExpect: '45',
			xsExpect: '43',
			newValue: '43',
		});
		expect(responsiveLineHeight).toBeTruthy();

		// letter spacing responsive
		const letterInput = await accordion.$$(
			'.maxi-typography-control .maxi-typography-control__text-options-tabs .maxi-typography-control__letter-spacing input'
		);

		await letterInput[0].focus();

		const responsiveLetterSpacing = await addResponsiveTest({
			page,
			instance:
				'.maxi-typography-control .maxi-typography-control__text-options-tabs .maxi-typography-control__letter-spacing input',
			needFocus: true,
			baseExpect: '10',
			xsExpect: '23',
			newValue: '23',
		});
		expect(responsiveLetterSpacing).toBeTruthy();

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
