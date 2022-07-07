/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	getBlockStyle,
	openSidebarTab,
	getAttributes,
	addResponsiveTest,
	editColorControl,
	editAdvancedNumberControl,
	changeResponsive,
} from '../../utils';

describe('Video icon control', () => {
	it('Check video icon control', async () => {
		await createNewPost();
		await insertBlock('Video Maxi');

		const accordionPanel = await openSidebarTab(page, 'style', 'video');

		// Change type
		const videoType = await accordionPanel.$(
			'.maxi-accordion-control__item .maxi-video-control__type select'
		);

		await videoType.select('popup');

		expect(await getAttributes('playerType')).toStrictEqual('popup');

		// Change lightbox background colour
		await openSidebarTab(page, 'style', 'video options');

		await editColorControl({
			page,
			instance: await page.$(
				'.maxi-video-options-control__lightbox-colour'
			),
			paletteStatus: true,
			colorPalette: 6,
		});

		expect(
			await getAttributes('lightbox-background-palette-color-general')
		).toStrictEqual(6);

		// Change opacity
		await editAdvancedNumberControl({
			page,
			instance: await page.$(
				'.maxi-advanced-number-control.maxi-opacity-control '
			),
			newNumber: '33',
		});

		expect(
			await getAttributes('lightbox-background-palette-opacity-general')
		).toStrictEqual(0.33);

		// Lightbox close button colour
		await editColorControl({
			page,
			instance: await page.$('.maxi-video-icon-control__icon-colour'),
			paletteStatus: true,
			colorPalette: 3,
		});

		expect(
			await getAttributes('close-icon-fill-palette-color')
		).toStrictEqual(3);

		// Change opacity
		await editAdvancedNumberControl({
			page,
			instance: await page.$(
				'.maxi-video-icon-control__icon-colour .maxi-advanced-number-control.maxi-opacity-control '
			),
			newNumber: '11',
		});

		expect(
			await getAttributes('close-icon-fill-palette-opacity')
		).toStrictEqual(0.11);

		// Icon height
		await editAdvancedNumberControl({
			page,
			instance: await page.$('.maxi-video-icon-control__icon-height '),
			newNumber: '44',
		});

		expect(await getAttributes('close-icon-height-general')).toStrictEqual(
			'44'
		);

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Check video icon control responsive', async () => {
		// Opacity lightbox responsive
		const responsiveValue = await addResponsiveTest({
			page,
			instance:
				'.maxi-advanced-number-control.maxi-opacity-control input',
			needFocus: true,
			baseExpect: '33',
			xsExpect: '64',
			newValue: '64',
		});
		expect(responsiveValue).toBeTruthy();

		// Icon height responsive
		const responsiveHeight = await addResponsiveTest({
			page,
			instance: '.maxi-video-icon-control__icon-height input',
			needFocus: true,
			baseExpect: '44',
			xsExpect: '27',
			newValue: '27',
		});
		expect(responsiveHeight).toBeTruthy();

		// Change lightbox responsive
		// Change S responsive
		await changeResponsive(page, 's');

		await editColorControl({
			page,
			instance: await page.$(
				'.maxi-video-options-control__lightbox-colour'
			),
			paletteStatus: true,
			colorPalette: 4,
		});

		expect(
			await getAttributes('lightbox-background-palette-color-s')
		).toStrictEqual(4);

		// change xs
		await changeResponsive(page, 'xs');

		const xsColorSelected = await page.$eval(
			'.maxi-video-options-control__lightbox-colour .maxi-color-control__palette-box--active',
			select => select.getAttribute('data-item')
		);

		expect(xsColorSelected).toStrictEqual('4');

		// change m
		await changeResponsive(page, 'm');

		const mColorSelected = await page.$eval(
			'.maxi-video-options-control__lightbox-colour .maxi-color-control__palette-box--active',
			select => select.getAttribute('data-item')
		);

		expect(mColorSelected).toStrictEqual('6');
	});
});
