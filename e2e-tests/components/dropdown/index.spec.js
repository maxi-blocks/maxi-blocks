/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { openSidebarTab, getAttributes } from '../../utils';

describe('Dropdown', () => {
	it('Check dropdown', async () => {
		await createNewPost();
		await insertBlock('Container Maxi');
		await page.$eval('.maxi-container-block', select => select.focus());
		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'shape divider'
		);

		await accordionPanel.$eval(
			'.maxi-shapedividercontrol .maxi-toggle-switch .maxi-base-control__label',
			use => use.click()
		);

		await accordionPanel.$eval(
			'.maxi-dropdown.maxi-shapedividercontrol__shape-selector button',
			modal => modal.click()
		);

		await page.$$eval(
			'.maxi-shapedividercontrol__shape-list button',
			click => click[1].click()
		);

		expect(
			await getAttributes('shape-divider-top-shape-style')
		).toStrictEqual('waves-top');
	});
});
