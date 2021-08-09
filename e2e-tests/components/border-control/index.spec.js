/* eslint-disable no-await-in-loop */
/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { getBlockAttributes, openSidebar } from '../../utils';

describe('BorderControl', () => {
	beforeEach(async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
	});

	it('Checking the border control', async () => {
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
	});

	it('Check hover values kept after setting normal border to none', async () => {
		const borderAccordion = await openSidebar(page, 'border');
		await borderAccordion.$$eval(
			'.maxi-tabs-content .maxi-default-styles-control button',
			buttons => buttons[1].click()
		);

		await borderAccordion.$$eval('.maxi-tabs-control__button', buttons =>
			buttons[1].click()
		);

		await page.$$eval(
			'.maxi-border-status-hover .maxi-radio-control__option',
			buttons => buttons[0].querySelector('label').click()
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
			'border-color-general-hover': '',
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
	});
});
