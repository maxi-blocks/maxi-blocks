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

describe('ColorControl', () => {
	it('Checking the palette color control', async () => {
		await createNewPost();
		await insertBlock('Button Maxi');
		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'button background'
		);

		await editColorControl({
			page,
			instance: await accordionPanel.$(
				'.maxi-background-control .maxi-tabs-content'
			),
			paletteStatus: true,
			colorPalette: 3,
			opacity: '45',
		});

		expect(
			await getAttributes('button-background-palette-opacity-general')
		).toStrictEqual(0.45);

		expect(
			await getAttributes('button-background-palette-color-general')
		).toStrictEqual(3);

		// check reset button
		await accordionPanel.$eval(
			'.maxi-base-control__field .components-maxi-control__reset-button',
			resetButton => resetButton.click()
		);

		expect(
			await getAttributes('button-background-palette-color-general')
		).toStrictEqual(4);
	});

	it('Checking the custom color control', async () => {
		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'button background'
		);

		await editColorControl({
			page,
			instance: await accordionPanel.$('.maxi-color-control'),
			paletteStatus: false,
			customColor: '#8E2727',
			opacity: '67',
		});

		expect(
			await getAttributes('button-background-color-general')
		).toStrictEqual('rgba(142, 39, 39, 0.67)');

		expect(
			await getAttributes('button-background-palette-opacity-general')
		).toStrictEqual(0.67);

		// check reset button
		await accordionPanel.$eval(
			'.maxi-base-control__field .components-maxi-control__reset-button',
			resetButton => resetButton.click()
		);

		expect(
			await getAttributes('button-background-color-general')
		).toStrictEqual('rgba(255,74,23,0.67)');
	});

	it('Checking the opacity is never under 0 or more than 100', async () => {
		await createNewPost();
		await insertBlock('Button Maxi');
		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'button background'
		);

		await editColorControl({
			page,
			instance: await accordionPanel.$('.maxi-color-control'),
			paletteStatus: false,
			opacity: '250',
		});

		expect(
			await getAttributes('button-background-palette-opacity-general')
		).toStrictEqual(1);

		await editColorControl({
			page,
			instance: await accordionPanel.$('.maxi-color-control'),
			paletteStatus: false,
			opacity: '-23',
		});

		expect(
			await getAttributes('button-background-palette-opacity-general')
		).toStrictEqual(0.23);
	});

	it('Checking the reset button', async () => {
		await createNewPost();
		await insertBlock('Button Maxi');
		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'button background'
		);

		await editColorControl({
			page,
			instance: await accordionPanel.$(
				'.maxi-background-control .maxi-tabs-content'
			),
			paletteStatus: true,
			colorPalette: 5,
		});

		expect(
			await getAttributes('button-background-palette-color-general')
		).toStrictEqual(5);

		// reset button
		await page.$eval(
			'.maxi-responsive-tabs-control .maxi-tabs-content .maxi-color-palette-control .components-maxi-control__reset-button',
			input => input.click()
		);

		expect(
			await getAttributes('button-background-palette-color-general')
		).toStrictEqual(4);

		// custom color
		await page.$$eval(
			'.maxi-color-palette-control .maxi-toggle-switch input',
			input => input[1].click()
		);
		await page.waitForTimeout(150);

		// check custom color is equal to palette color
		const paletteColor = await page.$eval(
			'.maxi-color-control .maxi-color-control__display .maxi-color-control__display__color span',
			el =>
				window.getComputedStyle(el).getPropertyValue('background-color')
		);

		expect(paletteColor).toStrictEqual('rgb(255, 74, 23)');

		// change value
		await page.$eval(
			'.maxi-background-control .maxi-color-control__color input',
			input => input.focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('#9A5441');
		await page.waitForTimeout(250);

		expect(
			await getAttributes('button-background-color-general')
		).toStrictEqual('rgb(154,84,65)');

		// check reset button
		await accordionPanel.$eval(
			'.maxi-color-control .maxi-color-control__display button',
			resetButton => resetButton.click()
		);
		await page.waitForTimeout(250);

		expect(
			await getAttributes('button-background-color-general')
		).toStrictEqual('rgba(255,74,23,1)');
	});
});
