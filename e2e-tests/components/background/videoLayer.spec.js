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
	changeResponsive,
	getBlockStyle,
	openPreviewPage,
} from '../../utils';
import sizeAndPositionChecker from './utils/sizeAndPositionChecker';

describe('BackgroundControl', () => {
	it('Check Background video layer', async () => {
		await createNewPost();
		await insertBlock('Group Maxi');
		await openSidebarTab(page, 'style', 'background layer');
		await addBackgroundLayer(page, 'video');

		await page.waitForTimeout(150);

		const video =
			'https://www.youtube.com/watch?v=C0DPdy98e4c&ab_channel=SimonYapp';

		// Add VideoURL
		await page.$eval(
			'.maxi-background-control__video .maxi-text-control input',
			input => input.focus()
		);

		await page.keyboard.type(video);
		await page.waitForTimeout(150);

		// Edit start time
		await page.$eval('.maxi-background-video-start-time input', input =>
			input.focus()
		);

		await page.keyboard.type('55');

		// Edit end time
		await page.$eval('.maxi-background-video-end-time input', input =>
			input.focus()
		);
		await page.keyboard.type('77');

		// Add loop
		await page.$eval('.video-loop input', button => button.click());

		// Add reduce black borders
		await page.$eval('.video-reduce-border input', button =>
			button.click()
		);

		// Video opacity
		await page.$$eval(
			'.maxi-background-control .maxi-opacity-control input',
			opacity => opacity[0].focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('44');

		await sizeAndPositionChecker({ page });

		const layerExpect = await getBlockAttributes();
		expect(layerExpect['background-layers']).toMatchSnapshot();
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Check Background video layer responsive', async () => {
		// General
		await changeResponsive(page, 's');
		const backgroundOpacityBase = await page.$eval(
			'.maxi-background-control .maxi-opacity-control input',
			input => input.value
		);

		expect(backgroundOpacityBase).toStrictEqual('44');

		// Change opacity S
		await page.$eval(
			'.maxi-background-control .maxi-opacity-control input',
			input => input.focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('32');

		// Expect s
		const backgroundOpacityS = await page.$eval(
			'.maxi-background-control .maxi-opacity-control input',
			input => input.value
		);

		expect(backgroundOpacityS).toStrictEqual('32');

		await sizeAndPositionChecker({ page, breakpoint: 's' });

		// Expect Xs
		await changeResponsive(page, 'xs');
		const backgroundOpacityXs = await page.$eval(
			'.maxi-background-control .maxi-opacity-control input',
			input => input.value
		);
		expect(backgroundOpacityXs).toStrictEqual('32');

		await sizeAndPositionChecker({ page, breakpoint: 'xs' });

		// Expect M
		await changeResponsive(page, 'm');
		const backgroundOpacityM = await page.$eval(
			'.maxi-background-control .maxi-opacity-control input',
			input => input.value
		);

		await sizeAndPositionChecker({ page, breakpoint: 'm' });

		expect(backgroundOpacityM).toStrictEqual('44');
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Check Background video layer hover', async () => {
		await changeResponsive(page, 'base');
		const accordion = await openSidebarTab(
			page,
			'style',
			'background layer'
		);

		// Hover
		await accordion.$$eval('.maxi-tabs-control button', button =>
			button[1].click()
		);

		// Enable hover
		await page.$eval(
			'.maxi-background-status-hover .maxi-toggle-switch__toggle input',
			button => button.click()
		);

		// Hover options
		await page.$$eval(
			'.maxi-list-control__options .maxi-list-item-control',
			options => options[0].click()
		);

		// Video opacity
		await page.$$eval(
			'.maxi-background-control .maxi-opacity-control input',
			opacity => opacity[0].focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('82');

		await sizeAndPositionChecker({ page, isHover: true });

		const layerExpect = await getBlockAttributes();
		expect(layerExpect['background-layers']).toMatchSnapshot();
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Check Background video layer hover responsive', async () => {
		// General
		await changeResponsive(page, 's');

		const backgroundOpacityBase = await page.$$eval(
			'.maxi-background-control .maxi-opacity-control input',
			input => input[0].value
		);

		expect(backgroundOpacityBase).toStrictEqual('82');

		// Change opacity S
		await page.$eval(
			'.maxi-background-control .maxi-opacity-control input',
			input => input.focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('45');

		// Expect s
		const backgroundOpacityS = await page.$eval(
			'.maxi-background-control .maxi-opacity-control input',
			input => input.value
		);

		expect(backgroundOpacityS).toStrictEqual('45');

		await sizeAndPositionChecker({ page, breakpoint: 's', isHover: true });

		// Expect Xs
		await changeResponsive(page, 'xs');
		const backgroundOpacityXs = await page.$eval(
			'.maxi-background-control .maxi-opacity-control input',
			input => input.value
		);
		expect(backgroundOpacityXs).toStrictEqual('45');

		await sizeAndPositionChecker({ page, breakpoint: 'xs', isHover: true });

		// Expect M
		await changeResponsive(page, 'm');
		const backgroundOpacityM = await page.$eval(
			'.maxi-background-control .maxi-opacity-control input',
			input => input.value
		);

		expect(backgroundOpacityM).toStrictEqual('82');

		await sizeAndPositionChecker({ page, breakpoint: 'm', isHover: true });

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
