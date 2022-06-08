/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { openSidebarTab, checkIndicators } from '../../utils';

describe('Inspector margin padding', () => {
	it('Check group margin padding inspector', async () => {
		await createNewPost();
		await insertBlock('Group Maxi');
		await openSidebarTab(page, 'style', 'margin padding');

		await page.$$eval(
			'.maxi-axis-control__margin .maxi-axis-control__header button',
			button => button[1].click()
		);

		const expectResult = await checkIndicators({
			page,
			indicators: 'Margin / Padding',
		});

		expect(expectResult).toBeTruthy();
	});
});
