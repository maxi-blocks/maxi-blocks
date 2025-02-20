/**
 * WordPress dependencies
 */
import { createNewPost, saveDraft } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	addCustomCSS,
	getAttributes,
	getBlockStyle,
	getEditedPostContent,
	openPreviewPage,
	insertMaxiBlock,
	updateAllBlockUniqueIds,
} from '../../utils';
import getMapContainer from './utils/getMapContainer';
import roundMarkersCoords from './utils/roundMarkersCoords';

const popupTest = async map => {
	// Opening marker popup
	const marker = await map.$('.leaflet-marker-icon');
	if (!marker) throw new Error('Marker not found');

	// Add a small delay to ensure map is stable
	await page.waitForTimeout(800);

	// Try clicking the marker up to 3 times
	let popupContent = null;
	for (let i = 0; i < 3; i++) {
		await marker.click();
		try {
			// Wait for popup with increased timeout
			await page.waitForSelector('.maxi-map-block__popup__content', {
				timeout: 2000,
				visible: true,
			});
			popupContent = await map.$('.maxi-map-block__popup__content');
			if (popupContent) break;
		} catch (e) {
			if (i === 2)
				throw new Error(
					'Popup content never appeared after 3 attempts'
				);
			await page.waitForTimeout(500); // Wait before retry
		}
	}

	if (!popupContent) throw new Error('Popup content not found');

	// Testing popup title typing
	const popupTitle = await popupContent.$(
		'.maxi-map-block__popup__content__title'
	);
	if (!popupTitle) throw new Error('Popup title element not found');

	await popupTitle.focus();
	await popupTitle.type('Title test');
	await page.waitForTimeout(300);

	// Testing popup description typing
	const popupDescription = await popupContent.$(
		'.maxi-map-block__popup__content__description'
	);

	await popupDescription.focus();
	await popupDescription.type('Description test');
	await page.waitForTimeout(150);

	expect(
		roundMarkersCoords(await getAttributes('map-markers'))
	).toMatchSnapshot();

	// Testing marker removal
	const popupRemove = await popupContent.$(
		'.maxi-map-block__popup__content__marker-remove'
	);

	await popupRemove.click();

	expect(
		roundMarkersCoords(await getAttributes('map-markers'))
	).toMatchSnapshot();
};

describe('Map Maxi', () => {
	beforeEach(async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Map Maxi');
		await page.waitForSelector('.maxi-map-block');
		await updateAllBlockUniqueIds(page);
		await page.waitForTimeout(500);
	});

	it('Map Maxi does not break', async () => {
		expect(await getEditedPostContent(page)).toMatchSnapshot();
		expect(await getBlockStyle(page)).toMatchSnapshot();

		// Check frontend
		await saveDraft();
		const previewPage = await openPreviewPage(page);
		await previewPage.waitForSelector('.leaflet-container');
		// Waiting for the animation to complete
		await page.waitForTimeout(400);
		const container = await previewPage.$eval(
			'.maxi-map-block__container',
			container => container.innerHTML.trim()
		);
		expect(container).toMatchSnapshot();
	});

	it('Map Maxi add marker by hold', async () => {
		const map = await getMapContainer(page);

		const mapBoundingBox = await map.boundingBox();

		// Adding marker to the center of the map by holding
		await page.mouse.move(
			mapBoundingBox.x + mapBoundingBox.width / 2,
			mapBoundingBox.y + mapBoundingBox.height / 2
		);
		await page.mouse.down();

		await page.waitForTimeout(400);

		await page.mouse.up();

		expect(
			roundMarkersCoords(await getAttributes('map-markers'))
		).toMatchSnapshot();

		await popupTest(map);
	});

	it('Map Maxi add marker by search box', async () => {
		const map = await getMapContainer(page);

		await map.waitForSelector('.maxi-map-block__search-box');
		const searchBox = await map.$('.maxi-map-block__search-box');

		// Ensure map is fully loaded before interaction
		await page.waitForTimeout(1000);

		// Type with longer delay between keystrokes
		await searchBox.$eval('input', input => input.focus());
		await searchBox.type('London', { delay: 200 });
		await page.waitForTimeout(800);

		// Click search with retry
		const searchButton = await searchBox.$(
			'.maxi-map-block__search-box__button'
		);
		await searchButton.evaluate(button => button.click());
		await page.waitForTimeout(1000);

		// Wait for results with explicit visibility check
		await page.waitForSelector('.maxi-map-block__search-box-results', {
			visible: true,
			timeout: 5000,
		});

		const searchBoxResults = await map.$(
			'.maxi-map-block__search-box-results'
		);
		const searchBoxResultsButton = await searchBoxResults.$(
			'.maxi-map-block__search-box-results__button'
		);

		// Add delay before clicking result
		await page.waitForTimeout(500);
		await searchBoxResultsButton.click();
		await page.waitForTimeout(1000);

		expect(
			roundMarkersCoords(await getAttributes('map-markers'))
		).toMatchSnapshot();

		await popupTest(map);
	}, 30000); // Increase timeout for this specific test

	it('Map Maxi Custom CSS', async () => {
		await expect(await addCustomCSS(page)).toMatchSnapshot();
	}, 500000);
});
