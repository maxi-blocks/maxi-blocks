/**
 * WordPress dependencies
 */
import { createNewPost, pressKeyTimes } from '@wordpress/e2e-test-utils';

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

		await page.$eval('.maxi-toolbar-layout button', button =>
			button.click()
		);

		await page.$eval(
			'.maxi-responsive-selector .style-card-button',
			button => button.click()
		);
		await page.waitForTimeout(500);

		await page.$eval(
			'.maxi-blocks-sc__type--heading .maxi-accordion-control__item__button',
			accordion => accordion.click()
		);

		// screen size L
		await page.$$eval(
			'.maxi-blocks-sc__type--heading .maxi-tabs-control button',
			screenSize => screenSize[1].click()
		);
		// Size
		await page.$eval(
			'.maxi-blocks-sc__type--heading .maxi-typography-control__size input',
			size => size.focus()
		);
		await pressKeyTimes('Backspace', '2');
		await page.keyboard.type('20');

		// Line Height
		await page.$eval(
			'.maxi-blocks-sc__type--heading .maxi-typography-control__line-height input',
			size => size.focus()
		);
		await pressKeyTimes('Backspace', '4');
		await page.keyboard.type('0');

		// Letter Spacing
		await page.$eval(
			'.maxi-blocks-sc__type--heading .maxi-typography-control__letter-spacing input',
			size => size.focus()
		);
		await page.keyboard.type('5');

		// Selectors

		// Weight
		const weightSelector = await page.$(
			'.maxi-blocks-sc__type--heading .maxi-typography-control__weight select'
		);

		// Transform
		const transformSelector = await page.$(
			'.maxi-blocks-sc__type--heading .maxi-typography-control__transform select'
		);

		// Style
		const styleSelector = await page.$(
			'.maxi-blocks-sc__type--heading .maxi-typography-control__font-style select'
		);

		// Decoration
		const decorationSelector = await page.$(
			'.maxi-blocks-sc__type--heading .maxi-typography-control__decoration select'
		);

		await weightSelector.select('300');
		await transformSelector.select('capitalize');
		await styleSelector.select('italic');
		await decorationSelector.select('overline');

		await page.waitForTimeout(1500); // Ensures SC is saved on the store
		const {
			value: {
				light: { styleCard: expectPresets },
			},
		} = await receiveSelectedMaxiStyle();

		expect(expectPresets).toMatchSnapshot();
	});
});
