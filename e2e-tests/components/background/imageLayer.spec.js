/* eslint-disable jest/no-commented-out-tests */
/**
 * WordPress dependencies
 */
import { createNewPost } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	getBlockAttributes,
	openSidebarTab,
	addBackgroundLayer,
	changeResponsive,
	openPreviewPage,
	getBlockStyle,
	editAdvancedNumberControl,
	insertMaxiBlock,
	updateAllBlockUniqueIds,
} from '../../utils';
import sizeAndPositionChecker from './utils/sizeAndPositionChecker';

// Test image URL - using a data URL to avoid network dependency
// This is a 1x1 red pixel PNG
const TEST_IMAGE_URL =
	'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==';

/**
 * Helper to set an image URL for the background layer
 * This enables the FocalPointPicker to appear
 */
const setBackgroundImageUrl = async (page, imageUrl) => {
	const urlInput = await page.$(
		'.maxi-background-control__image-layer .maxi-image-url-upload input'
	);

	if (urlInput) {
		await urlInput.click({ clickCount: 3 });
		await urlInput.type(imageUrl);
		// Wait for image to load and FocalPointPicker to appear
		await page.waitForTimeout(1000);
	}
};

/**
 * Helper to set focal point picker position
 * @param {Object} page - Puppeteer page
 * @param {number} x - X position (0-100)
 * @param {number} y - Y position (0-100)
 * @returns {boolean} - true if position was set, false if no FocalPointPicker found
 */
const setFocalPointPosition = async (page, x, y) => {
	// Check if focal point picker exists (it only shows when there's an image)
	const focalPointPicker = await page.$(
		'.maxi-background-control__image-layer .maxi-focal-point-picker'
	);

	if (!focalPointPicker) {
		// No FocalPointPicker - likely no image set for this state
		return false;
	}

	// Get all inputs inside the focal-point-picker controls
	// The UnitControl renders an input inside each control
	const focalPointInputs = await page.$$(
		'.maxi-background-control__image-layer .maxi-focal-point-picker .focal-point-picker__controls input'
	);

	if (focalPointInputs.length >= 2) {
		// First input is LEFT (x) - clear and type new value
		await focalPointInputs[0].click({ clickCount: 3 });
		await focalPointInputs[0].press('Backspace');
		await focalPointInputs[0].type(String(x), { delay: 50 });
		// Blur to trigger onChange
		await focalPointInputs[0].evaluate(el => el.blur());
		await page.waitForTimeout(100);

		// Second input is TOP (y) - clear and type new value
		await focalPointInputs[1].click({ clickCount: 3 });
		await focalPointInputs[1].press('Backspace');
		await focalPointInputs[1].type(String(y), { delay: 50 });
		// Blur to trigger onChange
		await focalPointInputs[1].evaluate(el => el.blur());
		await page.waitForTimeout(300);
		return true;
	}

	return false;
};

/**
 * Helper to get focal point picker position values
 * @param {Object} page - Puppeteer page
 * @returns {Object} - { x, y } position values
 */
const getFocalPointPosition = async page => {
	const focalPointInputs = await page.$$(
		'.maxi-background-control__image-layer .maxi-focal-point-picker .focal-point-picker__controls input'
	);

	if (focalPointInputs.length >= 2) {
		const x = await page.evaluate(el => el.value.replace('%', ''), focalPointInputs[0]);
		const y = await page.evaluate(el => el.value.replace('%', ''), focalPointInputs[1]);
		return { x, y };
	}

	return { x: '50', y: '50' };
};

