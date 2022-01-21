/* eslint-disable no-await-in-loop */
/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	getEditedPostContent,
	pressKeyTimes,
	pressKeyWithModifier,
} from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	openSidebarTab,
	openPreviewPage,
	getAttributes,
	editColorControl,
	getBlockStyle,
	addTypographyOptions,
	addTypographyStyle,
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

		expect(await getAttributes('externalUrl')).toStrictEqual(
			'https://www.dzoom.org.es/wp-content/uploads/2017/07/seebensee-2384369-810x540.jpg'
		);
	});

	it('Image Dimension', async () => {
		await openSidebarTab(page, 'style', 'dimension');

		// imageRatio
		const selectorRatio = await page.$(
			'.maxi-image-inspector__ratio select'
		);

		await selectorRatio.select('ar11');

		expect(await getAttributes('imageRatio')).toStrictEqual('ar11');

		const checkFrontend = await page.$eval(
			'.maxi-image-block .maxi-image-ratio__ar11',
			div => div.innerHTML
		);

		expect(checkFrontend).toMatchSnapshot();
	});

	it('check title position', async () => {
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

		const caption = await page.$eval(
			'.maxi-image-block__resizer figcaption',
			input => input.focus()
		);

		await page.keyboard.type('Image test caption');

		const htmlCaption = await page.$eval(
			'.maxi-image-block__resizer figcaption',
			content => content.innerText
		);

		expect(htmlCaption).toMatchSnapshot();

		debugger;

		// Caption gap
		await page.$$eval('.maxi-image-inspector__caption-gap input', input =>
			input[0].focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('5');

		expect(await getAttributes('caption-gap-general')).toStrictEqual(5);

		const gapSelector = await page.$(
			'.maxi-image-inspector__caption-gap select'
		);

		await gapSelector.select('px');
		expect(await getAttributes('caption-gap-unit-general')).toStrictEqual(
			'px'
		);

		// fontFamily
		const fontFamilySelector = await accordionPanel.$(
			'.maxi-typography-control .maxi-typography-control__font-family'
		);

		await fontFamilySelector.click();
		await page.keyboard.type('Montserrat', { delay: 100 });
		await page.keyboard.press('Enter');
		await page.waitForTimeout(200);

		expect(await getAttributes('font-family-general')).toStrictEqual(
			'Montserrat'
		);

		// fontColor
		await editColorControl({
			page,
			instance: await page.$('.maxi-typography-control__color'),
			paletteStatus: true,
			colorPalette: 4,
		});

		expect(await getAttributes('link-palette-color-general')).toStrictEqual(
			4
		);

		// alignment
		await accordionPanel.$$eval(
			'.maxi-alignment-control button',
			alignment => alignment[1].click()
		);

		expect(await getAttributes('text-alignment-general')).toStrictEqual(
			'center'
		);

		// size, line-height, letter-spacing
		await addTypographyOptions({
			page,
			instance: await page.$(
				'.maxi-typography-control__text-options-tabs'
			),
			size: '11',
			lineHeight: '22',
			letterSpacing: '30',
		});

		const responsiveStage = await accordionPanel.$eval(
			'.maxi-typography-control__text-options-tabs .maxi-tabs-control__button[aria-pressed="true"]',
			tab => tab.innerText.toLowerCase()
		);

		const attributes = await getAttributes([
			[`font-size-${responsiveStage}`],
			[`line-height-${responsiveStage}`],
			[`letter-spacing-${responsiveStage}`],
		]);

		const expectedAttributesTwo = {
			[`font-size-${responsiveStage}`]: 11,
			[`line-height-${responsiveStage}`]: 22,
			[`letter-spacing-${responsiveStage}`]: 30,
		};

		expect(attributes).toStrictEqual(expectedAttributesTwo);

		// Weight, Transform, Style, Decoration
		await addTypographyStyle({
			page,
			decoration: 'overline',
			weight: '300',
			transform: 'capitalize',
			style: 'italic',
		});

		const result = await getAttributes([
			'font-style-general',
			'font-weight-general',
			'text-decoration-general',
			'text-transform-general',
		]);

		const expectedAttributes = {
			'font-style-general': 'italic',
			'font-weight-general': '300',
			'text-decoration-general': 'overline',
			'text-transform-general': 'capitalize',
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

			expect(await getAttributes('text-shadow-general')).toStrictEqual(
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
			'link-palette-color-general': 2,
			'link-hover-palette-color-general': 3,
			'link-active-palette-color-general': 4,
			'link-visited-palette-color-general': 5,
		};

		const linkAttributes = await getAttributes([
			'link-palette-color-general',
			'link-hover-palette-color-general',
			'link-active-palette-color-general',
			'link-visited-palette-color-general',
		]);

		expect(linkAttributes).toStrictEqual(expectedValues);
	});

	it('Image alt tag', async () => {
		await openSidebarTab(page, 'style', 'alt tag');

		// select custom alt tag
		const selector = await page.$('.maxi-image-inspector__alt-tag select');
		await selector.select('custom');

		await page.$eval('.maxi-image-inspector__custom-tag input', input =>
			input.focus()
		);

		await page.keyboard.type('Image Tag');

		expect(await getAttributes('mediaAlt')).toStrictEqual('Image Tag');

		const previewPage = await openPreviewPage(page);
		await previewPage.waitForSelector('.entry-content');

		const expectAlt = await previewPage.$eval(
			'.entry-content .maxi-image-block__image',
			alterative => alterative.alt
		);
		expect(expectAlt).toStrictEqual('Image Tag');

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
