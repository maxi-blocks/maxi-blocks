/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';

describe('Spinner', () => {
	it('Check the spinner', async () => {
		await createNewPost();
		await insertBlock('Image Maxi');

		await page.$eval('.maxi-image-block__placeholder button', click =>
			click.click()
		);

		await page.$$eval(
			'.media-modal.wp-core-ui .media-frame-tab-panel button',
			select => select[1].click()
		);

		const spinner = await page.$eval(
			'.media-modal.wp-core-ui .media-frame-content .media-toolbar-secondary',
			imageSpinner => imageSpinner.innerHTML
		);

		expect(spinner).toMatchSnapshot();
	});
});
