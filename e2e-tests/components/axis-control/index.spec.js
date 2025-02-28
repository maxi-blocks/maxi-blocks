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
			'margin-top-general': '66',
			'margin-bottom-general': '66',
			'margin-left-general': '66',
			'margin-right-general': '66',
			'margin-left-unit-general': '%',
			'margin-bottom-unit-general': '%',
			'margin-top-unit-general': '%',
			'margin-right-unit-general': '%',
		};
		const marginResult = await getAttributes([
			'margin-left-unit-general',
			'margin-bottom-unit-general',
			'margin-top-unit-general',
			'margin-right-unit-general',
			'margin-top-general',
			'margin-bottom-general',
			'margin-left-general',
			'margin-right-general',
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

		expect(
			typeof (await getAttributes('padding-bottom-general'))
		).toStrictEqual('string');

		expect(
			typeof (await getAttributes('margin-bottom-general'))
		).toStrictEqual('string');
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

		expect(await getAttributes('margin-top-general')).toStrictEqual('3.5');

		const input = await page.$$('.maxi-axis-control__content__item input');

		await input[0].focus();
		await pressKeyTimes('ArrowDown', '5');

		await page.waitForTimeout(350);

		expect(await getAttributes('margin-top-general')).toStrictEqual('-1');
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
			'margin-top-general': 'auto',
			'margin-bottom-general': 'auto',
			'margin-left-general': 'auto',
			'margin-right-general': 'auto',
			'margin-left-unit-general': 'px',
			'margin-bottom-unit-general': 'px',
			'margin-top-unit-general': 'px',
			'margin-right-unit-general': 'px',
		};

		const result = await getAttributes([
			'margin-left-unit-general',
			'margin-bottom-unit-general',
			'margin-top-unit-general',
			'margin-right-unit-general',
			'margin-top-general',
			'margin-bottom-general',
			'margin-left-general',
			'margin-right-general',
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
			'margin-top-general': '66',
			'margin-bottom-general': '66',
			'margin-left-general': '77',
			'margin-right-general': '77',
			'margin-left-unit-general': 'px',
			'margin-bottom-unit-general': '%',
			'margin-top-unit-general': '%',
			'margin-right-unit-general': 'px',
		};

		const resultAxis = await getAttributes([
			'margin-left-unit-general',
			'margin-bottom-unit-general',
			'margin-top-unit-general',
			'margin-right-unit-general',
			'margin-bottom-general',
			'margin-left-general',
			'margin-right-general',
			'margin-top-general',
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
			'margin-top-general': '66',
			'margin-bottom-general': '55',
			'margin-left-general': '33',
			'margin-right-general': '77',
			'margin-left-unit-general': 'px',
			'margin-bottom-unit-general': '%',
			'margin-top-unit-general': 'px',
			'margin-right-unit-general': 'px',
		};

		const resultSyncOptionNone = await getAttributes([
			'margin-top-general',
			'margin-bottom-general',
			'margin-left-general',
			'margin-right-general',
			'margin-left-unit-general',
			'margin-bottom-unit-general',
			'margin-top-unit-general',
			'margin-right-unit-general',
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

		expect(await getAttributes('padding-top-general')).toStrictEqual('0');
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
