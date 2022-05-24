/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import { getAttributes, openSidebarTab } from '../../../../utils';

describe('Divider alignment from Toolbar', () => {
	it('Test divider alignment from toolbar', async () => {
		await createNewPost();
		await page.waitForTimeout(1000);
		await insertBlock('Divider Maxi');

		// edit divider alignment
		await page.$eval(
			'.toolbar-wrapper .toolbar-item__button.toolbar-item__divider-alignment',
			button => button.click()
		);

		// select divider alignment style
		const selector = await page.$(
			'.toolbar-item__divider-alignment__popover .maxi-base-control select'
		);

		await selector.select('vertical');

		expect(await getAttributes('line-orientation-general')).toStrictEqual(
			'vertical'
		);

		// Check changes in sidebar
		const accordionPanel = await openSidebarTab(page, 'style', 'alignment');

		const alignmentOrientation = await accordionPanel.$$eval(
			'.maxi-base-control select',
			select => select[0].value
		);

		expect(alignmentOrientation).toStrictEqual('vertical');
	});
});
