/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { openSidebarTab, checkIndicators } from '../../utils';

describe('Inspector anchor link', () => {
	it('Check anchor link inspector', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		const accordionPanel = await openSidebarTab(
			page,
			'advanced',
			'add anchor link'
		);

		await accordionPanel.$eval('.maxi-anchor-link input', select =>
			select.focus()
		);

		await page.keyboard.type('test');

		const expectResult = await checkIndicators({
			page,
			indicators: 'Add anchor link',
		});

		expect(expectResult).toBeTruthy();
	});
});
