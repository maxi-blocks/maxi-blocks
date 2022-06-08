import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import {
	openSidebarTab,
	addBackgroundLayer,
	checkIndicators,
} from '../../utils';

describe('Inspector background', () => {
	it('Check group background inspector', async () => {
		await createNewPost();
		await insertBlock('Group Maxi');
		await openSidebarTab(page, 'style', 'background layer');
		await addBackgroundLayer(page, 'color');

		const expectResult = await checkIndicators({
			page,
			indicators: 'Background / Layer',
		});

		expect(expectResult).toBeTruthy();
	});

	it('Check group background hover inspector', async () => {
		await insertBlock('Group Maxi');
		const accordion = await openSidebarTab(
			page,
			'style',
			'background layer'
		);
		await addBackgroundLayer(page, 'color');

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
			indicators: 'Background / Layer',
		});

		expect(expectResult).toBeTruthy();

		const activeHoverInspectors = await page.$eval(
			'.maxi-tabs-control__button-Hover.maxi-tabs-control__button--active',
			test => test.outerText
		);
		expect(activeHoverInspectors).toStrictEqual('Hover state');
	});
});
