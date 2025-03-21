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

describe('Divider alignment from Toolbar', () => {
	it('Test divider alignment from toolbar', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Divider Maxi');

		await updateAllBlockUniqueIds(page);

		// Wait for toolbar to be visible
		await page.waitForSelector('.toolbar-wrapper');

		// edit divider alignment
		await page.$eval(
			'.toolbar-wrapper .toolbar-item__button.toolbar-item__divider-alignment',
			button => button.click()
		);

		// select divider alignment style
		await page.waitForSelector(
			'.toolbar-item__divider-alignment__popover .maxi-base-control select'
		);
		const selector = await page.$(
			'.toolbar-item__divider-alignment__popover .maxi-base-control select'
		);

		await selector.select('vertical');

		expect(await getAttributes('line-orientation-xl')).toStrictEqual(
			'vertical'
		);

		// Check changes in sidebar
		const accordionPanel = await openSidebarTab(page, 'style', 'alignment');

		const alignmentOrientation = await accordionPanel.$eval(
			'.line-orientation-selector select',
			select => select.value
		);

		expect(alignmentOrientation).toStrictEqual('vertical');
	});
});
