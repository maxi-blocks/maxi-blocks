/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { openSidebarTab, checkIndicators } from '../../utils';

describe('Inspector boxShadow', () => {
	it('Check text boxShadow inspector', async () => {
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

		const expectResult = await checkIndicators({
			page,
			indicators: 'Box shadow',
		});

		expect(expectResult).toBeTruthy();
	});

	it('Check text hover boxShadow inspector', async () => {
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

		const expectResult = await checkIndicators({
			page,
			indicators: 'Box shadow',
		});

		expect(expectResult).toBeTruthy();

		const activeHoverInspectors = await page.$eval(
			'.maxi-tabs-control__button-Hover.maxi-tabs-control__button--active',
			test => test.outerText
		);
		expect(activeHoverInspectors).toStrictEqual('Hover state');
	});
});
