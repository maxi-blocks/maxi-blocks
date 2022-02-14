/**
 * WordPress dependencies
 */
import {
	createNewPost,
	pressKeyTimes,
	setBrowserViewport,
} from '@wordpress/e2e-test-utils';

import { getStyleCardEditor } from '../../utils';

const receiveSelectedMaxiStyle = async () => {
	return page.evaluate(() => {
		return wp.data
			.select('maxiBlocks/style-cards')
			.receiveMaxiSelectedStyleCard();
	});
};

describe('StyleCards Paragraph', () => {
	it('Check Paragraph', async () => {
		await createNewPost();
		await setBrowserViewport('large');

		await getStyleCardEditor({
			page,
			accordion: 'paragraph',
		});

		// screen size L
		await page.$$eval(
			'.maxi-blocks-sc__type--paragraph .maxi-tabs-control button',
			screenSize => screenSize[1].click()
		);
		// Size
		await page.$eval(
			'.maxi-blocks-sc__type--paragraph .maxi-typography-control__size input',
			size => size.focus()
		);
		await pressKeyTimes('Backspace', '2');
		await page.keyboard.type('20');

		// Line Height
		await page.$eval(
			'.maxi-blocks-sc__type--paragraph .maxi-typography-control__line-height input',
			size => size.focus()
		);
		await pressKeyTimes('Backspace', '4');
		await page.keyboard.type('0');

		// Letter Spacing
		await page.$eval(
			'.maxi-blocks-sc__type--paragraph .maxi-typography-control__letter-spacing input',
			size => size.focus()
		);
		await page.keyboard.type('5');

		// Selectors
		// Weight
		const weightOptions = await page.$(
			'.maxi-blocks-sc__type--paragraph .maxi-typography-control__weight select'
		);

		// Transform
		const transformOptions = await page.$(
			'.maxi-blocks-sc__type--paragraph .maxi-typography-control__transform select'
		);

		// Style
		const styleOptions = await page.$(
			'.maxi-blocks-sc__type--paragraph .maxi-typography-control__font-style select'
		);

		// Decoration
		const decorationOptions = await page.$(
			'.maxi-blocks-sc__type--paragraph .maxi-typography-control__decoration select'
		);

		await weightOptions.select('300');
		await transformOptions.select('capitalize');
		await styleOptions.select('italic');
		await decorationOptions.select('overline');

		await page.waitForTimeout(1500); // Ensures SC is saved on the store
		const {
			value: {
				light: { styleCard: expectPresets },
			},
		} = await receiveSelectedMaxiStyle();

		expect(expectPresets).toMatchSnapshot();
	});
});
