/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { getBlockAttributes, openSidebarTab } from '../../utils';

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
			'.maxi-dropdown.maxi-shapedividercontrol__shape-selector div',
			modal => modal.click()
		);

		await page.$$eval(
			'.maxi-shapedividercontrol__shape-list button',
			click => click[1].click()
		);

		const shapeStyle = 'waves-top';
		const shapeStyleAttribute = await getBlockAttributes();
		const style = shapeStyleAttribute['shape-divider-top-shape-style'];

		expect(style).toStrictEqual(shapeStyle);
	});
});
