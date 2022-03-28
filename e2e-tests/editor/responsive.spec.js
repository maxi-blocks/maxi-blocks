/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	setBrowserViewport,
} from '@wordpress/e2e-test-utils';
import {
	getBlockStyle,
	getAttributes,
	openSidebarTab,
	changeResponsive,
	editAxisControl,
} from '../utils';

describe('Responsive attributes mechanisms', () => {
	beforeEach(async () => {
		// Base responsive is "M"
		await setBrowserViewport('large');

		await createNewPost();
		await insertBlock('Group Maxi');
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
			'border-style-xl': undefined,
			'border-top-width-xl': undefined,
			'border-right-width-xl': undefined,
			'border-bottom-width-xl': undefined,
			'border-left-width-xl': undefined,
		};

		const borderResult = await getAttributes([
			'border-style-general',
			'border-top-width-general',
			'border-right-width-general',
			'border-bottom-width-general',
			'border-left-width-general',
			'border-style-xl',
			'border-top-width-xl',
			'border-right-width-xl',
			'border-bottom-width-xl',
			'border-left-width-xl',
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
			'border-palette-status-xl': undefined,
		};

		const secondResult = await getAttributes([
			'border-palette-status-general',
			'border-palette-status-xl',
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
		};

		const borderResult = await getAttributes([
			'border-style-general',
			'border-top-width-general',
			'border-right-width-general',
			'border-bottom-width-general',
			'border-left-width-general',
			'border-sync-width-general',
			'border-unit-width-general',
		]);

		expect(borderResult).toStrictEqual(expectBorder);

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('On change attributes from XXL responsive and without a default general attribute value, just "general" and "XXL" change', async () => {
		await changeResponsive(page, 'xxl');

		const borderAccordion = await openSidebarTab(page, 'style', 'border');
		const selector = await borderAccordion.$(
			'.maxi-border-control__type select'
		);
		await selector.select('solid');

		const expectBorder = {
			'border-style-xxl': 'solid',
			'border-style-general': 'solid',
		};

		const borderResult = await getAttributes([
			'border-style-xxl',
			'border-style-general',
		]);

		expect(borderResult).toStrictEqual(expectBorder);

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('On change attributes from XXL responsive and some of them that have default on general, just "general" and "XXL" attributes change', async () => {
		await changeResponsive(page, 'xxl');

		const borderAccordion = await openSidebarTab(page, 'style', 'border');
		await borderAccordion.$$eval(
			'.maxi-tabs-content .maxi-default-styles-control button',
			buttons => buttons[1].click()
		);

		const expectBorder = {
			'border-style-xxl': 'solid',
			'border-top-width-xxl': 2,
			'border-right-width-xxl': 2,
			'border-bottom-width-xxl': 2,
			'border-left-width-xxl': 2,
			'border-sync-width-xxl': 'all',
			'border-unit-width-xxl': 'px',
			'border-style-general': 'solid',
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

	it('On first change attributes from XXL responsive and without a default general attribute value, and then changing from XL, "XL" change and "M" get general values', async () => {
		await changeResponsive(page, 'xxl');

		let borderAccordion = await openSidebarTab(page, 'style', 'border');
		let selector = await borderAccordion.$(
			'.maxi-border-control__type select'
		);
		await selector.select('solid');

		await changeResponsive(page, 'xl');

		borderAccordion = await openSidebarTab(page, 'style', 'border');
		selector = await borderAccordion.$('.maxi-border-control__type select');
		await selector.select('dashed');

		const expectBorder = {
			'border-style-xl': 'dashed',
			'border-style-m': 'solid',
		};

		const borderResult = await getAttributes([
			'border-style-xl',
			'border-style-m',
		]);

		expect(borderResult).toStrictEqual(expectBorder);

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('On first change attributes from XXL responsive and some of them have default general attribute value, and then changing from XL, "XL" change and "M" get general values', async () => {
		await changeResponsive(page, 'xxl');

		let borderAccordion = await openSidebarTab(page, 'style', 'border');
		await borderAccordion.$$eval(
			'.maxi-tabs-content .maxi-default-styles-control button',
			buttons => buttons[1].click()
		);

		await changeResponsive(page, 'xl');

		borderAccordion = await openSidebarTab(page, 'style', 'border');
		await borderAccordion.$$eval(
			'.maxi-tabs-content .maxi-default-styles-control button',
			buttons => buttons[2].click()
		);

		const expectBorder = {
			'border-style-xl': 'dashed',
			'border-style-m': 'solid',
		};

		const borderResult = await getAttributes([
			'border-style-xl',
			'border-style-m',
		]);

		expect(borderResult).toStrictEqual(expectBorder);

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('On first change attributes from XXL responsive and some of them have default general attribute value, and then changing from XL and from "M", all values correspond', async () => {
		await changeResponsive(page, 'xxl');

		let borderAccordion = await openSidebarTab(page, 'style', 'border');
		await borderAccordion.$$eval(
			'.maxi-tabs-content .maxi-default-styles-control button',
			buttons => buttons[1].click()
		);

		await changeResponsive(page, 'xl');

		borderAccordion = await openSidebarTab(page, 'style', 'border');
		await borderAccordion.$$eval(
			'.maxi-tabs-content .maxi-default-styles-control button',
			buttons => buttons[2].click()
		);

		await changeResponsive(page, 'm');

		borderAccordion = await openSidebarTab(page, 'style', 'border');
		await borderAccordion.$$eval(
			'.maxi-tabs-content .maxi-default-styles-control button',
			buttons => buttons[3].click()
		);

		const expectBorder = {
			'border-style-general': 'dotted',
			'border-style-xxl': 'solid',
			'border-style-xl': 'dashed',
			'border-style-m': 'dotted',
		};

		const borderResult = await getAttributes([
			'border-style-xxl',
			'border-style-xl',
			'border-style-general',
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

	it('On change attributes from XL responsive and then change from "M", "general" and "M" attributes change', async () => {
		await changeResponsive(page, 'xl');

		let borderAccordion = await openSidebarTab(page, 'style', 'border');
		let selector = await borderAccordion.$(
			'.maxi-border-control__type select'
		);
		await selector.select('solid');

		await changeResponsive(page, 'm');

		borderAccordion = await openSidebarTab(page, 'style', 'border');
		selector = await borderAccordion.$('.maxi-border-control__type select');
		await selector.select('dashed');

		const expectBorder = {
			'border-style-general': 'dashed',
			'border-style-m': 'dashed',
		};

		const borderResult = await getAttributes([
			'border-style-general',
			'border-style-m',
		]);

		expect(borderResult).toStrictEqual(expectBorder);

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
			'margin-top-xxl': '123',
		};

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
		await page.keyboard.type('100', { delay: 100 });

		const expectRadiusOnM = {
			'border-top-left-radius-general': 100,
			'border-top-left-radius-m': undefined,
		};

		const radiusOnM = await getAttributes([
			'border-top-left-radius-general',
			'border-top-left-radius-m',
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
			'border-top-left-radius-general': 100,
			'border-top-left-radius-m': 100,
			'border-top-left-radius-xl': 150,
		};

		const radiusOnXl = await getAttributes([
			'border-top-left-radius-general',
			'border-top-left-radius-m',
			'border-top-left-radius-xl',
		]);

		expect(radiusOnXl).toStrictEqual(expectRadiusOnXl);

		// Reset
		await borderAccordion.$eval(
			'.components-maxi-control__reset-button',
			button => button.click()
		);

		const expectResetRadiusOnXl = {
			'border-top-left-radius-general': 100,
			'border-top-left-radius-m': 100,
			'border-top-left-radius-xl': undefined,
		};

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
			'.components-maxi-control__reset-button',
			button => button.click()
		);

		const expectResetRadiusOnM = {
			'border-top-left-radius-general': undefined,
			'border-top-left-radius-m': undefined,
			'border-top-left-radius-xl': undefined,
		};

		const resetRadiusOnM = await getAttributes([
			'border-top-left-radius-general',
			'border-top-left-radius-m',
			'border-top-left-radius-xl',
		]);

		expect(resetRadiusOnM).toStrictEqual(expectResetRadiusOnM);
	});

	it('On change XL default attributes from General responsive, changes on General and XL', async () => {
		// Base responsive is "XL"
		await setBrowserViewport({ width: 1425, height: 700 });

		await createNewPost();
		await insertBlock('Button Maxi');

		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'margin padding'
		);

		const axisControlInstance = await accordionPanel.$(
			'.maxi-axis-control__padding'
		);
		await editAxisControl({
			page,
			instance: axisControlInstance,
			values: '0',
		});

		const expectPaddingOnM = {
			'button-padding-top-general': 0,
			'button-padding-top-xl': 0,
		};

		const paddingOnM = await getAttributes([
			'button-padding-top-general',
			'button-padding-top-xl',
		]);

		expect(paddingOnM).toStrictEqual(expectPaddingOnM);

		await changeResponsive(page, 'xxl');

		const expectPaddingOnXl = {
			'button-padding-top-general': 0,
			'button-padding-top-xl': 0,
			'button-padding-top-xxl': 23,
		};

		const paddingOnXl = await getAttributes([
			'button-padding-top-general',
			'button-padding-top-xl',
			'button-padding-top-xxl',
		]);

		expect(paddingOnXl).toStrictEqual(expectPaddingOnXl);
	});

	it('On change XXL default attributes from XL screen, then change the screen size to XXL, on changing the General attribute it changes on General and XXL', async () => {
		// Base responsive is "XL"
		await setBrowserViewport({ width: 1425, height: 700 });

		await createNewPost();
		await insertBlock('Group Maxi');

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
			'padding-top-general': 10,
			'padding-top-xxl': 10,
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

		const expectPaddingOnXxl = {
			'padding-top-general': 15,
			'padding-top-xl': undefined,
			'padding-top-xxl': 15,
		};

		const paddingOnXxl = await getAttributes([
			'padding-top-general',
			'padding-top-xl',
			'padding-top-xxl',
		]);

		expect(paddingOnXxl).toStrictEqual(expectPaddingOnXxl);
	});
});
