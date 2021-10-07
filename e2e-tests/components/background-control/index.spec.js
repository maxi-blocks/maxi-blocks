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
import { getBlockAttributes, openSidebar } from '../../utils';

describe('BackgroundControl', () => {
	beforeEach(async () => {
		await createNewPost();
		await insertBlock('Group Maxi');
	});

	it('Check Background Color Clip Path', async () => {
		const accordionPanel = await openSidebar(page, 'background');

		await accordionPanel.$$eval(
			'.maxi-settingstab-control .maxi-tabs-content .maxi-background-control .maxi-base-control__field label',
			select => select[4].click()
		);

		await accordionPanel.$eval(
			'.maxi-clip-path-control .maxi-toggle-switch .maxi-base-control__label',
			use => use.click()
		);

		await accordionPanel.$$eval('.clip-path-defaults button', click =>
			click[1].click()
		);

		await page.waitForTimeout(1000);

		const bgColorClipPathAttributes = await getBlockAttributes();
		const bgColorClipPathResult =
			bgColorClipPathAttributes['background-image-clip-path'];
		const expectedBgColorClipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';

		expect(bgColorClipPathResult).toStrictEqual(expectedBgColorClipPath);
	});

	it('Check Background Color Layer Clip Path', async () => {
		const accordionPanel = await openSidebar(page, 'background');

		await accordionPanel.$eval(
			'.maxi-tabs-content .maxi-background-control .maxi-toggle-switch .maxi-base-control__label',
			use => use.click()
		);

		const selectLayer = await accordionPanel.$(
			'.maxi-tabs-content .maxi-background-control .maxi-loader-control .maxi-base-control__field select'
		);

		const addNewLayer = await accordionPanel.$(
			'.maxi-tabs-content .maxi-background-control .maxi-loader-control button'
		);

		await selectLayer.select('color');
		await addNewLayer.click();

		await accordionPanel.$$eval(
			'.maxi-background-layers_options .maxi-background-layer span',
			select => select[0].click()
		);

		await accordionPanel.$eval(
			'.maxi-clip-path-control .maxi-toggle-switch .maxi-base-control__label',
			use => use.click()
		);

		await accordionPanel.$$eval('.clip-path-defaults button', click =>
			click[1].click()
		);

		await page.waitForTimeout(1000);

		const bgColorClipPathAttributes = await getBlockAttributes();
		const bgColorClipPathResult =
			bgColorClipPathAttributes['background-layers'][0][
				'background-color-clip-path'
			];
		const expectedBgColorClipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';

		expect(bgColorClipPathResult).toStrictEqual(expectedBgColorClipPath);
	});

	it('Check Background Color', async () => {
		const accordionPanel = await openSidebar(page, 'background');

		await accordionPanel.$$eval(
			'.maxi-settingstab-control .maxi-tabs-content .maxi-background-control .maxi-base-control__field label',
			select => select[3].click()
		);

		await accordionPanel.$$eval(
			'.maxi-color-palette-control .maxi-sc-color-palette div',
			select => select[3].click()
		);
		await page.waitForTimeout(1000);

		const colorAttributes = await getBlockAttributes();
		const result = colorAttributes['background-palette-color'];
		const expectedColor = 4;

		expect(result).toStrictEqual(expectedColor);
	});

	it('Check Background Custom Color', async () => {
		const accordionPanel = await openSidebar(page, 'background');

		await accordionPanel.$$eval(
			'.maxi-settingstab-control .maxi-tabs-content .maxi-background-control .maxi-base-control__field label',
			select => select[3].click()
		);

		await accordionPanel.$eval(
			'.maxi-sc-color-palette__custom .maxi-radio-control__option label',
			select => select.click()
		);

		await accordionPanel.$eval(
			'.maxi-color-control__color input',
			colorInput => colorInput.focus()
		);

		await pressKeyTimes('Backspace', '6');
		await page.keyboard.type('000000');
		await page.keyboard.press('Enter');

		await page.waitForTimeout(500);

		const colorAttributes = await getBlockAttributes();
		const result = colorAttributes['background-color'];
		const expectedColor = 'rgb(0,0,0)';

		expect(result).toStrictEqual(expectedColor);
	});

	it('Check Background Image', async () => {
		const accordionPanel = await openSidebar(page, 'background');
		await accordionPanel.$$eval(
			'.maxi-background-control .maxi-fancy-radio-control--full-width .maxi-base-control__field input',
			select => select[2].click()
		);

		// background options
		const selectors = await accordionPanel.$$(
			'.maxi-tabs-content .maxi-background-control .maxi-base-control select'
		);

		const [size, repeat, position, attachment] = selectors;

		await size.select('cover');
		await repeat.select('repeat-x');
		await position.select('left center');
		await attachment.select('fixed');

		// more settings
		await accordionPanel.$eval(
			'.maxi-background-control .maxi-fancy-radio-control--more-settings.maxi-toggle-switch .maxi-base-control__label',
			use => use.click()
		);

		// background more options
		const moreOptions = await accordionPanel.$$(
			'.maxi-tabs-content .maxi-background-control .maxi-background-image-more-settings .maxi-base-control select'
		);

		const [origin, clip] = moreOptions;

		await origin.select('border-box');
		await clip.select('padding-box');

		const expectAttributes = {
			'background-image-attachment': 'fixed',
			'background-image-size': 'cover',
			'background-image-clip': 'padding-box',
			'background-image-origin': 'border-box',
			'background-image-position': 'left center',
			'background-image-repeat': 'repeat-x',
		};

		const pageAttributes = await getBlockAttributes();
		const backgroundAttributes = (({
			'background-image-attachment': imageAttachment,
			'background-image-size': imageSize,
			'background-image-clip': imageClipPath,
			'background-image-origin': imageOrigin,
			'background-image-position': imagePosition,
			'background-image-repeat': imageRepeat,
		}) => ({
			'background-image-attachment': imageAttachment,
			'background-image-size': imageSize,
			'background-image-clip': imageClipPath,
			'background-image-origin': imageOrigin,
			'background-image-position': imagePosition,
			'background-image-repeat': imageRepeat,
		}))(pageAttributes);

		expect(backgroundAttributes).toStrictEqual(expectAttributes);
	});

	it('Check Background Video', async () => {
		const accordionPanel = await openSidebar(page, 'background');

		await accordionPanel.$$eval(
			'.maxi-settingstab-control .maxi-tabs-content .maxi-background-control .maxi-base-control__field label',
			select => select[5].click()
		);

		// insert URL
		const VideoUrl = 'https://youtu.be/hM7Eh0gGNKA';

		await accordionPanel.$eval(
			'.maxi-tabs-content .maxi-background-control__video .maxi-text-control input',
			url => url.focus()
		);
		await page.keyboard.type(VideoUrl);
		await page.keyboard.press('Enter');

		const inputs = await accordionPanel.$$(
			'.maxi-settingstab-control .maxi-tabs-content .maxi-advanced-number-control .maxi-base-control__field input'
		);

		// start Time
		await inputs[2].focus();
		await page.keyboard.type('1');
		await page.keyboard.press('Enter');

		// end time
		await inputs[4].focus();
		await page.keyboard.type('3');
		await page.keyboard.press('Enter');

		const expectVideo = await getBlockAttributes();
		expect(expectVideo['background-video-mediaURL']).toStrictEqual(
			VideoUrl
		);

		await accordionPanel.$eval(
			'.maxi-background-control__video .maxi-toggle-switch.video-loop .maxi-base-control__label',
			use => use.click()
		);

		await accordionPanel.$eval(
			'.maxi-background-control__video .maxi-toggle-switch.video-play-mobile .maxi-base-control__label',
			use => use.click()
		);

		const expectAttribute = await getBlockAttributes();
		const backgroundSettings = 'video';

		expect(expectAttribute['background-active-media']).toStrictEqual(
			backgroundSettings
		);
	});

	// TODO: needs to be fixed with #1931
	// it('Check Background Gradient', async () => {
	// 	await setBrowserViewport('large');
	// 	const accordionPanel = await openSidebar(page, 'background');
	// 	await accordionPanel.$$eval(
	// 		'.maxi-background-control .maxi-fancy-radio-control--full-width .maxi-base-control__field input',
	// 		select => select[4].click()
	// 	);

	// 	await page.$eval('.maxi-sidebar', sideBar =>
	// 		sideBar.scrollTo(0, sideBar.scrollHeight)
	// 	);

	// 	const { x, y } = await page.$eval(
	// 		'.maxi-background-control .maxi-gradient-control .maxi-gradient-control__gradient .components-custom-gradient-picker__markers-container',
	// 		gradientBar => {
	// 			const { x, y, width, height } =
	// 				gradientBar.getBoundingClientRect();

	// 			const xPos = x + width / 2;
	// 			const yPos = y + height / 2;

	// 			return { x: xPos, y: yPos };
	// 		}
	// 	);

	// 	await page.mouse.click(x, y, { delay: 1000 });

	// 	await page.waitForSelector(
	// 		'.components-dropdown__content.components-custom-gradient-picker__color-picker-popover'
	// 	);

	// 	const colorPickerPopover = await page.$(
	// 		'.components-dropdown__content.components-custom-gradient-picker__color-picker-popover'
	// 	);

	// 	await colorPickerPopover.$eval(
	// 		'.components-color-picker__inputs-fields input',
	// 		select => select.focus()
	// 	);
	// 	await pressKeyTimes('Backspace', '6');
	// 	await page.keyboard.type('24a319');
	// 	await page.keyboard.press('Enter');

	// 	await page.waitForTimeout(500);

	// 	const expectAttribute = await getBlockAttributes();
	// 	const gradient = expectAttribute['background-gradient'];
	// 	const expectGradient =
	// 		'linear-gradient(135deg,rgba(6,147,227,1) 0%,rgb(36,163,25) 46%,rgb(155,81,224) 100%)';

	// 	expect(gradient).toStrictEqual(expectGradient);
	// });

	it('Background hover attributes are kept after setting none to normal background settings', async () => {
		const accordionPanel = await openSidebar(page, 'background');

		await accordionPanel.$$eval(
			'.maxi-settingstab-control .maxi-tabs-content .maxi-background-control .maxi-base-control__field label',
			select => select[3].click()
		);

		await accordionPanel.$$eval('.maxi-tabs-control__button', buttons =>
			buttons[1].click()
		);

		await accordionPanel.$eval(
			'.maxi-background-status-hover.maxi-toggle-switch .maxi-base-control__label',
			use => use.click()
		);

		await accordionPanel.$$eval('.maxi-tabs-control__button', buttons =>
			buttons[0].click()
		);
		await accordionPanel.$$eval(
			'.maxi-settingstab-control .maxi-tabs-content .maxi-background-control .maxi-base-control__field label',
			select => select[2].click()
		);

		const expectChanges = {
			'background-active-media': '',
			'background-active-media-hover': 'color',
		};

		const backgroundAttributes = await getBlockAttributes();

		const background = (({
			'background-active-media': backgroundActiveMedia,
			'background-active-media-hover': backgroundActiveMediaHover,
		}) => ({
			'background-active-media': backgroundActiveMedia,
			'background-active-media-hover': backgroundActiveMediaHover,
		}))(backgroundAttributes);

		expect(background).toStrictEqual(expectChanges);
	});

	/* it('Check BackgroundShape', async () => {
		const { uniqueID } = await getBlockAttributes();

		const accordionPanel = await openSidebar(page, 'background');
		await accordionPanel.$$eval(
			'.maxi-background-control .maxi-fancy-radio-control--full-width .maxi-base-control__field input',
			select => select[5].click()
		);

		await accordionPanel.$$eval(
			'.maxi-settingstab-control .maxi-library-modal__action-section__buttons button',
			click => click[0].click()
		);

		await page.waitForSelector('.maxi-library-modal');
		const modal = await page.$('.maxi-library-modal');
		await page.waitForSelector('.ais-SearchBox-input');
		const modalSearcher = await modal.$('.ais-SearchBox-input');
		await modalSearcher.focus();
		await page.keyboard.type('angle 10');
		await page.waitForTimeout(1000);
		await page.waitForSelector('.angle-10-maxi-svg');
		await page.waitForSelector(
			'.maxi-cloud-masonry-card__svg-container__button'
		);
		await modal.$eval(
			'.maxi-cloud-masonry-card__svg-container__button',
			button => button.click()
		);

		const expectShape = `
	<svg viewBox="0 0 36.1 36.1" class="angle-10-maxi-svg" data-stroke="" data-item="${uniqueID}__svg"><path fill="" data-fill="" d="M29.837 9.563L18.05 1 6.263 9.563l3.071 9.45-3.071 2.231L10.766 35.1h14.569l4.502-13.856-3.071-2.231 3.071-9.45zm-22.774.26L18.05 1.84l10.987 7.983-2.85 8.77-8.138-5.912-8.137 5.912-2.85-8.77zm18.904 9.45l-1.126 3.466H11.26l-1.126-3.466 7.917-5.752 7.917 5.752zm3.071 2.231L24.84 34.42H11.26L7.063 21.504l2.492-1.811 1.211 3.726h14.569l1.211-3.726 2.492 1.811z"></path></svg>`;

		const attributes = await getBlockAttributes();

		expect(
			attributes['background-svg-SVGElement']
				.replace(/(\r\n|\n|\r)/g, '')
				.replace(/\s/g, '')
		).toEqual(expectShape.replace(/(\r\n|\n|\r)/g, '').replace(/\s/g, ''));
	}); */

	/* it('Check Background Shape Custom Color', async () => {
		const accordionPanel = await openSidebar(page, 'background');
		await accordionPanel.$$eval(
			'.maxi-background-control .maxi-fancy-radio-control--full-width .maxi-base-control__field input',
			select => select[5].click()
		);

		await accordionPanel.$$eval(
			'.maxi-settingstab-control .maxi-library-modal__action-section__buttons button',
			click => click[0].click()
		);

		await page.waitForSelector('.maxi-library-modal');
		const modal = await page.$('.maxi-library-modal');
		await page.waitForSelector('.ais-SearchBox-input');
		const modalSearcher = await modal.$('.ais-SearchBox-input');
		await modalSearcher.focus();
		await page.keyboard.type('angle 10');
		await page.waitForTimeout(1000);
		await modal.$eval(
			'.maxi-cloud-masonry-card__svg-container__button',
			button => button.click()
		);

		await accordionPanel.$$eval(
			'.maxi-background-control .maxi-settingstab-control .maxi-tabs-control button',
			click => click[1].click()
		);
		await accordionPanel.$eval(
			'.maxi-sc-color-palette__custom .maxi-radio-control__option label',
			select => select.click()
		);

		await accordionPanel.$eval(
			'.maxi-color-control__color input',
			colorInput => colorInput.focus()
		);

		await pressKeyTimes('Backspace', '6');
		await page.keyboard.type('000000');
		await page.keyboard.press('Enter');

		await page.waitForTimeout(500);

		const colorAttributes = await getBlockAttributes();

		const result =
			colorAttributes['background-svg-SVGData'][
				`${Object.keys(colorAttributes['background-svg-SVGData'])[0]}`
			].color;

		const expectedColor = 'rgba(0,0,0,1)';

		expect(result).toStrictEqual(expectedColor);
	}); */

	/* it('Check Background Layers', async () => {
		const accordionPanel = await openSidebar(page, 'background');

		// add color layer
		await accordionPanel.$$eval(
			'.maxi-tabs-content .maxi-background-control .maxi-base-control label',
			selectLayers => selectLayers[1].click()
		);

		const selectLayer = await accordionPanel.$(
			'.maxi-tabs-content .maxi-background-control .maxi-loader-control .maxi-base-control__field select'
		);

		const addNewLayer = await accordionPanel.$(
			'.maxi-tabs-content .maxi-background-control .maxi-loader-control button'
		);

		await selectLayer.select('color');
		await addNewLayer.click();

		await accordionPanel.$$eval(
			'.maxi-background-layers_options .maxi-background-layer span',
			select => select[0].click()
		);
		await accordionPanel.$$eval(
			'.maxi-color-palette-control .maxi-sc-color-palette div',
			select => select[3].click()
		);
		await page.waitForTimeout(1000);

		const expectAttribute = await getBlockAttributes();
		const layers = expectAttribute['background-active-media'];
		const bgLayerPaletteColor =
			expectAttribute['background-layers'][0]['background-palette-color'];
		const expectLayers = 'layers';
		const expectedColor = 4;

		expect(layers).toStrictEqual(expectLayers);
		expect(bgLayerPaletteColor).toStrictEqual(expectedColor);

		await accordionPanel.$eval(
			'.maxi-sc-color-palette__custom .maxi-radio-control__option label',
			select => select.click()
		);

		await accordionPanel.$eval(
			'.maxi-color-control__color input',
			colorInput => colorInput.focus()
		);

		await pressKeyTimes('Backspace', '6');
		await page.keyboard.type('000000');
		await page.keyboard.press('Enter');

		await page.waitForTimeout(500);

		const colorAttributes = await getBlockAttributes();
		const bgLayerCustomColor =
			colorAttributes['background-layers'][0]['background-color'];
		const expectedBackgroundCustomColor = 'rgba(0,0,0,1)';

		expect(bgLayerCustomColor).toStrictEqual(expectedBackgroundCustomColor);

		// remove layer test
		await accordionPanel.$$eval(
			'.maxi-background-layers_options .maxi-background-layer span',
			select => select[5].click()
		);

		const expectLayer = await getBlockAttributes();
		const none = expectLayer['background-active-media'];
		const expectMedia = 'none';

		expect(none).toStrictEqual(expectMedia);

		// add all layers
		await selectLayer.select('color');
		await addNewLayer.click();

		await selectLayer.select('image');
		await addNewLayer.click();

		await selectLayer.select('video');
		await addNewLayer.click();
		await accordionPanel.$$eval(
			'.maxi-background-layers_options .maxi-background-layer span',
			select => select[12].click()
		);

		await page.$eval(
			'.maxi-background-layer__content .maxi-text-control input',
			select => select.focus()
		);
		await page.keyboard.type('https://youtu.be/hM7Eh0gGNKA');

		await selectLayer.select('gradient');
		await addNewLayer.click();

		await selectLayer.select('shape');
		await addNewLayer.click();

		await accordionPanel.$$eval(
			'.maxi-background-layers_options .maxi-background-layer span',
			select => select[50].click()
		);

		await accordionPanel.$$eval(
			'.maxi-settingstab-control .maxi-library-modal__action-section__buttons button',
			click => click[0].click()
		);

		await page.waitForSelector('.maxi-library-modal');
		const modal = await page.$('.maxi-library-modal');
		await page.waitForSelector('.ais-SearchBox-input');
		const modalSearcher = await modal.$('.ais-SearchBox-input');
		await modalSearcher.focus();
		await page.keyboard.type('angle 10');
		await page.waitForTimeout(1000);
		await page.waitForSelector('.angle-10-maxi-svg');
		await page.waitForSelector(
			'.maxi-cloud-masonry-card__svg-container__button'
		);
		await modal.$eval(
			'.maxi-cloud-masonry-card__svg-container__button',
			button => button.click()
		);

		await accordionPanel.$$eval(
			'.maxi-background-control .maxi-settingstab-control .maxi-tabs-control button',
			click => click[1].click()
		);
		await accordionPanel.$$eval(
			'.maxi-color-palette-control .maxi-sc-color-palette div',
			select => select[3].click()
		);
		await page.waitForTimeout(1000);

		const expectShapeLayerAttribute = await getBlockAttributes();

		const bgShapeLayerPaletteColor =
			expectShapeLayerAttribute['background-layers'][4][
				'background-palette-svg-color'
			];
		const expectedShapePaletteColor = 4;

		expect(bgShapeLayerPaletteColor).toStrictEqual(
			expectedShapePaletteColor
		);

		await accordionPanel.$eval(
			'.maxi-sc-color-palette__custom .maxi-radio-control__option label',
			select => select.click()
		);

		await accordionPanel.$eval(
			'.maxi-color-control__color input',
			colorInput => colorInput.focus()
		);

		await pressKeyTimes('Backspace', '6');
		await page.keyboard.type('000000');
		await page.keyboard.press('Enter');

		await page.waitForTimeout(500);

		const shapeColorAttributes = await getBlockAttributes();
		const bgShapeLayerCustomColor =
			shapeColorAttributes['background-layers'][4][
				'background-svg-SVGData'
			][
				`${
					Object.keys(
						shapeColorAttributes['background-layers'][4][
							'background-svg-SVGData'
						]
					)[0]
				}`
			].color;

		const expectedShapeBackgroundCustomColor = 'rgba(0,0,0,1)';

		expect(bgShapeLayerCustomColor).toStrictEqual(
			expectedShapeBackgroundCustomColor
		);

		const expectBackgroundLayers = await getBlockAttributes();
		const allLayers = expectBackgroundLayers['background-layers'];

		expect(allLayers).toMatchSnapshot();
	}); */
});
