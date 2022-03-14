/**
 * WordPress dependencies
 */
import {
	createNewPost,
	setBrowserViewport,
	pressKeyWithModifier,
} from '@wordpress/e2e-test-utils';

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
		await setBrowserViewport('large');

		await getStyleCardEditor({
			page,
			accordion: 'button',
		});

		await changeResponsive(page, 'm');

		// size, line-height, letter-spacing
		await addTypographyOptions({
			page,
			instance: await page.$(
				'.maxi-typography-control.maxi-style-cards-control__sc__button-typography'
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
		});

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
});
