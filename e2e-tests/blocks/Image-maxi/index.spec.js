/* eslint-disable no-await-in-loop */
/**
 * WordPress dependencies
 */
import {
	createNewPost,
	pressKeyTimes,
	pressKeyWithModifier,
} from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	addCustomCSS,
	addTypographyOptions,
	addTypographyStyle,
	editColorControl,
	getAttributes,
	getBlockStyle,
	getEditedPostContent,
	openPreviewPage,
	openSidebarTab,
	insertMaxiBlock,
	updateAllBlockUniqueIds,
} from '../../utils';

describe.skip('Image Maxi', () => {
	it('Image Maxi does not break', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Image Maxi');

		await updateAllBlockUniqueIds(page);
		expect(await getEditedPostContent(page)).toMatchSnapshot();
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

		expect(await getAttributes('externalUrl')).toStrictEqual(
			'https://www.dzoom.org.es/wp-content/uploads/2017/07/seebensee-2384369-810x540.jpg'
		);
		const accordionPanel = await openSidebarTab(page, 'style', 'caption');

		// Custom caption
		const selector = await accordionPanel.$(
			'.maxi-image-caption-type select'
		);
		await selector.select('custom');

		// Caption position
		const positionSelector = await page.$(
			'.maxi-image-inspector__caption-position select'
		);

		await positionSelector.select('top');
		expect(await getAttributes('captionPosition')).toStrictEqual('top');

		// insert text
		await page.waitForSelector('.maxi-image-block__caption span');
		const text = await page.$('.maxi-image-block__caption span');
		await text.click();
		await page.keyboard.type('Testing Caption', { delay: 100 });

		expect(await getAttributes('captionContent')).toStrictEqual(
			'Testing Caption'
		);

		// Caption gap
		await page.$$eval('.maxi-image-inspector__caption-gap input', input =>
			input[0].focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('5', { delay: 350 });

		// fontFamily
		const fontFamilySelector = await accordionPanel.$(
			'.maxi-typography-control .maxi-typography-control__font-family'
		);
		await fontFamilySelector.click();
		await page.keyboard.type('Montserrat', { delay: 350 });
		await page.keyboard.press('Enter');
		await page.waitForTimeout(200);

		expect(await getAttributes('font-family-xl')).toStrictEqual(
			'Montserrat'
		);

		// fontColor
		await editColorControl({
			page,
			instance: await page.$('.maxi-typography-control__color'),
			paletteStatus: true,
			colorPalette: 4,
		});

		expect(await getAttributes('link-palette-color-xl')).toStrictEqual(4);

		// alignment
		await accordionPanel.$$eval(
			'.maxi-alignment-control button',
			alignment => alignment[1].click()
		);

		expect(await getAttributes('text-alignment-xl')).toStrictEqual(
			'center'
		);

		// size, line-height, letter-spacing
		await addTypographyOptions({
			page,
			instance: await page.$(
				'.maxi-typography-control .maxi-typography-control__text-options-tabs .maxi-tabs-content'
			),
			size: '19',
			lineHeight: '4',
			letterSpacing: '11',
		});

		const attributes = await getAttributes([
			'font-size-xl',
			'line-height-xl',
			'letter-spacing-xl',
		]);

		const expectedAttributesTwo = {
			'font-size-xl': 19,
			'line-height-xl': 4,
			'letter-spacing-xl': 11,
		};

		expect(attributes).toStrictEqual(expectedAttributesTwo);

		// Weight, Transform, Style, Decoration
		await addTypographyStyle({
			instance: await page.$(
				'.maxi-typography-control .maxi-typography-control__text-options-tabs .maxi-tabs-content'
			),
			decoration: 'overline',
			weight: '300',
			transform: 'capitalize',
			style: 'italic',
			orientation: 'mixed',
			direction: 'rtl',
			indent: '44',
		});

		const result = await getAttributes([
			'font-style-xl',
			'font-weight-xl',
			'text-decoration-xl',
			'text-transform-xl',
		]);

		const expectedAttributes = {
			'font-style-xl': 'italic',
			'font-weight-xl': '300',
			'text-decoration-xl': 'overline',
			'text-transform-xl': 'capitalize',
		};

		expect(result).toStrictEqual(expectedAttributes);

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
			'2px 4px 3px rgba(var(--maxi-light-color-8,150,176,203),0.3)',
			'2px 4px 3px rgba(var(--maxi-light-color-8,150,176,203),0.5)',
			'4px 4px 0px rgba(var(--maxi-light-color-8,150,176,203),0.21)',
		];

		for (let i = 0; i < shadowStyles.length; i += 1) {
			const setting = shadowStyles[i];

			await page.waitForSelector(
				'.maxi-typography-control__text-shadow .maxi-default-styles-control button'
			);
			await accordionPanel.$$eval(
				'.maxi-typography-control__text-shadow .maxi-default-styles-control button',
				(buttons, i) => buttons[i].click(),
				i
			);
			await page.waitForTimeout(200);

			expect(await getAttributes('text-shadow-xl')).toStrictEqual(
				setting
			);
		}

		// LinkColor
		await accordionPanel.$$eval(
			'.maxi-settingstab-control.maxi-typography-control__link-options button',
			tabs => tabs[0].click()
		);

		await editColorControl({
			page,
			instance: await page.$('.maxi-typography-link-color'),
			paletteStatus: true,
			colorPalette: 2,
		});

		// LinkHoverColor
		await accordionPanel.$$eval(
			'.maxi-settingstab-control.maxi-typography-control__link-options button',
			tabs => tabs[1].click()
		);
		await editColorControl({
			page,
			instance: await page.$('.maxi-typography-link-hover-color'),
			paletteStatus: true,
			colorPalette: 3,
		});

		// LinkActiveColor
		await accordionPanel.$$eval(
			'.maxi-settingstab-control.maxi-typography-control__link-options button',
			tabs => tabs[2].click()
		);
		await editColorControl({
			page,
			instance: await page.$('.maxi-typography-link-active-color'),
			paletteStatus: true,
			colorPalette: 4,
		});

		// LinkActiveColor
		await accordionPanel.$$eval(
			'.maxi-settingstab-control.maxi-typography-control__link-options button',
			tabs => tabs[3].click()
		);
		await editColorControl({
			page,
			instance: await page.$('.maxi-typography-link-visited-color'),
			paletteStatus: true,
			colorPalette: 5,
		});

		const expectedValues = {
			'link-palette-color-xl': 2,
			'link-hover-palette-color-xl': 3,
			'link-active-palette-color-xl': 4,
			'link-visited-palette-color-xl': 5,
		};

		const linkAttributes = await getAttributes([
			'link-palette-color-xl',
			'link-hover-palette-color-xl',
			'link-active-palette-color-xl',
			'link-visited-palette-color-xl',
		]);

		expect(linkAttributes).toStrictEqual(expectedValues);
	});

	it('Image Dimension', async () => {
		await openSidebarTab(page, 'style', 'dimension');

		// width
		await page.$eval(
			'.maxi-image-inspector__dimension-width .components-input-control__input',
			input => input.focus()
		);

		await pressKeyTimes('Backspace', '3');
		await page.keyboard.type('60', { delay: 350 });

		expect(await getAttributes('imgWidth')).toStrictEqual(60);

		// reset width
		const button = await page.$(
			'.maxi-image-inspector__dimension-width button'
		);
		await button.click();

		expect(await getAttributes('imgWidth')).toStrictEqual(100);

		// imageRatio
		const selector = await page.$('.maxi-image-inspector__ratio select');

		await selector.select('ar11');

		expect(await getAttributes('imageRatio')).toStrictEqual('ar11');

		const checkFrontend = await page.$eval(
			'.maxi-image-block .maxi-image-ratio__ar11',
			div => div.innerHTML
		);

		expect(checkFrontend).toMatchSnapshot();
		expect(await getAttributes('caption-gap-xl')).toStrictEqual(5);

		const gapSelector = await page.$(
			'.maxi-image-inspector__caption-gap select'
		);

		await gapSelector.select('px');
		expect(await getAttributes('caption-gap-unit-xl')).toStrictEqual('px');
	});

	it('Image alt tag', async () => {
		await openSidebarTab(page, 'style', 'alt tag');

		// select custom alt tag
		const selector = await page.$('.maxi-image-inspector__alt-tag select');
		await selector.select('custom');

		await page.$eval('.maxi-image-inspector__custom-tag input', input =>
			input.focus()
		);

		await page.keyboard.type('Image Custom Tag', { delay: 350 });

		expect(await getAttributes('mediaAlt')).toStrictEqual(
			'Image Custom Tag'
		);

		const previewPage = await openPreviewPage(page);
		await previewPage.waitForSelector('.entry-content');

		const expectAlt = await previewPage.$eval(
			'figure div img',
			alterative => alterative.alt
		);
		expect(expectAlt).toStrictEqual('Image Custom Tag');

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
	it('Image Custom CSS', async () => {
		await expect(await addCustomCSS(page)).toMatchSnapshot();
	}, 500000);
});
