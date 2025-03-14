/**
 * WordPress dependencies
 */
import {
	createNewPost,
	selectBlockByClientId,
	pressKeyWithModifier,
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
	updateAllBlockUniqueIds,
} from '../../utils';

describe('Column Maxi', () => {
	it('Column Maxi does not break', async () => {
		await createNewPost();
		await page.waitForTimeout(1500);
		await insertMaxiBlock(page, 'Container Maxi');

		await page.waitForSelector('.maxi-row-block__template button');
		await page.waitForTimeout(100);
		await page.$eval('.maxi-row-block__template button', button =>
			button.click()
		);
		await page.waitForTimeout(300);

		await page.waitForSelector('.maxi-column-block');

		await updateAllBlockUniqueIds(page);

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

		await pressKeyWithModifier('ctrl', 'a');
		await page.keyboard.type('50', { delay: 350 });

		expect(await getAttributes('column-size-xl')).toStrictEqual(50);

		const selector = await page.$(
			'.maxi-accordion-control__item__panel .maxi-base-control__field select'
		);
		await selector.select('center');

		expect(await getAttributes('justify-content-xl')).toStrictEqual(
			'center'
		);

		// responsive S
		await changeResponsive(page, 's');
		const columnSizeInput = await page.$eval(
			'.maxi-advanced-number-control .maxi-advanced-number-control__value',
			select => select.value
		);

		expect(columnSizeInput).toStrictEqual('100');

		await page.$eval(
			'.maxi-advanced-number-control .maxi-advanced-number-control__value',
			input => input.focus()
		);

		await pressKeyWithModifier('ctrl', 'a');
		await page.keyboard.type('9', { delay: 350 });

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

		await page.waitForTimeout(500);

		expect(responsiveMOption).toStrictEqual('100');

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Check column Border', async () => {
		await createNewPost();
		await page.waitForTimeout(1500);
		await insertMaxiBlock(page, 'Container Maxi');

		await page.waitForSelector('.maxi-row-block__template button');
		await page.waitForTimeout(200);
		await page.$$eval('.maxi-row-block__template button', button =>
			button[6].click()
		);
		await page.waitForTimeout(300);
		await page.waitForSelector('.maxi-column-block');

		await updateAllBlockUniqueIds(page);

		await page.waitForTimeout(500);

		// Ensure we select the first Column
		await page.$$eval('.maxi-container-block .maxi-column-block', block =>
			block[2].focus()
		);

		await page.waitForTimeout(200);

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
			'border-bottom-left-radius-xl': 25,
			'border-bottom-right-radius-xl': 24,
			'border-top-left-radius-xl': 16,
			'border-top-right-radius-xl': 15,
		};
		const borderResult = await getAttributes([
			'border-bottom-left-radius-xl',
			'border-bottom-right-radius-xl',
			'border-top-left-radius-xl',
			'border-top-right-radius-xl',
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
			'border-bottom-left-radius-xl-hover': 12,
			'border-bottom-right-radius-xl-hover': 55,
			'border-top-left-radius-xl-hover': 33,
			'border-top-right-radius-xl-hover': 25,
		};
		const borderHoverResult = await getAttributes([
			'border-bottom-left-radius-xl-hover',
			'border-bottom-right-radius-xl-hover',
			'border-top-left-radius-xl-hover',
			'border-top-right-radius-xl-hover',
		]);
		expect(borderHoverResult).toStrictEqual(expectHoverBorder);

		// check first column
		await page.waitForSelector('.maxi-column-block');
		await page.waitForTimeout(1500);

		await page.$$eval('.maxi-container-block .maxi-column-block', block =>
			block[0].focus()
		);

		await page.waitForTimeout(200);

		expect(await getBlockStyle(page)).toMatchSnapshot();

		// check last column
		await page.waitForTimeout(300);
		await page.waitForSelector('.maxi-container-block .maxi-column-block');
		await page.waitForTimeout(500);

		await page.$$eval('.maxi-container-block .maxi-column-block', block =>
			block[2].focus()
		);

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Column Maxi Custom CSS', async () => {
		await expect(await addCustomCSS(page)).toMatchSnapshot();
	}, 500000);
});
