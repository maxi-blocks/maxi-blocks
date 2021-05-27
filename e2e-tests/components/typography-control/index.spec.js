import {
	createNewPost,
	insertBlock,
	getEditedPostContent,
	pressKeyTimes,
} from '@wordpress/e2e-test-utils';
import { getBlockAttributes } from '../../utils';
import openSidebar from '../../utils/openSidebar';

describe('typography control', () => {
	beforeEach(async () => {
		await createNewPost();
	});
	it('checking the typography control', async () => {
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing font family');
		const accordionPanel = await openSidebar(page, 'typography');
		// fontFamily
		const fontFamilySelector = await accordionPanel.$(
			'.maxi-typography-control .maxi-typography-control__font-family'
		);
		await fontFamilySelector.click();
		await page.keyboard.type('Montserrat');
		await page.keyboard.press('Enter');

		const expectedFontFamily = 'Montserrat';
		const attributes = await getBlockAttributes();

		expect(attributes['font-family-general']).toStrictEqual(
			expectedFontFamily
		);
		// fontColor

		await accordionPanel.$eval(
			'.maxi-color-control .maxi-color-control__color input',
			select => select.focus()
		);

		await pressKeyTimes('Backspace', '6');
		await page.keyboard.type('FAFA03');
		await page.keyboard.press('Enter');

		await page.waitForTimeout(1000);

		const expectedColor = 'rgba(250,250,3,1)';

		const colorAttributes = await getBlockAttributes();

		expect(colorAttributes['color-general']).toStrictEqual(expectedColor);

		// size, Line height and Letter spacing

		// size
		await accordionPanel.$eval(
			'.maxi-typography-control__size input',
			select => select.focus()
		);
		await pressKeyTimes('Backspace', '1');
		await page.keyboard.type('9');

		// line-height
		await accordionPanel.$eval(
			'.maxi-typography-control__line-height input',
			select => select.focus()
		);
		await pressKeyTimes('Backspace', '4');
		await page.keyboard.type('40');

		// letter-spacing
		await accordionPanel.$eval(
			'.maxi-typography-control__letter-spacing input',
			select => select.focus()
		);
		await page.keyboard.type('10');

		const stylesAttributes = await getBlockAttributes();
		const expectedResult = (({
			'line-height-general': lineHeight,
			'letter-spacing-general': letterSpacing,
			'font-size-general': fontSize,
		}) => ({
			'line-height-general': lineHeight,
			'letter-spacing-general': letterSpacing,
			'font-size-general': fontSize,
		}))(stylesAttributes);
		const expectedAttributes = {
			'line-height-general': 140,
			'letter-spacing-general': 10,
			'font-size-general': 19,
		};
		expect(expectedResult).toStrictEqual(expectedAttributes);

		// Weight, Transform, Style, Decoration
		const weightSelector = await accordionPanel.$(
			'.maxi-typography-control__weight .components-select-control__input'
		);
		await weightSelector.select('300');

		const transformSelector = await accordionPanel.$(
			'.maxi-typography-control__transform .components-select-control__input'
		);
		await transformSelector.select('capitalize');

		const fontStyleSelector = await accordionPanel.$(
			'.maxi-typography-control__font-style .components-select-control__input'
		);
		await fontStyleSelector.select('italic');

		const decorationSelector = await accordionPanel.$(
			'.maxi-typography-control__decoration .components-select-control__input'
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
			'.maxi-textshadow-control .components-base-control__field .components-radio-control__option label',
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

			expect(shadowAttributes['text-shadow-general']).toStrictEqual(
				setting
			);
		}
	});
});
