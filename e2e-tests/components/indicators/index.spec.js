/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	openSidebarTab,
	changeResponsive,
	editColorControl,
} from '../../utils';
import checkIndicator from '../../utils/checkIndicator';

const breakpoints = ['xxl', 'xl', 'l', 'm', 's', 'xs'];

describe('Indicator tests', () => {
	it('Setup', async () => {
		await createNewPost();
		await insertBlock('Button Maxi');
		expect(true).toBeTruthy();
	});

	it.each(['xl', 'm'])('Check indicator in responsive', async breakpoint => {
		changeResponsive(page, breakpoint);
		const background = await openSidebarTab(
			page,
			'style',
			'button background'
		);
		const backgroundColor = await background.$(
			'.maxi-color-control.maxi-color-palette-control'
		);

		const normalTab = await page.$('.maxi-tabs-control__button-normal');
		const responsiveTab = await page.$(
			`.maxi-tabs-control__button.maxi-tabs-control__button-${breakpoint}`
		);
		const otherBreakpoints = await breakpoints.filter(
			b => b !== breakpoint
		);
		const otherResponsiveTabs = await Promise.all(
			otherBreakpoints.map(b =>
				page.$(
					`.maxi-tabs-control__button.maxi-tabs-control__button-${b}`
				)
			)
		);

		const tabs = [normalTab, responsiveTab];

		// palette color
		await editColorControl({
			page,
			instance: backgroundColor,
			colorPalette: 3,
		});
		expect(await checkIndicator(tabs, true)).toBe(true);
		expect(await checkIndicator(otherResponsiveTabs, false)).toBe(true);

		await backgroundColor.$eval(
			'.color-reset-button.maxi-reset-button',
			button => button.click()
		);

		expect(await checkIndicator(tabs, false)).toBeTruthy();
		expect(await checkIndicator(otherResponsiveTabs, false)).toBe(true);

		// palette opacity
		await editColorControl({
			page,
			instance: backgroundColor,
			opacity: '30',
		});

		expect(await checkIndicator(tabs, true)).toBeTruthy();
		expect(await checkIndicator(otherResponsiveTabs, false)).toBeTruthy();

		await backgroundColor.$eval(
			'.maxi-opacity-control .maxi-reset-button',
			button => button.click()
		);

		expect(await checkIndicator(tabs, false)).toBeTruthy();
		expect(await checkIndicator(otherResponsiveTabs, false)).toBe(true);

		// palette status
		await editColorControl({
			page,
			instance: backgroundColor,
			paletteStatus: false,
			customColor: '#ff0000',
		});

		expect(await checkIndicator(tabs, true)).toBeTruthy();
		expect(await checkIndicator(otherResponsiveTabs, false)).toBeTruthy();

		await backgroundColor.$eval(
			'.maxi-toggle-switch__toggle input',
			toggle => toggle.click()
		);

		expect(await checkIndicator(tabs, breakpoint !== 'xl')).toBeTruthy();
		expect(await checkIndicator(otherResponsiveTabs, false)).toBe(true);
	});
});
