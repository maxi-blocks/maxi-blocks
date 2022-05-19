/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { openSidebarTab } from '../../utils';

describe('inspector callout arrow', () => {
	it('check text callout arrow inspector', async () => {
		await createNewPost();
		await insertBlock('Group Maxi');
		await openSidebarTab(page, 'style', 'callout arrow');

		await page.$eval(
			'.maxi-arrow-control .maxi-base-control__field input',
			button => button.click()
		);

		const activeInspectors = await page.$eval(
			'.maxi-accordion-control__item__button.maxi-accordion-control__item--active',
			test => test.outerText
		);
		expect(activeInspectors).toStrictEqual('Callout arrow');
	});
});
