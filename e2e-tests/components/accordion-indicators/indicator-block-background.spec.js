import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { openSidebarTab, checkIndicators } from '../../utils';

describe('Inspector background', () => {
	it('Check group background inspector', async () => {
		await createNewPost();
		await insertBlock('Button Maxi');
		await openSidebarTab(page, 'style', 'button background');

		await page.$eval(
			'.maxi-responsive-tabs-control .maxi-color-palette-control .maxi-color-control__palette-label button',
			button => button.click()
		);

		const expectResult = await checkIndicators({
			page,
			indicators: 'Button background',
		});

		expect(expectResult).toBeTruthy();
	});

	it('Check group background hover inspector', async () => {
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

		const expectResult = await checkIndicators({
			page,
			indicators: 'Button background',
		});

		expect(expectResult).toBeTruthy();

		const activeHoverInspectors = await page.$eval(
			'.maxi-tabs-control__button-Hover.maxi-tabs-control__button--active',
			test => test.outerText
		);
		expect(activeHoverInspectors).toStrictEqual('Hover state');
	});
});
