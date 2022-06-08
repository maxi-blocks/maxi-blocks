/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import {
	openSidebarTab,
	editAdvancedNumberControl,
	checkIndicators,
} from '../../utils';

describe('Inspector size', () => {
	it('Check size inspector', async () => {
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

		const expectResult = await checkIndicators({
			page,
			indicators: 'Height / Width',
		});

		expect(expectResult).toBeTruthy();
	});
	// if add full size the indicator does not appear
	it('Check full size inspector', async () => {
		await createNewPost();
		await insertBlock('Button Maxi');
		await openSidebarTab(page, 'style', 'height width');

		await page.$eval(
			'.maxi-responsive-tabs-control .maxi-toggle-switch .maxi-toggle-switch__toggle input',
			input => input.click()
		);

		const expectResult = await checkIndicators({
			page,
			indicators: 'Height / Width',
		});

		expect(expectResult).toBeTruthy();
	});
});
