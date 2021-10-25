/* eslint-disable no-await-in-loop */
/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	pressKeyWithModifier,
	getEditedPostContent,
	pressKeyTimes,
} from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	getBlockAttributes,
	openSidebarTab,
	openPreviewPage,
} from '../../utils';

describe('Image Maxi', () => {
	it('Image Maxi does not break', async () => {
		await createNewPost();
		await insertBlock('Image Maxi');
		expect(await getEditedPostContent()).toMatchSnapshot();
	});

	it('Checking the image caption', async () => {
		// select img
		await page.$eval(
			'.maxi-image-block__placeholder .maxi-editor-url-input__button button',
			url => url.click()
		);

		await page.$eval(
			'.maxi-editor-url-input__button-modal .block-editor-url-input__input',
			input => input.focus()
		);

		const linkImage =
			'https://www.dzoom.org.es/wp-content/uploads/2017/07/seebensee-2384369-810x540.jpg';

		await page.keyboard.type(linkImage);
		await page.$$eval(
			'.maxi-image-block__placeholder .maxi-editor-url-input__button .maxi-editor-url-input__button-modal-line button',
			submitUrl => submitUrl[0].click()
		);

		const accordionPanel = await openSidebarTab(page, 'style', 'caption');

		// Custom caption
		const selector = await accordionPanel.$(
			'.maxi-image-caption-type select'
		);
		await selector.select('custom');

		// insert text
		await page.waitForSelector('.maxi-image-block__caption span');
		const text = await page.$('.maxi-image-block__caption span');
		await text.click();
		await page.keyboard.type('Testing Caption', { delay: 100 });

		const captionAttributes = await getBlockAttributes();
		const expectedText = 'Testing Caption';

		expect(captionAttributes.captionContent).toStrictEqual(expectedText);

		// fontFamily
		const fontFamilySelector = await accordionPanel.$(
			'.maxi-typography-control .maxi-typography-control__font-family'
		);
		await fontFamilySelector.click();
		await page.keyboard.type('Montserrat', { delay: 100 });
		await page.keyboard.press('Enter');
		await page.waitForTimeout(200);

		const attributes = await getBlockAttributes();
		const fontFamily = attributes['font-family-general'];
		const expectedFontFamily = 'Montserrat';

		expect(fontFamily).toStrictEqual(expectedFontFamily);

		// fontColor
		await accordionPanel.$$eval(
			'.maxi-typography-control .maxi-color-palette-control .maxi-sc-color-palette div',
			select => select[3].click()
		);

		const colorAttributes = await getBlockAttributes();
		const color = colorAttributes['link-palette-color-general'];
		const expectedColor = 4;

		expect(color).toStrictEqual(expectedColor);

		// alignment
		await accordionPanel.$$eval(
			'.maxi-alignment-control .maxi-base-control__field label',
			alignment => alignment[2].click()
		);

		const alignmentAttributes = await getBlockAttributes();
		const textAlignment = alignmentAttributes['text-alignment-general'];
		const expectedAlignment = 'center';

		expect(textAlignment).toStrictEqual(expectedAlignment);

		// size, line-height, letter-spacing
		const inputs = await accordionPanel.$$(
			'.maxi-advanced-number-control .maxi-base-control__field input'
		);

		await inputs[2].focus();
		await page.waitForTimeout(200);
		await page.keyboard.press('Backspace');
		await page.waitForTimeout(200);
		await page.keyboard.type('9');
		await page.waitForTimeout(200);

		await inputs[4].focus();
		await pressKeyWithModifier('primary', 'a');
		await page.waitForTimeout(200);
		await page.keyboard.type('4');

		await inputs[6].focus();
		await page.keyboard.type('11');
		await page.waitForTimeout(200);

		const responsiveStage = await accordionPanel.$eval(
			'.maxi-typography-control__text-options-tabs .maxi-tabs-control__button[aria-pressed="true"]',
			tab => tab.innerText.toLowerCase()
		);

		const styleAttributes = await getBlockAttributes();
		const typographyAttributes = (({
			[`font-size-${responsiveStage}`]: fontSize,
			[`line-height-${responsiveStage}`]: lineHeight,
			[`letter-spacing-${responsiveStage}`]: letterSpacing,
		}) => ({
			[`font-size-${responsiveStage}`]: fontSize,
			[`line-height-${responsiveStage}`]: lineHeight,
			[`letter-spacing-${responsiveStage}`]: letterSpacing,
		}))(styleAttributes);

		const expectedAttributesTwo = {
			[`font-size-${responsiveStage}`]: 19,
			[`line-height-${responsiveStage}`]: 4,
			[`letter-spacing-${responsiveStage}`]: 11,
		};

		expect(typographyAttributes).toStrictEqual(expectedAttributesTwo);

		// await changeResponsive(page, 'general');
		// accordionPanel = await openSidebarTab(page, 'style', 'caption');

		// Weight, Transform, Style, Decoration
		const weightSelector = await accordionPanel.$(
			'.maxi-typography-control__weight .maxi-base-control__field select'
		);
		await weightSelector.select('300');

		const transformSelector = await accordionPanel.$(
			'.maxi-typography-control__transform .maxi-base-control__field select'
		);
		await transformSelector.select('capitalize');

		const fontStyleSelector = await accordionPanel.$(
			'.maxi-typography-control__font-style .maxi-base-control__field select'
		);
		await fontStyleSelector.select('italic');

		const decorationSelector = await accordionPanel.$(
			'.maxi-typography-control__decoration .maxi-base-control__field select'
		);
		await decorationSelector.select('overline');

		const fontAttributes = await getBlockAttributes();
		const textAttributes = (({
			'font-style-general': fontStyle,
			'font-weight-general': fontWeight,
			'text-decoration-general': textDecoration,
			'text-transform-general': textTransform,
		}) => ({
			'font-style-general': fontStyle,
			'font-weight-general': fontWeight,
			'text-decoration-general': textDecoration,
			'text-transform-general': textTransform,
		}))(fontAttributes);

		const expectedAttributes = {
			'font-style-general': 'italic',
			'font-weight-general': '300',
			'text-decoration-general': 'overline',
			'text-transform-general': 'capitalize',
		};

		expect(textAttributes).toStrictEqual(expectedAttributes);

		// Text shadow
		await accordionPanel.$eval(
			'.maxi-typography-control .maxi-textshadow-control .maxi-toggle-switch .maxi-base-control__label',
			use => use.click()
		);

		await accordionPanel.$$(
			'.maxi-textshadow-control.maxi-typography-control__text-shadow .maxi-default-styles-control'
		);

		const shadowStyles = [
			'none',
			'2px 4px 3px rgba(var(--maxi-light-color-8),0.3)',
			'2px 4px 3px rgba(var(--maxi-light-color-8),0.5)',
			'4px 4px 0px rgba(var(--maxi-light-color-8),0.21)',
		];

		for (let i = 0; i < shadowStyles.length; i += 1) {
			const setting = shadowStyles[i];

			await accordionPanel.$$eval(
				'.maxi-textshadow-control.maxi-typography-control__text-shadow .maxi-default-styles-control button',
				(buttons, i) => buttons[i].click(),
				i
			);
			await page.waitForTimeout(200);

			const shadowAttributes = await getBlockAttributes();
			const textShadow = shadowAttributes['text-shadow-general'];
			expect(textShadow).toStrictEqual(setting);
		}

		// Colors: LinkColor, LinkHoverColor, LinkActiveColor, LinkVisitedColor
		// LinkColor
		await accordionPanel.$$eval(
			'.maxi-typography-link-color .maxi-sc-color-palette div',
			colors => colors[1].click()
		);
		// LinkHoverColor
		await accordionPanel.$$eval(
			'.maxi-typography-link-hover-color .maxi-sc-color-palette div',
			colors => colors[2].click()
		);
		// LinkActiveColor
		await accordionPanel.$$eval(
			'.maxi-typography-link-active-color .maxi-sc-color-palette div',
			colors => colors[3].click()
		);
		// LinkVisitedColor
		await accordionPanel.$$eval(
			'.maxi-typography-link-visited-color .maxi-sc-color-palette div',
			colors => colors[4].click()
		);

		const linkColorAttributes = await getBlockAttributes();
		const linkAttributes = (({
			'link-palette-color-general': linkColor,
			'link-hover-palette-color-general': linkHover,
			'link-active-palette-color-general': linkActive,
			'link-visited-palette-color-general': linkVisited,
		}) => ({
			'link-palette-color-general': linkColor,
			'link-hover-palette-color-general': linkHover,
			'link-active-palette-color-general': linkActive,
			'link-visited-palette-color-general': linkVisited,
		}))(linkColorAttributes);

		const expectedValues = {
			'link-palette-color-general': 2,
			'link-hover-palette-color-general': 3,
			'link-active-palette-color-general': 4,
			'link-visited-palette-color-general': 5,
		};

		expect(linkAttributes).toStrictEqual(expectedValues);
	});

	it('Image Dimension', async () => {
		await openSidebarTab(page, 'style', 'image dimension');

		// width
		await page.$eval(
			'.maxi-image-inspector__dimension-width .components-input-control__input',
			input => input.focus()
		);

		await pressKeyTimes('Backspace', '3');
		await page.keyboard.type('60');

		const imageWidth = await getBlockAttributes();
		expect(imageWidth.imgWidth).toStrictEqual(60);

		// reset width
		const button = await page.$(
			'.maxi-image-inspector__dimension-width button'
		);
		await button.click();

		const imageWidthReset = await getBlockAttributes();
		expect(imageWidthReset.imgWidth).toStrictEqual(100);

		// imageRatio
		const selector = await page.$('.maxi-image-inspector__ratio select');

		await selector.select('ar11');

		const ratio = await getBlockAttributes();
		expect(ratio.imageRatio).toStrictEqual('ar11');

		const checkFrontend = await page.$eval(
			'.maxi-image-block .maxi-image-ratio__ar11',
			div => div.innerHTML
		);

		expect(checkFrontend).toMatchSnapshot();
	});
	it('Image alt tag', async () => {
		await openSidebarTab(page, 'style', 'image alt tag');

		// select custom alt tag
		const selector = await page.$('.maxi-image-inspector__alt-tag select');
		await selector.select('custom');

		await page.$eval('.maxi-image-inspector__custom-tag input', input =>
			input.focus()
		);

		await page.keyboard.type('Image Tag');

		const altTag = await getBlockAttributes();
		expect(altTag.mediaAlt).toStrictEqual('Image Tag');

		const previewPage = await openPreviewPage(page);
		await previewPage.waitForSelector('.entry-content');

		const expectAlt = await previewPage.$eval(
			'figure div img',
			alterative => alterative.alt
		);
		expect(expectAlt).toStrictEqual('Image Tag');
	});
});
