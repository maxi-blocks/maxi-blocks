/**
 * WordPress
 */
import {
	createNewPost,
	insertBlock,
	getEditedPostContent,
	pressKeyTimes,
} from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import {
	openSidebarTab,
	changeResponsive,
	getAttributes,
	getBlockStyle,
	addCustomCSS,
} from '../../utils';

describe('Column Maxi', () => {
	it('Column Maxi does not break', async () => {
		await createNewPost();
		await insertBlock('Container Maxi');

		await page.$$eval('.maxi-row-block__template button', button =>
			button[0].click()
		);

		expect(await getEditedPostContent()).toMatchSnapshot();
	});

	it('check column settings', async () => {
		const column = await page.$('.maxi-column-block');
		// need an offset as if not click on the appender and opens the menu
		await column.click({ offset: { x: 0, y: 0 } });

		await openSidebarTab(page, 'style', 'column settings');

		await page.$eval(
			'.maxi-advanced-number-control .maxi-advanced-number-control__value',
			input => input.focus()
		);

		await pressKeyTimes('Backspace', '3');

		await page.keyboard.type('50');

		expect(await getAttributes('column-size-general')).toStrictEqual(50);

		const selector = await page.$(
			'.maxi-accordion-control__item__panel .maxi-base-control__field select'
		);
		await selector.select('center');

		expect(await getAttributes('verticalAlign')).toStrictEqual('center');

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

		await pressKeyTimes('Backspace', '2');
		await page.keyboard.type('9');

		const responsiveSOption = await page.$eval(
			'.maxi-advanced-number-control .maxi-advanced-number-control__value',
			select => select.value
		);

		expect(responsiveSOption).toStrictEqual('19');

		expect(await getAttributes('column-size-s')).toStrictEqual(19);

		// responsive xs
		await changeResponsive(page, 'xs');

		const responsiveXsOption = await page.$eval(
			'.maxi-advanced-number-control .maxi-advanced-number-control__value',
			select => select.value
		);

		expect(responsiveXsOption).toStrictEqual('19');

		// responsive m
		await changeResponsive(page, 'm');

		const responsiveMOption = await page.$eval(
			'.maxi-advanced-number-control .maxi-advanced-number-control__value',
			select => select.value
		);

		expect(responsiveMOption).toStrictEqual('100');
	});

	it('check responsive column size', async () => {
		await changeResponsive(page, 'base');

		await page.$eval(
			'.maxi-advanced-number-control .maxi-advanced-number-control__value',
			input => input.focus()
		);

		await pressKeyTimes('Backspace', '3');
		await page.keyboard.type('50');

		expect(await getAttributes('column-size-general')).toStrictEqual(50);

		// responsive m
		await changeResponsive(page, 'm');

		const responsiveMOption = await page.$eval(
			'.maxi-advanced-number-control .maxi-advanced-number-control__value',
			select => select.value
		);

		expect(responsiveMOption).toStrictEqual('100');

		// responsive S
		await changeResponsive(page, 's');

		await page.$eval(
			'.maxi-advanced-number-control .maxi-advanced-number-control__value',
			input => input.focus()
		);

		await pressKeyTimes('Backspace', '1');
		await page.keyboard.type('7');

		expect(await getAttributes('column-size-s')).toStrictEqual(17);

		// responsive XS
		await changeResponsive(page, 'xs');

		const responsiveXsOption = await page.$eval(
			'.maxi-advanced-number-control .maxi-advanced-number-control__value',
			select => select.value
		);

		expect(responsiveXsOption).toStrictEqual('17');

		// responsive M
		await changeResponsive(page, 'm');

		const returnToMResponsive = await page.$eval(
			'.maxi-advanced-number-control .maxi-advanced-number-control__value',
			select => select.value
		);

		expect(returnToMResponsive).toStrictEqual('100');

		// responsive L
		await changeResponsive(page, 'l');

		const responsiveL = await page.$eval(
			'.maxi-advanced-number-control .maxi-advanced-number-control__value',
			select => select.value
		);

		expect(responsiveL).toStrictEqual('50');

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
