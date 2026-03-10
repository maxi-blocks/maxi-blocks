/**
 * WordPress dependencies
 */
import { createNewPost } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	getAttributes,
	openSidebarTab,
	insertMaxiBlock,
	updateAllBlockUniqueIds,
	getEditorFrame,
} from '../../../../utils';

describe('Column pattern from Toolbar', () => {
	it('Test column pattern from toolbar', async () => {
		await createNewPost();
		await page.waitForTimeout(1500);
		await insertMaxiBlock(page, 'Container Maxi');
		await updateAllBlockUniqueIds(page);

		// Wait for toolbar to be visible
		await page.waitForSelector('.toolbar-wrapper');

		const frame = await getEditorFrame(page);
		await frame.waitForSelector('.maxi-row-block__template button');
		await page.waitForTimeout(500);
		await frame.$$eval('.maxi-row-block__template button', button =>
			button[0].click()
		);
		await frame.waitForSelector('.maxi-column-block');

		expect(await getAttributes('row-pattern-general')).toStrictEqual('1');

		await page.waitForTimeout(500);
		// toolbar patterns
		await page.$eval(
			'.toolbar-wrapper .toolbar-item__button.toolbar-item__column-pattern',
			button => button.click()
		);

		await page.waitForTimeout(500);
		// change column pattern
		await page.$$eval(
			'.toolbar-item__column-pattern__popover .components-column-pattern__templates button',
			button => button[1].click()
		);

		expect(await getAttributes('row-pattern-general')).toStrictEqual('1-1');

		// Check changes in sidebar
		await openSidebarTab(page, 'style', 'column picker');

		const columnNumber = await page.$eval(
			'.maxi-responsive-tabs-control .maxi-tabs-content .components-column-pattern input',
			select => select.value
		);

		expect(columnNumber).toStrictEqual('2');
	});
});
