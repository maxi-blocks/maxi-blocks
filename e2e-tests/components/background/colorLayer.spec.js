/* eslint-disable jest/no-commented-out-tests */
/**
 * WordPress dependencies
 */
import { createNewPost } from '@wordpress/e2e-test-utils';

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
	editAdvancedNumberControl,
	insertMaxiBlock,
	updateAllBlockUniqueIds,
} from '../../utils';
import sizeAndPositionChecker from './utils/sizeAndPositionChecker';

describe('Background Color Layer', () => {
	it('Check Background Color layer', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Group Maxi');
		await updateAllBlockUniqueIds(page);
		await openSidebarTab(page, 'style', 'background layer');
		await addBackgroundLayer(page, 'color');

		// change color
		await page.$$eval(
			'.maxi-list-item-control__content .maxi-color-control__palette-container button',
			colorPalette => colorPalette[4].click()
		);

		// opacity
		await editAdvancedNumberControl({
			page,
			instance: await page.$(
				'.maxi-background-control .maxi-color-control .maxi-opacity-control'
			),
			newNumber: '45',
		});

		// clip-path
		await page.$eval(
			'.maxi-clip-path-control .maxi-toggle-switch__toggle input',
			input => input.click()
		);

		await page.$$eval('.clip-path-defaults button', buttons =>
			buttons[3].click()
		);

		await sizeAndPositionChecker({ page });

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
			'.maxi-list-item-control__content .maxi-color-control__palette-box',
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

		await sizeAndPositionChecker({
			page,
			breakpoint: 'xs',
		});

		// expect m
		await changeResponsive(page, 'm');

		const mColorSelected = await page.$eval(
			'.maxi-color-control__palette-container .maxi-color-control__palette-box--active',
			select => select.getAttribute('data-item')
		);

		expect(mColorSelected).toStrictEqual('5');

		await sizeAndPositionChecker({
			page,
			breakpoint: 'm',
		});

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
		await accordion.$eval(
			'.maxi-tabs-control .maxi-tabs-control__button-hover',
			button => button.click()
		);

		// enable hover
		await page.$eval(
			'.maxi-background-status-hover .maxi-toggle-switch__toggle input',
			button => button.click()
		);

		// hover options
		await page.$eval(
			'.maxi-list-control__options .maxi-list-item-control',
			options => options.click()
		);

		// change color
		await page.$$eval(
			'.maxi-list-item-control__content .maxi-color-control__palette-container button',
			colorPalette => colorPalette[1].click()
		);

		// opacity
		await editAdvancedNumberControl({
			page,
			instance: await page.$(
				'.maxi-background-control .maxi-opacity-control'
			),
			newNumber: '45',
		});

		// clip-path
		await page.$$eval('.clip-path-defaults button', buttons =>
			buttons[2].click()
		);

		await sizeAndPositionChecker({
			page,
			isHover: true,
		});

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
			'.maxi-list-item-control__content .maxi-color-control__palette-container button',
			colorPalette => colorPalette[3].click()
		);

		// expect s
		const sColorSelected = await page.$eval(
			'.maxi-color-control__palette-container .maxi-color-control__palette-box--active',
			select => select.getAttribute('data-item')
		);
		expect(sColorSelected).toStrictEqual('4');

		await sizeAndPositionChecker({
			page,
			breakpoint: 's',
			isHover: true,
		});

		// expect xs
		await changeResponsive(page, 'xs');

		const xsColorSelected = await page.$eval(
			'.maxi-color-control__palette-container .maxi-color-control__palette-box--active',
			select => select.getAttribute('data-item')
		);

		expect(xsColorSelected).toStrictEqual('4');

		await sizeAndPositionChecker({
			page,
			breakpoint: 'xs',
			isHover: true,
		});

		// expect m
		await changeResponsive(page, 'm');

		const mColorSelected = await page.$eval(
			'.maxi-color-control__palette-container .maxi-color-control__palette-box--active',
			select => select.getAttribute('data-item')
		);

		expect(mColorSelected).toStrictEqual('2');

		await sizeAndPositionChecker({
			page,
			breakpoint: 'm',
			isHover: true,
		});

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Check Background Color layer displayer', async () => {
		const checkEditor = await page.$eval(
			'.maxi-background-displayer',
			el => el.innerHTML
		);

		expect(checkEditor).toBeTruthy();
		const previewPage = await openPreviewPage(page);
		await previewPage.waitForSelector('.entry-content');
		const backgroundPreviewPage = await previewPage.$(
			'.maxi-background-displayer'
		);

		expect(backgroundPreviewPage).toBeTruthy();
	});
});
