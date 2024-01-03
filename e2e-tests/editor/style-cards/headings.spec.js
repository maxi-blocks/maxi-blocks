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
	generalTypographyStyle,
	responsiveTypographyStyle,
} from './constants';

describe('StyleCards headings', () => {
	it('Check Headings', async () => {
		await createNewPost();

		await getStyleCardEditor({
			page,
			accordion: 'heading',
		});
		await copySCToEdit(page, `copy - ${Date.now()}`);

		// Size, line-height, letter-spacing
		await addTypographyOptions({
			page,
			instance: await page.$(
				'.maxi-blocks-sc__type--heading .maxi-style-cards-control__sc__h1-typography'
			),
			...generalTypographyOptions,
		});

		// Weight, Transform, Style, Decoration
		await addTypographyStyle({
			instance: await page.$(
				'.maxi-blocks-sc__type--heading .maxi-style-cards-control__sc__h1-typography'
			),
			...generalTypographyStyle,
			isStyleCards: true,
		});

		// Check paragraph global styles
		// Paragraph Colour
		await editGlobalStyles({
			page,
			block: 'heading',
		});

		page.waitForTimeout(1000);

		expect(await checkSCResult(page)).toMatchSnapshot();
	});

	it('Works on responsive', async () => {
		await changeResponsive(page, 'm');

		// Size, line-height, letter-spacing
		await addTypographyOptions({
			page,
			instance: await page.$(
				'.maxi-blocks-sc__type--heading .maxi-style-cards-control__sc__h1-typography'
			),
			...responsiveTypographyOptions,
		});

		// Weight, Transform, Style, Decoration
		await addTypographyStyle({
			instance: await page.$(
				'.maxi-blocks-sc__type--heading .maxi-style-cards-control__sc__h1-typography'
			),
			...responsiveTypographyStyle,
			isStyleCards: true,
		});

		page.waitForTimeout(1000);

		expect(await checkSCResult(page)).toMatchSnapshot();

		// Check values on S to be the same as on M breakpoint
		await changeResponsive(page, 's');
		const typographyStylesS = await addTypographyStyle({
			instance: await page.$(
				'.maxi-blocks-sc__type--heading .maxi-style-cards-control__sc__h1-typography'
			),
			isStyleCards: true,
		});

		expect(typographyStylesS).toEqual(responsiveTypographyStyle);

		// Check values on L to be the same as on general breakpoint
		await changeResponsive(page, 'l');
		const typographyStylesL = await addTypographyStyle({
			instance: await page.$(
				'.maxi-blocks-sc__type--heading .maxi-style-cards-control__sc__h1-typography'
			),
			isStyleCards: true,
		});

		expect(typographyStylesL).toEqual(generalTypographyStyle);
	});
});
