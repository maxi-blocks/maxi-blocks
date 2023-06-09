/**
 * WordPress dependencies
 */
import { createNewPost } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import {
	openSidebarTab,
	editAxisControl,
	getAttributes,
	addResponsiveTest,
	resettingAttributes,
	insertMaxiBlock,
} from '../../utils';

describe('Padding control', () => {
	it('Checking padding equal control', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Text Maxi');
		await openSidebarTab(page, 'style', 'margin padding');

		await editAxisControl({
			page,
			instance: await page.$(
				'.maxi-axis-control__padding .maxi-axis-control__content__item__padding'
			),
			values: '24',
			unit: 'em',
		});

		const expectPadding = {
			'_p.t-g': '24',
			'_p.b-g': '24',
			'padding-left-g': '24',
			'padding-right-g': '24',
			'padding-left-unit-g': 'em',
			'_p.b-unit-g': 'em',
			'_p.t-unit-g': 'em',
			'padding-right-unit-g': 'em',
		};
		const paddingResult = await getAttributes([
			'padding-left-unit-g',
			'_p.b-unit-g',
			'_p.t-unit-g',
			'padding-right-unit-g',
			'_p.t-g',
			'_p.b-g',
			'padding-left-g',
			'padding-right-g',
		]);

		expect(paddingResult).toStrictEqual(expectPadding);

		const resetExpect = await resettingAttributes({
			page,
			instance: 'maxi-axis-control__content__item__margin',
			expectValue: '',
		});
		expect(resetExpect).toBeTruthy();
	});

	it('Checking padding together control', async () => {
		await page.$eval(
			'.maxi-axis-control__padding .maxi-axis-control__header .maxi-tabs-control .maxi-tabs-control__button-axis',
			button => button.click()
		);

		await editAxisControl({
			page,
			instance: await page.$(
				'.maxi-axis-control__padding .maxi-axis-control__content__item__top-bottom'
			),
			values: '34',
			unit: '%',
		});

		await editAxisControl({
			page,
			instance: await page.$(
				'.maxi-axis-control__padding .maxi-axis-control__content__item__left-right'
			),
			values: '44',
			unit: 'em',
		});

		const expectPadding = {
			'_p.t-g': '34',
			'_p.b-g': '34',
			'padding-left-g': '44',
			'padding-right-g': '44',
			'padding-left-unit-g': 'em',
			'_p.b-unit-g': '%',
			'_p.t-unit-g': '%',
			'padding-right-unit-g': 'em',
		};
		const paddingResult = await getAttributes([
			'padding-left-unit-g',
			'_p.b-unit-g',
			'_p.t-unit-g',
			'padding-right-unit-g',
			'_p.t-g',
			'_p.b-g',
			'padding-left-g',
			'padding-right-g',
		]);

		expect(paddingResult).toStrictEqual(expectPadding);
	});

	it('Checking padding separately control', async () => {
		await page.$eval(
			'.maxi-axis-control__padding .maxi-axis-control__header .maxi-tabs-control .maxi-tabs-control__button-none',
			button => button.click()
		);

		await editAxisControl({
			page,
			instance: await page.$(
				'.maxi-axis-control__padding .maxi-axis-control__content__item__top'
			),
			values: '10',
			unit: '%',
		});

		await editAxisControl({
			page,
			instance: await page.$(
				'.maxi-axis-control__padding .maxi-axis-control__content__item__right'
			),
			values: '20',
			unit: 'em',
		});

		await editAxisControl({
			page,
			instance: await page.$(
				'.maxi-axis-control__padding .maxi-axis-control__content__item__bottom'
			),
			values: '30',
			unit: 'vw',
		});

		await editAxisControl({
			page,
			instance: await page.$(
				'.maxi-axis-control__padding .maxi-axis-control__content__item__left'
			),
			values: '40',
			unit: '%',
		});

		const expectPadding = {
			'_p.t-g': '10',
			'_p.b-g': '30',
			'padding-left-g': '40',
			'padding-right-g': '20',
			'padding-left-unit-g': '%',
			'_p.b-unit-g': 'vw',
			'_p.t-unit-g': '%',
			'padding-right-unit-g': 'em',
		};
		const paddingResult = await getAttributes([
			'padding-left-unit-g',
			'_p.b-unit-g',
			'_p.t-unit-g',
			'padding-right-unit-g',
			'_p.t-g',
			'_p.b-g',
			'padding-left-g',
			'padding-right-g',
		]);

		expect(paddingResult).toStrictEqual(expectPadding);
	});

	it('Checking responsive padding', async () => {
		await page.$eval(
			'.maxi-axis-control__padding .maxi-axis-control__header .maxi-tabs-control .maxi-tabs-control__button-all',
			button => button.click()
		);

		const responsiveValue = await addResponsiveTest({
			page,
			instance:
				'.maxi-axis-control__padding .maxi-axis-control__content__item__padding input',
			needFocusPlaceholder: true,
			baseExpect: '10',
			xsExpect: '56',
			newValue: '56',
		});
		expect(responsiveValue).toBeTruthy();

		const responsiveUnit = await addResponsiveTest({
			page,
			instance:
				'.maxi-axis-control__padding .maxi-axis-control__content__item__padding select',
			selectInstance:
				'.maxi-axis-control__padding .maxi-axis-control__content__item__padding select',
			needSelectIndex: true,
			baseExpect: '%',
			xsExpect: 'em',
			newValue: 'em',
		});
		expect(responsiveUnit).toBeTruthy();
	});
});
