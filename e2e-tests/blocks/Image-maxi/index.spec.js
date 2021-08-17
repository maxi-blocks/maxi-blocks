/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	pressKeyTimes,
	getEditedPostContent,
} from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { getBlockAttributes, openSidebar } from '../../utils';

describe('Image Maxi', () => {
	it('Image Maxi does not break', async () => {
		await createNewPost();
		await insertBlock('Image Maxi');

		expect(await getEditedPostContent()).toMatchSnapshot();
	});

	it('Checking the image caption', async () => {
		await createNewPost();
		await insertBlock('Image Maxi');

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

		const accordionPanel = await openSidebar(page, 'caption');

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
		await page.keyboard.type('Montserrat');
		await page.keyboard.press('Enter');

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
		await inputs[0].focus();
		await pressKeyTimes('Backspace', '1');
		await page.keyboard.type('9');

		await inputs[2].focus();
		await pressKeyTimes('Backspace', '4');
		await page.keyboard.type('2');

		await inputs[4].focus();
		await page.keyboard.type('11');

		const styleAttributes = await getBlockAttributes();
		const typographyAttributes = (({
			'font-size-m': fontSize,
			'line-height-m': lineHeight,
			'letter-spacing-m': letterSpacing,
		}) => ({
			'font-size-m': fontSize,
			'line-height-m': lineHeight,
			'letter-spacing-m': letterSpacing,
		}))(styleAttributes);

		const expectedAttributesTwo = {
			'font-size-m': 19,
			'line-height-m': 12,
			'letter-spacing-m': 11,
		};

		expect(typographyAttributes).toStrictEqual(expectedAttributesTwo);

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
		await accordionPanel.$$eval(
			'.maxi-typography-control .maxi-textshadow-control .maxi-base-control__field label',
			select => select[1].click()
		);

		await accordionPanel.$$(
			'.maxi-textshadow-control.maxi-typography-control__text-shadow .maxi-default-styles-control'
		);

		const shadowStyles = [
			'none',
			'0px 0px 5px #a2a2a2',
			'5px 0px 3px #a2a2a2',
			'2px 4px 0px #a2a2a2',
		];

		for (let i = 0; i < shadowStyles.length; i++) {
			const setting = shadowStyles[i];

			await accordionPanel.$$eval(
				'.maxi-textshadow-control.maxi-typography-control__text-shadow .maxi-default-styles-control button',
				(buttons, i) => buttons[i].click(),
				i
			);

			const shadowAttributes = await getBlockAttributes();
			const textShadow = shadowAttributes['text-shadow-general'];
			expect(textShadow).toStrictEqual(setting);
		}

		// Colors: LinkColour, LinkHoverColour, LinkActiveColour, LinkVisitedColour
		const colors = await accordionPanel.$$(
			'.maxi-typography-control .maxi-color-palette-control .maxi-sc-color-palette div'
		);

		// LinkColour
		await colors[9].click();
		// LinkHoverColour
		await colors[17].click();
		// LinkActiveColour
		await colors[24].click();
		// LinkVisitedColour
		await colors[31].click();

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
			'link-palette-color-general': 3,
			'link-hover-palette-color-general': 4,
			'link-active-palette-color-general': 4,
			'link-visited-palette-color-general': 4,
		};

		expect(linkAttributes).toStrictEqual(expectedValues);
	});
});
