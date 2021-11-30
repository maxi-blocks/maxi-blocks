/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
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

		const backGroundColor = await accordionPanel.$(
			'.maxi-background-control .maxi-tabs-content'
		);

		await editColorControl({
			page,
			instance: backGroundColor,
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
	});

	it('Checking the custom color control', async () => {
		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'button background'
		);

		const backGroundColor = await accordionPanel.$('.maxi-color-control');

		await editColorControl({
			page,
			instance: backGroundColor,
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
	});

	it('Checking the opacity is never under 0 or more than 100', async () => {
		await createNewPost();
		await insertBlock('Button Maxi');
		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'button background'
		);

		const backGroundColor = await accordionPanel.$('.maxi-color-control');

		await editColorControl({
			page,
			instance: backGroundColor,
			paletteStatus: false,
			opacity: '250',
		});

		expect(
			await getAttributes('button-background-palette-opacity-general')
		).toStrictEqual(1);

		await editColorControl({
			page,
			instance: backGroundColor,
			paletteStatus: false,
			opacity: '-23',
		});

		expect(
			await getAttributes('button-background-palette-opacity-general')
		).toStrictEqual(0.23);
	});
});
