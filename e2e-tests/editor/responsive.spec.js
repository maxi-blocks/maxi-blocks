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
			'bo_s-g': 'solid',
			'bo_w.t-g': 2,
			'bo_w.r-g': 2,
			'bo_w.b-g': 2,
			'bo_w.l-g': 2,
			'bo_s-m': undefined,
			'bo_w.t-m': undefined,
			'bo_w.r-m': undefined,
			'bo_w.b-m': undefined,
			'bo_w.l-m': undefined,
		};

		const borderResult = await getAttributes([
			'bo_s-g',
			'bo_w.t-g',
			'bo_w.r-g',
			'bo_w.b-g',
			'bo_w.l-g',
			'bo_s-m',
			'bo_w.t-m',
			'bo_w.r-m',
			'bo_w.b-m',
			'bo_w.l-m',
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
			'border_ps-g': false,
		};

		const firstResult = await getAttributes(['border_ps-g']);

		expect(firstResult).toStrictEqual(firstExpect);

		await borderAccordion.$$eval(
			'.maxi-color-control .maxi-toggle-switch .maxi-base-control__label',
			select => select[0].click()
		);

		const secondExpect = {
			'border_ps-g': true,
			'border_ps-m': undefined,
		};

		const secondResult = await getAttributes([
			'border_ps-g',
			'border_ps-m',
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
			'bo_s-g': 'solid',
			'bo_w.t-g': 2,
			'bo_w.r-g': 2,
			'bo_w.b-g': 2,
			'bo_w.l-g': 2,
			'bo_w.sy-g': 'all',
			'bo_w.u-g': 'px',
			'bo_s-m': undefined,
			'bo_w.t-m': undefined,
			'bo_w.r-m': undefined,
			'bo_w.b-m': undefined,
			'bo_w.l-m': undefined,
			'bo_w.sy-m': undefined,
			'bo_w.u-m': undefined,
		};

		const borderResult = await getAttributes([
			'bo_s-g',
			'bo_w.t-g',
			'bo_w.r-g',
			'bo_w.b-g',
			'bo_w.l-g',
			'bo_w.sy-g',
			'bo_w.u-g',
			'bo_s-m',
			'bo_w.t-m',
			'bo_w.r-m',
			'bo_w.b-m',
			'bo_w.l-m',
			'bo_w.sy-m',
			'bo_w.u-m',
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
			'_m.t-g': '100',
			'_m.t-xxl': undefined,
		};

		const marginResult = await getAttributes(['_m.t-g', '_m.t-xxl']);

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
			'bo_s-xxl': 'solid',
			'bo_w.t-xxl': undefined,
			'bo_w.r-xxl': undefined,
			'bo_w.b-xxl': undefined,
			'bo_w.l-xxl': undefined,
			'bo_w.sy-xxl': undefined,
			'bo_w.u-xxl': undefined,
			'bo_s-g': 'none',
			'bo_w.t-g': 2,
			'bo_w.r-g': 2,
			'bo_w.b-g': 2,
			'bo_w.l-g': 2,
		};

		const borderResult = await getAttributes([
			'bo_s-xxl',
			'bo_w.t-xxl',
			'bo_w.r-xxl',
			'bo_w.b-xxl',
			'bo_w.l-xxl',
			'bo_w.sy-xxl',
			'bo_w.u-xxl',
			'bo_s-g',
			'bo_w.t-g',
			'bo_w.r-g',
			'bo_w.b-g',
			'bo_w.l-g',
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
			'_m.t-g': '10',
			'_m.t-xl': '20',
			'_m.t-m': '10',
		};

		const marginResult = await getAttributes([
			'_m.t-g',
			'_m.t-xl',
			'_m.t-m',
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
			'_m.t-g': '10',
			'_m.t-xl': '20',
			'_m.t-m': '10',
		};

		const marginResult = await getAttributes([
			'_m.t-g',
			'_m.t-xl',
			'_m.t-m',
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
			'bo_s-xxl': 'solid',
			'bo_s-g': 'dotted',
			'bo_s-xl': 'dashed',
			'bo_s-m': 'dotted',
		};

		const borderResult = await getAttributes([
			'bo_s-xxl',
			'bo_s-g',
			'bo_s-xl',
			'bo_s-m',
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
			'bo_s-xl': 'solid',
		};

		const borderResult = await getAttributes(['bo_s-xl']);

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
			'_m.t-g': '10',
			'_m.t-xl': '20',
			'_m.t-m': '10',
		};

		const marginResult = await getAttributes([
			'_m.t-g',
			'_m.t-xl',
			'_m.t-m',
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
			'_m.t-g': '123',
			'_m.t-xxl': undefined,
		};

		const marginResult = await getAttributes(['_m.t-g', '_m.t-xxl']);

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
			'bo.ra.tl-g': 100,
			'bo.ra.tl-m': undefined,
		};

		const radiusOnM = await getAttributes(['bo.ra.tl-g', 'bo.ra.tl-m']);

		expect(radiusOnM).toStrictEqual(expectRadiusOnM);

		await changeResponsive(page, 'xl');

		borderAccordion = await openSidebarTab(page, 'style', 'border');

		await borderAccordion.$eval(
			'.maxi-axis-control__content__item__border-radius input',
			input => input.focus()
		);
		await page.keyboard.type('150', { delay: 100 });

		const expectRadiusOnXl = {
			'bo.ra.tl-g': 100,
			'bo.ra.tl-xl': 150,
			'bo.ra.tl-m': 100,
		};

		const radiusOnXl = await getAttributes([
			'bo.ra.tl-g',
			'bo.ra.tl-m',
			'bo.ra.tl-xl',
		]);

		expect(radiusOnXl).toStrictEqual(expectRadiusOnXl);

		// Reset
		await borderAccordion.$eval(
			'.maxi-axis-control__content__item__border-radius .maxi-reset-button',
			button => button.click()
		);

		const expectResetRadiusOnXl = {
			'bo.ra.tl-g': 100,
			'bo.ra.tl-m': undefined,
			'bo.ra.tl-xl': undefined,
		};

		const resetRadiusOnXl = await getAttributes([
			'bo.ra.tl-g',
			'bo.ra.tl-m',
			'bo.ra.tl-xl',
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
			'bo.ra.tl-g': undefined,
			'bo.ra.tl-m': undefined,
			'bo.ra.tl-xl': undefined,
		};

		const resetRadiusOnM = await getAttributes([
			'bo.ra.tl-g',
			'bo.ra.tl-m',
			'bo.ra.tl-xl',
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
			'bt_p.t-g': '10',
			'bt_p.t-xl': undefined,
		};

		const paddingOnM = await getAttributes(['bt_p.t-g', 'bt_p.t-xl']);

		expect(paddingOnM).toStrictEqual(expectPaddingOnM);

		await changeResponsive(page, 'xxl');

		const expectPaddingOnXl = {
			'bt_p.t-g': '10',
			'bt_p.t-xl': undefined,
			'bt_p.t-xxl': '23',
		};

		const paddingOnXl = await getAttributes([
			'bt_p.t-g',
			'bt_p.t-xl',
			'bt_p.t-xxl',
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
			'bt_p.t-g': '15',
			'bt_p.t-xl': undefined,
			'bt_p.t-xxl': '23',
		};

		const paddingAfterReset = await getAttributes([
			'bt_p.t-g',
			'bt_p.t-xl',
			'bt_p.t-xxl',
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
			'_p.t-g': '10',
			'_p.t-xxl': undefined,
			'_p.t-xl': undefined,
		};

		const paddingOnXl = await getAttributes([
			'_p.t-g',
			'_p.t-xxl',
			'_p.t-xl',
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
			'_p.t-g': '15',
			'_p.t-xl': undefined,
			'_p.t-xxl': undefined,
		};

		const paddingOnXxl = await getAttributes([
			'_p.t-g',
			'_p.t-xl',
			'_p.t-xxl',
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
