/**
 * WordPress dependencies
 */
import { createNewPost, setBrowserViewport } from '@wordpress/e2e-test-utils';

import {
	addTypographyOptions,
	addTypographyStyle,
	getStyleCardEditor,
	getBlockStyle,
	editGlobalStyles,
} from '../../utils';

const receiveSelectedMaxiStyle = async () => {
	return page.evaluate(() => {
		return wp.data
			.select('maxiBlocks/style-cards')
			.receiveMaxiSelectedStyleCard();
	});
};

describe('StyleCards, Buttons', () => {
	it('Check Button', async () => {
		await createNewPost();
		await setBrowserViewport('large');

		await getStyleCardEditor({
			page,
			accordion: 'button',
		});
		// screen size L
		await page.$$eval(
			'.maxi-blocks-sc__type--button .maxi-tabs-control button',
			screenSize => screenSize[2].click()
		);

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

		await page.waitForTimeout(1500); // Ensures SC is saved on the store
		const {
			value: {
				light: { styleCard: expectPresets },
			},
		} = await receiveSelectedMaxiStyle();

		expect(expectPresets).toMatchSnapshot();
	});
	it('Check Button global styles', async () => {
		// text color
		await editGlobalStyles({
			page,
			block: 'button',
			type: '0',
			paletteColor: '3',
		});
		await page.waitForTimeout(150);

		// background color
		await editGlobalStyles({
			page,
			block: 'button',
			type: '1',
			paletteColor: '3',
		});

		await page.waitForTimeout(150);

		// background hover color
		await editGlobalStyles({
			page,
			block: 'button',
			type: '1',
			paletteColor: '3',
		});
		await page.waitForTimeout(150);

		// text hover color
		await editGlobalStyles({
			page,
			block: 'button',
			type: '1',
			paletteColor: '3',
		});
		await page.waitForTimeout(150);

		// border color
		await editGlobalStyles({
			page,
			block: 'button',
			type: '1',
			paletteColor: '3',
		});
		await page.waitForTimeout(150);

		// border hover color
		await editGlobalStyles({
			page,
			block: 'button',
			type: '1',
			paletteColor: '3',
		});
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
