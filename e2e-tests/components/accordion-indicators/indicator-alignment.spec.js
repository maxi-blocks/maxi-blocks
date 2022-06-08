/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { checkIndicators, openSidebarTab } from '../../utils';

describe('Inspector alignment', () => {
	it('Check text alignment inspector', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing Text Maxi');

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

	/* it('Check divider alignment inspector', async () => {
		await insertBlock('Divider Maxi');
		await openSidebarTab(page, 'style', 'alignment');

		const selector = await page.$('.line-orientation-selector select');

		await selector.select('vertical');
		await page.waitForTimeout(150);

		const expectResult = await checkIndicators({
			page,
			inspectors: ['Alignment'],
		});

		expect(expectResult).toBeTruthy();
	}); */
});
