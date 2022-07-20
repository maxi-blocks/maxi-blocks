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
			instance: page,
			decoration: 'overline',
			weight: '300',
			transform: 'capitalize',
			style: 'italic',
			orientation: 'mixed',
			direction: 'ltr',
		});
		await page.waitForTimeout(100);

		await page.$$eval(
			'.maxi-blocks-sc__type--button .maxi-typography-control__text-indent input',
			input => input[0].focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('44');

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
		await createNewPost();

		await getStyleCardEditor({
			page,
			accordion: 'button',
		});

		await changeResponsive(page, 'l');

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
			instance: page,
			decoration: 'overline',
			weight: '300',
			transform: 'capitalize',
			style: 'italic',
			orientation: 'mixed',
			direction: 'ltr',
		});
		await page.waitForTimeout(100);

		await page.$$eval(
			'.maxi-blocks-sc__type--button .maxi-typography-control__text-indent input',
			input => input[0].focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('44');

		expect(await checkSCResult(page)).toMatchSnapshot();
	});
});