describe('BackgroundControl', () => {
	it('Check Background image layer', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Group Maxi');
		await updateAllBlockUniqueIds(page);
		await openSidebarTab(page, 'style', 'background layer');
		await addBackgroundLayer(page, 'image');

		// Set image URL to enable FocalPointPicker
		await setBackgroundImageUrl(page, TEST_IMAGE_URL);

		// opacity
		await editAdvancedNumberControl({
			page,
			instance: await page.$(
				'.maxi-background-control .maxi-opacity-control'
			),
			newNumber: '55',
		});

		// selectors
		// background size
		const sizeSelector = await page.$(
			'.maxi-background-control__image-layer__size-selector select'
		);
		await sizeSelector.select('contain');

		// background repeat
		const repeatSelector = await page.$(
			'.maxi-background-control__image-layer__repeat-selector select'
		);
		await repeatSelector.select('repeat');

		// background position via FocalPointPicker (0% = left/top)
		await setFocalPointPosition(page, 0, 0);

		// background attachment
		const attachmentSelector = await page.$(
			'.maxi-background-control__image-layer__attachment-selector select'
		);

		await attachmentSelector.select('fixed');

		// more settings
		await page.$eval(
			'.maxi-tabs-content .maxi-background-image-more-settings--toggle input',
			button => button.click()
		);

		// background origin
		const originSelector = await page.$(
			'.maxi-background-control__image-layer__origin-selector select'
		);

		await originSelector.select('border-box');

		// background clip
		const clipSelector = await page.$(
			'.maxi-background-control__image-layer__clip-selector select'
		);

		await clipSelector.select('content-box');

		// clip-path
		await page.$eval(
			'.maxi-clip-path-control .maxi-toggle-switch__toggle input',
			input => input.click()
		);

		await page.$$eval('.clip-path-defaults button', buttons =>
			buttons[3].click()
		);

		await sizeAndPositionChecker({ page });

		const layerExpect = await getBlockAttributes();
		expect(layerExpect['background-layers']).toMatchSnapshot();
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Check Background image layer responsive', async () => {
		// general expects in S responsive
		await changeResponsive(page, 's');

		// background size
		const baseBackgroundSize = await page.$eval(
			'.maxi-background-control__image-layer__size-selector select',
			selector => selector.value
		);
		expect(baseBackgroundSize).toStrictEqual('contain');

		// background repeat
		const baseBackgroundRepeat = await page.$eval(
			'.maxi-background-control__image-layer__repeat-selector select',
			selector => selector.value
		);
		expect(baseBackgroundRepeat).toStrictEqual('repeat');

		// background position via FocalPointPicker
		const basePosition = await getFocalPointPosition(page);
		expect(basePosition.x).toStrictEqual('0');
		expect(basePosition.y).toStrictEqual('0');

		// background attachment
		const baseBackgroundAttachment = await page.$eval(
			'.maxi-background-control__image-layer__attachment-selector select',
			selector => selector.value
		);
		expect(baseBackgroundAttachment).toStrictEqual('fixed');

		// selectors
		// background size
		const sizeSelector = await page.$(
			'.maxi-background-control__image-layer__size-selector select'
		);
		await sizeSelector.select('cover');

		// background repeat
		const repeatSelector = await page.$(
			'.maxi-background-control__image-layer__repeat-selector select'
		);
		await repeatSelector.select('space');

		// background position via FocalPointPicker (50% = center, 0% = top)
		await setFocalPointPosition(page, 50, 0);

		// background attachment
		const attachmentSelector = await page.$(
			'.maxi-background-control__image-layer__attachment-selector select'
		);

		await attachmentSelector.select('local');

		// expect values
		// background size
		const sBackgroundSize = await page.$eval(
			'.maxi-background-control__image-layer__size-selector select',
			selector => selector.value
		);
		expect(sBackgroundSize).toStrictEqual('cover');

		// background repeat
		const sBackgroundRepeat = await page.$eval(
			'.maxi-background-control__image-layer__repeat-selector select',
			selector => selector.value
		);
		expect(sBackgroundRepeat).toStrictEqual('space');

		// background position via FocalPointPicker
		const sPosition = await getFocalPointPosition(page);
		expect(sPosition.x).toStrictEqual('50');
		expect(sPosition.y).toStrictEqual('0');

		// background attachment
		const sBackgroundAttachment = await page.$eval(
			'.maxi-background-control__image-layer__attachment-selector select',
			selector => selector.value
		);
		expect(sBackgroundAttachment).toStrictEqual('local');

		await sizeAndPositionChecker({ page, breakpoint: 's' });

		await changeResponsive(page, 'xs');
		const xsBackgroundSize = await page.$eval(
			'.maxi-background-control__image-layer__size-selector select',
			selector => selector.value
		);
		expect(xsBackgroundSize).toStrictEqual('cover');

		// background repeat
		const xsBackgroundRepeat = await page.$eval(
			'.maxi-background-control__image-layer__repeat-selector select',
			selector => selector.value
		);
		expect(xsBackgroundRepeat).toStrictEqual('space');

		// background position via FocalPointPicker
		const xsPosition = await getFocalPointPosition(page);
		expect(xsPosition.x).toStrictEqual('50');
		expect(xsPosition.y).toStrictEqual('0');

		// background attachment
		const xsBackgroundAttachment = await page.$eval(
			'.maxi-background-control__image-layer__attachment-selector select',
			selector => selector.value
		);
		expect(xsBackgroundAttachment).toStrictEqual('local');

		await sizeAndPositionChecker({ page, breakpoint: 'xs' });

		await changeResponsive(page, 'm');
		const mBackgroundSize = await page.$eval(
			'.maxi-background-control__image-layer__size-selector select',
			selector => selector.value
		);
		expect(mBackgroundSize).toStrictEqual('contain');

		// background repeat
		const mBackgroundRepeat = await page.$eval(
			'.maxi-background-control__image-layer__repeat-selector select',
			selector => selector.value
		);
		expect(mBackgroundRepeat).toStrictEqual('repeat');

		// background position via FocalPointPicker (inherits from base: 0, 0)
		const mPosition = await getFocalPointPosition(page);
		expect(mPosition.x).toStrictEqual('0');
		expect(mPosition.y).toStrictEqual('0');

		// background attachment
		const mBackgroundAttachment = await page.$eval(
			'.maxi-background-control__image-layer__attachment-selector select',
			selector => selector.value
		);
		expect(mBackgroundAttachment).toStrictEqual('fixed');

		await sizeAndPositionChecker({ page, breakpoint: 'm' });

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Check Background image layer hover', async () => {
		await changeResponsive(page, 'base');

		const accordion = await openSidebarTab(
			page,
			'style',
			'background layer'
		);

		// hover
		await accordion.$eval(
			'.maxi-tabs-control .maxi-tabs-control__button-hover',
			button => button.click()
		);

		// enable hover
		await page.$eval(
			'.maxi-background-status-hover .maxi-toggle-switch__toggle input',
			button => button.click()
		);

		// hover options
		await page.$$eval(
			'.maxi-list-control__options .maxi-list-item-control',
			options => options[0].click()
		);

		// opacity
		await editAdvancedNumberControl({
			page,
			instance: await page.$(
				'.maxi-background-control .maxi-opacity-control'
			),
			newNumber: '82',
		});

		// background size
		const sizeSelector = await page.$(
			'.maxi-background-control__image-layer__size-selector select'
		);
		await sizeSelector.select('cover');

		// background repeat
		const repeatSelector = await page.$(
			'.maxi-background-control__image-layer__repeat-selector select'
		);
		await repeatSelector.select('repeat-x');

		// Note: Hover layers don't have an image, so FocalPointPicker is not visible
		// Position testing is done via sizeAndPositionChecker for the layer wrapper

		// background attachment
		const attachmentSelector = await page.$(
			'.maxi-background-control__image-layer__attachment-selector select'
		);

		await attachmentSelector.select('local');
		// more settings
		await page.$eval(
			'.maxi-tabs-content .maxi-background-image-more-settings--toggle input',
			button => button.click()
		);

		// background origin
		const originSelector = await page.$(
			'.maxi-background-control__image-layer__origin-selector select'
		);

		await originSelector.select('content-box');

		// background clip
		const clipSelector = await page.$(
			'.maxi-background-control__image-layer__clip-selector select'
		);

		await clipSelector.select('border-box');

		// clip-path
		await page.$$eval('.clip-path-defaults button', buttons =>
			buttons[3].click()
		);

		await sizeAndPositionChecker({ page, isHover: true });

		const layerExpect = await getBlockAttributes();
		expect(layerExpect['background-layers']).toMatchSnapshot();
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Check Background image layer hover responsive', async () => {
		// general expects in S responsive
		await changeResponsive(page, 's');

		// background size
		const baseBackgroundSize = await page.$eval(
			'.maxi-background-control__image-layer__size-selector select',
			selector => selector.value
		);
		expect(baseBackgroundSize).toStrictEqual('cover');

		// background repeat
		const baseBackgroundRepeat = await page.$eval(
			'.maxi-background-control__image-layer__repeat-selector select',
			selector => selector.value
		);
		expect(baseBackgroundRepeat).toStrictEqual('repeat-x');

		// Note: Hover layers don't have an image, so FocalPointPicker is not visible
		// Skipping position testing via FocalPointPicker for hover

		// background attachment
		const baseBackgroundAttachment = await page.$eval(
			'.maxi-background-control__image-layer__attachment-selector select',
			selector => selector.value
		);
		expect(baseBackgroundAttachment).toStrictEqual('local');

		// change values in S responsive
		// background size
		const sizeSelector = await page.$(
			'.maxi-background-control__image-layer__size-selector select'
		);
		await sizeSelector.select('contain');

		// background repeat
		const repeatSelector = await page.$(
			'.maxi-background-control__image-layer__repeat-selector select'
		);
		await repeatSelector.select('repeat-y');

		// background attachment
		const attachmentSelector = await page.$(
			'.maxi-background-control__image-layer__attachment-selector select'
		);

		await attachmentSelector.select('scroll');

		// expect values
		// background size
		const sBackgroundSize = await page.$eval(
			'.maxi-background-control__image-layer__size-selector select',
			selector => selector.value
		);
		expect(sBackgroundSize).toStrictEqual('contain');

		// background repeat
		const sBackgroundRepeat = await page.$eval(
			'.maxi-background-control__image-layer__repeat-selector select',
			selector => selector.value
		);
		expect(sBackgroundRepeat).toStrictEqual('repeat-y');

		// background attachment
		const sBackgroundAttachment = await page.$eval(
			'.maxi-background-control__image-layer__attachment-selector select',
			selector => selector.value
		);
		expect(sBackgroundAttachment).toStrictEqual('scroll');

		await sizeAndPositionChecker({ page, breakpoint: 's', isHover: true });

		await changeResponsive(page, 'xs');
		const xsBackgroundSize = await page.$eval(
			'.maxi-background-control__image-layer__size-selector select',
			selector => selector.value
		);
		expect(xsBackgroundSize).toStrictEqual('contain');

		// background repeat
		const xsBackgroundRepeat = await page.$eval(
			'.maxi-background-control__image-layer__repeat-selector select',
			selector => selector.value
		);
		expect(xsBackgroundRepeat).toStrictEqual('repeat-y');

		// background attachment
		const xsBackgroundAttachment = await page.$eval(
			'.maxi-background-control__image-layer__attachment-selector select',
			selector => selector.value
		);
		expect(xsBackgroundAttachment).toStrictEqual('scroll');

		await sizeAndPositionChecker({ page, breakpoint: 'xs', isHover: true });

		await changeResponsive(page, 'm');
		const mBackgroundSize = await page.$eval(
			'.maxi-background-control__image-layer__size-selector select',
			selector => selector.value
		);
		expect(mBackgroundSize).toStrictEqual('cover');

		// background repeat
		const mBackgroundRepeat = await page.$eval(
			'.maxi-background-control__image-layer__repeat-selector select',
			selector => selector.value
		);
		expect(mBackgroundRepeat).toStrictEqual('repeat-x');

		// background attachment
		const mBackgroundAttachment = await page.$eval(
			'.maxi-background-control__image-layer__attachment-selector select',
			selector => selector.value
		);
		expect(mBackgroundAttachment).toStrictEqual('local');

		await sizeAndPositionChecker({ page, breakpoint: 'm', isHover: true });

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
	it('Check Background Image layer display', async () => {
		const checkEditor = await page.$eval(
			'.maxi-background-displayer',
			el => el.innerHTML
		);

		expect(checkEditor).toBeTruthy();
		const previewPage = await openPreviewPage(page);
		await previewPage.waitForSelector('.entry-content');

		const backgroundPreviewPage = await previewPage.$(
			'.maxi-group-block .maxi-background-displayer'
		);

		expect(backgroundPreviewPage).toBeTruthy();
	});
});
