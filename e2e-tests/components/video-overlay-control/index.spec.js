/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';

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
} from '../../utils';

describe('Video overlay control', () => {
	it('Check video overlay control', async () => {
		await createNewPost();
		await insertBlock('Video Maxi');

		const accordionPanel = await openSidebarTab(page, 'style', 'video');

		// Change type
		const videoType = await accordionPanel.$(
			'.maxi-accordion-control__item .maxi-video-type select'
		);

		await videoType.select('popup');

		expect(await getAttributes('playerType')).toStrictEqual('popup');

		// Overlay background button
		await openSidebarTab(page, 'style', 'video overlay');

		await editColorControl({
			page,
			instance: await page.$(
				'.maxi-video-overlay-control__overlay-background-colour'
			),
			paletteStatus: true,
			colorPalette: 8,
		});
		expect(
			await getAttributes('overlay-background-palette-color-general')
		).toStrictEqual(8);

		// Opacity
		await editAdvancedNumberControl({
			page,
			instance: await page.$(
				'.maxi-video-overlay-control__overlay-background-colour '
			),
			newNumber: '33',
		});

		expect(
			await getAttributes('overlay-background-palette-opacity-general')
		).toStrictEqual(0.33);

		// Play icon color
		await editColorControl({
			page,
			instance: await page.$('.maxi-video-icon-control__icon-colour '),
			paletteStatus: true,
			colorPalette: 6,
		});
		expect(
			await getAttributes('play-icon-fill-palette-color')
		).toStrictEqual(6);

		// Opacity
		await editAdvancedNumberControl({
			page,
			instance: await page.$(
				'.maxi-video-icon-control__icon-colour .maxi-opacity-control'
			),
			newNumber: '56',
		});

		expect(
			await getAttributes('play-icon-fill-palette-opacity')
		).toStrictEqual(0.56);

		// Icon height
		await editAdvancedNumberControl({
			page,
			instance: await page.$(
				'.maxi-accordion-control__item .icon-height-number-control '
			),
			newNumber: '23',
		});

		expect(await getAttributes('play-icon-height-general')).toStrictEqual(
			'23'
		);
	});

	it('Check video overlay control responsive', async () => {
		const responsiveValue = await addResponsiveTest({
			page,
			instance:
				'.maxi-accordion-control__item .icon-height-number-control input',
			needFocus: true,
			baseExpect: '23',
			xsExpect: '32',
			newValue: '32',
		});
		expect(responsiveValue).toBeTruthy();

		const responsiveOpacityValue = await addResponsiveTest({
			page,
			instance:
				'.maxi-video-overlay-control__overlay-background-colour input',
			needFocus: true,
			baseExpect: '33',
			xsExpect: '56',
			newValue: '56',
		});
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

		expect(
			await getAttributes('overlay-background-palette-color-s')
		).toStrictEqual(3);

		// Change xs
		await changeResponsive(page, 'xs');

		const xsColorSelected = await page.$eval(
			'.maxi-video-overlay-control__overlay-background-colour .maxi-color-control__palette-box--active',
			select => select.getAttribute('data-item')
		);

		expect(xsColorSelected).toStrictEqual('3');

		// Change m
		await changeResponsive(page, 'm');

		const mColorSelected = await page.$eval(
			'.maxi-video-overlay-control__overlay-background-colour .maxi-color-control__palette-box--active',
			select => select.getAttribute('data-item')
		);

		expect(mColorSelected).toStrictEqual('8');
	});
});
