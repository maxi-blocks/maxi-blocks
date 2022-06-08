/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { openSidebarTab, checkIndicators } from '../../utils';

describe('Inspector position', () => {
	it('Check text position inspector', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		await openSidebarTab(page, 'advanced', 'position');

		const selectPosition = await page.$(
			'.maxi-position-control .maxi-base-control__field select'
		);
		await selectPosition.select('relative');

		const expectResult = await checkIndicators({
			page,
			indicators: 'Position',
		});

		expect(expectResult).toBeTruthy();
	});
});
