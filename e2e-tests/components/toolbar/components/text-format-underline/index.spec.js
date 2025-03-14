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

describe('Text underline', () => {
	it('Check text underline', async () => {
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

		// select underline
		await page.$eval(
			'.toolbar-item__popover__font-options__wrap_family .toolbar-item__typography-control__extra-text-options .toolbar-item__underline',
			button => button.click()
		);

		expect(await getAttributes('text-decoration-xl')).toStrictEqual(
			'underline'
		);

		// Check changes in sidebar
		await openSidebarTab(page, 'style', 'typography');

		const textDecoration = await page.$eval(
			'.maxi-tabs-content .maxi-typography-control__decoration select',
			input => input.value
		);

		expect(textDecoration).toStrictEqual('underline');
	});
});
