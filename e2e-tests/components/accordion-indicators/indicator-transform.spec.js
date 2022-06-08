/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { openSidebarTab, checkIndicators } from '../../utils';

describe('Inspector transform', () => {
	it('Check transform inspector', async () => {
		await createNewPost();
		await insertBlock('Image Maxi');
		const accordionPanel = await openSidebarTab(
			page,
			'advanced',
			'transform'
		);

		await accordionPanel.$eval(
			'.maxi-transform-control .maxi-transform-control__square-control .maxi-transform-control__square-control__y-control__value input',
			select => select.focus()
		);

		await page.keyboard.type('55');

		const expectResult = await checkIndicators({
			page,
			indicators: 'Transform',
		});

		expect(expectResult).toBeTruthy();
	});
});
