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

describe('StyleCards headings', () => {
	it('Check Headings', async () => {
		await createNewPost();

		await getStyleCardEditor({
			page,
			accordion: 'heading',
		});

		// size, line-height, letter-spacing
		await addTypographyOptions({
			page,
			instance: await page.$(
				'.maxi-blocks-sc__type--heading .maxi-style-cards-control__sc__h1-typography'
			),
			size: '20',
			lineHeight: '0',
			letterSpacing: '5',
		});

		// Selectors
		// Weight, Transform, Style, Decoration
		await addTypographyStyle({
			instance: await page.$(
				'.maxi-blocks-sc__type--heading .maxi-style-cards-control__sc__h1-typography'
			),
			...generalTypographyStyle,
		});

		// Check paragraph global styles
		// Paragraph Colour
		await editGlobalStyles({
			page,
			block: 'heading',
		});

		expect(await checkSCResult(page)).toMatchSnapshot();
	});

	it('Works on responsive', async () => {
		await changeResponsive(page, 'm');

		// size, line-height, letter-spacing
		await addTypographyOptions({
			page,
			instance: await page.$(
				'.maxi-blocks-sc__type--heading .maxi-style-cards-control__sc__h1-typography'
			),
			size: '15',
			lineHeight: '0',
			letterSpacing: '5',
		});

		// Selectors
		// Weight, Transform, Style, Decoration
		await addTypographyStyle({
			instance: await page.$(
				'.maxi-blocks-sc__type--heading .maxi-style-cards-control__sc__h1-typography'
			),
			...responsiveTypographyStyle,
		});

		expect(await checkSCResult(page)).toMatchSnapshot();

		// Check values on S to be the same as on M breakpoint
		await changeResponsive(page, 's');
		const typographyStylesS = await addTypographyStyle({
			instance: await page.$(
				'.maxi-blocks-sc__type--heading .maxi-style-cards-control__sc__h1-typography'
			),
		});

		expect(typographyStylesS).toEqual(responsiveTypographyStyle);

		// Check values on L to be the same as on general breakpoint
		await changeResponsive(page, 'l');
		const typographyStylesL = await addTypographyStyle({
			instance: await page.$(
				'.maxi-blocks-sc__type--heading .maxi-style-cards-control__sc__h1-typography'
			),
		});

		expect(typographyStylesL).toEqual(generalTypographyStyle);
	});
});
