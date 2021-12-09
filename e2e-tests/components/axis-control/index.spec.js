/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	pressKeyTimes,
} from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import {
	openSidebarTab,
	changeResponsive,
	editAxisControl,
	getAttributes,
	getBlockStyle,
} from '../../utils';

describe('AxisControl', () => {
	it('Checking AxisControl util', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
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
			values: '66',
			unit: '%',
		});

		const expectMargin = {
			'margin-top-general': '66',
			'margin-bottom-general': '66',
			'margin-left-general': '66',
			'margin-right-general': '66',
			'margin-unit-general': '%',
		};
		const marginResult = await getAttributes([
			'margin-unit-general',
			'margin-top-general',
			'margin-bottom-general',
			'margin-left-general',
			'margin-right-general',
		]);

		expect(marginResult).toStrictEqual(expectMargin);

		await editAxisControl({
			page,
			instance: await page.$('.maxi-axis-control__padding'),
			values: '34',
			unit: '%',
		});

		const paddingType = await page.$eval(
			'.maxi-axis-control__padding .maxi-axis-control__content__item__padding input',
			input => input.type
		);
		const paddingTypeOf = typeof paddingType;

		expect(paddingTypeOf).toStrictEqual('string');

		const marginType = await page.$(
			'.maxi-axis-control__margin .maxi-axis-control__content__item__margin input'
		);
		const marginTypeOf = typeof marginType;

		expect(marginTypeOf).toStrictEqual('object');
	});

	it('Checking responsive axisControl', async () => {
		await changeResponsive(page, 's');

		const positionGeneralValue = await page.$$eval(
			'.maxi-axis-control__margin .maxi-axis-control__content__item__margin input',
			input => input[0].placeholder
		);

		expect(positionGeneralValue).toStrictEqual('66');

		const positionGeneralUnit = await page.$eval(
			'.maxi-axis-control__margin .maxi-axis-control__unit-header select',
			input => input.value
		);
		expect(positionGeneralUnit).toStrictEqual('%');

		// change s responsive
		const axisControlInstance = await page.$('.maxi-axis-control__margin');
		await editAxisControl({
			page,
			instance: axisControlInstance,
			values: '89',
			unit: 'px',
		});

		const positionSValue = await page.$$eval(
			'.maxi-axis-control__margin .maxi-axis-control__content__item__margin input',
			input => input[0].placeholder
		);

		expect(positionSValue).toStrictEqual('89');

		const positionSUnit = await page.$eval(
			'.maxi-axis-control__margin .maxi-axis-control__unit-header select',
			input => input.value
		);
		expect(positionSUnit).toStrictEqual('px');

		// Xs responsive
		await changeResponsive(page, 'xs');

		const positionXsValue = await page.$$eval(
			'.maxi-axis-control__margin .maxi-axis-control__content__item__margin input',
			input => input[0].placeholder
		);

		expect(positionXsValue).toStrictEqual('89');

		const positionXsUnit = await page.$eval(
			'.maxi-axis-control__margin .maxi-axis-control__unit-header select',
			input => input.value
		);
		expect(positionXsUnit).toStrictEqual('px');

		// M responsive
		await changeResponsive(page, 'm');

		const positionMValue = await page.$$eval(
			'.maxi-axis-control__margin .maxi-axis-control__content__item__margin input',
			input => input[0].placeholder
		);

		expect(positionMValue).toStrictEqual('66');

		const positionMUnit = await page.$eval(
			'.maxi-axis-control__margin .maxi-axis-control__unit-header select',
			input => input.value
		);
		expect(positionMUnit).toStrictEqual('%');
	});
	it('Check the arrows in input', async () => {
		await changeResponsive(page, 'base');

		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'margin padding'
		);

		await page.waitForTimeout(150);

		await editAxisControl({
			page,
			instance: await accordionPanel.$('.maxi-axis-control__margin'),
			values: '3',
		});
		await page.waitForTimeout(150);

		expect(await getAttributes('margin-top-general')).toStrictEqual('3');

		const input = await accordionPanel.$$(
			'.maxi-axis-control__content__item input'
		);

		await input[0].focus();
		await pressKeyTimes('ArrowDown', '5');

		expect(await getAttributes('margin-top-general')).toStrictEqual('0');
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
			'margin-unit-general': 'px',
		};

		const result = await getAttributes([
			'margin-unit-general',
			'margin-top-general',
			'margin-bottom-general',
			'margin-left-general',
			'margin-right-general',
		]);

		expect(result).toStrictEqual(expectMargin);
	});
	it('Checking AxisControl async buttons', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
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
			'margin-unit-general': '%',
		};

		const resultAxis = await getAttributes([
			'margin-top-general',
			'margin-bottom-general',
			'margin-left-general',
			'margin-right-general',
			'margin-unit-general',
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
			'margin-unit-general': 'px',
		};

		const resultSyncOptionNone = await getAttributes([
			'margin-unit-general',
			'margin-top-general',
			'margin-bottom-general',
			'margin-left-general',
			'margin-right-general',
		]);

		expect(resultSyncOptionNone).toStrictEqual(expectSyncOptionNone);
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
