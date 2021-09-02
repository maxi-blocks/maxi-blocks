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
import {
	getBlockAttributes,
	openAdvancedSidebar,
	changeResponsive,
} from '../../utils';

describe('TransformControl', () => {
	it('Check transform control', async () => {
		await createNewPost();
		await insertBlock('Image Maxi');
		const accordionPanel = await openAdvancedSidebar(page, 'transform');

		const buttons = await accordionPanel.$$(
			'.maxi-transform-control .maxi-settingstab-control button'
		);

		// Scale
		// Y
		await accordionPanel.$eval(
			'.maxi-transform-control .maxi-transform-control__square-control .maxi-transform-control__square-control__y-control__value input',
			select => select.focus()
		);

		await page.keyboard.type('55');

		const transformScaleY = await getBlockAttributes();
		const scaleY = transformScaleY['transform-scale-y-general'];
		const expectY = 55;

		expect(scaleY).toStrictEqual(expectY);

		// X
		await accordionPanel.$eval(
			'.maxi-transform-control .maxi-transform-control__square-control .maxi-transform-control__square-control__x-control__value input',
			select => select.focus()
		);

		await page.keyboard.type('44');

		const transformScaleX = await getBlockAttributes();
		const scaleX = transformScaleX['transform-scale-x-general'];
		const expectX = 44;

		expect(scaleX).toStrictEqual(expectX);

		// translate
		await buttons[1].click();

		// Y
		await accordionPanel.$eval(
			'.maxi-transform-control .maxi-transform-control__square-control .maxi-transform-control__square-control__y-control__value input',
			select => select.focus()
		);
		await page.keyboard.type('55');

		const selectYUnit = await accordionPanel.$(
			'.maxi-transform-control .maxi-transform-control__square-control .maxi-transform-control__square-control__y-control__value select'
		);
		await selectYUnit.select('px');

		const transformTranslateY = await getBlockAttributes();
		const translateY = transformTranslateY['transform-translate-y-general'];
		const expectTranslateY = 55;

		expect(translateY).toStrictEqual(expectTranslateY);

		const translateYUnit =
			transformTranslateY['transform-translate-y-unit-general'];
		const expectTranslateYUnit = 'px';

		expect(translateYUnit).toStrictEqual(expectTranslateYUnit);

		// X
		await accordionPanel.$eval(
			'.maxi-transform-control .maxi-transform-control__square-control .maxi-transform-control__square-control__x-control__value input',
			select => select.focus()
		);
		await page.keyboard.type('66');

		const selectXUnit = await accordionPanel.$(
			'.maxi-transform-control .maxi-transform-control__square-control .maxi-transform-control__square-control__x-control__value select'
		);
		await selectXUnit.select('px');

		const transformTranslateX = await getBlockAttributes();
		const translateX = transformTranslateX['transform-translate-x-general'];
		const expectTranslateX = 66;

		expect(translateX).toStrictEqual(expectTranslateX);

		const translateXUnit =
			transformTranslateX['transform-translate-x-unit-general'];
		const expectTranslateXUnit = 'px';

		expect(translateXUnit).toStrictEqual(expectTranslateXUnit);

		// Rotate
		await buttons[2].click();
		const rotateInputs = await accordionPanel.$$(
			'.maxi-transform-control__rotate-control .maxi-transform-control__rotate-control__item__input'
		);

		// X
		await rotateInputs[0].focus();
		await page.keyboard.type('150');

		// Y
		await rotateInputs[1].focus();
		await page.keyboard.type('200');

		// Z
		await rotateInputs[2].focus();
		await page.keyboard.type('100');

		// expect
		const styleAttributes = await getBlockAttributes();
		const rotateAttributes = (({
			'transform-rotate-x-general': transformRotateX,
			'transform-rotate-y-general': transformRotateY,
			'transform-rotate-z-general': transformRotateZ,
		}) => ({
			'transform-rotate-x-general': transformRotateX,
			'transform-rotate-y-general': transformRotateY,
			'transform-rotate-z-general': transformRotateZ,
		}))(styleAttributes);

		const expectedAttributes = {
			'transform-rotate-x-general': 150,
			'transform-rotate-y-general': 200,
			'transform-rotate-z-general': 100,
		};

		expect(rotateAttributes).toStrictEqual(expectedAttributes);

		// Origin
		await buttons[3].click();
		// Y
		await accordionPanel.$eval(
			'.maxi-transform-control .maxi-transform-control__square-control .maxi-transform-control__square-control__y-control__value input',
			select => select.focus()
		);

		await page.keyboard.type('80');

		const transformOriginY = await getBlockAttributes();
		const originY = transformOriginY['transform-origin-y-general'];
		const expectYOrigin = 80;

		expect(originY).toStrictEqual(expectYOrigin);

		// X
		await accordionPanel.$eval(
			'.maxi-transform-control .maxi-transform-control__square-control .maxi-transform-control__square-control__x-control__value input',
			select => select.focus()
		);

		await page.keyboard.type('20');

		const transformOriginX = await getBlockAttributes();
		const originX = transformOriginX['transform-origin-x-general'];
		const expectXOrigin = 20;

		expect(originX).toStrictEqual(expectXOrigin);
	});

	it('Check Responsive transform control', async () => {
		await createNewPost();
		await insertBlock('Image Maxi');
		await openAdvancedSidebar(page, 'transform');
		const tabsControl = await page.$$(
			'.maxi-transform-control .maxi-tabs-control button'
		);

		// Scale
		// general
		const scaleInput = await page.$(
			'.maxi-transform-control .maxi-transform-control__square-control__y-control__value input'
		);

		await scaleInput.focus();
		await page.waitForTimeout(100);
		await page.keyboard.type('5');
		const scaleValue = await page.$eval(
			'.maxi-transform-control .maxi-transform-control__square-control__y-control__value input',
			input => input.value
		);

		expect(scaleValue).toStrictEqual('5');

		// responsive S
		await changeResponsive(page, 's');
		await scaleInput.focus();
		await page.keyboard.type('7');

		const responsiveSOption = await page.$eval(
			'.maxi-transform-control .maxi-transform-control__square-control__y-control__value input',
			input => input.value
		);

		expect(responsiveSOption).toStrictEqual('57');

		const attributes = await getBlockAttributes();
		const transformScale = attributes['transform-scale-y-s'];

		expect(transformScale).toStrictEqual(57);

		// responsive XS
		await changeResponsive(page, 'xs');
		const responsiveXsOption = await page.$eval(
			'.maxi-transform-control .maxi-transform-control__square-control__y-control__value input',
			input => input.value
		);

		expect(responsiveXsOption).toStrictEqual('57');

		// responsive M
		await changeResponsive(page, 'm');
		const responsiveMOption = await page.$eval(
			'.maxi-transform-control .maxi-transform-control__square-control__y-control__value input',
			input => input.value
		);

		expect(responsiveMOption).toStrictEqual('5');

		// Translate
		await tabsControl[1].click();
		const translateInput = await page.$(
			'.maxi-transform-control .maxi-transform-control__square-control__y-control__value input'
		);

		await translateInput.focus();
		await page.keyboard.type('3');
		const translateValue = await page.$eval(
			'.maxi-transform-control .maxi-transform-control__square-control__y-control__value input',
			input => input.value
		);

		expect(translateValue).toStrictEqual('3');

		// responsive S
		await changeResponsive(page, 's');
		await translateInput.focus();
		await page.keyboard.type('5');

		const translateSOption = await page.$eval(
			'.maxi-transform-control .maxi-transform-control__square-control__y-control__value input',
			input => input.value
		);

		expect(translateSOption).toStrictEqual('35');

		const translateAttributes = await getBlockAttributes();
		const translate = translateAttributes['transform-translate-y-s'];

		expect(translate).toStrictEqual(35);

		// responsive XS
		await changeResponsive(page, 'xs');
		const translateXsOption = await page.$eval(
			'.maxi-transform-control .maxi-transform-control__square-control__y-control__value input',
			input => input.value
		);

		expect(translateXsOption).toStrictEqual('35');

		// responsive M
		await changeResponsive(page, 'm');
		const translateMOption = await page.$eval(
			'.maxi-transform-control .maxi-transform-control__square-control__y-control__value input',
			input => input.value
		);

		expect(translateMOption).toStrictEqual('3');

		// Rotate
		await tabsControl[2].click();
		const rotateInput = await page.$(
			'.maxi-transform-control .maxi-transform-control__rotate-control__item__input'
		);

		await rotateInput.focus();
		await page.keyboard.type('9');
		const rotateValue = await page.$eval(
			'.maxi-transform-control .maxi-transform-control__rotate-control__item__input',
			input => input.value
		);

		expect(rotateValue).toStrictEqual('9');

		// responsive S
		await changeResponsive(page, 's');
		await translateInput.focus();
		await page.keyboard.type('5');

		const rotateSOption = await page.$eval(
			'.maxi-transform-control .maxi-transform-control__rotate-control__item__input',
			input => input.value
		);

		expect(rotateSOption).toStrictEqual('95');

		const rotateAttributes = await getBlockAttributes();
		const rotate = rotateAttributes['transform-rotate-x-s'];

		expect(rotate).toStrictEqual(95);

		// responsive XS
		await changeResponsive(page, 'xs');
		const rotateXsOption = await page.$eval(
			'.maxi-transform-control .maxi-transform-control__rotate-control__item__input',
			input => input.value
		);

		expect(rotateXsOption).toStrictEqual('95');

		// responsive M
		await changeResponsive(page, 'm');
		const rotateMOption = await page.$eval(
			'.maxi-transform-control .maxi-transform-control__rotate-control__item__input',
			input => input.value
		);

		expect(rotateMOption).toStrictEqual('9');

		// Origin
		await tabsControl[3].click();
		const originInput = await page.$(
			'.maxi-transform-control .maxi-transform-control__square-control__y-control__value input'
		);

		await originInput.focus();
		await page.keyboard.type('6');
		const originValue = await page.$eval(
			'.maxi-transform-control .maxi-transform-control__square-control__y-control__value input',
			input => input.value
		);

		expect(originValue).toStrictEqual('6');

		// responsive S
		await changeResponsive(page, 's');
		await originInput.focus();
		await page.keyboard.type('3');

		const originSOption = await page.$eval(
			'.maxi-transform-control .maxi-transform-control__square-control__y-control__value input',
			input => input.value
		);

		expect(originSOption).toStrictEqual('63');

		const originAttributes = await getBlockAttributes();
		const origin = originAttributes['transform-origin-y-s'];

		expect(origin).toStrictEqual(63);

		// responsive XS
		await changeResponsive(page, 'xs');
		const originXsOption = await page.$eval(
			'.maxi-transform-control .maxi-transform-control__square-control__y-control__value input',
			input => input.value
		);

		expect(originXsOption).toStrictEqual('63');

		// responsive M
		await changeResponsive(page, 'm');
		const originMOption = await page.$eval(
			'.maxi-transform-control .maxi-transform-control__square-control__y-control__value input',
			input => input.value
		);

		expect(originMOption).toStrictEqual('6');
	});
});
