/**
 * WordPress dependencies
 */
import { createNewPost, pressKeyWithModifier } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import {
	openSidebarTab,
	editColorControl,
	getAttributes,
	insertMaxiBlock,
	updateAllBlockUniqueIds,
} from '../../utils';

describe('ColorControl', () => {
	it('Checking the palette color control', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Button Maxi');
		await updateAllBlockUniqueIds(page);
		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'button background'
		);

		await editColorControl({
			page,
			instance: await accordionPanel.$('.maxi-background-control '),
			paletteStatus: true,
			colorPalette: 3,
			opacity: '45',
		});

		await page.waitForTimeout(350);

		expect(
			await getAttributes('button-background-palette-opacity-general')
		).toStrictEqual(0.45);

		expect(
			await getAttributes('button-background-palette-color-general')
		).toStrictEqual(3);

		// check reset button
		await accordionPanel.$eval(
			'.maxi-background-control .maxi-base-control__field .maxi-reset-button',
			resetButton => resetButton.click()
		);

		await page.waitForTimeout(350);

		expect(
			await getAttributes('button-background-palette-color-general')
		).toStrictEqual(4);

		// click reset opacity button
		await accordionPanel.$eval(
			'.maxi-background-control .maxi-opacity-control button.maxi-reset-button',
			resetButton => resetButton.click()
		);
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

		await page.waitForTimeout(350);

		expect(
			await getAttributes('button-background-color-general')
		).toStrictEqual('rgba(142, 39, 39, 0.67)');

		expect(
			await getAttributes('button-background-palette-opacity-general')
		).toStrictEqual(0.67);

		// check reset button
		await accordionPanel.$eval(
			'.maxi-base-control__field .maxi-reset-button',
			resetButton => resetButton.click()
		);

		await page.waitForTimeout(350);

		expect(
			await getAttributes('button-background-color-general')
		).toStrictEqual('rgba(255,74,23,0.67)');
	});

	it('Checking the opacity is never under 0 or more than 100', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Button Maxi');
		await updateAllBlockUniqueIds(page);
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

		await page.waitForTimeout(350);

		expect(
			await getAttributes('button-background-palette-opacity-general')
		).toStrictEqual(1);

		await editColorControl({
			page,
			instance: await accordionPanel.$('.maxi-color-control'),
			paletteStatus: false,
			opacity: '-23',
		});

		await page.waitForTimeout(350);

		expect(
			await getAttributes('button-background-palette-opacity-general')
		).toStrictEqual(0.23);
	});

	it('Checking the reset button', async () => {
		await createNewPost();

		await insertMaxiBlock(page, 'Button Maxi');
		await updateAllBlockUniqueIds(page);
		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'button background'
		);

		await editColorControl({
			page,
			instance: await accordionPanel.$('.maxi-background-control'),
			paletteStatus: true,
			colorPalette: 5,
		});

		await page.waitForTimeout(350);

		expect(
			await getAttributes('button-background-palette-color-general')
		).toStrictEqual(5);

		// reset button
		await page.$$eval(
			'.maxi-background-control .maxi-color-palette-control .maxi-reset-button',
			input => input[0].click()
		);

		await page.waitForTimeout(350);

		expect(
			await getAttributes('button-background-palette-color-general')
		).toStrictEqual(4);

		// custom color
		await page.$eval(
			'.maxi-color-palette-control .maxi-toggle-switch input',
			input => input.click()
		);
		await page.waitForTimeout(350);

		// check custom color

		await page.$eval(
			'.maxi-opacity-control .maxi-advanced-number-control__value',
			opacity => opacity.focus()
		);
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('50', { delay: 350 });

		await page.waitForTimeout(350);

		expect(
			await getAttributes('button-background-color-general')
		).toStrictEqual('rgba(255, 74, 23, 0.5)');

		// change value
		await page.$eval(
			'.maxi-background-control .maxi-color-control__color input',
			input => input.focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('#9A5441', { delay: 350 });
		await page.waitForTimeout(350);

		expect(
			await getAttributes('button-background-color-general')
		).toStrictEqual('rgba(255, 74, 23, 0.5)');

		// check reset button
		await accordionPanel.$eval(
			'.maxi-color-control .maxi-color-control__display button',
			resetButton => resetButton.click()
		);
		await page.waitForTimeout(350);

		expect(
			await getAttributes('button-background-color-general')
		).toStrictEqual('rgba(255,74,23,0.5)');
	});
});
