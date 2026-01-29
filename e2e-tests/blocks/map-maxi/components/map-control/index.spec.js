/**
 * WordPress dependencies
 */
import { createNewPost } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	editAdvancedNumberControl,
	getAttributes,
	openSidebarTab,
	resettingAttributes,
	insertMaxiBlock,
} from '../../../../utils';
import getMapContainer from '../../utils/getMapContainer';

describe('Map Control', () => {
	beforeEach(async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Map Maxi');
	});

	it('Map Maxi custom min/max zoom', async () => {
		const accordionTab = await openSidebarTab(
			page,
			'style',
			'configure map'
		);

		// Changing min zoom
		await editAdvancedNumberControl({
			page,
			instance: await accordionTab.$('.maxi-map-control__min-zoom '),
			newNumber: '3',
		});

		// Changing max zoom
		await editAdvancedNumberControl({
			page,
			instance: await accordionTab.$('.maxi-map-control__max-zoom '),
			newNumber: '5',
		});

		const attributes = ['map-min-zoom', 'map-max-zoom'];

		expect(await getAttributes(attributes)).toMatchSnapshot();

		const map = await getMapContainer(page);

		const clickOnZoomButton = async (button, times) => {
			for (let i = 0; i < times; i += 1) {
				// eslint-disable-next-line no-await-in-loop
				await button.click();
				// eslint-disable-next-line no-await-in-loop
				await page.waitForTimeout(200); // Wait for map to zoom
			}
		};

		// Check that zoom is default
		expect(await getAttributes('map-zoom')).toMatchSnapshot();

		// Clicking on min zoom button multiple times to check if min zoom is working
		const minZoomButton = await map.$('.leaflet-control-zoom-out');
		await clickOnZoomButton(minZoomButton, 3);
		expect(await getAttributes('map-zoom')).toMatchSnapshot();

		// Clicking on max zoom button multiple times to check if max zoom is working
		const maxZoomButton = await map.$('.leaflet-control-zoom-in');
		await clickOnZoomButton(maxZoomButton, 5);
		expect(await getAttributes('map-zoom')).toMatchSnapshot();

		// Resetting min zoom
		const resetMinZoom = await resettingAttributes({
			page,
			instance: 'maxi-map-control__min-zoom',
			expectValue: '1',
		});

		expect(resetMinZoom).toBeTruthy();

		// Resetting max zoom
		const resetMaxZoom = await resettingAttributes({
			page,
			instance: 'maxi-map-control__max-zoom',
			expectValue: '18',
		});

		expect(resetMaxZoom).toBeTruthy();
	});
});
