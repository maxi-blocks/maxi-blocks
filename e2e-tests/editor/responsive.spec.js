/**
 * WordPress dependencies
 */
import { createNewPost, setBrowserViewport } from '@wordpress/e2e-test-utils';
import {
	getBlockStyle,
	getAttributes,
	openSidebarTab,
	changeResponsive,
	editAxisControl,
	getStyleCardEditor,
	editAdvancedNumberControl,
	insertMaxiBlock,
} from '../utils';

describe('Responsive attributes mechanisms', () => {
	beforeEach(async () => {
		// Base responsive is "M"
		await setBrowserViewport({ width: 1240, height: 700 });

		await createNewPost();
		await insertMaxiBlock(page, 'Group Maxi');
	});

	it('On change attributes from base responsive, just "g" attributes change', async () => {
		const borderAccordion = await openSidebarTab(page, 'style', 'border');
		const selector = await borderAccordion.$(
			'.maxi-border-control__type select'
		);
		await selector.select('solid');

		const expectBorder = {
			'border-style-g': 'solid',
			'border-width-top-g': 2,
			'border-width-right-g': 2,
			'border-width-bottom-g': 2,
			'border-width-left-g': 2,
			'border-style-m': undefined,
			'border-width-top-m': undefined,
			'border-width-right-m': undefined,
			'border-width-bottom-m': undefined,
			'border-width-left-m': undefined,
		};

		const borderResult = await getAttributes([
			'border-style-g',
			'border-width-top-g',
			'border-width-right-g',
			'border-width-bottom-g',
			'border-width-left-g',
			'border-style-m',
			'border-width-top-m',
			'border-width-right-m',
			'border-width-bottom-m',
			'border-width-left-m',
		]);

		expect(borderResult).toStrictEqual(expectBorder);

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('On change attributes from base responsive multiple times, just "g" attributes change', async () => {
		const borderAccordion = await openSidebarTab(page, 'style', 'border');
		const selector = await borderAccordion.$(
			'.maxi-border-control__type select'
		);
		await selector.select('solid');

		await borderAccordion.$$eval(
			'.maxi-color-control .maxi-toggle-switch .maxi-base-control__label',
			select => select[0].click()
		);

		const firstExpect = {
			'border-palette-status-g': false,
		};

		const firstResult = await getAttributes(['border-palette-status-g']);

		expect(firstResult).toStrictEqual(firstExpect);

		await borderAccordion.$$eval(
			'.maxi-color-control .maxi-toggle-switch .maxi-base-control__label',
			select => select[0].click()
		);

		const secondExpect = {
			'border-palette-status-g': true,
			'border-palette-status-m': undefined,
		};

		const secondResult = await getAttributes([
			'border-palette-status-g',
			'border-palette-status-m',
		]);

		expect(secondResult).toStrictEqual(secondExpect);

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('On change attributes from base responsive and some attributes have default on g, just "g" attributes change', async () => {
		const borderAccordion = await openSidebarTab(page, 'style', 'border');
		await borderAccordion.$$eval(
			'.maxi-tabs-content .maxi-default-styles-control button',
			buttons => buttons[1].click()
		);

		const expectBorder = {
			'border-style-g': 'solid',
			'border-width-top-g': 2,
			'border-width-right-g': 2,
			'border-width-bottom-g': 2,
			'border-width-left-g': 2,
			'border-width-sync-g': 'all',
			'border-width-unit-g': 'px',
			'border-style-m': undefined,
			'border-width-top-m': undefined,
			'border-width-right-m': undefined,
			'border-width-bottom-m': undefined,
			'border-width-left-m': undefined,
			'border-width-sync-m': undefined,
			'border-width-unit-m': undefined,
		};

		const borderResult = await getAttributes([
			'border-style-g',
			'border-width-top-g',
			'border-width-right-g',
			'border-width-bottom-g',
			'border-width-left-g',
			'border-width-sync-g',
			'border-width-unit-g',
			'border-style-m',
			'border-width-top-m',
			'border-width-right-m',
			'border-width-bottom-m',
			'border-width-left-m',
			'border-width-sync-m',
			'border-width-unit-m',
		]);

		expect(borderResult).toStrictEqual(expectBorder);

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('On change attributes from XXL responsive and without a default g attribute value, just "g" change', async () => {
		await changeResponsive(page, 'xxl');

		const marginPaddingAccordion = await openSidebarTab(
			page,
			'style',
			'margin padding'
		);
		const axisControlInstance = await marginPaddingAccordion.$(
			'.maxi-axis-control__margin'
		);
		await editAxisControl({
			page,
			instance: axisControlInstance,
			values: '100',
		});

		const expectMargin = {
			'margin-top-g': '100',
			'margin-top-xxl': undefined,
		};

		const marginResult = await getAttributes([
			'margin-top-g',
			'margin-top-xxl',
		]);

		expect(marginResult).toStrictEqual(expectMargin);

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('On change attributes from XXL responsive and some of them that have default on g, just "g" attributes change', async () => {
		await changeResponsive(page, 'xxl');

		const borderAccordion = await openSidebarTab(page, 'style', 'border');
		await borderAccordion.$$eval(
			'.maxi-tabs-content .maxi-default-styles-control button',
			buttons => buttons[1].click()
		);

		const expectBorder = {
			'border-style-xxl': 'solid',
			'border-width-top-xxl': undefined,
			'border-width-right-xxl': undefined,
			'border-width-bottom-xxl': undefined,
			'border-width-left-xxl': undefined,
			'border-width-sync-xxl': undefined,
			'border-width-unit-xxl': undefined,
			'border-style-g': 'none',
			'border-width-top-g': 2,
			'border-width-right-g': 2,
			'border-width-bottom-g': 2,
			'border-width-left-g': 2,
		};

		const borderResult = await getAttributes([
			'border-style-xxl',
			'border-width-top-xxl',
			'border-width-right-xxl',
			'border-width-bottom-xxl',
			'border-width-left-xxl',
			'border-width-sync-xxl',
			'border-width-unit-xxl',
			'border-style-g',
			'border-width-top-g',
			'border-width-right-g',
			'border-width-bottom-g',
			'border-width-left-g',
		]);

		expect(borderResult).toStrictEqual(expectBorder);

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('On first change attributes from XXL responsive and without a default g attribute value, and then changing from XL, just "g" and XL attributes change', async () => {
		await changeResponsive(page, 'xxl');

		let marginPaddingAccordion = await openSidebarTab(
			page,
			'style',
			'margin padding'
		);
		let axisControlInstance = await marginPaddingAccordion.$(
			'.maxi-axis-control__margin'
		);
		await editAxisControl({
			page,
			instance: axisControlInstance,
			values: '10',
		});

		await changeResponsive(page, 'xl');
		marginPaddingAccordion = await openSidebarTab(
			page,
			'style',
			'margin padding'
		);
		axisControlInstance = await marginPaddingAccordion.$(
			'.maxi-axis-control__margin'
		);
		await editAxisControl({
			page,
			instance: axisControlInstance,
			values: '20',
		});

		const expectMargin = {
			'margin-top-g': '10',
			'margin-top-xl': '20',
			'margin-top-m': '10',
		};

		const marginResult = await getAttributes([
			'margin-top-g',
			'margin-top-xl',
			'margin-top-m',
		]);

		expect(marginResult).toStrictEqual(expectMargin);

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('On first change attributes from XXL responsive and some of them have default g attribute value, and then changing from XL, "XL" change', async () => {
		await changeResponsive(page, 'xxl');

		let marginPaddingAccordion = await openSidebarTab(
			page,
			'style',
			'margin padding'
		);
		let axisControlInstance = await marginPaddingAccordion.$(
			'.maxi-axis-control__margin'
		);
		await editAxisControl({
			page,
			instance: axisControlInstance,
			values: '10',
		});

		await changeResponsive(page, 'xl');

		marginPaddingAccordion = await openSidebarTab(
			page,
			'style',
			'margin padding'
		);
		axisControlInstance = await marginPaddingAccordion.$(
			'.maxi-axis-control__margin'
		);
		await editAxisControl({
			page,
			instance: axisControlInstance,
			values: '20',
		});

		const expectMargin = {
			'margin-top-g': '10',
			'margin-top-xl': '20',
			'margin-top-m': '10',
		};

		const marginResult = await getAttributes([
			'margin-top-g',
			'margin-top-xl',
			'margin-top-m',
		]);

		expect(marginResult).toStrictEqual(expectMargin);

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('On first change attributes from XXL responsive and some of them have default g attribute value, and then changing from XL and from "M", all values correspond', async () => {
		await changeResponsive(page, 'xxl');
		let borderAccordion = await openSidebarTab(page, 'style', 'border');
		await borderAccordion.$$eval(
			'.maxi-tabs-content .maxi-default-styles-control button',
			buttons => buttons[1].click() // solid
		);

		await changeResponsive(page, 'xl');
		borderAccordion = await openSidebarTab(page, 'style', 'border');
		await borderAccordion.$$eval(
			'.maxi-tabs-content .maxi-default-styles-control button',
			buttons => buttons[2].click() // dashed
		);

		await changeResponsive(page, 'm');
		borderAccordion = await openSidebarTab(page, 'style', 'border');
		await borderAccordion.$$eval(
			'.maxi-tabs-content .maxi-default-styles-control button',
			buttons => buttons[3].click() // dotted
		);

		const expectBorder = {
			'border-style-xxl': 'solid',
			'border-style-g': 'dotted',
			'border-style-xl': 'dashed',
			'border-style-m': 'dotted',
		};

		const borderResult = await getAttributes([
			'border-style-xxl',
			'border-style-g',
			'border-style-xl',
			'border-style-m',
		]);

		expect(borderResult).toStrictEqual(expectBorder);

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('On change attributes from XL responsive, just "XL" attributes change', async () => {
		await changeResponsive(page, 'xl');

		const borderAccordion = await openSidebarTab(page, 'style', 'border');
		const selector = await borderAccordion.$(
			'.maxi-border-control__type select'
		);
		await selector.select('solid');

		const expectBorder = {
			'border-style-xl': 'solid',
		};

		const borderResult = await getAttributes(['border-style-xl']);

		expect(borderResult).toStrictEqual(expectBorder);

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('On change attributes from XL responsive and then change from "M", "g" attributes change', async () => {
		await changeResponsive(page, 'xl');

		let marginPaddingAccordion = await openSidebarTab(
			page,
			'style',
			'margin padding'
		);
		let axisControlInstance = await marginPaddingAccordion.$(
			'.maxi-axis-control__margin'
		);
		await editAxisControl({
			page,
			instance: axisControlInstance,
			values: '20',
		});

		await changeResponsive(page, 'm');

		marginPaddingAccordion = await openSidebarTab(
			page,
			'style',
			'margin padding'
		);
		axisControlInstance = await marginPaddingAccordion.$(
			'.maxi-axis-control__margin'
		);
		await editAxisControl({
			page,
			instance: axisControlInstance,
			values: '10',
		});

		const expectMargin = {
			'margin-top-g': '10',
			'margin-top-xl': '20',
			'margin-top-m': '10',
		};

		const marginResult = await getAttributes([
			'margin-top-g',
			'margin-top-xl',
			'margin-top-m',
		]);

		expect(marginResult).toStrictEqual(expectMargin);

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('On change number attributes from XXL responsive without g attribute, it changes on XXL and g all time', async () => {
		await changeResponsive(page, 'xxl');

		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'margin padding'
		);

		const axisControlInstance = await accordionPanel.$(
			'.maxi-axis-control__margin'
		);
		await editAxisControl({
			page,
			instance: axisControlInstance,
			values: '123',
		});

		const expectMargin = {
			'margin-top-g': '123',
			'margin-top-xxl': undefined,
		};

		const marginResult = await getAttributes([
			'margin-top-g',
			'margin-top-xxl',
		]);

		expect(marginResult).toStrictEqual(expectMargin);

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('On change attributes from base responsive, then from XL, reset it and reset from base again, everything come to default', async () => {
		let borderAccordion = await openSidebarTab(page, 'style', 'border');

		await borderAccordion.$eval(
			'.maxi-axis-control__content__item__border-radius input',
			input => input.focus()
		);
		await page.keyboard.type('100', { delay: 100 });

		const expectRadiusOnM = {
			'border-radius-top-left-g': 100,
			'border-radius-top-left-m': undefined,
		};

		const radiusOnM = await getAttributes([
			'border-radius-top-left-g',
			'border-radius-top-left-m',
		]);

		expect(radiusOnM).toStrictEqual(expectRadiusOnM);

		await changeResponsive(page, 'xl');

		borderAccordion = await openSidebarTab(page, 'style', 'border');

		await borderAccordion.$eval(
			'.maxi-axis-control__content__item__border-radius input',
			input => input.focus()
		);
		await page.keyboard.type('150', { delay: 100 });

		const expectRadiusOnXl = {
			'border-radius-top-left-g': 100,
			'border-radius-top-left-xl': 150,
			'border-radius-top-left-m': 100,
		};

		const radiusOnXl = await getAttributes([
			'border-radius-top-left-g',
			'border-radius-top-left-m',
			'border-radius-top-left-xl',
		]);

		expect(radiusOnXl).toStrictEqual(expectRadiusOnXl);

		// Reset
		await borderAccordion.$eval(
			'.maxi-axis-control__content__item__border-radius .maxi-reset-button',
			button => button.click()
		);

		const expectResetRadiusOnXl = {
			'border-radius-top-left-g': 100,
			'border-radius-top-left-m': undefined,
			'border-radius-top-left-xl': undefined,
		};

		const resetRadiusOnXl = await getAttributes([
			'border-radius-top-left-g',
			'border-radius-top-left-m',
			'border-radius-top-left-xl',
		]);

		expect(resetRadiusOnXl).toStrictEqual(expectResetRadiusOnXl);

		await changeResponsive(page, 'm');

		borderAccordion = await openSidebarTab(page, 'style', 'border');

		// Reset
		await borderAccordion.$eval(
			'.maxi-axis-control__content__item__border-radius .maxi-reset-button',
			button => button.click()
		);

		const expectResetRadiusOnM = {
			'border-radius-top-left-g': undefined,
			'border-radius-top-left-m': undefined,
			'border-radius-top-left-xl': undefined,
		};

		const resetRadiusOnM = await getAttributes([
			'border-radius-top-left-g',
			'border-radius-top-left-m',
			'border-radius-top-left-xl',
		]);

		expect(resetRadiusOnM).toStrictEqual(expectResetRadiusOnM);
	});

	it('On change XL default attributes from g responsive and then reset, changes on g', async () => {
		// Base responsive is "XL"
		await setBrowserViewport({ width: 1920, height: 700 });

		await createNewPost();
		await insertMaxiBlock(page, 'Button Maxi');

		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'margin padding'
		);

		let axisControlInstance = await accordionPanel.$(
			'.maxi-axis-control__padding'
		);
		await editAxisControl({
			page,
			instance: axisControlInstance,
			values: '10',
		});

		const expectPaddingOnM = {
			'button-padding-top-g': '10',
			'button-padding-top-xl': undefined,
		};

		const paddingOnM = await getAttributes([
			'button-padding-top-g',
			'button-padding-top-xl',
		]);

		expect(paddingOnM).toStrictEqual(expectPaddingOnM);

		await changeResponsive(page, 'xxl');

		const expectPaddingOnXl = {
			'button-padding-top-g': '10',
			'button-padding-top-xl': undefined,
			'button-padding-top-xxl': '23',
		};

		const paddingOnXl = await getAttributes([
			'button-padding-top-g',
			'button-padding-top-xl',
			'button-padding-top-xxl',
		]);

		expect(paddingOnXl).toStrictEqual(expectPaddingOnXl);

		// Reset
		await changeResponsive(page, 'xl');
		axisControlInstance = await accordionPanel.$(
			'.maxi-axis-control__padding'
		);

		await axisControlInstance.$eval('.maxi-reset-button', button =>
			button.click()
		);

		const expectPaddingAfterReset = {
			'button-padding-top-g': '15',
			'button-padding-top-xl': undefined,
			'button-padding-top-xxl': '23',
		};

		const paddingAfterReset = await getAttributes([
			'button-padding-top-g',
			'button-padding-top-xl',
			'button-padding-top-xxl',
		]);

		expect(paddingAfterReset).toStrictEqual(expectPaddingAfterReset);
	});

	it('On change XXL default attributes from XL screen, then change the screen size to XXL, on changing the g attribute it changes on g and XXL', async () => {
		// Base responsive is "XL"
		await setBrowserViewport({ width: 1920, height: 700 });

		await createNewPost();
		await insertMaxiBlock(page, 'Group Maxi');
		await page.waitForSelector('.maxi-group-block');

		await changeResponsive(page, 'xxl');

		let accordionPanel = await openSidebarTab(
			page,
			'style',
			'margin padding'
		);

		let axisControlInstance = await accordionPanel.$(
			'.maxi-axis-control__padding'
		);
		await editAxisControl({
			page,
			instance: axisControlInstance,
			values: '10',
		});

		await page.waitForTimeout(500);

		const expectPaddingOnXl = {
			'padding-top-g': '10',
			'padding-top-xxl': undefined,
			'padding-top-xl': undefined,
		};

		const paddingOnXl = await getAttributes([
			'padding-top-g',
			'padding-top-xxl',
			'padding-top-xl',
		]);

		expect(paddingOnXl).toStrictEqual(expectPaddingOnXl);

		await setBrowserViewport({ width: 3840, height: 2160 });

		accordionPanel = await openSidebarTab(page, 'style', 'margin padding');

		axisControlInstance = await accordionPanel.$(
			'.maxi-axis-control__padding'
		);
		await editAxisControl({
			page,
			instance: axisControlInstance,
			values: '15',
		});

		const expectPaddingOnXxl = {
			'padding-top-g': '15',
			'padding-top-xl': undefined,
			'padding-top-xxl': undefined,
		};

		const paddingOnXxl = await getAttributes([
			'padding-top-g',
			'padding-top-xl',
			'padding-top-xxl',
		]);

		expect(paddingOnXxl).toStrictEqual(expectPaddingOnXxl);
	});

	/**
	 * TODO: needs #3809 to be fixed first. On resetting, g values are overwriting XXL ones.
	 */
	it.skip('On resetting Typography values from SC having XXL as baseBreakpoint', async () => {
		// Base responsive is "XXL"
		await setBrowserViewport({ width: 2400, height: 700 });
		await createNewPost();

		await getStyleCardEditor({
			page,
			accordion: 'paragraph',
		});

		const defaultValue = await page.$eval(
			'.maxi-blocks-sc__type--paragraph .maxi-typography-control__size input',
			input => input.value
		);

		// Size reset button 1
		await page.$eval(
			'.maxi-blocks-sc__type--paragraph .maxi-typography-control__size .maxi-reset-button',
			input => input.click()
		);

		await page.waitForTimeout(150);

		// Size reset button 2
		await page.$eval(
			'.maxi-blocks-sc__type--paragraph .maxi-typography-control__size .maxi-reset-button',
			input => input.click()
		);

		await page.waitForTimeout(150);

		// Size reset button 3
		await page.$eval(
			'.maxi-blocks-sc__type--paragraph .maxi-typography-control__size .maxi-reset-button',
			input => input.click()
		);

		await page.waitForTimeout(150);

		// Size value
		await page.$eval(
			'.maxi-blocks-sc__type--paragraph .maxi-typography-control__size input',
			input => input.focus()
		);

		const value = await page.$eval(
			'.maxi-blocks-sc__type--paragraph .maxi-typography-control__size input',
			input => input.value
		);

		expect(defaultValue).toBe(value);
	});

	// Skipped as Row doesn't have Width options anymore and there are no more situations where the first default attribute doesn't
	// start with XXL, g or XL. In this case, having the width-l default value as the first was creating this concrete issue that
	// was supposed to be fixed and tested here. Things are different now, so this test is skipped but kept in case we find a future
	// situation related that will need it 👍
	it.skip('On L as a baseBreakpoint and changing a default L attribute with no higher value, it changes g and L', async () => {
		// Base responsive is "L"
		await setBrowserViewport({ width: 1400, height: 700 });

		await createNewPost();
		await insertMaxiBlock(page, 'Container Maxi');
		await page.waitForSelector('.maxi-row-block');

		await page.$$eval('.maxi-row-block__template button', button =>
			button[0].click()
		);
		await page.waitForSelector('.maxi-column-block');

		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'height width'
		);

		await editAdvancedNumberControl({
			page,
			instance: await accordionPanel.$('.maxi-full-size-control__width'),
			newNumber: '500',
		});

		const newWidth = await accordionPanel.$eval(
			'.maxi-full-size-control__width input',
			input => input.value
		);

		expect(newWidth).toMatchSnapshot('500');
	});
});
