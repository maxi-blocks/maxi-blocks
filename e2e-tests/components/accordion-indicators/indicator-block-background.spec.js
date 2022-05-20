import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { openSidebarTab, addBackgroundLayer } from '../../utils';

describe('inspector background', () => {
	it('check group background inspector', async () => {
		await createNewPost();
		await insertBlock('Button Maxi');
		await openSidebarTab(page, 'style', 'button background');

		await page.$eval(
			'.maxi-responsive-tabs-control .maxi-color-palette-control .maxi-color-control__palette-label button',
			button => button.click()
		);

		const activeInspectors = await page.$eval(
			'.maxi-accordion-control__item__button.maxi-accordion-control__item--active',
			test => test.outerText
		);
		expect(activeInspectors).toStrictEqual('Button background');
	});

	it('check group background hover inspector', async () => {
		await insertBlock('Button Maxi');
		const accordion = await openSidebarTab(
			page,
			'style',
			'button background'
		);

		// hover
		await accordion.$$eval('.maxi-tabs-control button', button =>
			button[1].click()
		);

		// enable hover
		await page.$eval(
			'.maxi-background-status-hover .maxi-toggle-switch__toggle input',
			button => button.click()
		);

		const activeInspectors = await page.$eval(
			'.maxi-accordion-control__item__button.maxi-accordion-control__item--active',
			test => test.outerText
		);
		expect(activeInspectors).toStrictEqual('Button background');

		const activeHoverInspectors = await page.$eval(
			'.maxi-tabs-control__button-Hover.maxi-tabs-control__button--active',
			test => test.outerText
		);
		expect(activeHoverInspectors).toStrictEqual('Hover state');
	});
});
