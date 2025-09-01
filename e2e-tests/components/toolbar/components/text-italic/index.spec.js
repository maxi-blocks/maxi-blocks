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

describe('Text italic', () => {
	it('Check text italic', async () => {
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

		// select italic
		await page.$eval(
			'.toolbar-item__popover__font-options__wrap_family .toolbar-item__typography-control__extra-text-options .toolbar-item__italic',
			button => button.click()
		);

		expect(await getAttributes('font-style-general')).toStrictEqual(
			'italic'
		);

		// Check changes in sidebar
		await openSidebarTab(page, 'style', 'typography');

		const italicButton = await page.$eval(
			'.maxi-tabs-content .maxi-typography-control__format-button--italic',
			button => button.getAttribute('aria-pressed')
		);

		expect(italicButton).toStrictEqual('true');
	});
});
