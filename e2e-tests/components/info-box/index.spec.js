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

		const warningBox = await page.$eval(
			'.components-panel .maxi-warning-box',
			warning => warning.innerHTML
		);

		expect(warningBox).toMatchSnapshot();
	});
});
