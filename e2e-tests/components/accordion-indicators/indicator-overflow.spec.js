/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { openSidebarTab, checkIndicators } from '../../utils';

describe('Inspector overflow', () => {
	it('Check text overflow inspector', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		await openSidebarTab(page, 'advanced', 'overflow');

		const selectorX = await page.$$('.maxi-overflow-control select');

		await selectorX[0].select('hidden');

		const expectResult = await checkIndicators({
			page,
			indicators: 'Overflow',
		});

		expect(expectResult).toBeTruthy();
	});
});
