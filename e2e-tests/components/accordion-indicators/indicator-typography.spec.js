/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { openSidebarTab } from '../../utils';

describe('Inspector typography', () => {
	it('Check typography inspector', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'typography'
		);

		// fontFamily
		const fontFamilySelector = await accordionPanel.$(
			'.maxi-typography-control .maxi-typography-control__font-family'
		);
		await fontFamilySelector.click();
		await page.keyboard.type('Montserrat');
		await page.keyboard.press('Enter');

		const activeStateInspectors = await page.$eval(
			'.maxi-tabs-control__button-Normal.maxi-tabs-control__button--active',
			test => test.outerText
		);
		expect(activeStateInspectors).toStrictEqual('Normal state');

		const activeInspectors = await page.$eval(
			'.maxi-accordion-control__item__button.maxi-accordion-control__item--active',
			test => test.outerText
		);
		expect(activeInspectors).toStrictEqual('Typography');
	});

	it('Check typography hover inspector', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		const accordion = await openSidebarTab(page, 'style', 'typography');

		// hover
		await accordion.$eval('.maxi-tabs-control__button-Hover', button =>
			button.click()
		);

		// enable hover
		await page.$eval(
			'.maxi-tab-content--selected .maxi-toggle-switch__toggle input',
			button => button.click()
		);

		const activeStateInspectors = await page.$eval(
			'.maxi-tabs-control__button-Hover.maxi-tabs-control__button--active',
			test => test.outerText
		);
		expect(activeStateInspectors).toStrictEqual('Hover state');

		const activeInspectors = await page.$eval(
			'.maxi-accordion-control__item__button.maxi-accordion-control__item--active',
			test => test.outerText
		);
		expect(activeInspectors).toStrictEqual('Typography');
	});
});
