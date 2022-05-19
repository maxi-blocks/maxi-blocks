/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { openSidebarTab } from '../../utils';

describe('inspector boxShadow', () => {
	it('check text boxShadow inspector', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'box shadow'
		);

		await accordionPanel.$$eval('.maxi-shadow-control button', click =>
			click[1].click()
		);
		const activeInspectors = await page.$eval(
			'.maxi-accordion-control__item__button.maxi-accordion-control__item--active',
			test => test.outerText
		);
		expect(activeInspectors).toStrictEqual('Box shadow');
	});

	it('check text hover boxShadow inspector', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		await openSidebarTab(page, 'style', 'box shadow');

		// add hover
		await page.$eval(
			'.maxi-tabs-content .maxi-tabs-control__button-Hover',
			buttons => buttons.click()
		);

		await page.$eval(
			'.maxi-box-shadow-status-hover .maxi-toggle-switch__toggle input',
			input => input.click()
		);

		const activeInspectors = await page.$eval(
			'.maxi-accordion-control__item__button.maxi-accordion-control__item--active',
			test => test.outerText
		);
		expect(activeInspectors).toStrictEqual('Box shadow');

		const activeHoverInspectors = await page.$eval(
			'.maxi-tabs-control__button-Hover.maxi-tabs-control__button--active',
			test => test.outerText
		);
		expect(activeHoverInspectors).toStrictEqual('Hover state');
	});
});
