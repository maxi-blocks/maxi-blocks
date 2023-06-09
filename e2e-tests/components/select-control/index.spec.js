/**
 * WordPress dependencies
 */
import { createNewPost } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { openSidebarTab, getAttributes, insertMaxiBlock } from '../../utils';

describe('SelectControl', () => {
	it('Check select control', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Text Maxi');
		const accordionPanel = await openSidebarTab(page, 'style', 'border');

		const selector = await accordionPanel.$(
			'.maxi-tabs-content .maxi-border-control .maxi-base-control__field select'
		);
		await selector.select('dotted');

		expect(await getAttributes('bo_s-g')).toStrictEqual('dotted');

		// Reset
		await page.$eval(
			'.maxi-tabs-content .maxi-border-control .maxi-select-control .maxi-reset-button',
			button => button.click()
		);

		expect(await getAttributes('bo_s-g')).toStrictEqual('none');
	});
});
