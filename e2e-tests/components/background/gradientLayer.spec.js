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
	getBlockStyle,
	changeResponsive,
	addResponsiveTest,
	openPreviewPage,
} from '../../utils';

describe('BackgroundControl', () => {
	it('Check Background gradient layer', async () => {
		await createNewPost();
		await insertBlock('Group Maxi');
		await openSidebarTab(page, 'style', 'background layer');
		await addBackgroundLayer(page, 'shape');

		const accordion = await openSidebarTab(
			page,
			'style',
			'background layer'
		);
		await addBackgroundLayer(page, 'gradient');

		await accordion.$eval(
			'.maxi-gradient-control .maxi-opacity-control input',
			input => input.focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('50');

		const selector = await page.$(
			'.maxi-gradient-control .components-custom-gradient-picker select'
		);

		await selector.select('radial-gradient');

		const layerExpect = await getBlockAttributes();
		expect(layerExpect['background-layers']).toMatchSnapshot();

		// check responsive
		const responsiveResult = await addResponsiveTest({
			page,
			instance: '.maxi-gradient-control .maxi-opacity-control input',
			needFocus: true,
			baseExpect: '50',
			xsExpect: '88',
			newValue: '88',
		});
		expect(responsiveResult).toBeTruthy();

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Check Background gradient layer hover', async () => {
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

		await addBackgroundLayer(page, 'gradient');

		await accordion.$eval(
			'.maxi-gradient-control .maxi-opacity-control input',
			input => input.focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('50');

		const selector = await page.$(
			'.maxi-gradient-control .components-custom-gradient-picker select'
		);

		await selector.select('radial-gradient');

		const layerExpect = await getBlockAttributes();
		expect(layerExpect['background-layers']).toMatchSnapshot();

		// check responsive
		const responsiveResult = await addResponsiveTest({
			page,
			instance: '.maxi-gradient-control .maxi-opacity-control input',
			needFocus: true,
			baseExpect: '50',
			xsExpect: '88',
			newValue: '88',
		});
		expect(responsiveResult).toBeTruthy();
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
	it('Check Background Gradient layer display', async () => {
		const previewPage = await openPreviewPage(page);
		const backgroundPreviewPage = await previewPage.$(
			'.maxi-background-displayer'
		);

		expect(backgroundPreviewPage).toMatchSnapshot();
	});
});
