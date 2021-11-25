/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import {
	getBlockAttributes,
	openSidebarTab,
	editColorControl,
} from '../../utils';

describe('ColorControl', () => {
	it('Checking the palette color control', async () => {
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
			colorPalette: 3,
			paletteOpacity: '45',
		});

		const attributes = await getBlockAttributes();
		const opacity = attributes['button-background-palette-opacity-general'];

		expect(opacity).toStrictEqual(0.45);

		const colorAttributes = await getBlockAttributes();
		const colorPalette =
			colorAttributes['button-background-palette-color-general'];

		expect(colorPalette).toStrictEqual(3);
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
			customColor: '#8E2727',
			customOpacity: '67',
		});

		const customColorAttributes = await getBlockAttributes();
		const customColor =
			customColorAttributes['button-background-color-general'];

		expect(customColor).toStrictEqual('rgba(142, 39, 39, 0.67)');

		const customOpacityAttributes = await getBlockAttributes();
		const customOpacity =
			customOpacityAttributes[
				'button-background-palette-opacity-general'
			];

		expect(customOpacity).toStrictEqual(0.67);
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
			paletteOpacity: '250',
		});

		const maxOpacityAttributes = await getBlockAttributes();
		const maxOpacity =
			maxOpacityAttributes['button-background-palette-opacity-general'];

		expect(maxOpacity).toStrictEqual(1);

		await editColorControl({
			page,
			instance: backGroundColor,
			paletteOpacity: '-23',
		});

		const minOpacityAttributes = await getBlockAttributes();
		const minOpacity =
			minOpacityAttributes['button-background-palette-opacity-general'];

		expect(minOpacity).toStrictEqual(0.23);
	});
});
