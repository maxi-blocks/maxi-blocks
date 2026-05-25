/**
 * WordPress dependencies
 */
import { createNewPost } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import {
	openSidebarTab,
	changeResponsive,
	getBlockStyle,
	editAxisControl,
	getAttributes,
	insertMaxiBlock,
	updateAllBlockUniqueIds,
} from '../../utils';

/**
 * Helper to expand advanced position options if not already visible
 */
const expandAdvancedOptions = async page => {
	const positionControl = await page.$('.maxi-position-control');
	if (!positionControl) return;

	// Check if AxisControl is already visible
	const axisControlVisible = await positionControl.$(
		'.maxi-position-control__advanced-options .maxi-axis-control'
	);

	// Only click toggle if AxisControl is not visible
	if (!axisControlVisible) {
		const advancedToggle = await positionControl.$(
			'.maxi-position-control__advanced-toggle button'
		);
		if (advancedToggle) {
			await advancedToggle.click();
			await page.waitForTimeout(200);
		}
	}
};

/**
 * Helper to get AxisControl instance after expanding advanced options
 */
const getAxisControl = async page => {
	await expandAdvancedOptions(page);
	return page.$(
		'.maxi-position-control .maxi-position-control__advanced-options .maxi-axis-control'
	);
};

describe('PositionControl', () => {
	it('Checking position control', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Text Maxi');
		await updateAllBlockUniqueIds(page);

		const accordionPanel = await openSidebarTab(
			page,
			'advanced',
			'position'
		);
		const selectPosition = await accordionPanel.$(
			'.maxi-position-control .maxi-base-control__field select'
		);
		await selectPosition.select('relative');

		// Wait for UI to update after position change
		await page.waitForTimeout(300);

		// Expand advanced options and get AxisControl
		const axisControl = await getAxisControl(page);

		await editAxisControl({
			page,
			instance: axisControl,
			syncOption: 'all',
			values: '56',
			unit: '%',
		});

		const expectPosition = {
			'position-top-general': '56',
			'position-bottom-general': '56',
			'position-left-general': '56',
			'position-right-general': '56',
			'position-top-unit-general': '%',
			'position-bottom-unit-general': '%',
			'position-left-unit-general': '%',
			'position-right-unit-general': '%',
		};

		const positionResult = await getAttributes([
			'position-top-general',
			'position-bottom-general',
			'position-left-general',
			'position-right-general',
			'position-top-unit-general',
			'position-bottom-unit-general',
			'position-left-unit-general',
			'position-right-unit-general',
		]);

		expect(positionResult).toStrictEqual(expectPosition);

		// check static
		await selectPosition.select('static');
		await page.waitForTimeout(300);

		// For static position, AxisControl might still be visible
		const axisControlStatic = await getAxisControl(page);

		await editAxisControl({
			page,
			instance: axisControlStatic,
			syncOption: 'all',
			values: '56',
		});

		expect(await getAttributes('position-top-general')).toStrictEqual('56');
		expect(await getBlockStyle(page)).toMatchSnapshot();

		await selectPosition.select('relative');
		await page.waitForTimeout(300);
	});

	it('Check Responsive position control', async () => {
		await changeResponsive(page, 's');

		const positionSelector = await page.$eval(
			'.maxi-position-control .maxi-base-control__field .maxi-select-control__input',
			input => input.value
		);

		expect(positionSelector).toStrictEqual('relative');

		// Expand advanced options to see AxisControl values
		await expandAdvancedOptions(page);

		const positionGeneralValue = await page.$$eval(
			'.maxi-position-control__advanced-options .maxi-axis-control .maxi-advanced-number-control input',
			input => input[0].placeholder
		);

		expect(positionGeneralValue).toStrictEqual('56');

		const positionGeneralUnit = await page.$eval(
			'.maxi-position-control__advanced-options .maxi-dimensions-control__units select',
			input => input.value
		);
		expect(positionGeneralUnit).toStrictEqual('%');

		// responsive S
		const selectSPosition = await page.$(
			'.maxi-position-control .maxi-base-control__field select'
		);
		await selectSPosition.select('fixed');
		await page.waitForTimeout(300);

		const axisControlS = await getAxisControl(page);

		await editAxisControl({
			page,
			instance: axisControlS,
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
			'.maxi-position-control__advanced-options .maxi-axis-control .maxi-advanced-number-control input',
			input => input[0].placeholder
		);

		expect(positionSGeneralValue).toStrictEqual('87');

		const positionSGeneralUnit = await page.$eval(
			'.maxi-position-control__advanced-options .maxi-dimensions-control__units select',
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

		// Expand advanced options for XS
		await expandAdvancedOptions(page);

		const positionXsGeneralValue = await page.$$eval(
			'.maxi-position-control__advanced-options .maxi-axis-control .maxi-advanced-number-control input',
			input => input[0].placeholder
		);

		expect(positionXsGeneralValue).toStrictEqual('87');

		const positionXsGeneralUnit = await page.$eval(
			'.maxi-position-control__advanced-options .maxi-dimensions-control__units select',
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

		// Expand advanced options for M
		await expandAdvancedOptions(page);

		const positionMGeneralValue = await page.$$eval(
			'.maxi-position-control__advanced-options .maxi-axis-control .maxi-advanced-number-control input',
			input => input[0].placeholder
		);

		expect(positionMGeneralValue).toStrictEqual('56');

		const positionMGeneralUnit = await page.$eval(
			'.maxi-position-control__advanced-options .maxi-dimensions-control__units select',
			input => input.value
		);
		expect(positionMGeneralUnit).toStrictEqual('%');

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Check position static and sticky', async () => {
		await changeResponsive(page, 'base');

		const accordionPanel = await openSidebarTab(
			page,
			'advanced',
			'position'
		);

		const selectPosition = await accordionPanel.$(
			'.maxi-position-control .maxi-base-control__field select'
		);

		// check static
		await selectPosition.select('static');
		await page.waitForTimeout(300);

		const axisControlStatic = await getAxisControl(page);

		await editAxisControl({
			page,
			instance: axisControlStatic,
			syncOption: 'all',
			values: '44',
		});

		expect(await getAttributes('position-top-general')).toStrictEqual('44');
		expect(await getBlockStyle(page)).toMatchSnapshot();

		await selectPosition.select('sticky');
		await page.waitForTimeout(300);

		const axisControlSticky = await getAxisControl(page);

		await editAxisControl({
			page,
			instance: axisControlSticky,
			syncOption: 'all',
			values: '12',
		});

		expect(await getAttributes('position-top-general')).toStrictEqual('12');
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
