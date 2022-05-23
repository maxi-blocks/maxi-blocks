import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { openSidebarTab } from '../../utils';

describe('Inspector settings', () => {
	it('Check text settings inspector', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		await openSidebarTab(page, 'style', 'alignment');

		await page.$$eval('.maxi-alignment-control button', button =>
			button[2].click()
		);

		const activeInspectors = await page.$eval(
			'.maxi-tabs-control__button-Settings.maxi-tabs-control__button--active',
			test => test.outerText
		);
		expect(activeInspectors).toStrictEqual('Settings');
	});
});
