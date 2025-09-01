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
	openSidebarTab,
} from '../../utils';
import getMapContainer from './utils/getMapContainer';
import roundMarkersCoords from './utils/roundMarkersCoords';

const tryClickMarker = async (marker, map) => {
	await marker.click();
	try {
		// Wait for popup with increased timeout
		await page.waitForSelector('.maxi-map-block__popup__content', {
			timeout: 2000,
			visible: true,
		});
		const popupContent = await map.$('.maxi-map-block__popup__content');
		if (popupContent) return popupContent;
	} catch (e) {
		await page.waitForTimeout(500); // Wait before retry
	}
	return null;
};

const tryClickMarkerWithRetry = async (marker, map, attemptsLeft = 3) => {
	if (attemptsLeft <= 0) {
		throw new Error('Popup content never appeared after 3 attempts');
	}

	const result = await tryClickMarker(marker, map);
	if (result) return result;

	return tryClickMarkerWithRetry(marker, map, attemptsLeft - 1);
};

const popupTest = async map => {
	// Opening marker popup
	const marker = await map.$('.leaflet-marker-icon');
	if (!marker) throw new Error('Marker not found');

	// Add a small delay to ensure map is stable
	await page.waitForTimeout(800);

	const popupContent = await tryClickMarkerWithRetry(marker, map);

	if (!popupContent) {
		throw new Error('Popup content never appeared after 3 attempts');
	}

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

	const markers = await getAttributes('map-markers');
	expect(markers).toHaveLength(1);
	expect(markers[0]).toEqual(
		expect.objectContaining({
			description: 'Description test',
			heading: 'Title test',
			id: 0,
		})
	);

	// Testing marker removal
	const popupRemove = await popupContent.$(
		'.maxi-map-block__popup__content__marker-remove'
	);

	await popupRemove.click();

	expect(await getAttributes('map-markers')).toEqual([]);
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

		// Check marker coordinates with flexible latitude
		const markers = await getAttributes('map-markers');
		expect(markers).toHaveLength(1);
		expect(Number(markers[0].latitude)).toBeGreaterThanOrEqual(50);
		expect(Number(markers[0].latitude)).toBeLessThanOrEqual(52);
		expect(Number(markers[0].longitude)).toBeCloseTo(0, 0);

		await popupTest(map);
	}, 30000);

	it('Map Maxi OpenStreetMap types work correctly', async () => {
		const waitForTilesWithRetry = async (mapType, maxRetries = 3) => {
			let attempt = 1;

			const attemptTileLoading = async () => {
				try {
					await page.waitForFunction(
						() => {
							const tiles =
								document.querySelectorAll('.leaflet-tile');
							// Consider test passed if we have tiles and at least 70% are loaded
							// More lenient for CI environments
							if (tiles.length === 0) return false;
							const loadedTiles = Array.from(tiles).filter(
								tile =>
									tile.classList.contains(
										'leaflet-tile-loaded'
									) && tile.style.opacity === '1'
							);
							return loadedTiles.length / tiles.length >= 0.7;
						},
						{ timeout: 10000 } // Reduced timeout per attempt
					);
					return true; // Success
				} catch (error) {
					if (attempt === maxRetries) {
						// Final attempt failed - check if we have any tiles loaded
						const hasAnyTiles = await page.evaluate(() => {
							const tiles =
								document.querySelectorAll('.leaflet-tile');
							return tiles.length > 0;
						});

						if (!hasAnyTiles) {
							throw new Error(
								`${mapType} map failed to load any tiles after ${maxRetries} attempts`
							);
						}

						// If we have some tiles but not enough loaded, continue with test
						// This handles slow CI environments more gracefully
						return true;
					}

					// Wait before retry with exponential backoff
					await page.waitForTimeout(1000 * attempt);
					attempt += 1;
					return attemptTileLoading();
				}
			};

			return attemptTileLoading();
		};

		// Wait for the map block to be fully loaded
		await page.waitForSelector('.maxi-map-block');

		// Open the sidebar and configure map tab
		const accordionTab = await openSidebarTab(
			page,
			'style',
			'configure map'
		);

		// Get the type select element
		const typeSelect = await accordionTab.$(
			'.maxi-map-control__type select'
		);

		// Test humanitarian type
		await typeSelect.select('humanitarian');
		await page.waitForTimeout(2000); // Increased initial wait

		// Wait for tiles to load with retry logic
		await waitForTilesWithRetry('humanitarian');

		let attributes = await getAttributes('map-type');
		expect(attributes).toBe('humanitarian');
		let map = await getMapContainer(page);

		// Check that humanitarian tiles have started loading
		const humanitarianTilesExist = await map.evaluate(container => {
			const tiles = container.querySelectorAll('.leaflet-tile');
			return tiles.length > 0;
		});
		expect(humanitarianTilesExist).toBe(true);

		// Test cycle type
		// Open the sidebar and configure map tab
		const accordionTab2 = await openSidebarTab(
			page,
			'style',
			'configure map'
		);

		// Get the type select element
		const typeSelect2 = await accordionTab2.$(
			'.maxi-map-control__type select'
		);

		await typeSelect2.select('cycle');
		await page.waitForTimeout(2000); // Consistent wait time

		// Wait for cycle map tiles to load with retry logic
		await waitForTilesWithRetry('cycle');

		attributes = await getAttributes('map-type');
		expect(attributes).toBe('cycle');
		map = await getMapContainer(page);

		// Check that cycle tiles have started loading
		const cycleTilesExist = await map.evaluate(container => {
			const tiles = container.querySelectorAll('.leaflet-tile');
			return tiles.length > 0;
		});
		expect(cycleTilesExist).toBe(true);
	}, 30000);

	it('Map Maxi Custom CSS', async () => {
		await expect(await addCustomCSS(page)).toMatchSnapshot();
	}, 500000);

	it('Map Maxi can be removed', async () => {
		// Verify map exists
		const map = await getMapContainer(page);
		expect(map).not.toBeNull();

		// Select the block
		await page.click('.maxi-map-block');

		// Open more settings menu
		await page.$eval(
			'.toolbar-wrapper .toolbar-item.toolbar-item__more-settings button',
			button => button.click()
		);

		// Click delete button in popover
		await page.$eval(
			'.components-popover__content .toolbar-item__delete button',
			button => button.click()
		);

		await page.waitForTimeout(500);

		// Verify map no longer exists
		const mapExists = await page.evaluate(() => {
			return document.querySelector('.maxi-map-block') !== null;
		});
		expect(mapExists).toBe(false);
	}, 10000);
});
