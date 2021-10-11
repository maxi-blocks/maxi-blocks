/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	pressKeyTimes,
} from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { getBlockAttributes, openSidebar, getBlockStyle } from '../../utils';

console.error = jest.fn();

describe('MapControl', () => {
	it('Check map control', async () => {
		await createNewPost();
		await insertBlock('Map Maxi');
		const accordionPanel = await openSidebar(page, 'map');

		const inputs = await accordionPanel.$$(
			'.components-base-control .components-base-control__field input'
		);

		await inputs[1].focus();
		await pressKeyTimes('Backspace', '6');
		await page.keyboard.type('555');

		const expectLatitude = '52.555';
		const mapAttributes = await getBlockAttributes();
		const latitudeAttribute = mapAttributes['map-latitude'];
		expect(latitudeAttribute).toStrictEqual(expectLatitude);

		await inputs[2].focus();
		await pressKeyTimes('Backspace', '6');
		await page.keyboard.type('444');

		const expectLongitude = '13.444';
		const mapAttribute = await getBlockAttributes();
		const longitudeAttribute = mapAttribute['map-longitude'];
		expect(longitudeAttribute).toStrictEqual(expectLongitude);

		// zoom
		const zoom = await accordionPanel.$$(
			'.maxi-base-control.maxi-advanced-number-control .maxi-base-control__field input'
		);

		await zoom[0].focus();
		await pressKeyTimes('Backspace', '1');
		await page.keyboard.type('8');

		const expectZoom = 8;
		const mapZoomAttribute = await getBlockAttributes();
		const mapZoom = mapZoomAttribute['map-zoom'];
		expect(mapZoom).toStrictEqual(expectZoom);

		// map icon
		await accordionPanel.$$eval(
			'.maxi-map-control__markers div',
			selectIcon => selectIcon[2].click()
		);

		const expectMarker = 3;
		const mapMarkerAttribute = await getBlockAttributes();
		const mapMarker = mapMarkerAttribute['map-marker'];
		expect(mapMarker).toStrictEqual(expectMarker);

		// Marker Opacity
		const opacity = await accordionPanel.$('.maxi-opacity-control input');

		await opacity.focus();
		await pressKeyTimes('Backspace', '4');
		await page.keyboard.type('50');

		const expectOpacity = 0.5;
		const mapOpacityAttribute = await getBlockAttributes();
		const mapOpacity = mapOpacityAttribute['map-marker-opacity'];

		expect(mapOpacity).toStrictEqual(expectOpacity);

		// Marker Scale
		const scale = await accordionPanel.$$(
			'.maxi-base-control.maxi-advanced-number-control .maxi-base-control__field input'
		);

		await scale[4].focus();
		await pressKeyTimes('Backspace', '1');
		await page.keyboard.type('5');

		const expectScale = 5;
		const mapScaleAttribute = await getBlockAttributes();
		const mapScale = mapScaleAttribute['map-marker-scale'];
		expect(mapScale).toStrictEqual(expectScale);

		// custom color
		await accordionPanel.$eval(
			'.maxi-map-control .maxi-toggle-switch .maxi-base-control__label',
			use => use.click()
		);

		await accordionPanel.$eval('.maxi-color-control input', color =>
			color.focus()
		);

		await pressKeyTimes('Backspace', '2');
		await page.keyboard.type('55');

		const expectColor = '#081219';
		const mapColorAttribute = await getBlockAttributes();
		const mapColor = mapColorAttribute['map-marker-stroke-color'];
		expect(mapColor).toStrictEqual(expectColor);

		// Marker text
		const marker = await accordionPanel.$$(
			'.maxi-map-control__full-width-text input'
		);

		await marker[1].focus();
		await pressKeyTimes('Backspace', '5');
		await page.keyboard.type('test');

		const expectText = 'Marker test';
		const mapTextAttribute = await getBlockAttributes();
		const mapText = mapTextAttribute['map-marker-text'];
		expect(mapText).toStrictEqual(expectText);

		// Marker text color
		await accordionPanel.$$eval(
			'.maxi-color-palette-control .maxi-color-palette-control__palette-label .maxi-sc-color-palette div',
			color => color[4].click()
		);

		const expectColorText = 5;
		const mapColorTextAttribute = await getBlockAttributes();
		const mapColorText =
			mapColorTextAttribute['map-marker-palette-text-color'];
		expect(mapColorText).toStrictEqual(expectColorText);

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
