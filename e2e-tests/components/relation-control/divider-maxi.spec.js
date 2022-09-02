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

describe('Divider Maxi hover simple actions', () => {
	beforeEach(async () => {
		await createNewPost();
		await insertBlock('Divider Maxi');

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

	it('Divider shadow', async () => {
		// Select setting
		const selectControls = await page.$$('.maxi-select-control__input');
		await selectControls[3].select('Divider box shadow');

		// Select first default
		await page.$$eval('.maxi-default-styles-control__button', buttons =>
			buttons[1].click()
		);

		// Shadow color
		await editColorControl({
			page,
			instance: await page.$('.maxi-color-control'),
			paletteStatus: true,
			colorPalette: 8,
			opacity: 11,
		});

		// Shadow horizontal offset
		await page.$$eval(
			'.maxi-advanced-number-control .maxi-advanced-number-control__value',
			ANCs => ANCs[1].focus()
		);
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('22');

		// Shadow vertical offset
		await page.$$eval(
			'.maxi-advanced-number-control .maxi-advanced-number-control__value',
			ANCs => ANCs[2].focus()
		);
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('33');

		// Shadow blur
		await page.$$eval(
			'.maxi-advanced-number-control .maxi-advanced-number-control__value',
			ANCs => ANCs[3].focus()
		);
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('44');

		// Shadow spread
		await page.$$eval(
			'.maxi-advanced-number-control .maxi-advanced-number-control__value',
			ANCs => ANCs[4].focus()
		);
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('55');

		expect(await getAttributes('relations')).toMatchSnapshot();
	});

	it('Line settings', async () => {
		// Select setting
		const selectControls = await page.$$('.maxi-select-control__input');
		await selectControls[3].select('Line settings');

		// Select second default
		await page.$$eval('.maxi-default-styles-control__button', buttons =>
			buttons[2].click()
		);

		// Line color
		await editColorControl({
			page,
			instance: await page.$('.maxi-color-control'),
			paletteStatus: true,
			colorPalette: 8,
			opacity: 50,
		});

		// Line size
		await page.$$eval(
			'.maxi-advanced-number-control .maxi-advanced-number-control__value',
			ANCs => ANCs[1].focus()
		);
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('11');

		// Line weight
		await page.$$eval(
			'.maxi-advanced-number-control .maxi-advanced-number-control__value',
			ANCs => ANCs[2].focus()
		);
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('22');

		expect(await getAttributes('relations')).toMatchSnapshot();
	});
});
