/* eslint-disable no-await-in-loop */
/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import {
	changeResponsive,
	getBlockAttributes,
	openSidebar,
	getBlockStyle,
} from '../../utils';

describe('BorderControl', () => {
	it('Checking the border control', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		const borderAccordion = await openSidebar(page, 'border');
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
		const expectBorderType = 'groove';

		const attributes = await getBlockAttributes();
		const borderAttribute = attributes['border-style-general'];

		expect(borderAttribute).toStrictEqual(expectBorderType);

		// color
		await page.$$eval(
			'.maxi-border-control .maxi-base-control__field .maxi-sc-color-palette div',
			clickDiv => clickDiv[4].click()
		);

		const expectedColorResult = 5;

		const colorAttributes = await getBlockAttributes();
		const borderColor = colorAttributes['border-palette-color-general'];

		expect(borderColor).toStrictEqual(expectedColorResult);

		const selector = await borderAccordion.$(
			'.maxi-tabs-content .maxi-border-control .maxi-base-control__field select'
		);
		await selector.select('dotted');

		const expectResult = 'dotted';
		const borderAttributes = await getBlockAttributes();
		const style = borderAttributes['border-style-general'];

		expect(style).toStrictEqual(expectResult);
	});

	it('Check Responsive border control', async () => {
		// Dotted bottom enabled
		await changeResponsive(page, 's');
		await page.$eval('.maxi-text-block', block => block.focus());

		const dottedButton = await page.$eval(
			'.maxi-tabs-content .maxi-border-control__type .maxi-select-control__input',
			button => button.selectedOptions[0].innerHTML
		);

		expect(dottedButton).toStrictEqual('Dotted');

		// responsive S
		const accordionPanel = await openSidebar(page, 'border');
		await changeResponsive(page, 's');

		const selector = await accordionPanel.$(
			'.maxi-tabs-content .maxi-border-control .maxi-base-control__field select'
		);
		await selector.select('dashed');

		const responsiveSOption = await page.$eval(
			'.maxi-tabs-content .maxi-border-control__type .maxi-select-control__input',
			selectedStyle => selectedStyle.selectedOptions[0].innerHTML
		);

		expect(responsiveSOption).toStrictEqual('Dashed');

		// responsive XS
		await changeResponsive(page, 'xs');

		const responsiveXsOption = await page.$eval(
			'.maxi-tabs-content .maxi-border-control__type .maxi-select-control__input',
			selectedStyle => selectedStyle.selectedOptions[0].innerHTML
		);

		expect(responsiveXsOption).toStrictEqual('Dashed');

		// responsive M
		await changeResponsive(page, 'm');

		const responsiveMOption = await page.$eval(
			'.maxi-tabs-content .maxi-border-control__type .maxi-select-control__input',
			selectedStyle => selectedStyle.selectedOptions[0].innerHTML
		);

		expect(responsiveMOption).toStrictEqual('Dotted');
	});

	it('Check hover values kept after setting normal border to none', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		const borderAccordion = await openSidebar(page, 'border');
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

		const expectChanges = {
			'border-color-general': undefined,
			'border-color-general-hover': undefined,
			'border-style-general': undefined,
			'border-style-general-hover': 'solid',
			'border-top-width-general': undefined,
			'border-top-width-general-hover': 2,
			'border-right-width-general': undefined,
			'border-right-width-general-hover': 2,
			'border-bottom-width-general': undefined,
			'border-bottom-width-general-hover': 2,
			'border-left-width-general': undefined,
			'border-left-width-general-hover': 2,
		};

		const borderAttributes = await getBlockAttributes();

		const border = (({
			'border-color-general': borderColor,
			'border-color-general-hover': borderColorHover,
			'border-style-general': borderStyle,
			'border-style-general-hover': borderStyleHover,
			'border-top-width-general': borderTopWidth,
			'border-top-width-general-hover': borderTopWidthHover,
			'border-right-width-general': borderRightWidth,
			'border-right-width-general-hover': borderRightWidthHover,
			'border-bottom-width-general': borderBottomWidth,
			'border-bottom-width-general-hover': borderBottomWidthHover,
			'border-left-width-general': borderLeftWidth,
			'border-left-width-general-hover': borderLeftWidthHover,
		}) => ({
			'border-color-general': borderColor,
			'border-color-general-hover': borderColorHover,
			'border-style-general': borderStyle,
			'border-style-general-hover': borderStyleHover,
			'border-top-width-general': borderTopWidth,
			'border-top-width-general-hover': borderTopWidthHover,
			'border-right-width-general': borderRightWidth,
			'border-right-width-general-hover': borderRightWidthHover,
			'border-bottom-width-general': borderBottomWidth,
			'border-bottom-width-general-hover': borderBottomWidthHover,
			'border-left-width-general': borderLeftWidth,
			'border-left-width-general-hover': borderLeftWidthHover,
		}))(borderAttributes);

		expect(border).toStrictEqual(expectChanges);

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
