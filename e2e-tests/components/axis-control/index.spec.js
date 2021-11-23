/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import {
	getBlockAttributes,
	openSidebarTab,
	changeResponsive,
	editAxisControl,
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
			'margin-top-general': 66,
			'margin-bottom-general': 66,
			'margin-left-general': 66,
			'margin-right-general': 66,
			'margin-unit-general': '%',
		};

		const pageAttributes = await getBlockAttributes();
		const marginAttributes = (({
			'margin-unit-general': marginUnit,
			'margin-top-general': marginTop,
			'margin-bottom-general': marginBottom,
			'margin-left-general': marginLeft,
			'margin-right-general': marginRight,
		}) => ({
			'margin-unit-general': marginUnit,
			'margin-top-general': marginTop,
			'margin-bottom-general': marginBottom,
			'margin-left-general': marginLeft,
			'margin-right-general': marginRight,
		}))(pageAttributes);

		expect(marginAttributes).toStrictEqual(expectMargin);
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
	it('Checking AxisControl auto', async () => {
		await changeResponsive(page, 'base');

		const axisControlInstance = await page.$('.maxi-axis-control__margin');
		await editAxisControl({
			page,
			instance: axisControlInstance,
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

		const pageAttributes = await getBlockAttributes();
		const marginAttributes = (({
			'margin-unit-general': marginUnit,
			'margin-top-general': marginTop,
			'margin-bottom-general': marginBottom,
			'margin-left-general': marginLeft,
			'margin-right-general': marginRight,
		}) => ({
			'margin-unit-general': marginUnit,
			'margin-top-general': marginTop,
			'margin-bottom-general': marginBottom,
			'margin-left-general': marginLeft,
			'margin-right-general': marginRight,
		}))(pageAttributes);

		expect(marginAttributes).toStrictEqual(expectMargin);
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

		const expectMargin = {
			'margin-top-general': 66,
			'margin-bottom-general': 66,
			'margin-left-general': 77,
			'margin-right-general': 77,
			'margin-unit-general': '%',
		};

		const pageAttributes = await getBlockAttributes();
		const marginAttributes = (({
			'margin-unit-general': marginUnit,
			'margin-top-general': marginTop,
			'margin-bottom-general': marginBottom,
			'margin-left-general': marginLeft,
			'margin-right-general': marginRight,
		}) => ({
			'margin-unit-general': marginUnit,
			'margin-top-general': marginTop,
			'margin-bottom-general': marginBottom,
			'margin-left-general': marginLeft,
			'margin-right-general': marginRight,
		}))(pageAttributes);

		expect(marginAttributes).toStrictEqual(expectMargin);

		await editAxisControl({
			page,
			instance: axisControlInstance,
			syncOption: 'none',
			values: ['66', '77', '55', '33'],
			unit: 'px',
		});

		const expectSyncMargin = {
			'margin-top-general': 66,
			'margin-bottom-general': 55,
			'margin-left-general': 33,
			'margin-right-general': 77,
			'margin-unit-general': 'px',
		};

		const pageSyncAttributes = await getBlockAttributes();
		const marginSyncAttributes = (({
			'margin-unit-general': marginUnit,
			'margin-top-general': marginTop,
			'margin-bottom-general': marginBottom,
			'margin-left-general': marginLeft,
			'margin-right-general': marginRight,
		}) => ({
			'margin-unit-general': marginUnit,
			'margin-top-general': marginTop,
			'margin-bottom-general': marginBottom,
			'margin-left-general': marginLeft,
			'margin-right-general': marginRight,
		}))(pageSyncAttributes);

		expect(marginSyncAttributes).toStrictEqual(expectSyncMargin);
	});
});
