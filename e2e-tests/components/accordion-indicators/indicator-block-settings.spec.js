import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { openSidebarTab, checkIndicators } from '../../utils';

describe('Inspector settings', () => {
	it('Check text settings inspector', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		await openSidebarTab(page, 'style', 'alignment');

		await page.$$eval('.maxi-alignment-control button', button =>
			button[2].click()
		);

		const expectResult = await checkIndicators({
			page,
			indicators: 'Alignment',
		});

		expect(expectResult).toBeTruthy();
	});
});
