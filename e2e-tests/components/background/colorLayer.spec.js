/* eslint-disable jest/no-commented-out-tests */
/**
 * WordPress dependencies
 */
import {
	pressKeyWithModifier,
	insertBlock,
	createNewPost,
} from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	getBlockAttributes,
	addBackgroundLayer,
	getBlockStyle,
	openSidebarTab,
	changeResponsive,
	openPreviewPage,
} from '../../utils';

describe('Background Color Layer', () => {
	it('Check Background Color layer', async () => {
		await createNewPost();
		await insertBlock('Group Maxi');
		await openSidebarTab(page, 'style', 'background layer');
		await addBackgroundLayer(page, 'color');

		// change color
		await page.$$eval(
			'.maxi-background-layer__content .maxi-color-control__palette-container button',
			colorPalette => colorPalette[4].click()
		);

		// opacity
		await page.$eval(
			'.maxi-background-control .maxi-advanced-number-control input',
			opacity => opacity.focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('45');

		// clip-path
		await page.$eval(
			'.maxi-clip-path-control .maxi-toggle-switch__toggle input',
			input => input.click()
		);

		await page.$$eval('.clip-path-defaults button', buttons =>
			buttons[3].click()
		);

		const layerExpect = await getBlockAttributes();
		expect(layerExpect['background-layers']).toMatchSnapshot();
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Check Background Color layer responsive', async () => {
		await changeResponsive(page, 's');

		// expect general
		const baseColorSelected = await page.$eval(
			'.maxi-color-control__palette-container .maxi-color-control__palette-box--active',
			select => select.getAttribute('data-item')
		);

		expect(baseColorSelected).toStrictEqual('5');

		// modify s responsive
		await page.$$eval(
			'.maxi-background-layer__content .maxi-color-control__palette-box',
			colorPalette => colorPalette[5].click()
		);

		// expect s
		const sColorSelected = await page.$eval(
			'.maxi-color-control__palette-container .maxi-color-control__palette-box--active',
			select => select.getAttribute('data-item')
		);
		expect(sColorSelected).toStrictEqual('6');

		// expect xs
		await changeResponsive(page, 'xs');

		const xsColorSelected = await page.$eval(
			'.maxi-color-control__palette-container .maxi-color-control__palette-box--active',
			select => select.getAttribute('data-item')
		);

		expect(xsColorSelected).toStrictEqual('6');

		// expect m
		await changeResponsive(page, 'm');

		const mColorSelected = await page.$eval(
			'.maxi-color-control__palette-container .maxi-color-control__palette-box--active',
			select => select.getAttribute('data-item')
		);

		expect(mColorSelected).toStrictEqual('5');
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Check Background Color layer hover', async () => {
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
		await page.$eval(
			'.maxi-background-layers_options .maxi-background-layer__arrow',
			options => options.click()
		);

		// change color
		await page.$$eval(
			'.maxi-background-layer__content .maxi-color-control__palette-container button',
			colorPalette => colorPalette[1].click()
		);

		// opacity
		await page.$eval(
			'.maxi-background-control .maxi-opacity-control input[type="number"]',
			opacity => opacity.focus()
		);
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('45');

		// clip-path
		await page.$$eval('.clip-path-defaults button', buttons =>
			buttons[2].click()
		);

		const layerExpect = await getBlockAttributes();
		expect(layerExpect['background-layers']).toMatchSnapshot();
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Check Background Color layer hover responsive', async () => {
		await changeResponsive(page, 's');

		// expect base value
		const baseColorSelected = await page.$eval(
			'.maxi-color-control__palette-container .maxi-color-control__palette-box--active',
			select => select.getAttribute('data-item')
		);

		expect(baseColorSelected).toStrictEqual('2');

		// modify s responsive
		await page.$$eval(
			'.maxi-background-layer__content .maxi-color-control__palette-container button',
			colorPalette => colorPalette[3].click()
		);

		// expect s
		const sColorSelected = await page.$eval(
			'.maxi-color-control__palette-container .maxi-color-control__palette-box--active',
			select => select.getAttribute('data-item')
		);
		expect(sColorSelected).toStrictEqual('4');

		// expect xs
		await changeResponsive(page, 'xs');

		const xsColorSelected = await page.$eval(
			'.maxi-color-control__palette-container .maxi-color-control__palette-box--active',
			select => select.getAttribute('data-item')
		);

		expect(xsColorSelected).toStrictEqual('4');

		// expect m
		await changeResponsive(page, 'm');

		const mColorSelected = await page.$eval(
			'.maxi-color-control__palette-container .maxi-color-control__palette-box--active',
			select => select.getAttribute('data-item')
		);

		expect(mColorSelected).toStrictEqual('2');
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Check Background Color layer displayer', async () => {
		const previewPage = await openPreviewPage(page);
		await previewPage.waitForSelector('.entry-content');
		const backgroundPreviewPage = await previewPage.$(
			'.maxi-background-displayer'
		);

		expect(backgroundPreviewPage).toBeTruthy();
	});
});
