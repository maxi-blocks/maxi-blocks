/**
 * WordPress dependencies
 */
import {
	createNewPost,
	pressKeyTimes,
	selectBlockByClientId,
} from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import {
	addCustomCSS,
	changeResponsive,
	editAxisControl,
	getAttributes,
	getBlockStyle,
	getEditedPostContent,
	openSidebarTab,
	insertMaxiBlock,
} from '../../utils';

describe('Column Maxi', () => {
	it('Column Maxi does not break', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Container Maxi');

		await page.$eval('.maxi-row-block__template button', button =>
			button.click()
		);
		await page.waitForSelector('.maxi-column-block');

		expect(await getEditedPostContent(page)).toMatchSnapshot();
	});

	it('Check column settings', async () => {
		const columnClientId = await page.$eval('.maxi-column-block', column =>
			column.getAttribute('data-block')
		);
		await selectBlockByClientId(columnClientId);

		await openSidebarTab(page, 'style', 'column settings');

		await page.$eval(
			'.maxi-advanced-number-control .maxi-advanced-number-control__value',
			input => input.focus()
		);

		await pressKeyTimes('Backspace', '3');

		await page.keyboard.type('50');

		expect(await getAttributes('column-size-g')).toStrictEqual(50);

		const selector = await page.$(
			'.maxi-accordion-control__item__panel .maxi-base-control__field select'
		);
		await selector.select('center');

		expect(await getAttributes('justify-content-g')).toStrictEqual(
			'center'
		);

		// responsive S
		await changeResponsive(page, 's');
		const columnSizeInput = await page.$eval(
			'.maxi-advanced-number-control .maxi-advanced-number-control__value',
			select => select.value
		);

		expect(columnSizeInput).toStrictEqual('50');

		await page.$eval(
			'.maxi-advanced-number-control .maxi-advanced-number-control__value',
			input => input.focus()
		);

		await pressKeyTimes('Backspace', '2');
		await page.keyboard.type('9');

		const responsiveSOption = await page.$eval(
			'.maxi-advanced-number-control .maxi-advanced-number-control__value',
			select => select.value
		);

		expect(responsiveSOption).toStrictEqual('9');

		expect(await getAttributes('column-size-s')).toStrictEqual(9);

		// responsive xs
		await changeResponsive(page, 'xs');

		const responsiveXsOption = await page.$eval(
			'.maxi-advanced-number-control .maxi-advanced-number-control__value',
			select => select.value
		);

		expect(responsiveXsOption).toStrictEqual('9');

		// responsive m
		await changeResponsive(page, 'm');

		const responsiveMOption = await page.$eval(
			'.maxi-advanced-number-control .maxi-advanced-number-control__value',
			select => select.value
		);

		expect(responsiveMOption).toStrictEqual('50');

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Check column Border', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Container Maxi');

		await page.$$eval('.maxi-row-block__template button', button =>
			button[6].click()
		);
		await page.waitForSelector('.maxi-column-block');

		// Ensure we select the first Column
		await page.$$eval('.maxi-container-block .maxi-column-block', block =>
			block[2].focus()
		);

		const borderAccordion = await openSidebarTab(page, 'style', 'border');

		const axisControlInstance = await borderAccordion.$(
			'.maxi-axis-control__border'
		);

		await editAxisControl({
			page,
			instance: axisControlInstance,
			syncOption: 'none',
			values: ['16', '15', '24', '25'],
			unit: '%',
		});

		const expectBorder = {
			'border-radius-bottom-left-g': 25,
			'border-radius-bottom-right-g': 24,
			'border-radius-top-left-g': 16,
			'border-radius-top-right-g': 15,
		};
		const borderResult = await getAttributes([
			'border-radius-bottom-left-g',
			'border-radius-bottom-right-g',
			'border-radius-top-left-g',
			'border-radius-top-right-g',
		]);

		expect(borderResult).toStrictEqual(expectBorder);

		// check hover border
		await borderAccordion.$$eval(
			'.maxi-accordion-control__item__panel .maxi-settingstab-control .maxi-tabs-control button',
			button => button[1].click()
		);

		await borderAccordion.$eval(
			'.maxi-border-status-hover .maxi-toggle-switch__toggle input',
			button => button.click()
		);

		const axisControlHoverInstance = await borderAccordion.$(
			'.maxi-axis-control__border'
		);

		await editAxisControl({
			page,
			instance: axisControlHoverInstance,
			syncOption: 'none',
			values: ['33', '25', '55', '12'],
			unit: '%',
		});

		const expectHoverBorder = {
			'border-radius-bottom-left-g-hover': 12,
			'border-radius-bottom-right-g-hover': 55,
			'border-radius-top-left-g-hover': 33,
			'border-radius-top-right-g-hover': 25,
		};
		const borderHoverResult = await getAttributes([
			'border-radius-bottom-left-g-hover',
			'border-radius-bottom-right-g-hover',
			'border-radius-top-left-g-hover',
			'border-radius-top-right-g-hover',
		]);
		expect(borderHoverResult).toStrictEqual(expectHoverBorder);

		// check first column
		await page.waitForSelector('.maxi-column-block');
		await page.$$eval('.maxi-container-block .maxi-column-block', block =>
			block[0].focus()
		);

		expect(await getBlockStyle(page)).toMatchSnapshot();

		// check last column
		await page.waitForSelector('.maxi-container-block .maxi-column-block');
		await page.$$eval('.maxi-container-block .maxi-column-block', block =>
			block[2].focus()
		);

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Column Maxi Custom CSS', async () => {
		await expect(await addCustomCSS(page)).toMatchSnapshot();
	}, 500000);
});
