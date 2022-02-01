/* eslint-disable jest/no-commented-out-tests */
/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	pressKeyWithModifier,
} from '@wordpress/e2e-test-utils';

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
} from '../../utils';

describe('BackgroundControl', () => {
	it('Check Background image layer', async () => {
		await createNewPost();
		await insertBlock('Group Maxi');
		await openSidebarTab(page, 'style', 'background layer');
		await addBackgroundLayer(page, 'image');

		// opacity
		await page.$$eval(
			'.maxi-background-control .maxi-advanced-number-control input',
			opacity => opacity[0].focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('55');

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

		// background position
		const positionSelector = await page.$(
			'.maxi-background-control__image-layer__position-selector select'
		);
		await positionSelector.select('left top');

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

		// background position
		const baseBackgroundPosition = await page.$eval(
			'.maxi-background-control__image-layer__position-selector select',
			selector => selector.value
		);
		expect(baseBackgroundPosition).toStrictEqual('left top');

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

		// background position
		const positionSelector = await page.$(
			'.maxi-background-control__image-layer__position-selector select'
		);
		await positionSelector.select('center top');

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

		// background position
		const sBackgroundPosition = await page.$eval(
			'.maxi-background-control__image-layer__position-selector select',
			selector => selector.value
		);
		expect(sBackgroundPosition).toStrictEqual('center top');

		// background attachment
		const sBackgroundAttachment = await page.$eval(
			'.maxi-background-control__image-layer__attachment-selector select',
			selector => selector.value
		);
		expect(sBackgroundAttachment).toStrictEqual('local');

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

		// background position
		const xsBackgroundPosition = await page.$eval(
			'.maxi-background-control__image-layer__position-selector select',
			selector => selector.value
		);
		expect(xsBackgroundPosition).toStrictEqual('center top');

		// background attachment
		const xsBackgroundAttachment = await page.$eval(
			'.maxi-background-control__image-layer__attachment-selector select',
			selector => selector.value
		);
		expect(xsBackgroundAttachment).toStrictEqual('local');

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

		// background position
		const mBackgroundPosition = await page.$eval(
			'.maxi-background-control__image-layer__position-selector select',
			selector => selector.value
		);
		expect(mBackgroundPosition).toStrictEqual('left top');

		// background attachment
		const mBackgroundAttachment = await page.$eval(
			'.maxi-background-control__image-layer__attachment-selector select',
			selector => selector.value
		);
		expect(mBackgroundAttachment).toStrictEqual('fixed');
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Check Background image layer hover', async () => {
		debugger;
		await changeResponsive(page, 'base');

		const accordion = await openSidebarTab(
			page,
			'style',
			'background layer'
		);

		// hover
		await accordion.$$eval('.maxi-tabs-control button', button =>
			button[1].click()
		);

		// enable hover
		await page.$eval(
			'.maxi-background-status-hover .maxi-toggle-switch__toggle input',
			button => button.click()
		);

		// hover options
		await page.$$eval(
			'.maxi-background-layers_options .maxi-background-layer__arrow',
			options => options[0].click()
		);

		// opacity
		await page.$$eval(
			'.maxi-background-control .maxi-advanced-number-control input',
			opacity => opacity[0].focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('82');

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
		// background position
		const positionSelector = await page.$(
			'.maxi-background-control__image-layer__position-selector select'
		);
		await positionSelector.select('center top');
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

		await originSelector.select('content box');

		// background clip
		const clipSelector = await page.$(
			'.maxi-background-control__image-layer__clip-selector select'
		);

		await clipSelector.select('border-box');

		// clip-path
		await page.$$eval('.clip-path-defaults button', buttons =>
			buttons[3].click()
		);

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

		// background position
		const baseBackgroundPosition = await page.$eval(
			'.maxi-background-control__image-layer__position-selector select',
			selector => selector.value
		);
		expect(baseBackgroundPosition).toStrictEqual('center top');

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
		// background position
		const positionSelector = await page.$(
			'.maxi-background-control__image-layer__position-selector select'
		);
		await positionSelector.select('left top');
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

		// background position
		const sBackgroundPosition = await page.$eval(
			'.maxi-background-control__image-layer__position-selector select',
			selector => selector.value
		);
		expect(sBackgroundPosition).toStrictEqual('left top');

		// background attachment
		const sBackgroundAttachment = await page.$eval(
			'.maxi-background-control__image-layer__attachment-selector select',
			selector => selector.value
		);
		expect(sBackgroundAttachment).toStrictEqual('scroll');

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

		// background position
		const xsBackgroundPosition = await page.$eval(
			'.maxi-background-control__image-layer__position-selector select',
			selector => selector.value
		);
		expect(xsBackgroundPosition).toStrictEqual('left top');

		// background attachment
		const xsBackgroundAttachment = await page.$eval(
			'.maxi-background-control__image-layer__attachment-selector select',
			selector => selector.value
		);
		expect(xsBackgroundAttachment).toStrictEqual('scroll');

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

		// background position
		const mBackgroundPosition = await page.$eval(
			'.maxi-background-control__image-layer__position-selector select',
			selector => selector.value
		);
		expect(mBackgroundPosition).toStrictEqual('center top');

		// background attachment
		const mBackgroundAttachment = await page.$eval(
			'.maxi-background-control__image-layer__attachment-selector select',
			selector => selector.value
		);
		expect(mBackgroundAttachment).toStrictEqual('local');
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
	it('Check Background Image layer display', async () => {
		const previewPage = await openPreviewPage(page);
		await previewPage.waitForSelector('.entry-content');

		const backgroundPreviewPage = await previewPage.$(
			'.maxi-group-block .maxi-background-displayer'
		);

		expect(backgroundPreviewPage).toBeTruthy();
	});
});
