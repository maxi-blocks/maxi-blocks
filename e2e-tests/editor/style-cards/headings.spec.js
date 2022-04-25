/**
 * WordPress dependencies
 */
import { createNewPost, pressKeyWithModifier } from '@wordpress/e2e-test-utils';
import {
	addTypographyOptions,
	addTypographyStyle,
	getStyleCardEditor,
	editGlobalStyles,
	checkSCResult,
	changeResponsive,
} from '../../utils';

describe('StyleCards headings', () => {
	it('Check Headings', async () => {
		await createNewPost();
		await page.setViewport({
			width: 1280,
			height: 1800,
		});

		await getStyleCardEditor({
			page,
			accordion: 'heading',
		});

		await changeResponsive(page, 'l');

		// size, line-height, letter-spacing
		await addTypographyOptions({
			page,
			instance: await page.$(
				'.maxi-blocks-sc__type--heading .maxi-style-cards-control__sc__h1-typography .maxi-typography-control__text-options-tabs'
			),
			size: '20',
			lineHeight: '0',
			letterSpacing: '5',
		});

		// Selectors
		// Weight, Transform, Style, Decoration
		await addTypographyStyle({
			page,
			instance: await page.$(
				'.maxi-blocks-sc__type--heading .maxi-style-cards-control__sc__h1-typography'
			),
			decoration: 'overline',
			weight: '300',
			transform: 'capitalize',
			style: 'italic',
			orientation: 'mixed',
		});

		await page.$$eval(
			'.maxi-blocks-sc__type--button .maxi-typography-control__text-indent input',
			input => input[0].focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('44');

		// Check paragraph global styles
		// Paragraph Colour
		await editGlobalStyles({
			page,
			block: 'heading',
		});

		expect(await checkSCResult(page)).toMatchSnapshot();
	});
});
