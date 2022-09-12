/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
import {
	addCustomCSS,
	getAttributes,
	getBlockStyle,
	getEditedPostContent,
	openPreviewPage,
} from '../../utils';
import getMapContainer from './utils/getMapContainer';
import roundMarkersCoords from './utils/roundMarkersCoords';

const popupTest = async map => {
	// Opening marker popup
	const marker = await map.$('.leaflet-marker-icon');

	await page.waitForTimeout(600);

	await marker.click();

	await page.waitForTimeout(150);

	const popupContent = await map.$('.maxi-map-block__popup__content');

	// Testing popup title typing
	const popupTitle = await popupContent.$(
		'.maxi-map-block__popup__content__title'
	);

	await popupTitle.focus();
	await popupTitle.type('Title test');

	// Testing popup description typing
	const popupDescription = await popupContent.$(
		'.maxi-map-block__popup__content__description'
	);

	await popupDescription.focus();
	await popupDescription.type('Description test');

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
		await insertBlock('Map Maxi');
	});

	it('Map Maxi does not break', async () => {
		expect(await getEditedPostContent(page)).toMatchSnapshot();
		expect(await getBlockStyle(page)).toMatchSnapshot();

		// Check frontend
		const previewPage = await openPreviewPage(page);
		await previewPage.waitForSelector('.leaflet-container');
		await page.waitForTimeout(150);
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

		const searchBox = await map.$('.maxi-map-block__search-box');

		// Typing London in the search box
		await searchBox.focus();
		await searchBox.type('London');

		// Starting search
		await searchBox.$eval('.maxi-map-block__search-box__button', button =>
			button.click()
		);

		await map.waitForSelector('.maxi-map-block__search-box-results');

		const searchBoxResults = await map.$(
			'.maxi-map-block__search-box-results'
		);

		const searchBoxResultsButton = await searchBoxResults.$(
			'.maxi-map-block__search-box-results__button'
		);

		// Clicking on first search result
		await searchBoxResultsButton.click();

		expect(
			roundMarkersCoords(await getAttributes('map-markers'))
		).toMatchSnapshot();

		await popupTest(map);
	});

	it('Map Maxi Custom CSS', async () => {
		await expect(await addCustomCSS(page)).toMatchSnapshot();
	}, 500000);
});
