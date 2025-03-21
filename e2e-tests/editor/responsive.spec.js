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
			'margin-top-xl': '100',
			'margin-top-xxl': '100',
		};

		const marginResult = await getAttributes([
			'margin-top-xl',
			'margin-top-xxl',
		]);

		expect(marginResult).toStrictEqual(expectMargin);

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
			'margin-top-xl': '20',
			'margin-top-m': '20',
		};

		await page.waitForTimeout(300);

		const marginResult = await getAttributes([
			'margin-top-xl',
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
			'margin-top-xl': '20',
			'margin-top-m': '20',
		};

		await page.waitForTimeout(300);

		const marginResult = await getAttributes([
			'margin-top-xl',
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
			'border-style-xl': 'dashed',
			'border-style-m': 'dotted',
		};

		const borderResult = await getAttributes([
			'border-style-xxl',
			'border-style-xl',
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
			'margin-top-xl': '20',
			'margin-top-m': '10',
		};

		const marginResult = await getAttributes([
			'margin-top-xl',
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
			'margin-top-xl': '123',
			'margin-top-xxl': '123',
		};

		await page.waitForTimeout(300);

		const marginResult = await getAttributes([
			'margin-top-xl',
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
			'border-top-left-radius-xl': undefined,
			'border-top-left-radius-m': 100,
		};

		await page.waitForTimeout(500);

		const radiusOnM = await getAttributes([
			'border-top-left-radius-xl',
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
			'border-top-left-radius-xl': 150,
			'border-top-left-radius-m': 150,
		};

		await page.waitForTimeout(500);

		const radiusOnXl = await getAttributes([
			'border-top-left-radius-xl',
			'border-top-left-radius-m',
		]);

		expect(radiusOnXl).toStrictEqual(expectRadiusOnXl);

		// Reset
		await borderAccordion.$eval(
			'.maxi-axis-control__content__item__border-radius .maxi-reset-button',
			button => button.click()
		);

		const expectResetRadiusOnXl = {
			'border-top-left-radius-xl': undefined,
			'border-top-left-radius-m': undefined,
		};

		await page.waitForTimeout(500);

		const resetRadiusOnXl = await getAttributes([
			'border-top-left-radius-xl',
			'border-top-left-radius-m',
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
			'border-top-left-radius-xl': undefined,
			'border-top-left-radius-m': undefined,
		};

		await page.waitForTimeout(500);

		const resetRadiusOnM = await getAttributes([
			'border-top-left-radius-xl',
			'border-top-left-radius-m',
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
			'button-padding-top-xl': '10',
		};

		const paddingOnM = await getAttributes([
			'button-padding-top-xl',
			'button-padding-top-xl',
		]);

		expect(paddingOnM).toStrictEqual(expectPaddingOnM);

		await changeResponsive(page, 'xxl');

		await page.waitForTimeout(500);

		const expectPaddingOnXl = {
			'button-padding-top-xl': '10',
			'button-padding-top-xxl': '23',
		};

		const paddingOnXl = await getAttributes([
			'button-padding-top-xl',
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
			'button-padding-top-xl': '15',
			'button-padding-top-xxl': '23',
		};

		const paddingAfterReset = await getAttributes([
			'button-padding-top-xl',
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
			'padding-top-xl': '10',
			'padding-top-xxl': '10',
		};

		const paddingOnXl = await getAttributes([
			'padding-top-xl',
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
			'padding-top-xl': '15',
			'padding-top-xxl': '15',
		};

		const paddingOnXxl = await getAttributes([
			'padding-top-xl',
			'padding-top-xl',
			'padding-top-xxl',
		]);

		expect(paddingOnXxl).toStrictEqual(expectPaddingOnXxl);
	});
});
