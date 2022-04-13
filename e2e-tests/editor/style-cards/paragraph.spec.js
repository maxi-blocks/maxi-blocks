/**
 * WordPress dependencies
 */
import {
	createNewPost,
	pressKeyTimes,
	pressKeyWithModifier,
} from '@wordpress/e2e-test-utils';

import {
	getStyleCardEditor,
	editGlobalStyles,
	checkSCResult,
} from '../../utils';

describe('StyleCards Paragraph', () => {
	it('Check Paragraph', async () => {
		await createNewPost();

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
		await pressKeyTimes('Backspace', '4');
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

		await page.$$eval(
			'.maxi-blocks-sc__type--paragraph .maxi-typography-control__text-indent input',
			input => input[0].focus()
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
});
