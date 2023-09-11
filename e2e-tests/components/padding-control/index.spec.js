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
	updateAllBlockUniqueIds,
} from '../../utils';

describe('Padding control', () => {
	it('Checking padding equal control', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Text Maxi');
		await updateAllBlockUniqueIds(page);
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
			'padding-top-general': '24',
			'padding-bottom-general': '24',
			'padding-left-general': '24',
			'padding-right-general': '24',
			'padding-left-unit-general': 'em',
			'padding-bottom-unit-general': 'em',
			'padding-top-unit-general': 'em',
			'padding-right-unit-general': 'em',
		};
		const paddingResult = await getAttributes([
			'padding-left-unit-general',
			'padding-bottom-unit-general',
			'padding-top-unit-general',
			'padding-right-unit-general',
			'padding-top-general',
			'padding-bottom-general',
			'padding-left-general',
			'padding-right-general',
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
			'padding-top-general': '34',
			'padding-bottom-general': '34',
			'padding-left-general': '44',
			'padding-right-general': '44',
			'padding-left-unit-general': 'em',
			'padding-bottom-unit-general': '%',
			'padding-top-unit-general': '%',
			'padding-right-unit-general': 'em',
		};
		const paddingResult = await getAttributes([
			'padding-left-unit-general',
			'padding-bottom-unit-general',
			'padding-top-unit-general',
			'padding-right-unit-general',
			'padding-top-general',
			'padding-bottom-general',
			'padding-left-general',
			'padding-right-general',
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
			'padding-top-general': '10',
			'padding-bottom-general': '30',
			'padding-left-general': '40',
			'padding-right-general': '20',
			'padding-left-unit-general': '%',
			'padding-bottom-unit-general': 'vw',
			'padding-top-unit-general': '%',
			'padding-right-unit-general': 'em',
		};
		const paddingResult = await getAttributes([
			'padding-left-unit-general',
			'padding-bottom-unit-general',
			'padding-top-unit-general',
			'padding-right-unit-general',
			'padding-top-general',
			'padding-bottom-general',
			'padding-left-general',
			'padding-right-general',
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
