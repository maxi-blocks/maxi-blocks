/**
 * WordPress dependencies
 */
import {
	createNewPost,
	pressKeyTimes,
	setBrowserViewport,
} from '@wordpress/e2e-test-utils';

const receiveSelectedMaxiStyle = async () => {
	return page.evaluate(() => {
		return wp.data
			.select('maxiBlocks/style-cards')
			.receiveMaxiSelectedStyleCard();
	});
};

const receiveSavedMaxiStyle = async () => {
	return page.evaluate(() => {
		return wp.data
			.select('maxiBlocks/style-cards')
			.receiveSavedMaxiStyleCards();
	});
};

describe('StyleCards', () => {
	it('Check Save', async () => {
		await createNewPost();
		await setBrowserViewport('large');

		await page.$eval('.maxi-toolbar-layout button', button =>
			button.click()
		);

		await page.$eval(
			'.maxi-responsive-selector .style-card-button',
			button => button.click()
		);
		await page.waitForTimeout(500);

		await page.$eval(
			'.maxi-blocks-sc__type--quick-color-presets .maxi-accordion-control__item__button',
			accordion => accordion.click()
		);

		// ColorControl
		await page.$eval(
			'.maxi-color-control .maxi-color-control__color input',
			input => input.focus()
		);
		await pressKeyTimes('Backspace', '6');
		await page.keyboard.type('106D3C');

		// Style Card Name
		await page.$eval(
			'.components-popover__content .maxi-style-cards__sc__save input',
			input => input.focus()
		);
		await page.waitForTimeout(500);
		await page.keyboard.type('Test Name');
		await page.waitForTimeout(500);
		await page.$eval(
			'.components-popover__content .maxi-style-cards__sc__save button',
			input => input.click()
		);

		await page.waitForTimeout(1500); // Ensures SC is saved on the store

		const expectPresets = await receiveSavedMaxiStyle();

		expect(expectPresets).toMatchSnapshot();
	});

	it('Change Style Card', async () => {
		// change SC
		const selector = await page.$(
			'.components-popover__content .maxi-style-cards__sc__more-sc .maxi-style-cards__sc__more-sc--select select'
		);

		await selector.select('sc_maxi');

		// expect
		await page.waitForTimeout(1500); // Ensures SC is saved on the store
		const expectPresets = await receiveSavedMaxiStyle();

		expect(expectPresets).toMatchSnapshot();
	});

	it('Delete Style Card', async () => {
		// button
		await page.$eval(
			'.components-popover__content .maxi-style-cards__sc__more-sc .maxi-style-cards__sc__more-sc--delete',
			button => button.click()
		);

		// Style Card Name

		await page.waitForTimeout(1500); // Ensures SC is saved on the store

		const expectPresets = await receiveSavedMaxiStyle();

		expect(expectPresets).toMatchSnapshot();
	});

	it('Dark Style Preset', async () => {
		await createNewPost();
		await setBrowserViewport('large');

		await page.$eval('.maxi-toolbar-layout button', button =>
			button.click()
		);

		await page.$$eval(
			'.maxi-responsive-selector .action-buttons__button',
			button => button[1].click()
		);

		await page.waitForTimeout(500);

		// select Dark Style
		await page.$$eval(
			'.components-popover__content .maxi-settingstab-control .maxi-tabs-control button',
			button => button[1].click()
		);

		// Divider
		await page.$$eval(
			'.maxi-accordion-control__item .maxi-accordion-tab div',
			accordion => accordion[6].click()
		);

		// button
		await page.$eval('.maxi-radio-control__option label', button =>
			button.click()
		);

		// ColorControl
		await page.$eval(
			'.maxi-color-control .maxi-color-control__color input',
			input => input.focus()
		);
		await pressKeyTimes('Backspace', '6');
		await page.keyboard.type('106D3C');

		await page.waitForTimeout(1500); // Ensures SC is saved on the store
		const {
			value: {
				dark: { styleCard: expectPresets },
			},
		} = await receiveSelectedMaxiStyle();

		expect(expectPresets).toMatchSnapshot();
	});

	it('Maxi Cloud Library', async () => {
		await createNewPost();
		await setBrowserViewport('large');

		await page.$eval('.maxi-toolbar-layout button', button =>
			button.click()
		);

		await page.$$eval(
			'.maxi-responsive-selector .action-buttons__button',
			button => button[1].click()
		);

		await page.waitForTimeout(500);

		await page.$eval(
			'.maxi-style-cards__sc .maxi-style-cards__sc__more-sc .maxi-library-modal__action-section button',
			button => button.click()
		);

		await page.waitForTimeout(500);

		await page.$$eval(
			'.components-modal__content .maxi-cloud-container .maxi-cloud-container__sc__content-sc .maxi-cloud-masonry-card__container .maxi-cloud-masonry-card__buttons button',
			button => button[0].click()
		);

		// colour preset
		await page.$$eval(
			'.maxi-accordion-control__item .maxi-accordion-tab div',
			accordion => accordion[0].click()
		);

		await page.waitForTimeout(1500); // Ensures SC is saved on the store
		const {
			value: {
				light: { styleCard: expectPresets },
			},
		} = await receiveSelectedMaxiStyle();

		expect(expectPresets).toMatchSnapshot();

		await page.$$eval(
			'.maxi-settingstab-control .maxi-tabs-control button',
			button => button[1].click()
		);
	});
});
