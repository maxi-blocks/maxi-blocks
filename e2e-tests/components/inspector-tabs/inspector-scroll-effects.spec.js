/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { openSidebarTab } from '../../utils';

describe('inspector responsive', () => {
	it('check text responsive inspector', async () => {
		await createNewPost();
		await insertBlock('Container Maxi');
		await openSidebarTab(page, 'advanced', 'scroll effects');

		const selector = await page.$(
			'.maxi-responsive-tabs-control .maxi-scroll-effects-control .maxi-base-control select'
		);

		await selector.select('2');

		const activeInspectors = await page.$eval(
			'.maxi-accordion-control__item__button.maxi-accordion-control__item--active',
			test => test.outerText
		);
		expect(activeInspectors).toStrictEqual('Scroll effects');
	});
});
