/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	pressKeyTimes,
} from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { getBlockAttributes, openSidebar } from '../../utils';

describe('TypographyControl', () => {
	it('Checking the typography control', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing Text Maxi');
		const accordionPanel = await openSidebar(page, 'typography');

		// fontFamily
		const fontFamilySelector = await accordionPanel.$(
			'.maxi-typography-control .maxi-typography-control__font-family'
		);
		await fontFamilySelector.click();
		await page.keyboard.type('Montserrat');
		await page.keyboard.press('Enter');
		await page.waitForTimeout(100);

		const attributes = await getBlockAttributes();
		const fontFamily = attributes['font-family-general'];
		const expectedFontFamily = 'Montserrat';

		expect(fontFamily).toStrictEqual(expectedFontFamily);

		// fontColor
		await accordionPanel.$eval(
			'.maxi-sc-color-palette__custom .maxi-radio-control__option label',
			select => select.click()
		);

		await accordionPanel.$eval(
			'.maxi-color-control .maxi-color-control__color input',
			select => select.focus()
		);

		await pressKeyTimes('Backspace', '6');
		await page.keyboard.type('FAFA03');
		await page.keyboard.press('Enter');

		await page.waitForTimeout(500);

		const colorAttributes = await getBlockAttributes();
		const color = colorAttributes['color-general'];
		const expectedColor = 'rgba(250,250,3,1)';

		expect(color).toStrictEqual(expectedColor);

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

		const styleAttributes = await getBlockAttributes();
		const typographyAttributes = (({
			'font-style-general': fontStyle,
			'font-weight-general': fontWeight,
			'text-decoration-general': textDecoration,
			'text-transform-general': textTransform,
		}) => ({
			'font-style-general': fontStyle,
			'font-weight-general': fontWeight,
			'text-decoration-general': textDecoration,
			'text-transform-general': textTransform,
		}))(styleAttributes);

		const expectedAttributesTwo = {
			'font-style-general': 'italic',
			'font-weight-general': '300',
			'text-decoration-general': 'overline',
			'text-transform-general': 'capitalize',
		};

		expect(typographyAttributes).toStrictEqual(expectedAttributesTwo);

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

		// size, Line height and Letter spacing

		// size
		await accordionPanel.$$eval(
			'.maxi-tabs-content .maxi-typography-control__text-options-tabs .maxi-tabs-content input',
			select => select[0].focus()
		);
		await pressKeyTimes('Backspace', '1');
		await page.waitForTimeout(200);

		await page.keyboard.type('9');
		await page.waitForTimeout(200);

		// line-height
		await accordionPanel.$$eval(
			'.maxi-tabs-content .maxi-typography-control__text-options-tabs .maxi-tabs-content input',
			select => select[2].focus()
		);
		await pressKeyTimes('Backspace', '1');
		await page.waitForTimeout(200);

		await page.keyboard.type('4');
		await page.waitForTimeout(200);

		// letter-spacing
		await accordionPanel.$$eval(
			'.maxi-tabs-content .maxi-typography-control__text-options-tabs .maxi-tabs-content input',
			select => select[4].focus()
		);
		await page.keyboard.type('10');
		await page.waitForTimeout(200);

		const stylesAttributes = await getBlockAttributes();

		const expectedResult = (({
			'line-height-m': lineHeight,
			'letter-spacing-m': letterSpacing,
			'font-size-m': fontSize,
		}) => ({
			'line-height-m': lineHeight,
			'letter-spacing-m': letterSpacing,
			'font-size-m': fontSize,
		}))(stylesAttributes);

		const expectedAttributes = {
			'line-height-m': 1.624,
			'letter-spacing-m': 10,
			'font-size-m': 19,
		};

		expect(expectedResult).toStrictEqual(expectedAttributes);
	});
});
