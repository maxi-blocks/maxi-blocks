/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { openSidebarTab, checkIndicators } from '../../utils';

describe('Inspector border', () => {
	it('Check text border inspector', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		const borderAccordion = await openSidebarTab(page, 'style', 'border');

		await borderAccordion.$$eval(
			'.maxi-tabs-content .maxi-default-styles-control button',
			button => button[1].click()
		);

		const expectResult = await checkIndicators({
			page,
			indicators: 'Border',
		});

		expect(expectResult).toBeTruthy();
	});

	it('Check text hover border inspector', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		const borderAccordion = await openSidebarTab(page, 'style', 'border');

		// add hover
		await borderAccordion.$eval(
			'.maxi-responsive-tabs-control .maxi-settingstab-control .maxi-tabs-control__button-Hover',
			buttons => buttons.click()
		);

		await page.$eval(
			'.maxi-tabs-content .maxi-border-status-hover input',
			input => input.click()
		);

		const expectResult = await checkIndicators({
			page,
			indicators: 'Border',
		});

		expect(expectResult).toBeTruthy();

		const activeHoverInspectors = await page.$eval(
			'.maxi-tabs-control__button-Hover.maxi-tabs-control__button--active',
			test => test.outerText
		);
		expect(activeHoverInspectors).toStrictEqual('Hover state');
	});
});
