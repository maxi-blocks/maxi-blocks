/**
 * WordPress dependencies
 */
import { createNewPost } from '@wordpress/e2e-test-utils';

import {
	getStyleCardEditor,
	editGlobalStyles,
	checkSCResult,
	addTypographyOptions,
	addTypographyStyle,
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

describe('StyleCards Paragraph', () => {
	it('Check Paragraph', async () => {
		await createNewPost();

		await getStyleCardEditor({
			page,
			accordion: 'paragraph',
		});

		await changeResponsive(page, 'base');

		await addTypographyOptions({
			page,
			instance: await page.$(
				'.maxi-blocks-sc__type--paragraph .maxi-style-cards-control__sc__p-typography'
			),
			size: '20',
			lineHeight: '0',
			letterSpacing: '5',
		});

		// Selectors
		// Weight, Transform, Style, Decoration
		await addTypographyStyle({
			instance: await page.$(
				'.maxi-blocks-sc__type--paragraph .maxi-style-cards-control__sc__p-typography'
			),
			...generalTypographyStyle,
		});

		// Check paragraph global styles
		// Paragraph Colour
		await page.waitForTimeout(150);
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
			size: '15',
			lineHeight: '0',
			letterSpacing: '5',
		});

		// Selectors
		// Weight, Transform, Style, Decoration
		await addTypographyStyle({
			instance: await page.$(
				'.maxi-blocks-sc__type--paragraph .maxi-style-cards-control__sc__p-typography'
			),
			...responsiveTypographyStyle,
		});

		expect(await checkSCResult(page)).toMatchSnapshot();

		// Check values on S to be the same as on M breakpoint
		await changeResponsive(page, 's');
		const typographyStylesS = await addTypographyStyle({
			instance: await page.$(
				'.maxi-blocks-sc__type--paragraph .maxi-style-cards-control__sc__p-typography'
			),
		});

		expect(typographyStylesS).toEqual(responsiveTypographyStyle);

		// Check values on L to be the same as on general breakpoint
		await changeResponsive(page, 'l');
		const typographyStylesL = await addTypographyStyle({
			instance: await page.$(
				'.maxi-blocks-sc__type--paragraph .maxi-style-cards-control__sc__p-typography'
			),
		});

		expect(typographyStylesL).toEqual(generalTypographyStyle);
	});
});
