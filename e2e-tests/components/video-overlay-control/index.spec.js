/**
 * WordPress dependencies
 */
import { createNewPost } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	openSidebarTab,
	getAttributes,
	addResponsiveTest,
	editColorControl,
	editAdvancedNumberControl,
	changeResponsive,
	insertMaxiBlock,
	updateAllBlockUniqueIds,
} from '../../utils';

describe('Video overlay control', () => {
	it('Check video overlay control', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Video Maxi');
		await updateAllBlockUniqueIds(page);

		const accordionPanel = await openSidebarTab(page, 'style', 'video');

		await page.waitForTimeout(300);

		// Change type
		await accordionPanel.$eval(
			'.maxi-video-control__player-type .maxi-tabs-control__button-popup',
			button => button.click()
		);
		expect(await getAttributes('playerType')).toStrictEqual('popup');

		// Overlay background button
		await openSidebarTab(page, 'style', 'image');

		await page.waitForTimeout(500);

		await editColorControl({
			page,
			instance: await page.$(
				'.maxi-video-overlay-control__overlay-background-colour'
			),
			paletteStatus: true,
			colorPalette: 8,
		});
		expect(
			await getAttributes('overlay-background-palette-color-xl')
		).toStrictEqual(8);

		// Opacity
		await editAdvancedNumberControl({
			page,
			instance: await page.$(
				'.maxi-video-overlay-control__overlay-background-colour '
			),
			newNumber: '33',
		});

		await page.waitForTimeout(350);

		expect(
			await getAttributes('overlay-background-palette-opacity-xl')
		).toStrictEqual(0.33);

		// Hide image(icon only)

		await page.$eval(
			'.maxi-video-overlay-control__hide-image input',
			input => input.click()
		);

		expect(await getAttributes('hideImage')).toStrictEqual(true);
	});

	it('Check video overlay control responsive', async () => {
		const responsiveOpacityValue = await addResponsiveTest({
			page,
			instance:
				'.maxi-video-overlay-control__overlay-background-colour input',
			needFocus: true,
			baseExpect: '33',
			xsExpect: '56',
			newValue: '56',
		});
		await page.waitForTimeout(500);

		expect(responsiveOpacityValue).toBeTruthy();

		// Change S responsive
		await changeResponsive(page, 's');

		await editColorControl({
			page,
			instance: await page.$(
				'.maxi-video-overlay-control__overlay-background-colour'
			),
			paletteStatus: true,
			colorPalette: 3,
		});

		await page.waitForTimeout(350);

		expect(
			await getAttributes('overlay-background-palette-color-s')
		).toStrictEqual(3);

		// Change xs
		await changeResponsive(page, 'xs');

		await page.waitForTimeout(350);

		const xsColorSelected = await page.$eval(
			'.maxi-video-overlay-control__overlay-background-colour .maxi-color-control__palette-box--active',
			select => select.getAttribute('data-item')
		);

		expect(xsColorSelected).toStrictEqual('3');

		// Change m
		await changeResponsive(page, 'm');

		await page.waitForTimeout(350);

		const mColorSelected = await page.$eval(
			'.maxi-video-overlay-control__overlay-background-colour .maxi-color-control__palette-box--active',
			select => select.getAttribute('data-item')
		);

		expect(mColorSelected).toStrictEqual('8');
	});
});
