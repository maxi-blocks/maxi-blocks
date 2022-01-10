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
	modalMock,
	changeResponsive,
	removeBackgroundLayers,
	editAxisControl,
	getBlockStyle,
} from '../../utils';

describe('BackgroundControl', () => {
	beforeAll(async () => {
		await createNewPost();
		await insertBlock('Group Maxi');
		await openSidebarTab(page, 'style', 'background layer');
	});

	it('Check Background Color layer', async () => {
		await addBackgroundLayer(page, 'style', 'color');

		// change color
		await page.$$eval(
			'.maxi-background-layer__content .maxi-color-control__palette-container button',
			colorPalette => colorPalette[4].click()
		);

		// opacity
		await page.$eval(
			'.maxi-background-control .maxi-advanced-number-control input',
			opacity => opacity.focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('45');

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

	it('Check Background Color layer responsive', async () => {
		await changeResponsive(page, 's');

		// expect general
		const baseColorSelected = await page.$eval(
			'.maxi-color-control__palette-container .maxi-color-control__palette-box--active',
			select => select.getAttribute('data-item')
		);

		expect(baseColorSelected).toStrictEqual('5');

		// modify s responsive
		await page.$$eval(
			'.maxi-background-layer__content .maxi-color-control__palette-box',
			colorPalette => colorPalette[5].click()
		);

		// expect s
		const sColorSelected = await page.$eval(
			'.maxi-color-control__palette-container .maxi-color-control__palette-box--active',
			select => select.getAttribute('data-item')
		);
		expect(sColorSelected).toStrictEqual('6');

		// expect xs
		await changeResponsive(page, 'xs');

		const xsColorSelected = await page.$eval(
			'.maxi-color-control__palette-container .maxi-color-control__palette-box--active',
			select => select.getAttribute('data-item')
		);

		expect(xsColorSelected).toStrictEqual('6');

		// expect m
		await changeResponsive(page, 'm');

		const mColorSelected = await page.$eval(
			'.maxi-color-control__palette-container .maxi-color-control__palette-box--active',
			select => select.getAttribute('data-item')
		);

		expect(mColorSelected).toStrictEqual('5');
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Check Background Color layer hover', async () => {
		await changeResponsive(page, 'base');
		const accordion = await openSidebarTab(
			page,
			'style',
			'background layer'
		);

		// hover
		await accordion.$$eval(
			'.maxi-tabs-control--disable-padding button',
			button => button[1].click()
		);

		// enable hover
		await page.$eval(
			'.maxi-background-status-hover .maxi-toggle-switch__toggle input',
			button => button.click()
		);

		// hover options
		await page.$eval(
			'.maxi-background-layers_options .maxi-background-layer__arrow',
			options => options.click()
		);

		// change color
		await page.$$eval(
			'.maxi-background-layer__content .maxi-color-control__palette-container button',
			colorPalette => colorPalette[1].click()
		);

		// opacity
		await page.$eval(
			'.maxi-background-control .maxi-opacity-control input[type="number"]',
			opacity => opacity.focus()
		);
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('45');

		// clip-path
		await page.$$eval('.clip-path-defaults button', buttons =>
			buttons[2].click()
		);

		const layerExpect = await getBlockAttributes();
		expect(layerExpect['background-layers']).toMatchSnapshot();
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Check Background Color layer hover responsive', async () => {
		await changeResponsive(page, 's');

		// expect base value
		const baseColorSelected = await page.$eval(
			'.maxi-color-control__palette-container .maxi-color-control__palette-box--active',
			select => select.getAttribute('data-item')
		);

		expect(baseColorSelected).toStrictEqual('2');

		// modify s responsive
		await page.$$eval(
			'.maxi-background-layer__content .maxi-color-control__palette-container button',
			colorPalette => colorPalette[3].click()
		);

		// expect s
		const sColorSelected = await page.$eval(
			'.maxi-color-control__palette-container .maxi-color-control__palette-box--active',
			select => select.getAttribute('data-item')
		);
		expect(sColorSelected).toStrictEqual('4');

		// expect xs
		await changeResponsive(page, 'xs');

		const xsColorSelected = await page.$eval(
			'.maxi-color-control__palette-container .maxi-color-control__palette-box--active',
			select => select.getAttribute('data-item')
		);

		expect(xsColorSelected).toStrictEqual('4');

		// expect m
		await changeResponsive(page, 'm');

		const mColorSelected = await page.$eval(
			'.maxi-color-control__palette-container .maxi-color-control__palette-box--active',
			select => select.getAttribute('data-item')
		);

		expect(mColorSelected).toStrictEqual('2');
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Check Background image layer', async () => {
		await changeResponsive(page, 'base');

		await removeBackgroundLayers(page);
		await addBackgroundLayer(page, 'style', 'image');

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
		await changeResponsive(page, 'base');

		const accordion = await openSidebarTab(
			page,
			'style',
			'background layer'
		);

		// hover
		await accordion.$$eval(
			'.maxi-tabs-control--disable-padding button',
			button => button[1].click()
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

	it('Check Background video layer', async () => {
		await changeResponsive(page, 'base');
		await removeBackgroundLayers(page);
		await addBackgroundLayer(page, 'style', 'video');

		const video =
			'https://www.youtube.com/watch?v=C0DPdy98e4c&ab_channel=SimonYapp';

		// add VideoURL
		await page.$eval(
			'.maxi-background-control__video .maxi-text-control input',
			input => input.focus()
		);
		await page.keyboard.type(video);

		// edit start time
		await page.$eval('.maxi-background-video-start-time input', input =>
			input.focus()
		);
		await page.keyboard.type('55');

		// edit end time
		await page.$eval('.maxi-background-video-end-time input', input =>
			input.focus()
		);
		await page.keyboard.type('77');

		// add loop
		await page.$eval('.video-loop input', button => button.click());

		// video opacity
		await page.$$eval(
			'.maxi-background-control .maxi-opacity-control input',
			opacity => opacity[0].focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('44');

		const layerExpect = await getBlockAttributes();
		expect(layerExpect['background-layers']).toMatchSnapshot();
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Check Background video layer responsive', async () => {
		// general
		await changeResponsive(page, 's');
		const backgroundOpacityBase = await page.$eval(
			'.maxi-background-control .maxi-opacity-control input',
			input => input.value
		);

		expect(backgroundOpacityBase).toStrictEqual('44');

		// change opacity S
		await page.$eval(
			'.maxi-background-control .maxi-opacity-control input',
			input => input.focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('32');

		// expect s
		const backgroundOpacityS = await page.$eval(
			'.maxi-background-control .maxi-opacity-control input',
			input => input.value
		);

		expect(backgroundOpacityS).toStrictEqual('32');

		// expect Xs
		await changeResponsive(page, 'xs');
		const backgroundOpacityXs = await page.$eval(
			'.maxi-background-control .maxi-opacity-control input',
			input => input.value
		);
		expect(backgroundOpacityXs).toStrictEqual('32');
		// expect M
		await changeResponsive(page, 'm');
		const backgroundOpacityM = await page.$eval(
			'.maxi-background-control .maxi-opacity-control input',
			input => input.value
		);

		expect(backgroundOpacityM).toStrictEqual('44');
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Check Background video layer hover', async () => {
		await changeResponsive(page, 'base');
		const accordion = await openSidebarTab(
			page,
			'style',
			'background layer'
		);

		// hover
		await accordion.$$eval(
			'.maxi-tabs-control--disable-padding button',
			button => button[1].click()
		);

		// hover options
		await page.$$eval(
			'.maxi-background-layers_options .maxi-background-layer__arrow',
			options => options[0].click()
		);

		// video opacity
		await page.$$eval(
			'.maxi-background-control .maxi-opacity-control input',
			opacity => opacity[0].focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('82');

		const layerExpect = await getBlockAttributes();
		expect(layerExpect['background-layers']).toMatchSnapshot();
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Check Background video layer hover responsive', async () => {
		// general
		await changeResponsive(page, 's');

		const backgroundOpacityBase = await page.$$eval(
			'.maxi-background-control .maxi-opacity-control input',
			input => input[0].value
		);

		expect(backgroundOpacityBase).toStrictEqual('82');

		// change opacity S
		await page.$eval(
			'.maxi-background-control .maxi-opacity-control input',
			input => input.focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('45');

		// expect s
		const backgroundOpacityS = await page.$eval(
			'.maxi-background-control .maxi-opacity-control input',
			input => input.value
		);

		expect(backgroundOpacityS).toStrictEqual('45');

		// expect Xs
		await changeResponsive(page, 'xs');
		const backgroundOpacityXs = await page.$eval(
			'.maxi-background-control .maxi-opacity-control input',
			input => input.value
		);
		expect(backgroundOpacityXs).toStrictEqual('45');

		// expect M
		await changeResponsive(page, 'm');
		const backgroundOpacityM = await page.$eval(
			'.maxi-background-control .maxi-opacity-control input',
			input => input.value
		);

		expect(backgroundOpacityM).toStrictEqual('82');
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	// Here are the tests of svg-fill-control
	it('Check Background shape layer', async () => {
		await changeResponsive(page, 'base');
		await removeBackgroundLayers(page);
		await addBackgroundLayer(page, 'style', 'shape');
		const accordion = await openSidebarTab(
			page,
			'style',
			'background layer'
		);

		await accordion.$$eval(
			'.maxi-tabs-control--disable-padding button',
			button => button[0].click()
		);

		await modalMock(page, { type: 'bg-shape', isBGLayers: true });
		await page.$eval('.maxi-background-layer__arrow', display =>
			display.click()
		);

		// opacity
		const opacityInput = await page.$$(
			'.maxi-color-control .maxi-advanced-number-control input'
		);

		await opacityInput[0].focus();
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('77');

		// size
		await page.$$eval(
			'.maxi-background-control__svg-layer--size .maxi-tabs-control button',
			sizeButton => sizeButton[1].click()
		);

		const sizeInput = await page.$$(
			'.maxi-background-control__svg-layer--size .maxi-advanced-number-control input'
		);

		await sizeInput[0].focus();
		await page.keyboard.type('43');

		const layerExpect = await getBlockAttributes();
		expect(layerExpect['background-layers']).toMatchSnapshot();

		expect(await getBlockStyle(page)).toMatchSnapshot();
		debugger;
	});

	it('Check Background shape layer responsive', async () => {
		await changeResponsive(page, 's');

		const baseBackgroundOpacity = await page.$eval(
			'.maxi-color-control .maxi-advanced-number-control input',
			selector => selector.value
		);

		expect(baseBackgroundOpacity).toStrictEqual('77');

		await page.$$eval(
			'.maxi-background-control__svg-layer--size .maxi-tabs-control button',
			sizeButton => sizeButton[1].click()
		);

		const baseBackgroundShapeSize = await page.$$eval(
			'.maxi-background-control__svg-layer--size .maxi-advanced-number-control input',
			selector => selector[0].value
		);

		expect(baseBackgroundShapeSize).toStrictEqual('43');

		// opacity and size
		const opacityInput = await page.$$(
			'.maxi-color-control .maxi-advanced-number-control input'
		);

		await opacityInput[0].focus();
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('54');

		const sizeInput = await page.$$(
			'.maxi-background-control__svg-layer--size .maxi-advanced-number-control input'
		);

		await sizeInput[0].focus();
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('23');

		// expect S responsive
		const sBackgroundOpacity = await page.$eval(
			'.maxi-color-control .maxi-advanced-number-control input',
			selector => selector.value
		);

		expect(sBackgroundOpacity).toStrictEqual('54');

		const sBackgroundShapeSize = await page.$$eval(
			'.maxi-background-control__svg-layer--size .maxi-advanced-number-control input',
			selector => selector[0].value
		);

		expect(sBackgroundShapeSize).toStrictEqual('23');

		// expect XS responsive
		await changeResponsive(page, 'xs');

		const xsBackgroundOpacity = await page.$eval(
			'.maxi-color-control .maxi-advanced-number-control input',
			selector => selector.value
		);

		expect(xsBackgroundOpacity).toStrictEqual('54');

		await page.$$eval(
			'.maxi-background-control__svg-layer--size .maxi-tabs-control button',
			sizeButton => sizeButton[1].click()
		);

		const xsBackgroundShapeSize = await page.$$eval(
			'.maxi-background-control__svg-layer--size .maxi-advanced-number-control input',
			selector => selector[0].value
		);

		expect(xsBackgroundShapeSize).toStrictEqual('23');

		// expect M responsive
		await changeResponsive(page, 'm');

		const mBackgroundOpacity = await page.$eval(
			'.maxi-color-control .maxi-advanced-number-control input',
			selector => selector.value
		);

		expect(mBackgroundOpacity).toStrictEqual('77');

		await page.$$eval(
			'.maxi-background-control__svg-layer--size .maxi-tabs-control button',
			sizeButton => sizeButton[1].click()
		);

		const mBackgroundShapeSize = await page.$$eval(
			'.maxi-background-control__svg-layer--size .maxi-advanced-number-control input',
			selector => selector[0].value
		);

		expect(mBackgroundShapeSize).toStrictEqual('43');
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Check Background shape layer hover', async () => {
		await changeResponsive(page, 'base');
		const accordion = await openSidebarTab(
			page,
			'style',
			'background layer'
		);

		// hover
		await accordion.$$eval(
			'.maxi-tabs-control--disable-padding button',
			button => button[1].click()
		);

		// hover options
		await page.$$eval(
			'.maxi-background-layers_options .maxi-background-layer__arrow',
			options => options[0].click()
		);

		await editAxisControl({
			page,
			instance: await page.$('.maxi-background-control__svg-layer--size'),
			values: '66',
		});

		// size
		await page.$$eval(
			'.maxi-responsive-tabs-control .maxi-settingstab-control .maxi-tabs-control button',
			sizeButton => sizeButton[1].click()
		);

		const sizeInput = await page.$$(
			'.maxi-background-control__svg-layer--size .maxi-advanced-number-control input'
		);

		await sizeInput[0].focus();
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('22');

		const layerExpect = await getBlockAttributes();
		expect(layerExpect['background-layers']).toMatchSnapshot();
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Check Background shape layer hover responsive', async () => {
		await changeResponsive(page, 's');

		await page.$$eval(
			'.maxi-background-control__svg-layer--size .maxi-tabs-control button',
			sizeButton => sizeButton[1].click()
		);

		const baseBackgroundShapeSize = await page.$$eval(
			'.maxi-background-control__svg-layer--size .maxi-advanced-number-control input',
			selector => selector[0].value
		);

		expect(baseBackgroundShapeSize).toStrictEqual('22');

		// size
		const sizeInput = await page.$$(
			'.maxi-background-control__svg-layer--size .maxi-advanced-number-control input'
		);

		await sizeInput[0].focus();
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('12');

		// expect S responsive
		const sBackgroundShapeSize = await page.$$eval(
			'.maxi-background-control__svg-layer--size .maxi-advanced-number-control input',
			selector => selector[0].value
		);

		expect(sBackgroundShapeSize).toStrictEqual('12');

		// expect XS responsive
		await changeResponsive(page, 'xs');

		await page.$$eval(
			'.maxi-background-control__svg-layer--size .maxi-tabs-control button',
			sizeButton => sizeButton[1].click()
		);

		const xsBackgroundShapeSize = await page.$$eval(
			'.maxi-background-control__svg-layer--size .maxi-advanced-number-control input',
			selector => selector[0].value
		);

		expect(xsBackgroundShapeSize).toStrictEqual('12');

		// expect M responsive
		await changeResponsive(page, 'm');

		await page.$$eval(
			'.maxi-background-control__svg-layer--size .maxi-tabs-control button',
			sizeButton => sizeButton[1].click()
		);

		const mBackgroundShapeSize = await page.$$eval(
			'.maxi-background-control__svg-layer--size .maxi-advanced-number-control input',
			selector => selector[0].value
		);

		expect(mBackgroundShapeSize).toStrictEqual('22');
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('generate a layer from hover on responsive and test that layers cannot be deleted from hover', async () => {
		await removeBackgroundLayers(page);
		await changeResponsive(page, 'l');
		await addBackgroundLayer(page, 'style', 'color');
		const accordion = await openSidebarTab(
			page,
			'style',
			'background layer'
		);

		// hover
		await accordion.$$eval(
			'.maxi-tabs-control--disable-padding button',
			button => button[1].click()
		);

		const deleteOption = await page.$$eval(
			'.maxi-background-layer__title',
			backgroundLayerTitle => backgroundLayerTitle[0].innerHTML
		);

		expect(deleteOption).toMatchSnapshot();
		const layerExpect = await getBlockAttributes();
		expect(layerExpect['background-layers']).toMatchSnapshot();
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('generate a layer from hover and test the hider', async () => {
		// hover

		await addBackgroundLayer(page, 'style', 'color', true);
		await addBackgroundLayer(page, 'style', 'image', true);
		await addBackgroundLayer(page, 'style', 'video', true);
		await addBackgroundLayer(page, 'style', 'shape', true);

		// hide layer
		await page.$eval(
			'.maxi-background-layer__title .maxi-background-layer__title__display',
			button => button.click()
		);

		const hideLayer = await page.$$eval(
			'.maxi-background-layer__title .maxi-background-layer__title__display',
			backgroundLayerTitle => backgroundLayerTitle.innerHTML
		);

		expect(hideLayer).toMatchSnapshot();

		const layerExpect = await getBlockAttributes();
		expect(layerExpect['background-layers-hover']).toMatchSnapshot();
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
