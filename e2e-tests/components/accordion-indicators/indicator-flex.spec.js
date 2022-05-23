/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { openSidebarTab } from '../../utils';

describe('Inspector flexbox', () => {
	it('Check group flexbox inspector', async () => {
		await createNewPost();
		await insertBlock('Group Maxi');
		const accordionPanel = await openSidebarTab(
			page,
			'advanced',
			'flexbox'
		);

		const selector = await accordionPanel.$(
			'.maxi-flex-settings--control .maxi-flex-wrap-control select'
		);

		await selector.select('wrap');

		const activeInspectors = await page.$eval(
			'.maxi-accordion-control__item__button.maxi-accordion-control__item--active',
			test => test.outerText
		);
		expect(activeInspectors).toStrictEqual('Flexbox');
	});
});
