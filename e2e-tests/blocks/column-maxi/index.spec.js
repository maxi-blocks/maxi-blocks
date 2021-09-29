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
import { getBlockAttributes, openSidebar, changeResponsive } from '../../utils';

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
		await page.$eval(
			'.block-editor-block-list__layout .block-editor-inserter',
			select => select.click()
		);
		await openSidebar(page, 'column settings');

		await page.$eval(
			'.maxi-advanced-number-control .maxi-advanced-number-control__value',
			input => input.focus()
		);

		await pressKeyTimes('Backspace', '3');
		await page.keyboard.type('50');

		const attributes = await getBlockAttributes();
		const columnSize = attributes['column-size-general'];

		expect(columnSize).toStrictEqual(50);

		const selector = await page.$(
			'.maxi-accordion-control__item__panel .maxi-base-control__field select'
		);
		await selector.select('center');

		const verticalAttributes = await getBlockAttributes();
		expect(verticalAttributes.verticalAlign).toStrictEqual('center');

		// responsive S
		await changeResponsive(page, 's');
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

		const expectAttributes = await getBlockAttributes();
		const position = expectAttributes['column-size-s'];

		expect(position).toStrictEqual(19);

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
});
