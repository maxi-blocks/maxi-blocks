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
	openSidebarTab,
	addBackgroundLayer,
	modalMock,
	changeResponsive,
	getBlockStyle,
	openPreviewPage,
	editAdvancedNumberControl,
	insertMaxiBlock,
	updateAllBlockUniqueIds,
} from '../../utils';
import sizeAndPositionChecker from './utils/sizeAndPositionChecker';

describe('BackgroundControl', () => {
	it('Check Background shape layer', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Group Maxi');
		await updateAllBlockUniqueIds(page);
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
		await page.$eval('.maxi-list-item-control__arrow', display =>
			display.click()
		);

		// opacity
		await editAdvancedNumberControl({
			page,
			instance: await page.$(
				'.maxi-color-control .maxi-advanced-number-control'
			),
			newNumber: '77',
		});

		const scaleAndRotate = await page.$$('.maxi-advanced-number-control');
		// scale

		await editAdvancedNumberControl({
			page,
			instance: scaleAndRotate[1],
			newNumber: '88',
		});
		// rotate
		await editAdvancedNumberControl({
			page,
			instance: scaleAndRotate[2],
			newNumber: '188',
		});

		const flipX = await page.$$('.maxi-toggle-switch input');

		// flipX
		await flipX[2].click();

		await sizeAndPositionChecker({ page });

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

		// opacity and size
		await editAdvancedNumberControl({
			page,
			instance: await page.$(
				'.maxi-color-control .maxi-advanced-number-control'
			),
			newNumber: '54',
		});

		// expect S responsive
		const sBackgroundOpacity = await page.$eval(
			'.maxi-color-control .maxi-advanced-number-control input',
			selector => selector.value
		);

		expect(sBackgroundOpacity).toStrictEqual('54');

		await sizeAndPositionChecker({ page, breakpoint: 's' });

		// expect XS responsive
		await changeResponsive(page, 'xs');

		const xsBackgroundOpacity = await page.$eval(
			'.maxi-color-control .maxi-advanced-number-control input',
			selector => selector.value
		);

		expect(xsBackgroundOpacity).toStrictEqual('54');

		await sizeAndPositionChecker({ page, breakpoint: 'xs' });

		// expect M responsive
		await changeResponsive(page, 'm');

		const mBackgroundOpacity = await page.$eval(
			'.maxi-color-control .maxi-advanced-number-control input',
			selector => selector.value
		);

		expect(mBackgroundOpacity).toStrictEqual('77');

		await sizeAndPositionChecker({ page, breakpoint: 'm' });

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
		await page.$$eval(
			'.maxi-list-control__options .maxi-list-item-control',
			options => options[0].click()
		);

		await sizeAndPositionChecker({ page, isHover: true });

		const layerExpect = await getBlockAttributes();
		expect(layerExpect['background-layers']).toMatchSnapshot();
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Check Background shape layer hover responsive', async () => {
		await changeResponsive(page, 's');

		await sizeAndPositionChecker({ page, isHover: true, breakpoint: 's' });

		// expect XS responsive
		await changeResponsive(page, 'xs');

		await sizeAndPositionChecker({ page, isHover: true, breakpoint: 'xs' });

		// expect M responsive
		await changeResponsive(page, 'm');

		await sizeAndPositionChecker({ page, isHover: true, breakpoint: 'm' });

		const layerExpect = await getBlockAttributes();
		expect(layerExpect['background-layers']).toMatchSnapshot();
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Check Background Shape layer display', async () => {
		const checkEditor = await page.$eval(
			'.maxi-background-displayer',
			el => el.innerHTML
		);

		expect(checkEditor).toMatchSnapshot();

		const previewPage = await openPreviewPage(page);
		await previewPage.waitForSelector('.entry-content');

		const backgroundPreviewPage = await previewPage.$eval(
			'.maxi-background-displayer',
			el => el.innerHTML
		);

		expect(backgroundPreviewPage).toMatchSnapshot();
	});
});
