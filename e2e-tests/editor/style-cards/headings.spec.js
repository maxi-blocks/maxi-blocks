/**
 * WordPress dependencies
 */
import { createNewPost } from '@wordpress/e2e-test-utils';
import {
	addTypographyOptions,
	addTypographyStyle,
	getStyleCardEditor,
} from '../../utils';

const receiveSelectedMaxiStyle = async () => {
	return page.evaluate(() => {
		return wp.data
			.select('maxiBlocks/style-cards')
			.receiveMaxiSelectedStyleCard();
	});
};

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

		// screen size L
		await page.$$eval(
			'.maxi-blocks-sc__type--heading .maxi-tabs-control button',
			screenSize => screenSize[1].click()
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
		// Size

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
});
