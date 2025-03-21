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
} from '../../../../utils';

describe('Text bold', () => {
	it('Check text bold', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Text Maxi');

		await updateAllBlockUniqueIds(page);

		// Wait for toolbar to be visible
		await page.waitForSelector('.toolbar-wrapper');

		// open editor
		await page.$eval(
			'.toolbar-item__typography-control .toolbar-item__button',
			button => button.click()
		);

		// select bold
		await page.$eval(
			'.toolbar-item__popover__font-options__wrap_family .toolbar-item__typography-control__extra-text-options .toolbar-item__bold',
			button => button.click()
		);

		expect(await getAttributes('font-weight-xl')).toStrictEqual(700);

		// Check changes in sidebar
		await openSidebarTab(page, 'style', 'typography');
		const bold = await page.$eval(
			'.maxi-tabs-content .maxi-typography-control__weight select',
			input => input.value
		);

		expect(bold).toStrictEqual('700');
	});
});
