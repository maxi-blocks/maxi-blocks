/**
 * WordPress dependencies
 */
import {
	createNewPost,
	selectBlockByClientId,
} from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	getAttributes,
	openSidebarTab,
	insertMaxiBlock,
	updateAllBlockUniqueIds,
} from '../../../../utils';

describe('Vertical align align from Toolbar', () => {
	it('Test vertical align align from toolbar', async () => {
		await createNewPost();
		await page.waitForTimeout(1500);
		await insertMaxiBlock(page, 'Container Maxi');
		await updateAllBlockUniqueIds(page);

		// Wait for toolbar to be visible
		await page.waitForSelector('.toolbar-wrapper');

		await page.waitForSelector('.maxi-row-block__template');

		await page.waitForSelector('.maxi-row-block__template button');
		await page.waitForTimeout(100);
		await page.$$eval('.maxi-row-block__template button', button =>
			button[0].click()
		);
		await page.waitForSelector('.maxi-column-block');

		const columnClientId = await page.$eval('.maxi-column-block', column =>
			column.getAttribute('data-block')
		);
		await selectBlockByClientId(columnClientId);

		await page.waitForTimeout(500);

		// edit vertical align
		await page.$eval(
			'.toolbar-wrapper .toolbar-item__button.toolbar-item__vertical-align',
			button => button.click()
		);

		// change vertical align
		const selector = await page.$(
			'.toolbar-item__vertical-align__popover select'
		);

		await selector.select('center');

		expect(await getAttributes('justify-content-xl')).toStrictEqual(
			'center'
		);

		// Check changes in sidebar
		await openSidebarTab(page, 'style', 'column settings');

		const verticalSelector = await page.$eval(
			'.maxi-tabs-content .maxi-base-control select',
			select => select.value
		);

		expect(verticalSelector).toStrictEqual('center');
	});
});
