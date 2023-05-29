/* eslint-disable no-await-in-loop */
/**
 * WordPress dependencies
 */
import { createNewPost, pressKeyWithModifier } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import {
	getBlockAttributes,
	openSidebarTab,
	getBlockStyle,
	editColorControl,
	getAttributes,
	editAxisControl,
	addResponsiveTest,
	changeResponsive,
	insertMaxiBlock,
} from '../../utils';

describe('BorderControl', () => {
	it('Checking the border control', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Text Maxi');
		const borderAccordion = await openSidebarTab(page, 'style', 'border');

		const axisControlInstance = await borderAccordion.$(
			'.maxi-axis-control__border'
		);

		await editAxisControl({
			page,
			instance: axisControlInstance,
			syncOption: 'none',
			values: ['56', '15', '96', '44'],
			unit: '%',
		});

		const expectMargin = {
			'border-radius-bottom-left-g': 44,
			'border-radius-bottom-right-g': 96,
			'border-radius-top-left-g': 56,
			'border-radius-top-right-g': 15,
		};
		const marginResult = await getAttributes([
			'border-radius-bottom-left-g',
			'border-radius-bottom-right-g',
			'border-radius-top-left-g',
			'border-radius-top-right-g',
		]);

		expect(marginResult).toStrictEqual(expectMargin);
		await borderAccordion.$$('.maxi-default-styles-control button');

		const expectAttributes = ['none', 'solid', 'dashed', 'dotted'];

		for (let i = 0; i < expectAttributes.length; i += 1) {
			await page.$$eval(
				'.maxi-border-control .maxi-default-styles-control button',
				(buttons, i) => buttons[i].click(),
				i
			);

			const attributes = await getBlockAttributes();
			const borderAttribute = attributes['border-style-g'];

			expect(borderAttribute).toStrictEqual(expectAttributes[i]);
		}

		const borderType = await borderAccordion.$(
			'.maxi-border-control__type .maxi-base-control__field select'
		);

		await borderType.select('groove');

		expect(await getAttributes('border-style-g')).toStrictEqual('groove');

		// color
		await editColorControl({
			page,
			instance: await page.$('.maxi-border-control'),
			paletteStatus: true,
			colorPalette: 4,
		});

		expect(await getAttributes('border-palette-color-g')).toStrictEqual(4);

		const selector = await borderAccordion.$(
			'.maxi-border-control .maxi-base-control__field select'
		);
		await selector.select('dotted');

		expect(await getAttributes('border-style-g')).toStrictEqual('dotted');

		// check responsive border
		const responsiveBorder = await addResponsiveTest({
			page,
			instance: '.maxi-border-control .maxi-base-control__field select',
			selectInstance:
				'.maxi-border-control .maxi-base-control__field select',
			needSelectIndex: true,
			baseExpect: 'dotted',
			xsExpect: 'groove',
			newValue: 'groove',
		});
		expect(responsiveBorder).toBeTruthy();

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Check hover values kept after setting normal border to none', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Text Maxi');
		const borderAccordion = await openSidebarTab(page, 'style', 'border');
		await borderAccordion.$$eval(
			'.maxi-default-styles-control button',
			buttons => buttons[1].click()
		);

		await borderAccordion.$$eval(
			'.maxi-accordion-control__item__panel .maxi-tabs-control button',
			buttons => buttons[1].click()
		);

		await page.$eval('.maxi-border-status-hover input', use => use.click());

		await borderAccordion.$$eval(
			'.maxi-accordion-control__item__panel .maxi-tabs-control button',
			buttons => buttons[0].click()
		);

		await borderAccordion.$$eval(
			'.maxi-default-styles-control button',
			buttons => buttons[0].click()
		);

		const expectBorder = {
			'border-width-bottom-g': 2,
			'border-width-bottom-g-hover': undefined,
			'border-color-g': undefined,
			'border-color-g-hover': undefined,
			'border-width-left-g': 2,
			'border-width-left-g-hover': undefined,
			'border-width-right-g': 2,
			'border-width-right-g-hover': undefined,
			'border-style-g': 'none',
			'border-style-g-hover': undefined,
			'border-width-top-g': 2,
			'border-width-top-g-hover': undefined,
		};

		const borderResult = await getAttributes([
			'border-color-g',
			'border-color-g-hover',
			'border-style-g',
			'border-style-g-hover',
			'border-width-top-g',
			'border-width-top-g-hover',
			'border-width-right-g',
			'border-width-right-g-hover',
			'border-width-bottom-g',
			'border-width-bottom-g-hover',
			'border-width-left-g',
			'border-width-left-g-hover',
		]);

		expect(borderResult).toStrictEqual(expectBorder);

		expect(await getBlockStyle(page)).toMatchSnapshot();

		// check that the values when changing the styles
		await page.$$eval(
			'.maxi-settingstab-control .maxi-border-control .maxi-default-styles-control button',
			button => button[1].click()
		);

		await page.$eval(
			'.maxi-axis-control__content__item__border-width input',
			input => input.focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('59');

		expect(await getAttributes('border-width-left-g')).toStrictEqual(59);

		// check border radius
		await page.$eval(
			'.maxi-axis-control__content__item__border-radius input',
			input => input.focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('26');

		expect(
			await getAttributes('border-radius-bottom-left-g')
		).toStrictEqual(26);

		// change style
		await page.$$eval(
			'.maxi-settingstab-control .maxi-border-control .maxi-default-styles-control button',
			button => button[2].click()
		);

		// same value
		const borderWidth = await page.$eval(
			'.maxi-axis-control__content__item__border-width input',
			input => input.value
		);
		expect(borderWidth).toStrictEqual('59');

		// check border radius
		const borderRadius = await page.$eval(
			'.maxi-axis-control__content__item__border-radius input',
			input => input.value
		);

		expect(borderRadius).toStrictEqual('26');

		// reset button
		await page.$eval(
			'.maxi-axis-control__border .maxi-axis-control__content__item__border-width .maxi-reset-button',
			button => button.click()
		);

		expect(await getAttributes('border-width-left-g')).toStrictEqual(2);

		await page.$eval(
			'.maxi-axis-control__border .maxi-axis-control__content__item__border-radius .maxi-reset-button',
			button => button.click()
		);

		expect(
			await getAttributes('border-radius-bottom-left-g')
		).toStrictEqual(undefined);
	});

	it('Checking the responsive border control', async () => {
		const borderAccordion = await openSidebarTab(page, 'style', 'border');

		// base
		await borderAccordion.$$eval(
			'.maxi-default-styles-control button',
			buttons => buttons[1].click()
		);

		expect(await getAttributes('border-style-g')).toStrictEqual('solid');

		// s
		await changeResponsive(page, 's');
		await borderAccordion.$$eval(
			'.maxi-default-styles-control button',
			buttons => buttons[2].click()
		);

		expect(await getAttributes('border-style-s')).toStrictEqual('dashed');

		// xs
		await changeResponsive(page, 'xs');

		const borderXsStyle = await page.$eval(
			'.maxi-border-control .maxi-border-control__type select',
			select => select.value
		);

		expect(borderXsStyle).toStrictEqual('dashed');

		// m
		await changeResponsive(page, 'm');

		const borderMStyle = await page.$eval(
			'.maxi-border-control .maxi-border-control__type select',
			select => select.value
		);

		expect(borderMStyle).toStrictEqual('solid');
	});

	it('Checking the responsive delete border', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Text Maxi');
		const borderAccordion = await openSidebarTab(page, 'style', 'border');

		// base
		await borderAccordion.$$eval(
			'.maxi-default-styles-control button',
			buttons => buttons[1].click()
		);

		expect(await getAttributes('border-style-g')).toStrictEqual('solid');

		// s
		await changeResponsive(page, 's');
		await borderAccordion.$$eval(
			'.maxi-default-styles-control button',
			buttons => buttons[0].click()
		);

		expect(await getAttributes('border-style-s')).toStrictEqual('none');

		// xs
		await changeResponsive(page, 'xs');

		const borderXsStyle = await page.$eval(
			'.maxi-border-control .maxi-border-control__type select',
			select => select.value
		);

		expect(borderXsStyle).toStrictEqual('none');

		// m
		await changeResponsive(page, 'm');

		const borderMStyle = await page.$eval(
			'.maxi-border-control .maxi-border-control__type select',
			select => select.value
		);

		expect(borderMStyle).toStrictEqual('solid');
	});
});
