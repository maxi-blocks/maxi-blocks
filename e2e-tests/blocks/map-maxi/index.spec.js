/**
 * WordPress dependencies
 */
import { createNewPost } from '@wordpress/e2e-test-utils';

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
	await page.waitForTimeout(150);

	// Testing popup description typing
	const popupDescription = await popupContent.$(
		'.maxi-map-block__popup__content__description'
	);

	await popupDescription.focus();
	await popupDescription.type('Description test');
	await page.waitForTimeout(150);

	expect(roundMarkersCoords(await getAttributes('m_mar'))).toMatchSnapshot();

	// Testing marker removal
	const popupRemove = await popupContent.$(
		'.maxi-map-block__popup__content__marker-remove'
	);

	await popupRemove.click();

	expect(roundMarkersCoords(await getAttributes('m_mar'))).toMatchSnapshot();
};

describe('Map Maxi', () => {
	beforeEach(async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Map Maxi');
		await page.waitForSelector('.maxi-map-block');
		await page.waitForTimeout(500);
	});

	it('Map Maxi does not break', async () => {
		expect(await getEditedPostContent(page)).toMatchSnapshot();
		expect(await getBlockStyle(page)).toMatchSnapshot();

		// Check frontend
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
			roundMarkersCoords(await getAttributes('m_mar'))
		).toMatchSnapshot();

		await popupTest(map);
	});

	it('Map Maxi add marker by search box', async () => {
		const map = await getMapContainer(page);

		await page.waitForSelector('.maxi-map-block__search-box');
		const searchBox = await map.$('.maxi-map-block__search-box');

		// Typing London in the search box
		await searchBox.$eval('input', input => input.focus());
		await searchBox.type('London', { delay: 100 });
		await page.waitForTimeout(150);

		// Starting search
		await page.waitForSelector('.maxi-map-block__search-box__button');
		await searchBox.$eval('.maxi-map-block__search-box__button', button =>
			button.click()
		);

		await page.waitForSelector('.maxi-map-block__search-box-results');
		const searchBoxResults = await map.$(
			'.maxi-map-block__search-box-results'
		);

		const searchBoxResultsButton = await searchBoxResults.$(
			'.maxi-map-block__search-box-results__button'
		);

		// Clicking on first search result
		await searchBoxResultsButton.click();

		expect(
			roundMarkersCoords(await getAttributes('m_mar'))
		).toMatchSnapshot();

		await popupTest(map);
	});

	it('Map Maxi Custom CSS', async () => {
		await expect(await addCustomCSS(page)).toMatchSnapshot();
	}, 500000);
});
