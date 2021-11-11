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
 * Interactive dependencies
 */
import {
	getBlockAttributes,
	openSidebarTab,
	addBackgroundLayer,
	modalMock,
	changeResponsive,
} from '../../utils';

describe('BackgroundControl', () => {
	beforeAll(async () => {
		await createNewPost();
		await insertBlock('Group Maxi');
		await openSidebarTab(page, 'style', 'background layer');
	});

	it.only('Check Background Color layer', async () => {
		await addBackgroundLayer(page, 'color');

		// change color
		await page.$$eval(
			'.maxi-background-layer__content .maxi-sc-color-palette__box',
			colorPalette => colorPalette[4].click()
		);

		// opacity
		await page.$eval(
			'.maxi-background-control .maxi-advanced-number-control input',
			opacity => opacity.focus()
		);

		pressKeyWithModifier('primary', 'a');
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
	});

	it('Check Background Color layer responsive', async () => {
		// expect general
		const baseColorSelected = await page.$eval(
			'.maxi-sc-color-palette__box--active',
			select => select.getAttribute('data-item')
		);

		expect(baseColorSelected).toStrictEqual('5');

		// modify s responsive
		await changeResponsive(page, 's');

		await page.$$eval(
			'.maxi-background-layer__content .maxi-sc-color-palette__box',
			colorPalette => colorPalette[5].click()
		);

		// expect s
		const sColorSelected = await page.$eval(
			'.maxi-sc-color-palette__box--active',
			select => select.getAttribute('data-item')
		);
		expect(sColorSelected).toStrictEqual('6');

		// expect xs
		await changeResponsive(page, 'xs');

		const xsColorSelected = await page.$eval(
			'.maxi-sc-color-palette__box--active',
			select => select.getAttribute('data-item')
		);

		expect(xsColorSelected).toStrictEqual('6');

		// expect m
		await changeResponsive(page, 'm');

		const mColorSelected = await page.$eval(
			'.maxi-sc-color-palette__box--active',
			select => select.getAttribute('data-item')
		);

		expect(mColorSelected).toStrictEqual('5');
	});

	it('Check Background Color layer hover', async () => {
		await changeResponsive(page, 'xl');
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
			'.maxi-background-layer__content .maxi-sc-color-palette__box',
			colorPalette => colorPalette[1].click()
		);

		// opacity
		await page.$eval(
			'.maxi-background-control .maxi-advanced-number-control input',
			opacity => opacity.focus()
		);
		pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('45');

		// clip-path
		await page.$$eval('.clip-path-defaults button', buttons =>
			buttons[2].click()
		);

		const layerExpect = await getBlockAttributes();
		expect(layerExpect['background-layers']).toMatchSnapshot();
	});

	it('Check Background Color layer hover responsive', async () => {
		// expect base value
		const baseColorSelected = await page.$eval(
			'.maxi-sc-color-palette__box--active',
			select => select.getAttribute('data-item')
		);

		expect(baseColorSelected).toStrictEqual('2');

		// modify s responsive
		await changeResponsive(page, 's');

		await page.$$eval(
			'.maxi-background-layer__content .maxi-sc-color-palette__box',
			colorPalette => colorPalette[3].click()
		);

		// expect s
		const sColorSelected = await page.$eval(
			'.maxi-sc-color-palette__box--active',
			select => select.getAttribute('data-item')
		);
		expect(sColorSelected).toStrictEqual('4');

		// expect xs
		await changeResponsive(page, 'xs');

		const xsColorSelected = await page.$eval(
			'.maxi-sc-color-palette__box--active',
			select => select.getAttribute('data-item')
		);

		expect(xsColorSelected).toStrictEqual('4');

		// expect m
		await changeResponsive(page, 'm');

		const mColorSelected = await page.$eval(
			'.maxi-sc-color-palette__box--active',
			select => select.getAttribute('data-item')
		);

		expect(mColorSelected).toStrictEqual('2');
	});

	it.only('Check Background image layer', async () => {
		await addBackgroundLayer(page, 'image');

		// opacity
		await page.$$eval(
			'.maxi-background-control .maxi-advanced-number-control input',
			opacity => opacity[0].focus()
		);

		pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('55');

		// selectors
		const backgroundSelectors = await page.$$(
			'.maxi-tab-content--selected select'
		);

		// background size
		await backgroundSelectors[1].select('contain');

		// background repeat
		await backgroundSelectors[2].select('repeat');

		// background position
		await backgroundSelectors[3].select('left top');

		// background attachment
		await backgroundSelectors[4].select('fixed');

		// more settings
		await page.$eval(
			'.maxi-tabs-content .maxi-background-image-more-settings--toggle input',
			button => button.click()
		);

		const moreSettingsSelectors = await page.$$(
			'.maxi-tab-content--selected select'
		);

		// background origin
		await moreSettingsSelectors[5].select('border-box');

		// background clip
		await moreSettingsSelectors[6].select('content-box');

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
	});

	it.only('Check Background image layer responsive', async () => {
		// general expects in S responsive
		await changeResponsive(page, 's');

		// background size
		const baseBackgroundSize = await page.$$eval(
			'.maxi-tab-content--selected select',
			selector => selector[0].value
		);
		expect(baseBackgroundSize).toStrictEqual('contain');

		// background repeat
		const baseBackgroundRepeat = await page.$$eval(
			'.maxi-tab-content--selected select',
			selector => selector[1].value
		);
		expect(baseBackgroundRepeat).toStrictEqual('repeat');

		// background position
		const baseBackgroundPosition = await page.$$eval(
			'.maxi-tab-content--selected select',
			selector => selector[2].value
		);
		expect(baseBackgroundPosition).toStrictEqual('left top');

		// background attachment
		const baseBackgroundAttachment = await page.$$eval(
			'.maxi-tab-content--selected select',
			selector => selector[3].value
		);
		expect(baseBackgroundAttachment).toStrictEqual('fixed');
		/// ///////////////////////////////////////////////////////
		// background origin
		/* const baseBackgroundOrigin = await page.$$eval(
			'.maxi-tab-content--selected select',
			selector => selector[4].value
		);
		expect(baseBackgroundOrigin).toStrictEqual('border-box');

		// background clip
		const baseBackgroundClip = await page.$$eval(
			'.maxi-tab-content--selected select',
			selector => selector[5].value
		);
		expect(baseBackgroundClip).toStrictEqual('content-box'); */
		/// //////////////////////////////////////////////////////
		// change values in S responsive

		// selectors
		const backgroundSelectors = await page.$$(
			'.maxi-tab-content--selected select'
		);

		// background size
		await backgroundSelectors[0].select('cover');

		// background repeat
		await backgroundSelectors[1].select('space');

		// background position
		await backgroundSelectors[2].select('center top');

		// background attachment
		await backgroundSelectors[3].select('local');

		// background origin
		/* await backgroundSelectors[4].select('padding-box');

		// background clip
		await backgroundSelectors[5].select('border-box'); */

		// expect values
		// background size
		const sBackgroundSize = await page.$$eval(
			'.maxi-tab-content--selected select',
			selector => selector[0].value
		);
		expect(sBackgroundSize).toStrictEqual('cover');

		// background repeat
		const sBackgroundRepeat = await page.$$eval(
			'.maxi-tab-content--selected select',
			selector => selector[1].value
		);
		expect(sBackgroundRepeat).toStrictEqual('space');

		// background position
		const sBackgroundPosition = await page.$$eval(
			'.maxi-tab-content--selected select',
			selector => selector[2].value
		);
		expect(sBackgroundPosition).toStrictEqual('center top');

		// background attachment
		const sBackgroundAttachment = await page.$$eval(
			'.maxi-tab-content--selected select',
			selector => selector[3].value
		);
		expect(sBackgroundAttachment).toStrictEqual('local');
		/// ////////////////////////////////////////////////
		// background origin
		/* const sBackgroundOrigin = await page.$$eval(
			'.maxi-tab-content--selected select',
			selector => selector[4].value
		);
		expect(sBackgroundOrigin).toStrictEqual('padding-box');

		// background clip
		const sBackgroundClip = await page.$$eval(
			'.maxi-tab-content--selected select',
			selector => selector[5].value
		);
		expect(sBackgroundClip).toStrictEqual('border-box'); */
		/// /////////////////////////////////////////////////

		await changeResponsive(page, 'xs');
		const xsBackgroundSize = await page.$$eval(
			'.maxi-tab-content--selected select',
			selector => selector[0].value
		);
		expect(xsBackgroundSize).toStrictEqual('cover');

		// background repeat
		const xsBackgroundRepeat = await page.$$eval(
			'.maxi-tab-content--selected select',
			selector => selector[1].value
		);
		expect(xsBackgroundRepeat).toStrictEqual('space');

		// background position
		const xsBackgroundPosition = await page.$$eval(
			'.maxi-tab-content--selected select',
			selector => selector[2].value
		);
		expect(xsBackgroundPosition).toStrictEqual('center top');

		// background attachment
		const xsBackgroundAttachment = await page.$$eval(
			'.maxi-tab-content--selected select',
			selector => selector[3].value
		);
		expect(xsBackgroundAttachment).toStrictEqual('local');

		await changeResponsive(page, 'm');
		const mBackgroundSize = await page.$$eval(
			'.maxi-tab-content--selected select',
			selector => selector[0].value
		);
		expect(mBackgroundSize).toStrictEqual('contain');

		// background repeat
		const mBackgroundRepeat = await page.$$eval(
			'.maxi-tab-content--selected select',
			selector => selector[1].value
		);
		expect(mBackgroundRepeat).toStrictEqual('repeat');

		// background position
		const mBackgroundPosition = await page.$$eval(
			'.maxi-tab-content--selected select',
			selector => selector[2].value
		);
		expect(mBackgroundPosition).toStrictEqual('left top');

		// background attachment
		const mBackgroundAttachment = await page.$$eval(
			'.maxi-tab-content--selected select',
			selector => selector[3].value
		);
		expect(mBackgroundAttachment).toStrictEqual('fixed');
	});

	it.only('Check Background image layer hover', async () => {
		debugger;
		await changeResponsive(page, 'xl');
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
			options => options[1].click()
		);

		// opacity
		await page.$$eval(
			'.maxi-background-control .maxi-advanced-number-control input',
			opacity => opacity[0].focus()
		);

		pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('82');

		// selectors
		const backgroundSelectors = await page.$$(
			'.maxi-tab-content--selected select'
		);

		// background size
		await backgroundSelectors[1].select('cover');

		// background repeat
		await backgroundSelectors[2].select('repeat-x');

		// background position
		await backgroundSelectors[3].select('center top');

		// background attachment
		await backgroundSelectors[4].select('local');

		// more settings
		await page.$eval(
			'.maxi-tabs-content .maxi-background-image-more-settings--toggle input',
			button => button.click()
		);

		const moreSettingsSelectors = await page.$$(
			'.maxi-tab-content--selected select'
		);

		// background origin
		await moreSettingsSelectors[5].select('content-box');

		// background clip
		await moreSettingsSelectors[6].select('padding-box');

		// clip-path
		await page.$$eval('.clip-path-defaults button', buttons =>
			buttons[3].click()
		);

		const layerExpect = await getBlockAttributes();
		expect(layerExpect['background-layers']).toMatchSnapshot();
	});
	it.only('Check Background image layer hover responsive', async () => {
		// general expects in S responsive
		await changeResponsive(page, 's');

		// background size
		const baseBackgroundSize = await page.$$eval(
			'.maxi-tab-content--selected select',
			selector => selector[0].value
		);
		expect(baseBackgroundSize).toStrictEqual('cover');

		// background repeat
		const baseBackgroundRepeat = await page.$$eval(
			'.maxi-tab-content--selected select',
			selector => selector[1].value
		);
		expect(baseBackgroundRepeat).toStrictEqual('repeat-x');

		// background position
		const baseBackgroundPosition = await page.$$eval(
			'.maxi-tab-content--selected select',
			selector => selector[2].value
		);
		expect(baseBackgroundPosition).toStrictEqual('center top');

		// background attachment
		const baseBackgroundAttachment = await page.$$eval(
			'.maxi-tab-content--selected select',
			selector => selector[3].value
		);
		expect(baseBackgroundAttachment).toStrictEqual('local');

		// change values in S responsive
		// selectors
		const backgroundSelectors = await page.$$(
			'.maxi-tab-content--selected select'
		);

		// background size
		await backgroundSelectors[0].select('contain');

		// background repeat
		await backgroundSelectors[1].select('repeat-y');

		// background position
		await backgroundSelectors[2].select('left top');

		// background attachment
		await backgroundSelectors[3].select('scroll');

		// expect values
		// background size
		const sBackgroundSize = await page.$$eval(
			'.maxi-tab-content--selected select',
			selector => selector[0].value
		);
		expect(sBackgroundSize).toStrictEqual('contain');

		// background repeat
		const sBackgroundRepeat = await page.$$eval(
			'.maxi-tab-content--selected select',
			selector => selector[1].value
		);
		expect(sBackgroundRepeat).toStrictEqual('repeat-y');

		// background position
		const sBackgroundPosition = await page.$$eval(
			'.maxi-tab-content--selected select',
			selector => selector[2].value
		);
		expect(sBackgroundPosition).toStrictEqual('left top');

		// background attachment
		const sBackgroundAttachment = await page.$$eval(
			'.maxi-tab-content--selected select',
			selector => selector[3].value
		);
		expect(sBackgroundAttachment).toStrictEqual('scroll');

		await changeResponsive(page, 'xs');
		const xsBackgroundSize = await page.$$eval(
			'.maxi-tab-content--selected select',
			selector => selector[0].value
		);
		expect(xsBackgroundSize).toStrictEqual('contain');

		// background repeat
		const xsBackgroundRepeat = await page.$$eval(
			'.maxi-tab-content--selected select',
			selector => selector[1].value
		);
		expect(xsBackgroundRepeat).toStrictEqual('repeat-y');

		// background position
		const xsBackgroundPosition = await page.$$eval(
			'.maxi-tab-content--selected select',
			selector => selector[2].value
		);
		expect(xsBackgroundPosition).toStrictEqual('left top');

		// background attachment
		const xsBackgroundAttachment = await page.$$eval(
			'.maxi-tab-content--selected select',
			selector => selector[3].value
		);
		expect(xsBackgroundAttachment).toStrictEqual('scroll');

		await changeResponsive(page, 'm');
		const mBackgroundSize = await page.$$eval(
			'.maxi-tab-content--selected select',
			selector => selector[0].value
		);
		expect(mBackgroundSize).toStrictEqual('cover');

		// background repeat
		const mBackgroundRepeat = await page.$$eval(
			'.maxi-tab-content--selected select',
			selector => selector[1].value
		);
		expect(mBackgroundRepeat).toStrictEqual('repeat-x');

		// background position
		const mBackgroundPosition = await page.$$eval(
			'.maxi-tab-content--selected select',
			selector => selector[2].value
		);
		expect(mBackgroundPosition).toStrictEqual('center top');

		// background attachment
		const mBackgroundAttachment = await page.$$eval(
			'.maxi-tab-content--selected select',
			selector => selector[3].value
		);
		expect(mBackgroundAttachment).toStrictEqual('local');
	});

	it('Check Background video layer', async () => {
		await changeResponsive(page, 'xl');
		await addBackgroundLayer(page, 'video');

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
		await page.$eval('.maxi-background-video-start-time input', input =>
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

		pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('44');

		const layerExpect = await getBlockAttributes();
		expect(layerExpect['background-layers']).toMatchSnapshot();
	});

	it('Check Background video layer responsive', async () => {
		// general
		const startTimeInputBase = await page.$$eval(
			'.maxi-background-video-start-time input',
			input => input[0].value()
		);

		expect(startTimeInputBase).toStrictEqual('55');

		await page.keyboard.type('55');

		expect(layerExpect['background-layers']).toMatchSnapshot();

		await changeResponsive(page, 's');

		// edit start time S
		await page.$eval('.maxi-background-video-start-time input', input =>
			input.focus()
		);

		await page.keyboard.type('89');

		const startTimeInputS = await page.$$eval(
			'.maxi-background-video-start-time input',
			input => input[0].value()
		);
		expect(startTimeInputS).toStrictEqual('89');

		// edit start time Xs
		const startTimeInputXs = await page.$$eval(
			'.maxi-background-video-start-time input',
			input => input[0].value()
		);
		expect(startTimeInputXs).toStrictEqual('89');

		// edit start time M
		const startTimeInputM = await page.$$eval(
			'.maxi-background-video-start-time input',
			input => input[0].value()
		);
		expect(startTimeInputM).toStrictEqual('89');

		const layerExpect = await getBlockAttributes();
		expect(layerExpect['background-layers']).toMatchSnapshot();
	});

	it('Check Background video layer hover', async () => {
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
			options => options[2].click()
		);

		// edit start time
		await page.$eval('.maxi-background-video-start-time input', input =>
			input.focus()
		);
		await page.keyboard.type('11');

		// edit end time
		await page.$eval('.maxi-background-video-start-time input', input =>
			input.focus()
		);
		await page.keyboard.type('33');

		// add loop
		await page.$eval('.video-loop input', button => button.click());

		// video opacity
		await page.$$eval(
			'.maxi-background-control .maxi-opacity-control input',
			opacity => opacity[0].focus()
		);

		pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('82');

		const layerExpect = await getBlockAttributes();
		expect(layerExpect['background-layers']).toMatchSnapshot();
	});
	it('Check Background shape layer', async () => {
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
		await page.keyboard.type('77');

		// sync button
		await page.$$eval('.maxi-axis-control__middle-part button', input =>
			input[0].click()
		);

		// position top
		const positionTop = await page.$$(
			'.maxi-axis-control__content__item__top input'
		);

		await positionTop[0].focus();
		await page.keyboard.type('25');

		// size
		await page.$$eval(
			'.maxi-responsive-tabs-control .maxi-settingstab-control .maxi-tabs-control button',
			sizeButton => sizeButton[1].click()
		);

		const sizeInput = await page.$$(
			'.maxi-tabs-content--disable-padding .maxi-tab-content--selected .maxi-tab-content--selected input'
		);

		await sizeInput[8].focus();
		await page.keyboard.type('77');

		const layerExpect = await getBlockAttributes();
		expect(layerExpect['background-layers']).toMatchSnapshot();
	});

	it('Check Background shape layer responsive', async () => {
		await page;
		await page.keyboard.type('25');

		// size
		await page.$$eval(
			'.maxi-responsive-tabs-control .maxi-settingstab-control .maxi-tabs-control button',
			sizeButton => sizeButton[1].click()
		);

		const sizeInput = await page.$$(
			'.maxi-tabs-content--disable-padding .maxi-tab-content--selected .maxi-tab-content--selected input'
		);

		await sizeInput[8].focus();
		await page.keyboard.type('77');

		const layerExpect = await getBlockAttributes();
		expect(layerExpect['background-layers']).toMatchSnapshot();
	});

	it('Check Background shape layer hover', async () => {
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
		const opacityInput = await page.$$(
			'.maxi-color-control .maxi-advanced-number-control input'
		);

		await opacityInput[0].focus();
		await page.keyboard.type('77');

		// sync button
		await page.$$eval('.maxi-axis-control__middle-part button', input =>
			input[0].click()
		);

		// position top
		const positionTop = await page.$$(
			'.maxi-axis-control__content__item__top input'
		);

		await positionTop[0].focus();
		await page.keyboard.type('25');

		// size
		await page.$$eval(
			'.maxi-responsive-tabs-control .maxi-settingstab-control .maxi-tabs-control button',
			sizeButton => sizeButton[1].click()
		);

		const sizeInput = await page.$$(
			'.maxi-tabs-content--disable-padding .maxi-tab-content--selected .maxi-tab-content--selected input'
		);

		await sizeInput[4].focus();
		await page.keyboard.type('77');

		const layerExpect = await getBlockAttributes();
		expect(layerExpect['background-layers']).toMatchSnapshot();
	});
});
