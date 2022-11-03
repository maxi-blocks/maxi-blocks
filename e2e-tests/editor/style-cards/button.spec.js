/**
 * WordPress dependencies
 */
import { createNewPost } from '@wordpress/e2e-test-utils';

import {
	addTypographyOptions,
	addTypographyStyle,
	getStyleCardEditor,
	editGlobalStyles,
	checkSCResult,
	changeResponsive,
} from '../../utils';

const generalTypographyStyle = {
	decoration: 'overline',
	weight: '300',
	transform: 'capitalize',
	style: 'italic',
	orientation: 'mixed',
	direction: 'ltr',
	indent: '44',
};

const responsiveTypographyStyle = {
	decoration: 'underline',
	weight: '400',
	transform: 'uppercase',
	style: 'oblique',
	orientation: 'upright',
	direction: 'rtl',
	indent: '22',
};

describe('StyleCards, Buttons', () => {
	it('Check Button', async () => {
		await createNewPost();

		await getStyleCardEditor({
			page,
			accordion: 'button',
		});

		// size, line-height, letter-spacing
		await addTypographyOptions({
			page,
			instance: await page.$(
				'.maxi-typography-control.maxi-style-cards-control__sc__button-typography'
			),
			size: '20',
			lineHeight: '10',
			letterSpacing: '5',
		});

		// Selectors
		// Weight, Transform, Style, Decoration
		await page.waitForTimeout(100);

		await addTypographyStyle({
			instance: await page.$(
				'.maxi-typography-control.maxi-style-cards-control__sc__button-typography'
			),
			...generalTypographyStyle,
		});
		await page.waitForTimeout(100);

		// Check Button global styles

		// text color
		await editGlobalStyles({
			page,
			block: 'button',
		});
		await page.waitForTimeout(100);

		// background color
		await editGlobalStyles({
			page,
			block: 'button',
			type: 'background',
		});
		await page.waitForTimeout(100);

		// background hover color
		await editGlobalStyles({
			page,
			block: 'button',
			type: 'hover-background',
		});
		await page.waitForTimeout(100);

		// text hover color
		await editGlobalStyles({
			page,
			block: 'button',
			type: 'hover',
		});
		await page.waitForTimeout(100);

		// border color
		await editGlobalStyles({
			page,
			block: 'button',
			type: 'border',
		});
		await page.waitForTimeout(100);

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

		// size, line-height, letter-spacing
		await addTypographyOptions({
			page,
			instance: await page.$(
				'.maxi-typography-control.maxi-style-cards-control__sc__button-typography'
			),
			size: '20',
			lineHeight: '10',
			letterSpacing: '5',
		});

		// Selectors
		// Weight, Transform, Style, Decoration
		await page.waitForTimeout(100);

		await addTypographyStyle({
			instance: await page.$(
				'.maxi-typography-control.maxi-style-cards-control__sc__button-typography'
			),
			...responsiveTypographyStyle,
		});
		await page.waitForTimeout(100);

		expect(await checkSCResult(page)).toMatchSnapshot();

		// Check values on S to be the same as on M breakpoint
		await changeResponsive(page, 's');
		const typographyStylesS = await addTypographyStyle({
			instance: await page.$(
				'.maxi-typography-control.maxi-style-cards-control__sc__button-typography'
			),
		});

		expect(typographyStylesS).toEqual(responsiveTypographyStyle);

		// Check values on L to be the same as on general breakpoint
		await changeResponsive(page, 'l');
		const typographyStylesL = await addTypographyStyle({
			instance: await page.$(
				'.maxi-typography-control.maxi-style-cards-control__sc__button-typography'
			),
		});

		expect(typographyStylesL).toEqual(generalTypographyStyle);
	});
});
