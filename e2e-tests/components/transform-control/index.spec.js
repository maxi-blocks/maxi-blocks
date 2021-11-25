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
	getAttributes,
	openSidebarTab,
	changeResponsive,
	getBlockStyle,
} from '../../utils';

describe('TransformControl', () => {
	it('Check transform control', async () => {
		await createNewPost();
		await insertBlock('Image Maxi');
		const accordionPanel = await openSidebarTab(
			page,
			'advanced',
			'transform'
		);

		const buttons = await accordionPanel.$$(
			'.maxi-transform-control .maxi-button-group-control button'
		);

		// Scale
		// Y
		await accordionPanel.$eval(
			'.maxi-transform-control .maxi-transform-control__square-control .maxi-transform-control__square-control__y-control__value input',
			select => select.focus()
		);

		await page.keyboard.type('55');

		expect(await getAttributes('transform-scale-y-general')).toStrictEqual(
			55
		);

		// X
		await accordionPanel.$eval(
			'.maxi-transform-control .maxi-transform-control__square-control .maxi-transform-control__square-control__x-control__value input',
			select => select.focus()
		);

		await page.keyboard.type('44');

		expect(await getAttributes('transform-scale-x-general')).toStrictEqual(
			44
		);

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

		expect(
			await getAttributes('transform-translate-y-general')
		).toStrictEqual(55);

		expect(
			await getAttributes('transform-translate-y-unit-general')
		).toStrictEqual('px');

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

		expect(
			await getAttributes('transform-translate-x-general')
		).toStrictEqual(66);

		expect(
			await getAttributes('transform-translate-x-unit-general')
		).toStrictEqual('px');

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
		const colorResult = await getAttributes([
			'transform-rotate-x-general',
			'transform-rotate-y-general',
			'transform-rotate-z-general',
		]);

		const expectedAttributes = {
			'transform-rotate-x-general': 150,
			'transform-rotate-y-general': 200,
			'transform-rotate-z-general': 100,
		};

		expect(colorResult).toStrictEqual(expectedAttributes);

		// Origin
		await buttons[3].click();
		// Y
		await accordionPanel.$eval(
			'.maxi-transform-control .maxi-transform-control__square-control .maxi-transform-control__square-control__y-control__value input',
			select => select.focus()
		);

		await page.keyboard.type('80');

		expect(await getAttributes('transform-origin-y-general')).toStrictEqual(
			'80'
		);

		// X
		await accordionPanel.$eval(
			'.maxi-transform-control .maxi-transform-control__square-control .maxi-transform-control__square-control__x-control__value input',
			select => select.focus()
		);

		await page.keyboard.type('20');

		expect(await getAttributes('transform-origin-x-general')).toStrictEqual(
			'20'
		);
	});

	it('Check Responsive transform control', async () => {
		await openSidebarTab(page, 'advanced', 'transform');
		const tabsControl = await page.$$(
			'.maxi-transform-control .maxi-button-group-control button'
		);

		// Scale
		await tabsControl[0].click();
		const scaleInput = await page.$(
			'.maxi-transform-control .maxi-transform-control__square-control__y-control__value input'
		);

		const scaleValue = await page.$eval(
			'.maxi-transform-control .maxi-transform-control__square-control__y-control__value input',
			input => input.value
		);

		expect(scaleValue).toStrictEqual('55');

		// responsive S
		await changeResponsive(page, 's');
		await scaleInput.focus();
		await pressKeyTimes('Backspace', '1');
		await page.keyboard.type('7');

		const responsiveSOption = await page.$eval(
			'.maxi-transform-control .maxi-transform-control__square-control__y-control__value input',
			input => input.value
		);

		expect(responsiveSOption).toStrictEqual('57');

		expect(await getAttributes('transform-scale-y-s')).toStrictEqual(57);

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

		expect(responsiveMOption).toStrictEqual('55');

		// Translate
		await tabsControl[1].click();
		const translateInput = await page.$(
			'.maxi-transform-control .maxi-transform-control__square-control__y-control__value input'
		);

		const translateValue = await page.$eval(
			'.maxi-transform-control .maxi-transform-control__square-control__y-control__value input',
			input => input.value
		);

		expect(translateValue).toStrictEqual('55');

		// responsive S
		await changeResponsive(page, 's');
		await translateInput.focus();
		await pressKeyTimes('Backspace', '1');
		await page.keyboard.type('3');

		const translateSOption = await page.$eval(
			'.maxi-transform-control .maxi-transform-control__square-control__y-control__value input',
			input => input.value
		);

		expect(translateSOption).toStrictEqual('53');

		expect(await getAttributes('transform-translate-y-s')).toStrictEqual(
			53
		);

		// responsive XS
		await changeResponsive(page, 'xs');
		const translateXsOption = await page.$eval(
			'.maxi-transform-control .maxi-transform-control__square-control__y-control__value input',
			input => input.value
		);

		expect(translateXsOption).toStrictEqual('53');

		// responsive M
		await changeResponsive(page, 'm');
		const translateMOption = await page.$eval(
			'.maxi-transform-control .maxi-transform-control__square-control__y-control__value input',
			input => input.value
		);

		expect(translateMOption).toStrictEqual('55');

		// Rotate
		await tabsControl[2].click();
		const rotateInput = await page.$(
			'.maxi-transform-control .maxi-transform-control__rotate-control__item__input'
		);

		const rotateValue = await page.$eval(
			'.maxi-transform-control .maxi-transform-control__rotate-control__item__input',
			input => input.value
		);

		expect(rotateValue).toStrictEqual('150');

		// responsive S
		await changeResponsive(page, 's');
		await rotateInput.focus();
		await pressKeyTimes('Backspace', '2');
		await page.keyboard.type('5');

		const rotateSOption = await page.$eval(
			'.maxi-transform-control .maxi-transform-control__rotate-control__item__input',
			input => input.value
		);

		expect(rotateSOption).toStrictEqual('15');

		expect(await getAttributes('transform-rotate-x-s')).toStrictEqual(15);

		// responsive XS
		await changeResponsive(page, 'xs');
		const rotateXsOption = await page.$eval(
			'.maxi-transform-control .maxi-transform-control__rotate-control__item__input',
			input => input.value
		);

		expect(rotateXsOption).toStrictEqual('15');

		// responsive M
		await changeResponsive(page, 'm');
		const rotateMOption = await page.$eval(
			'.maxi-transform-control .maxi-transform-control__rotate-control__item__input',
			input => input.value
		);

		expect(rotateMOption).toStrictEqual('150');

		// Origin
		await tabsControl[3].click();
		const originInput = await page.$(
			'.maxi-transform-control .maxi-transform-control__square-control__y-control__value input'
		);

		const originValue = await page.$eval(
			'.maxi-transform-control .maxi-transform-control__square-control__y-control__value input',
			input => input.value
		);

		expect(originValue).toStrictEqual('80');

		// responsive S
		await changeResponsive(page, 's');
		await originInput.focus();
		await pressKeyTimes('Backspace', '1');
		await page.keyboard.type('8');

		const originSOption = await page.$eval(
			'.maxi-transform-control .maxi-transform-control__square-control__y-control__value input',
			input => input.value
		);

		expect(originSOption).toStrictEqual('88');

		expect(await getAttributes('transform-origin-y-s')).toStrictEqual('88');

		// responsive XS
		await changeResponsive(page, 'xs');
		const originXsOption = await page.$eval(
			'.maxi-transform-control .maxi-transform-control__square-control__y-control__value input',
			input => input.value
		);

		expect(originXsOption).toStrictEqual('88');

		// responsive M
		await changeResponsive(page, 'm');
		const originMOption = await page.$eval(
			'.maxi-transform-control .maxi-transform-control__square-control__y-control__value input',
			input => input.value
		);

		expect(originMOption).toStrictEqual('80');

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
