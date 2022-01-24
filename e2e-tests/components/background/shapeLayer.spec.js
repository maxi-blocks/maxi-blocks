/* eslint-disable jest/no-commented-out-tests */
/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	pressKeyWithModifier,
} from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	getBlockAttributes,
	openSidebarTab,
	addBackgroundLayer,
	modalMock,
	changeResponsive,
	editAxisControl,
	getBlockStyle,
} from '../../utils';

describe('BackgroundControl', () => {
	it('Check Background shape layer', async () => {
		await createNewPost();
		await insertBlock('Group Maxi');
		await openSidebarTab(page, 'style', 'background layer');
		await addBackgroundLayer(page, 'shape');

		const accordion = await openSidebarTab(
			page,
			'style',
			'background layer'
		);

		await accordion.$$eval('.maxi-tabs-control button', button =>
			button[0].click()
		);

		await modalMock(page, { type: 'bg-shape', isBGLayers: true });
		await page.$eval('.maxi-background-layer__arrow', display =>
			display.click()
		);

		// opacity
		const opacityInput = await page.$$(
			'.maxi-color-control .maxi-advanced-number-control input'
		);

		await opacityInput[0].focus();
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('77');

		// size
		await page.$$eval(
			'.maxi-background-control__svg-layer--size.maxi-settingstab-control .maxi-tabs-control button',
			sizeButton => sizeButton[1].click()
		);

		const sizeInput = await page.$$(
			'.maxi-background-control__svg-layer--size .maxi-advanced-number-control input'
		);

		await sizeInput[0].focus();
		await page.keyboard.type('43');

		const layerExpect = await getBlockAttributes();
		expect(layerExpect['background-layers']).toMatchSnapshot();

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Check Background shape layer responsive', async () => {
		await changeResponsive(page, 's');

		const baseBackgroundOpacity = await page.$eval(
			'.maxi-color-control .maxi-advanced-number-control input',
			selector => selector.value
		);

		expect(baseBackgroundOpacity).toStrictEqual('77');

		await page.$$eval(
			'.maxi-background-control__svg-layer--size.maxi-settingstab-control .maxi-tabs-control button',
			sizeButton => sizeButton[1].click()
		);

		const baseBackgroundShapeSize = await page.$$eval(
			'.maxi-background-control__svg-layer--size .maxi-advanced-number-control input',
			selector => selector[0].value
		);

		expect(baseBackgroundShapeSize).toStrictEqual('43');

		// opacity and size
		const opacityInput = await page.$$(
			'.maxi-color-control .maxi-advanced-number-control input'
		);

		await opacityInput[0].focus();
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('54');

		const sizeInput = await page.$$(
			'.maxi-background-control__svg-layer--size .maxi-advanced-number-control input'
		);

		await sizeInput[0].focus();
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('23');

		// expect S responsive
		const sBackgroundOpacity = await page.$eval(
			'.maxi-color-control .maxi-advanced-number-control input',
			selector => selector.value
		);

		expect(sBackgroundOpacity).toStrictEqual('54');

		const sBackgroundShapeSize = await page.$$eval(
			'.maxi-background-control__svg-layer--size .maxi-advanced-number-control input',
			selector => selector[0].value
		);

		expect(sBackgroundShapeSize).toStrictEqual('23');

		// expect XS responsive
		await changeResponsive(page, 'xs');

		const xsBackgroundOpacity = await page.$eval(
			'.maxi-color-control .maxi-advanced-number-control input',
			selector => selector.value
		);

		expect(xsBackgroundOpacity).toStrictEqual('54');

		await page.$$eval(
			'.maxi-background-control__svg-layer--size.maxi-settingstab-control .maxi-tabs-control button',
			sizeButton => sizeButton[1].click()
		);

		const xsBackgroundShapeSize = await page.$$eval(
			'.maxi-background-control__svg-layer--size .maxi-advanced-number-control input',
			selector => selector[0].value
		);

		expect(xsBackgroundShapeSize).toStrictEqual('23');

		// expect M responsive
		await changeResponsive(page, 'm');

		const mBackgroundOpacity = await page.$eval(
			'.maxi-color-control .maxi-advanced-number-control input',
			selector => selector.value
		);

		expect(mBackgroundOpacity).toStrictEqual('77');

		await page.$$eval(
			'.maxi-background-control__svg-layer--size.maxi-settingstab-control .maxi-tabs-control button',
			sizeButton => sizeButton[1].click()
		);

		const mBackgroundShapeSize = await page.$$eval(
			'.maxi-background-control__svg-layer--size .maxi-advanced-number-control input',
			selector => selector[0].value
		);

		expect(mBackgroundShapeSize).toStrictEqual('43');
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Check Background shape layer hover', async () => {
		await changeResponsive(page, 'base');
		const accordion = await openSidebarTab(
			page,
			'style',
			'background layer'
		);

		// hover
		await accordion.$$eval('.maxi-tabs-control button', button =>
			button[1].click()
		);

		// enable hover
		await page.$eval(
			'.maxi-background-status-hover .maxi-toggle-switch__toggle input',
			button => button.click()
		);

		// hover options
		await page.$$eval(
			'.maxi-background-layers_options .maxi-background-layer__arrow',
			options => options[0].click()
		);

		await editAxisControl({
			page,
			instance: await page.$('.maxi-background-control__svg-layer--size'),
			values: '66',
		});

		// size
		await page.$$eval(
			'.maxi-background-control__svg-layer--size.maxi-settingstab-control .maxi-tabs-control button',
			sizeButton => sizeButton[1].click()
		);

		const sizeInput = await page.$$(
			'.maxi-background-control__svg-layer--size .maxi-advanced-number-control input'
		);

		await sizeInput[0].focus();
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('22');

		const layerExpect = await getBlockAttributes();
		expect(layerExpect['background-layers']).toMatchSnapshot();
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Check Background shape layer hover responsive', async () => {
		await changeResponsive(page, 's');

		await page.$$eval(
			'.maxi-background-control__svg-layer--size.maxi-settingstab-control .maxi-tabs-control button',
			sizeButton => sizeButton[1].click()
		);

		const baseBackgroundShapeSize = await page.$$eval(
			'.maxi-background-control__svg-layer--size .maxi-advanced-number-control input',
			selector => selector[0].value
		);

		expect(baseBackgroundShapeSize).toStrictEqual('22');

		// size
		const sizeInput = await page.$$(
			'.maxi-background-control__svg-layer--size .maxi-advanced-number-control input'
		);

		await sizeInput[0].focus();
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('12');

		// expect S responsive
		const sBackgroundShapeSize = await page.$$eval(
			'.maxi-background-control__svg-layer--size .maxi-advanced-number-control input',
			selector => selector[0].value
		);

		expect(sBackgroundShapeSize).toStrictEqual('12');

		// expect XS responsive
		await changeResponsive(page, 'xs');

		await page.$$eval(
			'.maxi-background-control__svg-layer--size.maxi-settingstab-control .maxi-tabs-control button',
			sizeButton => sizeButton[1].click()
		);

		const xsBackgroundShapeSize = await page.$$eval(
			'.maxi-background-control__svg-layer--size .maxi-advanced-number-control input',
			selector => selector[0].value
		);

		expect(xsBackgroundShapeSize).toStrictEqual('12');

		// expect M responsive
		await changeResponsive(page, 'm');

		await page.$$eval(
			'.maxi-background-control__svg-layer--size.maxi-settingstab-control .maxi-tabs-control button',
			sizeButton => sizeButton[1].click()
		);

		const mBackgroundShapeSize = await page.$$eval(
			'.maxi-background-control__svg-layer--size .maxi-advanced-number-control input',
			selector => selector[0].value
		);

		expect(mBackgroundShapeSize).toStrictEqual('22');
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
