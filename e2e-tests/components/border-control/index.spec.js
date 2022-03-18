/* eslint-disable no-await-in-loop */
/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	pressKeyWithModifier,
} from '@wordpress/e2e-test-utils';
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
} from '../../utils';

describe('BorderControl', () => {
	it('Checking the border control', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
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
			'border-bottom-left-radius-general': 44,
			'border-bottom-right-radius-general': 96,
			'border-top-left-radius-general': 56,
			'border-top-right-radius-general': 15,
		};
		const marginResult = await getAttributes([
			'border-bottom-left-radius-general',
			'border-bottom-right-radius-general',
			'border-top-left-radius-general',
			'border-top-right-radius-general',
		]);

		expect(marginResult).toStrictEqual(expectMargin);
		await borderAccordion.$$(
			'.maxi-tabs-content .maxi-default-styles-control button'
		);

		const expectAttributes = [undefined, 'solid', 'dashed', 'dotted'];

		for (let i = 0; i < expectAttributes.length; i += 1) {
			await page.$$eval(
				'.maxi-border-control .maxi-default-styles-control button',
				(buttons, i) => buttons[i].click(),
				i
			);

			const attributes = await getBlockAttributes();
			const borderAttribute = attributes['border-style-general'];

			expect(borderAttribute).toStrictEqual(expectAttributes[i]);
		}

		const borderType = await borderAccordion.$(
			'.maxi-tabs-content .maxi-border-control__type .maxi-base-control__field select'
		);

		await borderType.select('groove');

		expect(await getAttributes('border-style-general')).toStrictEqual(
			'groove'
		);

		// color
		await editColorControl({
			page,
			instance: await page.$('.maxi-border-control'),
			paletteStatus: true,
			colorPalette: 4,
		});

		expect(
			await getAttributes('border-palette-color-general')
		).toStrictEqual(4);

		const selector = await borderAccordion.$(
			'.maxi-tabs-content .maxi-border-control .maxi-base-control__field select'
		);
		await selector.select('dotted');

		expect(await getAttributes('border-style-general')).toStrictEqual(
			'dotted'
		);

		// check responsive border
		const responsiveBorder = await addResponsiveTest({
			page,
			instance:
				'.maxi-tabs-content .maxi-border-control .maxi-base-control__field select',
			selectInstance:
				'.maxi-tabs-content .maxi-border-control .maxi-base-control__field select',
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
		await insertBlock('Text Maxi');
		const borderAccordion = await openSidebarTab(page, 'style', 'border');
		await borderAccordion.$$eval(
			'.maxi-tabs-content .maxi-default-styles-control button',
			buttons => buttons[1].click()
		);

		await borderAccordion.$$eval('.maxi-tabs-control__button', buttons =>
			buttons[1].click()
		);

		await page.$eval(
			'.maxi-border-status-hover.maxi-toggle-switch .maxi-base-control__label',
			use => use.click()
		);

		await borderAccordion.$$eval('.maxi-tabs-control__button', buttons =>
			buttons[0].click()
		);

		await borderAccordion.$$eval(
			'.maxi-tabs-content .maxi-default-styles-control button',
			buttons => buttons[0].click()
		);

		const expectBorder = {
			'border-color-general': undefined,
			'border-color-general-hover': undefined,
			'border-style-general': undefined,
			'border-style-general-hover': 'solid',
			'border-top-width-general': 2,
			'border-top-width-general-hover': 2,
			'border-right-width-general': 2,
			'border-right-width-general-hover': 2,
			'border-bottom-width-general': 2,
			'border-bottom-width-general-hover': 2,
			'border-left-width-general': 2,
			'border-left-width-general-hover': 2,
		};

		const borderResult = await getAttributes([
			'border-color-general',
			'border-color-general-hover',
			'border-style-general',
			'border-style-general-hover',
			'border-top-width-general',
			'border-top-width-general-hover',
			'border-right-width-general',
			'border-right-width-general-hover',
			'border-bottom-width-general',
			'border-bottom-width-general-hover',
			'border-left-width-general',
			'border-left-width-general-hover',
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

		expect(await getAttributes('border-left-width-general')).toStrictEqual(
			59
		);

		// check border radius
		await page.$eval(
			'.maxi-axis-control__content__item__border-radius input',
			input => input.focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('26');

		expect(
			await getAttributes('border-bottom-left-radius-general')
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
			'.maxi-axis-control__border .maxi-axis-control__unit-header button',
			button => button.click()
		);

		expect(await getAttributes('border-left-width-general')).toStrictEqual(
			2
		);

		await page.$$eval(
			'.maxi-axis-control__border .maxi-axis-control__unit-header button',
			button => button[1].click()
		);

		expect(
			await getAttributes('border-bottom-left-radius-general')
		).toStrictEqual(undefined);
	});
});
