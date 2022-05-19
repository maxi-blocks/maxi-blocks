/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { openSidebarTab } from '../../utils';

describe('inspector margin padding', () => {
	it('check group margin padding inspector', async () => {
		await createNewPost();
		await insertBlock('Group Maxi');
		await openSidebarTab(page, 'style', 'margin padding');

		await page.$$eval(
			'.maxi-axis-control__margin .maxi-axis-control__header button',
			button => button[1].click()
		);

		const activeInspectors = await page.$eval(
			'.maxi-accordion-control__item__button.maxi-accordion-control__item--active',
			test => test.outerText
		);
		expect(activeInspectors).toStrictEqual('Margin / Padding');
	});
});
