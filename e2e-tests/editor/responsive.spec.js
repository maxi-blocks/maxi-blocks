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
	updateAllBlockUniqueIds,
} from '../utils';

describe('Responsive attributes mechanisms', () => {
	beforeEach(async () => {
		// Base responsive is "M"
		await setBrowserViewport({ width: 1024, height: 700 });

		await createNewPost();
		await insertMaxiBlock(page, 'Group Maxi');
		await updateAllBlockUniqueIds(page);
	});

	it('On change attributes from base responsive, just "general" attributes change', async () => {
		const borderAccordion = await openSidebarTab(page, 'style', 'border');
		const selector = await borderAccordion.$(
			'.maxi-border-control__type select'
		);
		await selector.select('solid');

		const expectBorder = {
			'border-style-general': 'solid',
			'border-top-width-general': 2,
			'border-right-width-general': 2,
			'border-bottom-width-general': 2,
			'border-left-width-general': 2,
			'border-style-m': undefined,
			'border-top-width-m': undefined,
			'border-right-width-m': undefined,
			'border-bottom-width-m': undefined,
			'border-left-width-m': undefined,
		};

		const borderResult = await getAttributes([
			'border-style-general',
			'border-top-width-general',
			'border-right-width-general',
			'border-bottom-width-general',
			'border-left-width-general',
			'border-style-m',
			'border-top-width-m',
			'border-right-width-m',
			'border-bottom-width-m',
			'border-left-width-m',
		]);

		expect(borderResult).toStrictEqual(expectBorder);

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('On change attributes from base responsive multiple times, just "general" attributes change', async () => {
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
			'border-palette-status-general': false,
		};

		const firstResult = await getAttributes([
			'border-palette-status-general',
		]);

		expect(firstResult).toStrictEqual(firstExpect);

		await borderAccordion.$$eval(
			'.maxi-color-control .maxi-toggle-switch .maxi-base-control__label',
			select => select[0].click()
		);

		const secondExpect = {
			'border-palette-status-general': true,
			'border-palette-status-m': undefined,
		};

		const secondResult = await getAttributes([
			'border-palette-status-general',
			'border-palette-status-m',
		]);

		expect(secondResult).toStrictEqual(secondExpect);

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('On change attributes from base responsive and some attributes have default on general, just "general" attributes change', async () => {
		const borderAccordion = await openSidebarTab(page, 'style', 'border');
		await borderAccordion.$$eval(
			'.maxi-tabs-content .maxi-default-styles-control button',
			buttons => buttons[1].click()
		);

		const expectBorder = {
			'border-style-general': 'solid',
			'border-top-width-general': 2,
			'border-right-width-general': 2,
			'border-bottom-width-general': 2,
			'border-left-width-general': 2,
			'border-sync-width-general': 'all',
			'border-unit-width-general': 'px',
			'border-style-m': undefined,
			'border-top-width-m': undefined,
			'border-right-width-m': undefined,
			'border-bottom-width-m': undefined,
			'border-left-width-m': undefined,
			'border-sync-width-m': undefined,
			'border-unit-width-m': undefined,
		};

		const borderResult = await getAttributes([
			'border-style-general',
			'border-top-width-general',
			'border-right-width-general',
			'border-bottom-width-general',
			'border-left-width-general',
			'border-sync-width-general',
			'border-unit-width-general',
			'border-style-m',
			'border-top-width-m',
			'border-right-width-m',
			'border-bottom-width-m',
			'border-left-width-m',
			'border-sync-width-m',
			'border-unit-width-m',
		]);

		expect(borderResult).toStrictEqual(expectBorder);

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('On change attributes from XXL responsive and without a default general attribute value, just "general" change', async () => {
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

		await page.waitForTimeout(300);

		const expectMargin = {
			'margin-top-general': '100',
			'margin-top-xxl': undefined,
		};

		const marginResult = await getAttributes([
			'margin-top-general',
			'margin-top-xxl',
		]);

		expect(marginResult).toStrictEqual(expectMargin);

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('On change attributes from XXL responsive and some of them that have default on general, just "general" attributes change', async () => {
		await changeResponsive(page, 'xxl');

		const borderAccordion = await openSidebarTab(page, 'style', 'border');
		await borderAccordion.$$eval(
			'.maxi-tabs-content .maxi-default-styles-control button',
			buttons => buttons[1].click()
		);

		const expectBorder = {
			'border-style-xxl': 'solid',
			'border-top-width-xxl': undefined,
			'border-right-width-xxl': undefined,
			'border-bottom-width-xxl': undefined,
			'border-left-width-xxl': undefined,
			'border-sync-width-xxl': undefined,
			'border-unit-width-xxl': undefined,
			'border-style-general': 'none',
			'border-top-width-general': 2,
			'border-right-width-general': 2,
			'border-bottom-width-general': 2,
			'border-left-width-general': 2,
		};

		const borderResult = await getAttributes([
			'border-style-xxl',
			'border-top-width-xxl',
			'border-right-width-xxl',
			'border-bottom-width-xxl',
			'border-left-width-xxl',
			'border-sync-width-xxl',
			'border-unit-width-xxl',
			'border-style-general',
			'border-top-width-general',
			'border-right-width-general',
			'border-bottom-width-general',
			'border-left-width-general',
		]);

		expect(borderResult).toStrictEqual(expectBorder);

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('On first change attributes from XXL responsive and without a default general attribute value, and then changing from XL, just "general" and XL attributes change', async () => {
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

		await page.waitForTimeout(300);

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
			'margin-top-general': '10',
			'margin-top-xl': '20',
			'margin-top-m': '10',
		};

		await page.waitForTimeout(300);

		const marginResult = await getAttributes([
			'margin-top-general',
			'margin-top-xl',
			'margin-top-m',
		]);

		expect(marginResult).toStrictEqual(expectMargin);

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('On first change attributes from XXL responsive and some of them have default general attribute value, and then changing from XL, "XL" change', async () => {
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

		await page.waitForTimeout(300);

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
			'margin-top-general': '10',
			'margin-top-xl': '20',
			'margin-top-m': '10',
		};

		await page.waitForTimeout(300);

		const marginResult = await getAttributes([
			'margin-top-general',
			'margin-top-xl',
			'margin-top-m',
		]);

		expect(marginResult).toStrictEqual(expectMargin);

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('On first change attributes from XXL responsive and some of them have default general attribute value, and then changing from XL and from "M", all values correspond', async () => {
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
			'border-style-general': 'dotted',
			'border-style-xl': 'dashed',
			'border-style-m': 'dotted',
		};

		const borderResult = await getAttributes([
			'border-style-xxl',
			'border-style-general',
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

	it('On change attributes from XL responsive and then change from "M", "general" attributes change', async () => {
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

		await page.waitForTimeout(500);

		await changeResponsive(page, 'm');

		await page.waitForTimeout(500);

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

		await page.waitForTimeout(500);

		const expectMargin = {
			'margin-top-general': '10',
			'margin-top-xl': '20',
			'margin-top-m': '10',
		};

		const marginResult = await getAttributes([
			'margin-top-general',
			'margin-top-xl',
			'margin-top-m',
		]);

		expect(marginResult).toStrictEqual(expectMargin);

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('On change number attributes from XXL responsive without General attribute, it changes on XXL and General all time', async () => {
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
			'margin-top-general': '123',
			'margin-top-xxl': undefined,
		};

		await page.waitForTimeout(300);

		const marginResult = await getAttributes([
			'margin-top-general',
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
		await page.keyboard.type('100', { delay: 300 });

		const expectRadiusOnM = {
			'border-top-left-radius-general': 100,
			'border-top-left-radius-m': undefined,
		};

		await page.waitForTimeout(500);

		const radiusOnM = await getAttributes([
			'border-top-left-radius-general',
			'border-top-left-radius-m',
		]);

		expect(radiusOnM).toStrictEqual(expectRadiusOnM);

		await changeResponsive(page, 'xl');

		await page.waitForTimeout(500);

		borderAccordion = await openSidebarTab(page, 'style', 'border');

		await borderAccordion.$eval(
			'.maxi-axis-control__content__item__border-radius input',
			input => input.focus()
		);
		await page.keyboard.type('150', { delay: 300 });

		const expectRadiusOnXl = {
			'border-top-left-radius-general': 100,
			'border-top-left-radius-xl': 150,
			'border-top-left-radius-m': 100,
		};

		await page.waitForTimeout(500);

		const radiusOnXl = await getAttributes([
			'border-top-left-radius-general',
			'border-top-left-radius-m',
			'border-top-left-radius-xl',
		]);

		expect(radiusOnXl).toStrictEqual(expectRadiusOnXl);

		// Reset
		await borderAccordion.$eval(
			'.maxi-axis-control__content__item__border-radius .maxi-reset-button',
			button => button.click()
		);

		const expectResetRadiusOnXl = {
			'border-top-left-radius-general': 100,
			'border-top-left-radius-m': undefined,
			'border-top-left-radius-xl': undefined,
		};

		await page.waitForTimeout(500);

		const resetRadiusOnXl = await getAttributes([
			'border-top-left-radius-general',
			'border-top-left-radius-m',
			'border-top-left-radius-xl',
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
			'border-top-left-radius-general': undefined,
			'border-top-left-radius-m': undefined,
			'border-top-left-radius-xl': undefined,
		};

		await page.waitForTimeout(500);

		const resetRadiusOnM = await getAttributes([
			'border-top-left-radius-general',
			'border-top-left-radius-m',
			'border-top-left-radius-xl',
		]);

		expect(resetRadiusOnM).toStrictEqual(expectResetRadiusOnM);
	});

	it('On change XL default attributes from General responsive and then reset, changes on General and baseBreakpoint', async () => {
		// Base responsive is "XL"
		await setBrowserViewport({ width: 1920, height: 700 });

		await createNewPost();
		await insertMaxiBlock(page, 'Button Maxi');
		await updateAllBlockUniqueIds(page);

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

		await page.waitForTimeout(500);

		const expectPaddingOnM = {
			'button-padding-top-general': '10',
			'button-padding-top-xl': '10',
		};

		const paddingOnM = await getAttributes([
			'button-padding-top-general',
			'button-padding-top-xl',
		]);

		expect(paddingOnM).toStrictEqual(expectPaddingOnM);

		await changeResponsive(page, 'xxl');

		await page.waitForTimeout(500);

		const expectPaddingOnXl = {
			'button-padding-top-general': '10',
			'button-padding-top-xl': '10',
			'button-padding-top-xxl': '23',
		};

		const paddingOnXl = await getAttributes([
			'button-padding-top-general',
			'button-padding-top-xl',
			'button-padding-top-xxl',
		]);

		expect(paddingOnXl).toStrictEqual(expectPaddingOnXl);

		// Reset
		await changeResponsive(page, 'xl');
		await page.waitForTimeout(500);

		axisControlInstance = await accordionPanel.$(
			'.maxi-axis-control__padding'
		);

		await axisControlInstance.$eval('.maxi-reset-button', button =>
			button.click()
		);

		await page.waitForTimeout(500);

		const expectPaddingAfterReset = {
			'button-padding-top-general': '15',
			'button-padding-top-xl': '15',
			'button-padding-top-xxl': '23',
		};

		const paddingAfterReset = await getAttributes([
			'button-padding-top-general',
			'button-padding-top-xl',
			'button-padding-top-xxl',
		]);

		expect(paddingAfterReset).toStrictEqual(expectPaddingAfterReset);
	});

	it('On change XXL default attributes from XL screen, then change the screen size to XXL, on changing the General attribute it changes on General and XXL', async () => {
		// Base responsive is "XL"
		await setBrowserViewport({ width: 1920, height: 700 });

		await createNewPost();
		await insertMaxiBlock(page, 'Group Maxi');
		await page.waitForSelector('.maxi-group-block');
		await updateAllBlockUniqueIds(page);

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
			'padding-top-general': '10',
			'padding-top-xxl': undefined,
			'padding-top-xl': undefined,
		};

		const paddingOnXl = await getAttributes([
			'padding-top-general',
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

		await page.waitForTimeout(300);

		const expectPaddingOnXxl = {
			'padding-top-general': '15',
			'padding-top-xl': undefined,
			'padding-top-xxl': undefined,
		};

		const paddingOnXxl = await getAttributes([
			'padding-top-general',
			'padding-top-xl',
			'padding-top-xxl',
		]);

		expect(paddingOnXxl).toStrictEqual(expectPaddingOnXxl);
	});

	/**
	 * TODO: needs #3809 to be fixed first. On resetting, General values are overwriting XXL ones.
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
	// start with XXL, General or XL. In this case, having the width-l default value as the first was creating this concrete issue that
	// was supposed to be fixed and tested here. Things are different now, so this test is skipped but kept in case we find a future
	// situation related that will need it 👍
	it.skip('On L as a baseBreakpoint and changing a default L attribute with no higher value, it changes General and L', async () => {
		// Base responsive is "L"
		await setBrowserViewport({ width: 1400, height: 700 });

		await createNewPost();
		await insertMaxiBlock(page, 'Container Maxi');

		await page.waitForSelector('.maxi-row-block');

		await page.waitForSelector('.maxi-row-block__template button');
		await page.waitForTimeout(100);
		await page.$$eval('.maxi-row-block__template button', button =>
			button[0].click()
		);
		await page.waitForSelector('.maxi-column-block');

		await updateAllBlockUniqueIds(page);

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
