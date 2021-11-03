/* eslint-disable jest/no-commented-out-tests */
/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	pressKeyTimes,
} from '@wordpress/e2e-test-utils';

/**
 * Interactive dependencies
 */
import { getBlockAttributes, openSidebarTab, getBlockStyle } from '../../utils';

describe('BackgroundControl', () => {
	it('Check Background Color layer', async () => {
		await createNewPost();
		await insertBlock('Group Maxi');
		await openSidebar(page, 'background');

	it('Check Background Color Clip Path', async () => {
		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'background'
		);

		await accordionPanel.$$eval(
			'.maxi-background-control__simple label',
			select => select[2].click()
		);

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

		await pressKeyTimes('Backspace', '3');
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

	it('Check Background Color Layer Clip Path', async () => {
		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'background'
		);

		await accordionPanel.$eval(
			'.maxi-tabs-content .maxi-background-control .maxi-toggle-switch .maxi-base-control__label',
			use => use.click()
		);

		const selectLayer = await accordionPanel.$(
			'.maxi-tabs-content .maxi-background-control .maxi-loader-control .maxi-base-control__field select'
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
			colorPalette => colorPalette[4].click()
		);

		// opacity
		await page.$eval(
			'.maxi-background-control .maxi-advanced-number-control input',
			opacity => opacity.focus()
		);

		await pressKeyTimes('Backspace', '3');
		await page.keyboard.type('45');

		// clip-path
		await page.$$eval('.clip-path-defaults button', buttons =>
			buttons[2].click()
		);

		const layerExpect = await getBlockAttributes();
		expect(layerExpect['background-layers']).toMatchSnapshot();
	});

	it('Check Background image layer', async () => {
		await addBackgroundLayer(page, 'image');

		// opacity
		await page.$$eval(
			'.maxi-background-control .maxi-advanced-number-control input',
			opacity => opacity[0].focus()
		);

		await pressKeyTimes('Backspace', '3');
		await page.keyboard.type('55');

		// background size
		const sizeSelector = await page.$('.maxi-background-size select');
		await sizeSelector.select('contain');

		// background repeat
		const repeatSelector = await page.$('.maxi-background-repeat select');
		await repeatSelector.select('repeat');

		// background position
		const positionSelector = await page.$(
			'.maxi-background-position select'
		);
		await positionSelector.select('left top');

		// background attachment
		const attachmentSelector = await page.$(
			'.maxi-background-attachment select'
		);
		await attachmentSelector.select('fixed');

		// more settings
		await page.$eval(
			'.maxi-tabs-content .maxi-background-image-more-settings--toggle input',
			button => button.click()
		);

		// background origin
		const originSelector = await page.$('.maxi-background-origin select');
		await originSelector.select('border-box');

		// background clip
		const clipSelector = await page.$('.maxi-background-clip select');
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
	});

	it('Check Background image layer hover', async () => {
		const accordion = await openSidebar(page, 'background');

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

		await pressKeyTimes('Backspace', '3');
		await page.keyboard.type('82');

		// background size
		const sizeSelector = await page.$('.maxi-background-size select');
		await sizeSelector.select('cover');

		// background repeat
		const repeatSelector = await page.$('.maxi-background-repeat select');
		await repeatSelector.select('repeat-x');

		// background position
		const positionSelector = await page.$(
			'.maxi-background-position select'
		);
		await positionSelector.select('center top');

		// background attachment
		const attachmentSelector = await page.$(
			'.maxi-background-attachment select'
		);
		await attachmentSelector.select('local');

		// more settings
		await page.$eval(
			'.maxi-tabs-content .maxi-background-image-more-settings--toggle input',
			button => button.click()
		);

		// background origin
		const originSelector = await page.$('.maxi-background-origin select');
		await originSelector.select('content-box');

		// background clip
		const clipSelector = await page.$('.maxi-background-clip select');
		await clipSelector.select('padding-box');

		// clip-path
		await page.$$eval('.clip-path-defaults button', buttons =>
			buttons[3].click()
		);

		const layerExpect = await getBlockAttributes();
		expect(layerExpect['background-layers']).toMatchSnapshot();
	});

	it('Check Background video layer', async () => {
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

		await pressKeyTimes('Backspace', '3');
		await page.keyboard.type('44');

		const layerExpect = await getBlockAttributes();
		expect(layerExpect['background-layers']).toMatchSnapshot();
	});

	it('Check Background video layer hover', async () => {
		const accordion = await openSidebar(page, 'background');

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

		await pressKeyTimes('Backspace', '3');
		await page.keyboard.type('82');

		const layerExpect = await getBlockAttributes();
		expect(layerExpect['background-layers']).toMatchSnapshot();
	});
	it('Check Background shape layer', async () => {
		await addBackgroundLayer(page, 'shape');

		// open library
		await page.$eval(
			'.maxi-library-modal__action-section__buttons button',
			button => button.click()
		);
		await page.waitForTimeout(200);
		await page.$$eval(
			'.ais-InfiniteHits .maxi-cloud-masonry-card__svg-container',
			selectShape => selectShape[0].click()
		);

		// opacity
		await page.$$eval(
			'.maxi-color-palette-control .maxi-advanced-number-control input',
			opacity => opacity[0].focus()
		);

		await pressKeyTimes('Backspace', '3');
		await page.keyboard.type('77');

		// position
		await page.$$eval(
			'.maxi-background-layer__content .maxi-tabs-content .maxi-tabs-control button',
			button => button[1].click()
		);

		// Y-axis
		await page.$$eval(
			'.maxi-settingstab-control .maxi-advanced-number-control .maxi-base-control__field input',
			input => input[2].focus()
		);

		await pressKeyTimes('Backspace', '2');
		await page.keyboard.type('53');

		// X-axis
		await page.$$eval(
			'.maxi-settingstab-control .maxi-advanced-number-control .maxi-base-control__field input',
			input => input[4].focus()
		);

		await pressKeyTimes('Backspace', '2');
		await page.keyboard.type('36');

		// size
		await page.$$eval(
			'.maxi-background-layer__content .maxi-tabs-content .maxi-tabs-control button',
			opacity => opacity[2].click()
		);

		await page.$$eval('.maxi-advanced-number-control input', size =>
			size[2].focus()
		);

		await pressKeyTimes('Backspace', '2');
		await page.keyboard.type('84');

		const layerExpect = await getBlockAttributes();
		expect(layerExpect['background-layers']).toMatchSnapshot();
	});

	it('Check Background shape layer hover', async () => {
		const accordion = await openSidebar(page, 'background');

		await page.waitForTimeout(200);
		// hover
		await accordion.$$eval(
			'.maxi-tabs-control--disable-padding button',
			button => button[1].click()
		);
		await page.waitForTimeout(200);
		// hover options
		await page.$$eval(
			'.maxi-background-layers_options .maxi-background-layer__arrow',
			options => options[3].click()
		);

		await page.waitForTimeout('200');
		// opacity
		await page.$$eval(
			'.maxi-advanced-number-control .maxi-base-control__field input',
			opacity => opacity[2].focus()
		);

		await pressKeyTimes('Backspace', '3');
		await page.keyboard.type('62');

		// position
		await page.$$eval(
			'.maxi-background-layer__content .maxi-tabs-content .maxi-tabs-control button',
			button => button[1].click()
		);

		// Y-axis
		await page.$$eval(
			'.maxi-settingstab-control .maxi-advanced-number-control .maxi-base-control__field input',
			input => input[2].focus()
		);

		await pressKeyTimes('Backspace', '2');
		await page.keyboard.type('93');

		// X-axis
		await page.$$eval(
			'.maxi-settingstab-control .maxi-advanced-number-control .maxi-base-control__field input',
			input => input[4].focus()
		);

		await pressKeyTimes('Backspace', '2');
		await page.keyboard.type('42');

		// size
		await page.$$eval(
			'.maxi-background-layer__content .maxi-tabs-content .maxi-tabs-control button',
			opacity => opacity[2].click()
		);

		await page.$$eval('.maxi-advanced-number-control input', size =>
			size[2].focus()
		);

		await pressKeyTimes('Backspace', '2');
		await page.keyboard.type('44');

		const layerExpect = await getBlockAttributes();
		expect(layerExpect['background-layers']).toMatchSnapshot();
	});
});
