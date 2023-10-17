/**
 * WordPress dependencies
 */
import { createNewPost } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import {
	openSidebarTab,
	getAttributes,
	insertMaxiBlock,
	updateAllBlockUniqueIds,
} from '../../utils';

describe('Dropdown', () => {
	it('Check dropdown', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Container Maxi');
		await updateAllBlockUniqueIds(page);

		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'shape divider'
		);

		await page.waitForTimeout(500);

		await accordionPanel.$eval(
			'.maxi-shape-divider-control .maxi-toggle-switch .maxi-base-control__label',
			use => use.click()
		);

		await accordionPanel.$eval(
			'.maxi-dropdown.maxi-shape-divider-control__shape-selector button',
			modal => modal.click()
		);

		await page.$$eval(
			'.maxi-shape-divider-control__shape-list button',
			click => click[1].click()
		);

		expect(
			await getAttributes('shape-divider-top-shape-style')
		).toStrictEqual('waves-top');
	});
});
