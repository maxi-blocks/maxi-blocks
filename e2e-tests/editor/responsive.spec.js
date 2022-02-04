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
			'border-style-xxl': 'solid',
			'border-style-xl': 'dashed',
			'border-style-general': 'dotted',
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
});
