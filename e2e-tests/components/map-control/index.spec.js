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
import { getBlockAttributes, openSidebar } from '../../utils';

//  jest.mock('console.error', () => {
// 	return jest.fn();
// });
console.error = jest.fn();
/* jest.mock('console', () => {
	return {
		error: jest.fn(),
	};
}); */

describe('MapControl', () => {
	it('Check map control', async () => {
		await createNewPost();
		await insertBlock('Map Maxi');
		const accordionPanel = await openSidebar(page, 'map');

		const inputs = await accordionPanel.$$(
			'.components-base-control .components-base-control__field input'
		);
		debugger;
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
		/* const zoom = await accordionPanel.$$(
			'.maxi-base-control.maxi-advanced-number-control .maxi-base-control__field input'
		);

		await zoom[1].focus();
		await pressKeyTimes('Backspace', '1');
		await page.keyboard.type('8');

		const expectZoom = '8';
		const mapZoomAttribute = await getBlockAttributes();
		const mapZoom = mapZoomAttribute['map-zoom'];
		expect(mapZoom).toStrictEqual(expectZoom); */

		// Marker Opacity
		const opacity = await accordionPanel.$$(
			'.maxi-base-control.maxi-advanced-number-control .maxi-base-control__field input'
		);

		await opacity[2].focus();
		await pressKeyTimes('Backspace', '4');
		await page.keyboard.type('50');

		const expectOpacity = 0.5;
		const mapOpacityAttribute = await getBlockAttributes();
		const mapOpacity = mapOpacityAttribute['map-marker-opacity'];
		expect(mapOpacity).toStrictEqual(expectOpacity);
	});
});
