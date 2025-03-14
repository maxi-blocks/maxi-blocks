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

		await editAxisControl({
			page,
			instance: await page.$('.maxi-position-control .maxi-axis-control'),
			syncOption: 'all',
			values: '56',
			unit: '%',
		});

		const expectPosition = {
			'position-top-xl': '56',
			'position-bottom-xl': '56',
			'position-left-xl': '56',
			'position-right-xl': '56',
			'position-top-unit-xl': '%',
			'position-bottom-unit-xl': '%',
			'position-left-unit-xl': '%',
			'position-right-unit-xl': '%',
		};

		const positionResult = await getAttributes([
			'position-top-xl',
			'position-bottom-xl',
			'position-left-xl',
			'position-right-xl',
			'position-top-unit-xl',
			'position-bottom-unit-xl',
			'position-left-unit-xl',
			'position-right-unit-xl',
		]);

		expect(positionResult).toStrictEqual(expectPosition);

		// check static
		await selectPosition.select('static');

		await editAxisControl({
			page,
			instance: await page.$('.maxi-position-control .maxi-axis-control'),
			syncOption: 'all',
			values: '56',
		});

		expect(await getAttributes('position-top-xl')).toStrictEqual('56');
		expect(await getBlockStyle(page)).toMatchSnapshot();

		await selectPosition.select('relative');
	});

	it('Check Responsive position control', async () => {
		await changeResponsive(page, 's');
		const positionSelector = await page.$eval(
			'.maxi-position-control .maxi-base-control__field .maxi-select-control__input',
			input => input.value
		);

		expect(positionSelector).toStrictEqual('relative');

		const positionGeneralValue = await page.$$eval(
			'.maxi-axis-control .maxi-advanced-number-control input',
			input => input[0].placeholder
		);

		expect(positionGeneralValue).toStrictEqual('56');

		const positionGeneralUnit = await page.$eval(
			'.maxi-dimensions-control__units select',
			input => input.value
		);
		expect(positionGeneralUnit).toStrictEqual('%');

		// responsive S
		const selectSPosition = await page.$(
			'.maxi-position-control .maxi-base-control__field select'
		);
		await selectSPosition.select('fixed');

		await editAxisControl({
			page,
			instance: await page.$('.maxi-position-control .maxi-axis-control'),
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
			'.maxi-axis-control .maxi-advanced-number-control input',
			input => input[0].placeholder
		);

		expect(positionSGeneralValue).toStrictEqual('87');

		const positionSGeneralUnit = await page.$eval(
			'.maxi-dimensions-control__units select',
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
			'.maxi-axis-control .maxi-advanced-number-control input',
			input => input[0].placeholder
		);

		expect(positionXsGeneralValue).toStrictEqual('87');

		const positionXsGeneralUnit = await page.$eval(
			'.maxi-dimensions-control__units select',
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
			'.maxi-axis-control .maxi-advanced-number-control input',
			input => input[0].placeholder
		);

		expect(positionMGeneralValue).toStrictEqual('56');

		const positionMGeneralUnit = await page.$eval(
			'.maxi-dimensions-control__units select',
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

		await editAxisControl({
			page,
			instance: await page.$('.maxi-position-control .maxi-axis-control'),
			syncOption: 'all',
			values: '44',
		});

		expect(await getAttributes('position-top-xl')).toStrictEqual('44');
		expect(await getBlockStyle(page)).toMatchSnapshot();

		await selectPosition.select('sticky');

		await editAxisControl({
			page,
			instance: await page.$('.maxi-position-control .maxi-axis-control'),
			syncOption: 'all',
			values: '12',
		});

		expect(await getAttributes('position-top-xl')).toStrictEqual('12');
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
