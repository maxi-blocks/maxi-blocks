/**
 * WordPress dependencies
 */
import { createNewPost } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	getStyleCardEditor,
	editGlobalStyles,
	checkSCResult,
	addTypographyOptions,
	addTypographyStyle,
	changeResponsive,
	copySCToEdit,
} from '../../utils';
import {
	generalTypographyOptions,
	responsiveTypographyOptions,
	generalTypographyStyle,
	responsiveTypographyStyle,
} from './constants';

describe('StyleCards Paragraph', () => {
	it('Check Paragraph', async () => {
		await createNewPost();

		await getStyleCardEditor({
			page,
			accordion: 'paragraph',
		});
		await copySCToEdit(page, `copy - ${Date.now()}`);

		await changeResponsive(page, 'base');

		await addTypographyOptions({
			page,
			instance: await page.$(
				'.maxi-blocks-sc__type--paragraph .maxi-style-cards-control__sc__p-typography'
			),
			...generalTypographyOptions,
		});

		// Selectors
		// Weight, Transform, Style, Decoration
		await addTypographyStyle({
			instance: await page.$(
				'.maxi-blocks-sc__type--paragraph .maxi-style-cards-control__sc__p-typography'
			),
			...generalTypographyStyle,
			isStyleCards: true,
		});

		// Check paragraph global styles
		// Paragraph Colour
		await editGlobalStyles({
			page,
			block: 'paragraph',
		});

		expect(await checkSCResult(page)).toMatchSnapshot();
	});

	it('Works on responsive', async () => {
		await changeResponsive(page, 'm');

		await addTypographyOptions({
			page,
			instance: await page.$(
				'.maxi-blocks-sc__type--paragraph .maxi-style-cards-control__sc__p-typography'
			),
			...responsiveTypographyOptions,
		});

		// Selectors
		// Weight, Transform, Style, Decoration
		await addTypographyStyle({
			instance: await page.$(
				'.maxi-blocks-sc__type--paragraph .maxi-style-cards-control__sc__p-typography'
			),
			...responsiveTypographyStyle,
			isStyleCards: true,
		});

		expect(await checkSCResult(page)).toMatchSnapshot();

		// Check values on S to be the same as on M breakpoint
		await changeResponsive(page, 's');
		const typographyStylesS = await addTypographyStyle({
			instance: await page.$(
				'.maxi-blocks-sc__type--paragraph .maxi-style-cards-control__sc__p-typography'
			),
			isStyleCards: true,
		});

		expect(typographyStylesS).toEqual(responsiveTypographyStyle);

		// Check values on L to be the same as on general breakpoint
		await changeResponsive(page, 'l');
		const typographyStylesL = await addTypographyStyle({
			instance: await page.$(
				'.maxi-blocks-sc__type--paragraph .maxi-style-cards-control__sc__p-typography'
			),
			isStyleCards: true,
		});

		expect(typographyStylesL).toEqual(generalTypographyStyle);
	});
});
