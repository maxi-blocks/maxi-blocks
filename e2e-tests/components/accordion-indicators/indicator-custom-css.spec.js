/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { openSidebarTab } from '../../utils';

// The indicator does not work in customCSS
describe.skip('Inspector custom css', () => {
	it('Check group custom css inspector', async () => {
		await createNewPost();
		await insertBlock('Group Maxi');
		const accordionPanel = await openSidebarTab(
			page,
			'advanced',
			'custom css'
		);

		const selector = await accordionPanel.$(
			'.maxi-custom-css-control__category select'
		);

		await selector.select('text');

		const activeInspectors = await page.$eval(
			'.maxi-accordion-control__item__button.maxi-accordion-control__item--active',
			test => test.outerText
		);
		expect(activeInspectors).toStrictEqual('Custom css');
	});
});
