/**
 * WordPress dependencies
 */
import { createNewPost } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	addTypographyOptions,
	addTypographyStyle,
	getStyleCardEditor,
	editGlobalStyles,
	checkSCResult,
	changeResponsive,
	copySCToEdit,
} from '../../utils';
import {
	generalTypographyOptions,
	responsiveTypographyOptions,
	generalButtonTypographyStyle,
	responsiveButtonTypographyStyle,
} from './constants';

describe('StyleCards, Buttons', () => {
	it('Check Button', async () => {
		await createNewPost();

		await getStyleCardEditor({
			page,
			accordion: 'button',
		});
		await copySCToEdit(page, `copy - ${Date.now()}`);

		// Size, line-height, letter-spacing
		await addTypographyOptions({
			page,
			instance: await page.$(
				'.maxi-typography-control.maxi-style-cards-control__sc__button-typography'
			),
			...generalTypographyOptions,
		});

		// click on the typography advanced settings
		const isAdvancedSettingsOpen = await page.evaluate(
			() =>
				!!document.querySelector(
					'.maxi-typography-control__text-indent'
				)
		);
		if (!isAdvancedSettingsOpen) {
			const advancedSettingsSelector = await page.$(
				'.maxi-typography-control__advanced-toggle button.maxi-typography-control-button'
			);
			if (advancedSettingsSelector)
				await advancedSettingsSelector.click();
		}

		// Weight, Transform, Style, Decoration
		await page.waitForTimeout(100);

		await addTypographyStyle({
			instance: await page.$(
				'.maxi-typography-control.maxi-style-cards-control__sc__button-typography'
			),
			...generalButtonTypographyStyle,
			isStyleCards: true,
		});

		// Check Button global styles
		// text color
		await editGlobalStyles({
			page,
			block: 'button',
		});

		// background color
		await editGlobalStyles({
			page,
			block: 'button',
			type: 'background',
		});

		// background hover color
		await editGlobalStyles({
			page,
			block: 'button',
			type: 'hover-background',
		});

		// text hover color
		await editGlobalStyles({
			page,
			block: 'button',
			type: 'hover',
		});

		// border color
		await editGlobalStyles({
			page,
			block: 'button',
			type: 'border',
		});

		// border hover color
		await editGlobalStyles({
			page,
			block: 'button',
			type: 'hover-border',
		});

		expect(await checkSCResult(page)).toMatchSnapshot();
	});

	it('Should work on responsive', async () => {
		await changeResponsive(page, 'm');

		// Size, line-height, letter-spacing
		await addTypographyOptions({
			page,
			instance: await page.$(
				'.maxi-typography-control.maxi-style-cards-control__sc__button-typography'
			),
			...responsiveTypographyOptions,
		});

		// Weight, Transform, Style, Decoration
		await addTypographyStyle({
			instance: await page.$(
				'.maxi-typography-control.maxi-style-cards-control__sc__button-typography'
			),
			...responsiveButtonTypographyStyle,
			isStyleCards: true,
		});

		expect(await checkSCResult(page)).toMatchSnapshot();

		// Check values on S to be the same as on M breakpoint
		await changeResponsive(page, 's');
		const typographyStylesS = await addTypographyStyle({
			instance: await page.$(
				'.maxi-typography-control.maxi-style-cards-control__sc__button-typography'
			),
			isStyleCards: true,
		});

		expect(typographyStylesS).toStrictEqual(
			responsiveButtonTypographyStyle
		);

		// Check values on L to be the same as on general breakpoint
		await changeResponsive(page, 'l');
		const typographyStylesL = await addTypographyStyle({
			instance: await page.$(
				'.maxi-typography-control.maxi-style-cards-control__sc__button-typography'
			),
			isStyleCards: true,
		});

		expect(typographyStylesL).toStrictEqual(generalButtonTypographyStyle);
	});
});
