/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { openSidebarTab, editAdvancedNumberControl } from '../../utils';

describe('inspector size', () => {
	it('check size inspector', async () => {
		await createNewPost();
		await insertBlock('Button Maxi');
		await openSidebarTab(page, 'style', 'height width');

		await editAdvancedNumberControl({
			page,
			instance: await page.$(
				'.maxi-full-size-control .maxi-advanced-number-control'
			),
			newNumber: '22',
		});

		const activeInspectors = await page.$eval(
			'.maxi-accordion-control__item__button.maxi-accordion-control__item--active',
			test => test.outerText
		);
		expect(activeInspectors).toStrictEqual('Height / Width');
	});
	it('check full size inspector', async () => {
		await createNewPost();
		await insertBlock('Button Maxi');
		await openSidebarTab(page, 'style', 'height width');

		await page.$eval(
			'.maxi-responsive-tabs-control .maxi-toggle-switch .maxi-toggle-switch__toggle input',
			input => input.click()
		);

		const activeInspectors = await page.$eval(
			'.maxi-accordion-control__item__button.maxi-accordion-control__item--active',
			test => test.outerText
		);
		expect(activeInspectors).toStrictEqual('Height / Width');
	});
});
