/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import {
	openSidebarTab,
	editAdvancedNumberControl,
	checkIndicators,
} from '../../utils';

describe('Inspector Z-index', () => {
	it('Check Z-index inspector', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing Text Maxi');
		await openSidebarTab(page, 'advanced', 'z index');

		await editAdvancedNumberControl({
			page,
			instance: await page.$(
				'.maxi-zIndex-control .maxi-base-control__field'
			),
			newNumber: '20',
		});

		const expectResult = await checkIndicators({
			page,
			indicators: 'Z-index',
		});

		expect(expectResult).toBeTruthy();
	});
});
