/* eslint-disable no-await-in-loop */
/**
 * WordPress dependencies
 */
import { createNewPost, pressKeyTimes } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import {
	openSidebarTab,
	changeResponsive,
	editAxisControl,
	getAttributes,
	getBlockStyle,
	addResponsiveTest,
	insertMaxiBlock,
} from '../../utils';

describe('AxisControl', () => {
	it('Checking AxisControl util', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Text Maxi');
		await openSidebarTab(page, 'style', 'margin padding');

		await editAxisControl({
			page,
			instance: await page.$(
				'.maxi-axis-control__margin .maxi-axis-control__content__item__margin'
			),
			values: '66',
			unit: '%',
		});

		const expectMargin = {
			'_m.t-g': '66',
			'_m.b-g': '66',
			'_m.l-g': '66',
			'_m.r-g': '66',
			'_m.l.u-g': '%',
			'_m.b.u-g': '%',
			'_m.t.u-g': '%',
			'_m.r.u-g': '%',
		};
		const marginResult = await getAttributes([
			'_m.l.u-g',
			'_m.b.u-g',
			'_m.t.u-g',
			'_m.r.u-g',
			'_m.t-g',
			'_m.b-g',
			'_m.l-g',
			'_m.r-g',
		]);

		expect(marginResult).toStrictEqual(expectMargin);
	});

	it('Check padding attributes strings', async () => {
		await editAxisControl({
			page,
			instance: await page.$(
				'.maxi-axis-control__padding .maxi-axis-control__content__item__padding'
			),
			values: '34',
			unit: '%',
		});

		expect(typeof (await getAttributes('_p.b-g'))).toStrictEqual('string');

		expect(typeof (await getAttributes('_m.b-g'))).toStrictEqual('string');
	});

	it('Checking responsive axisControl', async () => {
		const responsiveValue = await addResponsiveTest({
			page,
			instance:
				'.maxi-axis-control__margin .maxi-axis-control__content__item__margin input',
			needFocusPlaceholder: true,
			baseExpect: '66',
			xsExpect: '44',
			newValue: '44',
		});
		expect(responsiveValue).toBeTruthy();

		const responsiveUnit = await addResponsiveTest({
			page,
			instance:
				'.maxi-axis-control__margin .maxi-axis-control__content__item__margin select',
			selectInstance:
				'.maxi-axis-control__margin .maxi-axis-control__content__item__margin select',
			needSelectIndex: true,
			baseExpect: '%',
			xsExpect: 'px',
			newValue: 'px',
		});
		expect(responsiveUnit).toBeTruthy();
	});

	it('Check the arrows in input and %% 0.1 steps', async () => {
		await changeResponsive(page, 'base');

		// reset attributtes
		await page.$(
			'.maxi-axis-control__margin .components-maxi-control__reset-button',
			button => button.click()
		);

		await page.waitForTimeout(150);

		await editAxisControl({
			page,
			instance: await page.$('.maxi-axis-control__margin'),
			values: '3.5',
			unit: 'px',
		});

		await page.waitForTimeout(300);

		expect(await getAttributes('_m.t-g')).toStrictEqual('3.5');

		const input = await page.$$('.maxi-axis-control__content__item input');

		await input[0].focus();
		await pressKeyTimes('ArrowDown', '5');

		expect(await getAttributes('_m.t-g')).toStrictEqual('-1');
	});

	it('Checking AxisControl auto', async () => {
		await changeResponsive(page, 'base');

		await editAxisControl({
			page,
			instance: await page.$('.maxi-axis-control__margin'),
			values: 'auto',
			unit: 'px',
		});

		const expectMargin = {
			'_m.t-g': 'auto',
			'_m.b-g': 'auto',
			'_m.l-g': 'auto',
			'_m.r-g': 'auto',
			'_m.l.u-g': 'px',
			'_m.b.u-g': 'px',
			'_m.t.u-g': 'px',
			'_m.r.u-g': 'px',
		};

		const result = await getAttributes([
			'_m.l.u-g',
			'_m.b.u-g',
			'_m.t.u-g',
			'_m.r.u-g',
			'_m.t-g',
			'_m.b-g',
			'_m.l-g',
			'_m.r-g',
		]);

		expect(result).toStrictEqual(expectMargin);
	});

	it('Checking AxisControl async buttons', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Text Maxi');
		await openSidebarTab(page, 'style', 'margin padding');
		const axisControlInstance = await page.$('.maxi-axis-control__margin');

		await editAxisControl({
			page,
			instance: axisControlInstance,
			syncOption: 'axis',
			values: ['66', '77'],
			unit: '%',
		});

		const expectAxisMargin = {
			'_m.t-g': '66',
			'_m.b-g': '66',
			'_m.l-g': '77',
			'_m.r-g': '77',
			'_m.l.u-g': 'px',
			'_m.b.u-g': '%',
			'_m.t.u-g': '%',
			'_m.r.u-g': 'px',
		};

		const resultAxis = await getAttributes([
			'_m.l.u-g',
			'_m.b.u-g',
			'_m.t.u-g',
			'_m.r.u-g',
			'_m.b-g',
			'_m.l-g',
			'_m.r-g',
			'_m.t-g',
		]);

		expect(resultAxis).toStrictEqual(expectAxisMargin);

		await editAxisControl({
			page,
			instance: axisControlInstance,
			syncOption: 'none',
			values: ['66', '77', '55', '33'],
			unit: 'px',
		});

		const expectSyncOptionNone = {
			'_m.t-g': '66',
			'_m.b-g': '55',
			'_m.l-g': '33',
			'_m.r-g': '77',
			'_m.l.u-g': 'px',
			'_m.b.u-g': '%',
			'_m.t.u-g': 'px',
			'_m.r.u-g': 'px',
		};

		const resultSyncOptionNone = await getAttributes([
			'_m.t-g',
			'_m.b-g',
			'_m.l-g',
			'_m.r-g',
			'_m.l.u-g',
			'_m.b.u-g',
			'_m.t.u-g',
			'_m.r.u-g',
		]);

		expect(resultSyncOptionNone).toStrictEqual(expectSyncOptionNone);
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Check padding min is never below 0', async () => {
		await openSidebarTab(page, 'style', 'margin padding');

		await editAxisControl({
			page,
			instance: await page.$('.maxi-axis-control__padding'),
			values: '1',
			unit: 'px',
		});

		const input = await page.$(
			'.maxi-axis-control__padding .maxi-axis-control__content__item input'
		);

		await input.focus();
		await pressKeyTimes('ArrowDown', '5');

		expect(await getAttributes('_p.t-g')).toStrictEqual('0');
	});

	it('Checking AxisControl arrows when value inherited from higher breakpoints', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Text Maxi');
		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'margin padding'
		);

		for (const [index, value] of [-30, 30].entries()) {
			const itemMarginContentClass =
				' .maxi-axis-control__margin .maxi-axis-control__content__item__margin';

			if (index !== 0) {
				await accordionPanel.$eval(
					`${itemMarginContentClass} .maxi-reset-button`,
					button => button.click()
				);

				await changeResponsive(page, 'base');
			}

			await editAxisControl({
				page,
				instance: await page.$(itemMarginContentClass),
				values: `${value}`,
				unit: 'px',
			});

			await changeResponsive(page, 'm');

			await accordionPanel.$eval(
				`${itemMarginContentClass} .maxi-advanced-number-control__value`,
				input => input.focus()
			);

			await page.keyboard.press('ArrowDown');

			expect(await getAttributes('_m.t-m')).toStrictEqual(`${value - 1}`);

			await page.keyboard.press('ArrowUp');

			expect(await getAttributes('_m.t-m')).toStrictEqual(undefined);
		}
	});
});
