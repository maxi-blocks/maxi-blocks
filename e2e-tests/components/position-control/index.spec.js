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
	getBlockStyle,
	editAxisControl,
} from '../../utils';

describe('PositionControl', () => {
	it('Checking position control', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');

		const accordionPanel = await openSidebarTab(
			page,
			'advanced',
			'position'
		);
		const selectPosition = await accordionPanel.$(
			'.maxi-position-control .maxi-base-control__field select'
		);
		await selectPosition.select('relative');

		const axisControlInstance = await page.$(
			'.maxi-position-control .maxi-axis-control'
		);
		await editAxisControl({
			page,
			instance: axisControlInstance,
			syncOption: 'all',
			values: '56',
			unit: '%',
		});

		const expectPosition = {
			'position-top-general': 56,
			'position-bottom-general': 56,
			'position-left-general': 56,
			'position-right-general': 56,
			'position-unit-general': '%',
		};

		const pageAttributes = await getBlockAttributes();
		const positionAttributes = (({
			'position-unit-general': positionUnit,
			'position-top-general': positionTop,
			'position-bottom-general': positionBottom,
			'position-left-general': positionLeft,
			'position-right-general': positionRight,
		}) => ({
			'position-unit-general': positionUnit,
			'position-top-general': positionTop,
			'position-bottom-general': positionBottom,
			'position-left-general': positionLeft,
			'position-right-general': positionRight,
		}))(pageAttributes);

		expect(positionAttributes).toStrictEqual(expectPosition);
	});

	it('Check Responsive position control', async () => {
		await changeResponsive(page, 's');
		const positionSelector = await page.$eval(
			'.maxi-position-control .maxi-base-control__field .maxi-select-control__input',
			input => input.value
		);

		expect(positionSelector).toStrictEqual('relative');

		const positionGeneralValue = await page.$$eval(
			'.maxi-axis-control__disable-auto .maxi-advanced-number-control input',
			input => input[0].placeholder
		);

		expect(positionGeneralValue).toStrictEqual('56');

		const positionGeneralUnit = await page.$eval(
			'.maxi-axis-control__unit-header select',
			input => input.value
		);
		expect(positionGeneralUnit).toStrictEqual('%');

		// responsive S
		const selectSPosition = await page.$(
			'.maxi-position-control .maxi-base-control__field select'
		);
		await selectSPosition.select('fixed');

		const axisControlInstance = await page.$(
			'.maxi-position-control .maxi-axis-control'
		);
		await editAxisControl({
			page,
			instance: axisControlInstance,
			syncOption: 'all',
			values: '87',
			unit: 'px',
		});

		const positionSSelector = await page.$eval(
			'.maxi-position-control .maxi-base-control__field .maxi-select-control__input',
			input => input.value
		);

		expect(positionSSelector).toStrictEqual('fixed');

		const positionSGeneralValue = await page.$$eval(
			'.maxi-axis-control__disable-auto .maxi-advanced-number-control input',
			input => input[0].placeholder
		);

		expect(positionSGeneralValue).toStrictEqual('87');

		const positionSGeneralUnit = await page.$eval(
			'.maxi-axis-control__unit-header select',
			input => input.value
		);
		expect(positionSGeneralUnit).toStrictEqual('px');

		// responsive XS
		await changeResponsive(page, 'xs');

		const positionXsSelector = await page.$eval(
			'.maxi-position-control .maxi-base-control__field .maxi-select-control__input',
			input => input.value
		);

		expect(positionXsSelector).toStrictEqual('fixed');

		const positionXsGeneralValue = await page.$$eval(
			'.maxi-axis-control__disable-auto .maxi-advanced-number-control input',
			input => input[0].placeholder
		);

		expect(positionXsGeneralValue).toStrictEqual('87');

		const positionXsGeneralUnit = await page.$eval(
			'.maxi-axis-control__unit-header select',
			input => input.value
		);
		expect(positionXsGeneralUnit).toStrictEqual('px');

		// responsive M
		await changeResponsive(page, 'm');

		const positionMSelector = await page.$eval(
			'.maxi-position-control .maxi-base-control__field .maxi-select-control__input',
			input => input.value
		);

		expect(positionMSelector).toStrictEqual('relative');

		const positionMGeneralValue = await page.$$eval(
			'.maxi-axis-control__disable-auto .maxi-advanced-number-control input',
			input => input[0].placeholder
		);

		expect(positionMGeneralValue).toStrictEqual('56');

		const positionMGeneralUnit = await page.$eval(
			'.maxi-axis-control__unit-header select',
			input => input.value
		);
		expect(positionMGeneralUnit).toStrictEqual('%');

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
