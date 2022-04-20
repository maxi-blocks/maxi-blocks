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

// Needs a deep check; snapshot is totally different
describe.skip('StyleCards headings', () => {
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
				'.maxi-typography-control.maxi-style-cards-control__sc__h1-typography'
			),
			size: '20',
			lineHeight: '0',
			letterSpacing: '5',
		});

		// Selectors
		// Weight, Transform, Style, Decoration
		await addTypographyStyle({
			page,
			decoration: 'overline',
			weight: '300',
			transform: 'capitalize',
			style: 'italic',
			orientation: 'mixed',
		});

		await page.$$eval(
			'.maxi-style-cards-control__sc__h1-typography .maxi-typography-control__text-indent input',
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
