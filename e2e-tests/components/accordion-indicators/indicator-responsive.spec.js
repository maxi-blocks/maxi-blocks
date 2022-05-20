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
		await insertBlock('Text Maxi');
		await openSidebarTab(page, 'advanced', 'overflow');

		// xxl responsive
		await page.$eval(
			'.maxi-responsive-tabs-control .maxi-tabs-control__button-XXL',
			button => button.click()
		);

		const selectorX = await page.$$('.maxi-overflow-control select');

		await selectorX[0].select('hidden');

		const activeXxlInspectors = await page.$eval(
			'.maxi-tabs-control__button-XXL.maxi-tabs-control__button--active',
			test => test.outerText
		);
		expect(activeXxlInspectors).toStrictEqual('XXL');

		const activeInspectors = await page.$eval(
			'.maxi-accordion-control__item__button.maxi-accordion-control__item--active',
			test => test.outerText
		);
		expect(activeInspectors).toStrictEqual('Overflow');
	});
});
