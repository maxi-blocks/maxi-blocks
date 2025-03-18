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
	updateAllBlockUniqueIds,
} from '../../utils';

describe('AxisControl', () => {
	it('Checking AxisControl util', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Text Maxi');
		await updateAllBlockUniqueIds(page);
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
			'margin-top-xl': '66',
			'margin-bottom-xl': '66',
			'margin-left-xl': '66',
			'margin-right-xl': '66',
			'margin-left-unit-xl': '%',
			'margin-bottom-unit-xl': '%',
			'margin-top-unit-xl': '%',
			'margin-right-unit-xl': '%',
		};
		const marginResult = await getAttributes([
			'margin-left-unit-xl',
			'margin-bottom-unit-xl',
			'margin-top-unit-xl',
			'margin-right-unit-xl',
			'margin-top-xl',
			'margin-bottom-xl',
			'margin-left-xl',
			'margin-right-xl',
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

		expect(typeof (await getAttributes('padding-bottom-xl'))).toStrictEqual(
			'string'
		);

		expect(typeof (await getAttributes('margin-bottom-xl'))).toStrictEqual(
			'string'
		);
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

		expect(await getAttributes('margin-top-xl')).toStrictEqual('3.5');

		const input = await page.$$('.maxi-axis-control__content__item input');

		await input[0].focus();
		await pressKeyTimes('ArrowDown', '5');

		await page.waitForTimeout(350);

		expect(await getAttributes('margin-top-xl')).toStrictEqual('-1');
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
			'margin-top-xl': 'auto',
			'margin-bottom-xl': 'auto',
			'margin-left-xl': 'auto',
			'margin-right-xl': 'auto',
			'margin-left-unit-xl': 'px',
			'margin-bottom-unit-xl': 'px',
			'margin-top-unit-xl': 'px',
			'margin-right-unit-xl': 'px',
		};

		const result = await getAttributes([
			'margin-left-unit-xl',
			'margin-bottom-unit-xl',
			'margin-top-unit-xl',
			'margin-right-unit-xl',
			'margin-top-xl',
			'margin-bottom-xl',
			'margin-left-xl',
			'margin-right-xl',
		]);

		expect(result).toStrictEqual(expectMargin);
	});

	it('Checking AxisControl async buttons', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Text Maxi');
		await updateAllBlockUniqueIds(page);
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
			'margin-top-xl': '66',
			'margin-bottom-xl': '66',
			'margin-left-xl': '77',
			'margin-right-xl': '77',
			'margin-bottom-unit-xl': '%',
			'margin-top-unit-xl': '%',
		};

		const resultAxis = await getAttributes([
			'margin-bottom-unit-xl',
			'margin-top-unit-xl',
			'margin-bottom-xl',
			'margin-left-xl',
			'margin-right-xl',
			'margin-top-xl',
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
			'margin-top-xl': '66',
			'margin-bottom-xl': '55',
			'margin-left-xl': '33',
			'margin-right-xl': '77',
			'margin-bottom-unit-xl': '%',
			'margin-top-unit-xl': 'px',
		};

		const resultSyncOptionNone = await getAttributes([
			'margin-top-xl',
			'margin-bottom-xl',
			'margin-left-xl',
			'margin-right-xl',
			'margin-bottom-unit-xl',
			'margin-top-unit-xl',
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

		await page.waitForTimeout(350);

		expect(await getAttributes('padding-top-xl')).toStrictEqual('0');
	});

	it('Checking AxisControl arrows when value inherited from higher breakpoints', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Text Maxi');
		await updateAllBlockUniqueIds(page);
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

			await page.keyboard.press('ArrowDown', { delay: 350 });

			expect(await getAttributes('margin-top-m')).toStrictEqual(
				`${value - 1}`
			);

			await page.keyboard.press('ArrowUp', { delay: 350 });

			expect(await getAttributes('margin-top-m')).toStrictEqual(
				`${value}`
			);
		}
	});
});
