/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { openSidebarTab, checkIndicators } from '../../utils';

describe('Inspector custom css', () => {
	it('Check custom css inspector', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		const accordionPanel = await openSidebarTab(
			page,
			'advanced',
			'add css classes'
		);

		await accordionPanel.$eval(
			'.maxi-additional__css-classes input',
			select => select.focus()
		);

		await page.keyboard.type('test');

		const expectResult = await checkIndicators({
			page,
			indicators: 'Add CSS classes',
		});

		expect(expectResult).toBeTruthy();
	});
});
