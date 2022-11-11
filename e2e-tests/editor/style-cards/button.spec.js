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
} from '../../utils';
import {
	generalTypographyOptions,
	responsiveTypographyOptions,
	generalTypographyStyle,
	responsiveTypographyStyle,
} from './constants';

describe('StyleCards, Buttons', () => {
	it('Check Button', async () => {
		await createNewPost();

		await getStyleCardEditor({
			page,
			accordion: 'button',
		});

		// Size, line-height, letter-spacing
		await addTypographyOptions({
			page,
			instance: await page.$(
				'.maxi-typography-control.maxi-style-cards-control__sc__button-typography'
			),
			...generalTypographyOptions,
		});

		// Weight, Transform, Style, Decoration
		await page.waitForTimeout(100);

		await addTypographyStyle({
			instance: await page.$(
				'.maxi-typography-control.maxi-style-cards-control__sc__button-typography'
			),
			...generalTypographyStyle,
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
			...responsiveTypographyStyle,
		});

		expect(await checkSCResult(page)).toMatchSnapshot();

		// Check values on S to be the same as on M breakpoint
		await changeResponsive(page, 's');
		const typographyStylesS = await addTypographyStyle({
			instance: await page.$(
				'.maxi-typography-control.maxi-style-cards-control__sc__button-typography'
			),
		});

		expect(typographyStylesS).toStrictEqual(responsiveTypographyStyle);

		// Check values on L to be the same as on general breakpoint
		await changeResponsive(page, 'l');
		const typographyStylesL = await addTypographyStyle({
			instance: await page.$(
				'.maxi-typography-control.maxi-style-cards-control__sc__button-typography'
			),
		});

		expect(typographyStylesL).toStrictEqual(generalTypographyStyle);
	});
});
