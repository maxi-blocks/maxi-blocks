/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { getBlockAttributes, openAdvancedSidebar } from '../../utils';

describe('TransformControl', () => {
	it('Check transform control', async () => {
		await createNewPost();
		await insertBlock('Image Maxi');
		const accordionPanel = await openAdvancedSidebar(page, 'transform');

		const buttons = await accordionPanel.$$(
			'.maxi-transform-control .maxi-settingstab-control button'
		);

		// scale
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
});
