/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { openSidebarTab, checkIndicators } from '../../utils';

describe('Inspector responsive', () => {
	it('Check text responsive inspector', async () => {
		await createNewPost();
		await insertBlock('Container Maxi');
		await openSidebarTab(page, 'advanced', 'scroll effects');

		const selector = await page.$(
			'.maxi-responsive-tabs-control .maxi-scroll-effects-control .maxi-base-control select'
		);

		await selector.select('2');

		const expectResult = await checkIndicators({
			page,
			indicators: 'Scroll effects',
		});

		expect(expectResult).toBeTruthy();
	});
});
