/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { openSidebarTab } from '../../utils';

describe('Inspector alignment', () => {
	it('Check text alignment inspector', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing Text Maxi');

		await openSidebarTab(page, 'style', 'alignment');

		await page.$$eval('.maxi-alignment-control button', button =>
			button[2].click()
		);

		const activeInspectors = await page.$eval(
			'.maxi-accordion-control__item__button.maxi-accordion-control__item--active',
			test => test.outerText
		);
		expect(activeInspectors).toStrictEqual('Alignment');
	});

	it('Check divider alignment inspector', async () => {
		await insertBlock('Divider Maxi');
		await openSidebarTab(page, 'style', 'alignment');

		const selector = await page.$('.line-orientation-selector select');

		await selector.select('vertical');
		await page.waitForTimeout(150);

		const activeInspectors = await page.$eval(
			'.maxi-accordion-control__item__button.maxi-accordion-control__item--active',
			test => test.outerText
		);
		expect(activeInspectors).toStrictEqual('Alignment');

		// the indicator disappears
		/* const defaultSelection = await page.$(
			'.line-orientation-selector select'
		);

		await defaultSelection.select('horizontal');

		const deactivateInspectors = await page.$eval(
			'.maxi-accordion-control__item__button.maxi-accordion-control__item--active',
			test => test.outerText
		);
		expect(deactivateInspectors).toStrictEqual('Alignment'); */
	});
});
