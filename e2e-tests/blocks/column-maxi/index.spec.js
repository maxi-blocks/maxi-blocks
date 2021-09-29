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
import { getBlockAttributes, openSidebar } from '../../utils';

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
	});
});
