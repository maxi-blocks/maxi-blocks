/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	pressKeyWithModifier,
} from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { openSidebarTab, editColorControl, getAttributes } from '../../utils';

describe('Button Maxi hover simple actions', () => {
	beforeEach(async () => {
		await createNewPost();
		await insertBlock('Button Maxi');

		// Add icon
		await openSidebarTab(page, 'style', 'quick styles');
		await page.$$eval('.maxi-default-styles-control__button', buttons =>
			buttons[3].click()
		);

		await insertBlock('Button Maxi');
		await openSidebarTab(page, 'advanced', 'interaction builder');

		// Add interaction
		await page.waitForSelector('.maxi-relation-control__button');
		await page.$eval('.maxi-relation-control__button', el => el.click());

		// Add title
		const textControls = await page.$$('.maxi-text-control__input');
		await textControls[1].focus();
		await page.keyboard.type('Hello World!');

		// Add target
		let selectControls = await page.$$('.maxi-select-control__input');
		await selectControls[1].select('button-maxi-1');

		// Add action
		selectControls = await page.$$('.maxi-select-control__input');
		await selectControls[2].select('hover');
	});

	afterEach(() => {
		debugger;
	});

	it('Button icon', async () => {
		// Select setting
		let selectControls = await page.$$('.maxi-select-control__input');
		await selectControls[3].select('Button icon');

		// Width
		await page.$$eval(
			'.maxi-advanced-number-control .maxi-advanced-number-control__value',
			ANCs => ANCs[0].click()
		);
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('11');

		const ANCs = await page.$$(
			'.maxi-advanced-number-control .maxi-select-control__input'
		);
		await ANCs[0].select('%');

		// Stroke width
		await page.$$eval(
			'.maxi-advanced-number-control .maxi-advanced-number-control__value',
			ANCs => ANCs[1].click()
		);
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('22');

		// Spacing
		await page.$$eval(
			'.maxi-advanced-number-control .maxi-advanced-number-control__value',
			ANCs => ANCs[2].click()
		);
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('33');

		// Icon position
		await page.$eval(
			'.maxi-tabs-control__button.maxi-tabs-control__button-bottom',
			el => el.click()
		);

		// Icon stroke color
		let colorControls = await page.$$('.maxi-color-control');
		await editColorControl({
			page,
			instance: await colorControls[0],
			paletteStatus: true,
			colorPalette: 8,
			opacity: 50,
		});

		// Icon background color
		colorControls = await page.$$('.maxi-color-control');
		await editColorControl({
			page,
			instance: await colorControls[1],
			paletteStatus: true,
			colorPalette: 5,
			opacity: 75,
		});

		// Icon padding
		selectControls = await page.$$('.maxi-select-control__input');
		await selectControls[5].select('%');

		await page.$$eval(
			'.maxi-advanced-number-control .maxi-advanced-number-control__value',
			ANCs => ANCs[5].click()
		);
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('44');

		expect(await getAttributes('relations')).toMatchSnapshot();
	});

	it('Change button background', async () => {
		// Select setting
		const selectControls = await page.$$('.maxi-select-control__input');
		await selectControls[3].select('Button background');

		// Background color
		await editColorControl({
			page,
			instance: await page.$('.maxi-color-control'),
			paletteStatus: true,
			colorPalette: 8,
			opacity: 20,
		});

		expect(await getAttributes('relations')).toMatchSnapshot();
	});
});
