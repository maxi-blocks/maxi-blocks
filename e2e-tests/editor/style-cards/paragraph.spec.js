/**
 * WordPress dependencies
 */
import { createNewPost, pressKeyWithModifier } from '@wordpress/e2e-test-utils';

import {
	getStyleCardEditor,
	editGlobalStyles,
	checkSCResult,
	addTypographyOptions,
	addTypographyStyle,
	changeResponsive,
} from '../../utils';

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
			decoration: 'overline',
			weight: '300',
			transform: 'capitalize',
			style: 'italic',
			orientation: 'mixed',
			direction: 'ltr',
			indent: '44',
		});

		await page.$eval(
			'.maxi-blocks-sc__type--paragraph .maxi-typography-control__text-indent input',
			input => input.focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('44');

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
			decoration: 'underline',
			weight: '400',
			transform: 'capitalize',
			style: 'italic',
			orientation: 'mixed',
			direction: 'ltr',
			indent: '44',
		});

		await page.$eval(
			'.maxi-blocks-sc__type--paragraph .maxi-typography-control__text-indent input',
			input => input.focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('44');

		expect(await checkSCResult(page)).toMatchSnapshot();
	});
});
