/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';

describe('InfoBox', () => {
	it('Check Infobox', async () => {
		await createNewPost();
		await page.$eval(
			'.interface-interface-skeleton__header .maxi-toolbar-layout button',
			click => click.click()
		);

		await page.$$eval('.maxi-responsive-selector button', select =>
			select[3].click()
		);

		await insertBlock('Text Maxi');
		await page.$eval(
			'.interface-interface-skeleton__header .edit-post-header__settings .interface-pinned-items button',
			click => click.click()
		);

		const warningBox = await page.$eval(
			'.components-panel .maxi-warning-box',
			warning => warning.innerHTML
		);

		expect(warningBox).toMatchSnapshot();
	});
});
