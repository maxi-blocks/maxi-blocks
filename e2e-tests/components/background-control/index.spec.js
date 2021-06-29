/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	pressKeyTimes,
	setBrowserViewport,
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

	it('Check Background Color', async () => {
		const accordionPanel = await openSidebar(page, 'background');

		await accordionPanel.$$eval(
			'.maxi-settingstab-control .maxi-tabs-content .maxi-background-control .maxi-base-control__field label',
			select => select[5].click()
		);

		await accordionPanel.$$eval(
			'.maxi-color-palette-control .maxi-sc-color-palette div',
			select => select[3].click()
		);
		await page.waitForTimeout(1000);

		const colorAttributes = await getBlockAttributes();
		const result = colorAttributes['palette-preset-background-color'];
		const expectedColor = 4;

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

		const [size, repeat, position, origin, clip, attachment] = selectors;

		await size.select('cover');
		await repeat.select('repeat-x');
		await position.select('left center');
		await origin.select('border-box');
		await clip.select('padding-box');
		await attachment.select('fixed');

		const expectAttributes = {
			'background-image-attachment': 'fixed',
			'background-image-size': 'cover',
			'background-image-clip-path': 'padding-box',
			'background-image-origin': 'border-box',
			'background-image-position': 'left center',
			'background-image-repeat': 'repeat-x',
		};

		const pageAttributes = await getBlockAttributes();
		const backgroundAttributes = (({
			'background-image-attachment': imageAttachment,
			'background-image-size': imageSize,
			'background-image-clip-path': imageClipPath,
			'background-image-origin': imageOrigin,
			'background-image-position': imagePosition,
			'background-image-repeat': imageRepeat,
		}) => ({
			'background-image-attachment': imageAttachment,
			'background-image-size': imageSize,
			'background-image-clip-path': imageClipPath,
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
			select => select[7].click()
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

		await accordionPanel.$$eval(
			'.maxi-background-control__video .maxi-fancy-radio-control label',
			select => {
				select[2].click(); // loop
				select[5].click(); // Play on mobile
			}
		);

		const expectAttribute = await getBlockAttributes();
		const backgroundSettings = 'video';

		expect(expectAttribute['background-active-media']).toStrictEqual(
			backgroundSettings
		);
	});

	it('Check Background Gradient', async () => {
		await setBrowserViewport('large');
		const accordionPanel = await openSidebar(page, 'background');
		await accordionPanel.$$eval(
			'.maxi-background-control .maxi-fancy-radio-control--full-width .maxi-base-control__field input',
			select => select[4].click()
		);

		await page.$eval('.maxi-sidebar', sideBar =>
			sideBar.scrollTo(0, sideBar.scrollHeight)
		);

		const { x, y } = await page.$eval(
			'.maxi-background-control .maxi-gradient-control .maxi-gradient-control__gradient .components-custom-gradient-picker__markers-container',
			gradientBar => {
				const { x, y, width, height } =
					gradientBar.getBoundingClientRect();

				const xPos = x + width / 2;
				const yPos = y + height / 2;

				return { x: xPos, y: yPos };
			}
		);

		await page.mouse.click(x, y, { delay: 1000 });

		await page.waitForSelector(
			'.components-dropdown__content.components-custom-gradient-picker__color-picker-popover'
		);

		const colorPickerPopover = await page.$(
			'.components-dropdown__content.components-custom-gradient-picker__color-picker-popover'
		);

		await colorPickerPopover.$eval(
			'.components-color-picker__inputs-fields input',
			select => select.focus()
		);
		await pressKeyTimes('Backspace', '6');
		await page.keyboard.type('24a319');
		await page.keyboard.press('Enter');

		await page.waitForTimeout(500);

		const expectAttribute = await getBlockAttributes();
		const gradient = expectAttribute['background-gradient'];
		const expectGradient =
			'linear-gradient(135deg,rgba(6,147,227,1) 0%,rgb(36,163,25) 46%,rgb(155,81,224) 100%)';

		expect(gradient).toStrictEqual(expectGradient);
	});

	it('Check BackgroundShape', async () => {
		const { uniqueID } = await getBlockAttributes();

		const accordionPanel = await openSidebar(page, 'background');
		await accordionPanel.$$eval(
			'.maxi-background-control .maxi-fancy-radio-control--full-width .maxi-base-control__field input',
			select => select[5].click()
		);

		await accordionPanel.$$eval(
			'.maxi-settingstab-control .maxi-svg-defaults button',
			click => click[1].click()
		);

		const expectShape = `<svg viewBox="0 0 36.1 36.1" xmlns="http://www.w3.org/2000/svg" data-item="${uniqueID}__svg"><circle fill="" r="17.2" cy="18" cx="18"></circle></svg>`;
		const attributes = await getBlockAttributes();

		expect(
			attributes['background-svg-SVGElement']
				.replace(/(\r\n|\n|\r)/g, '')
				.replace(/\s/g, '')
		).toEqual(expectShape.replace(/(\r\n|\n|\r)/g, '').replace(/\s/g, ''));
	});

	it('Check Background Layers', async () => {
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
		await accordionPanel.$eval(
			'.maxi-background-layer__content .maxi-color-control__color input',
			colorInput => colorInput.focus()
		);

		await pressKeyTimes('Backspace', '3');
		await page.keyboard.type('555');

		const expectAttribute = await getBlockAttributes();
		const layers = expectAttribute['background-active-media'];
		const expectLayers = 'layers';

		expect(layers).toStrictEqual(expectLayers);

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

		await accordionPanel.$$eval('.maxi-svg-defaults button', select =>
			select[2].click()
		);

		const expectBackgroundLayers = await getBlockAttributes();
		const allLayers = expectBackgroundLayers['background-layers'];

		expect(allLayers).toMatchSnapshot();
	});
});
