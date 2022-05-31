/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';

describe('Placeholder', () => {
	it('Test placeholder', async () => {
		await createNewPost();

		await page.$eval('.maxi-toolbar-layout button', button =>
			button.click()
		);

		await page.$$eval(
			'.maxi-responsive-selector .action-buttons__button',
			button => button[0].click()
		);

		await page.$eval(
			'.maxi-library-modal .components-modal__header button',
			closeModal => closeModal.click()
		);

		const placeholder = await page.$eval(
			'.maxi-placeholder ',
			div => div.innerHTML
		);
		await page.waitForTimeout(500);
		expect(placeholder).toMatchSnapshot();
	});

	it('Test icon placeholder', async () => {
		await insertBlock('Icon Maxi');

		await page.$eval('.components-modal__header button', button =>
			button.click()
		);

		const placeholder = await page.$eval(
			'.maxi-svg-icon-block__placeholder',
			div => div.innerHTML
		);
		await page.waitForTimeout(500);
		expect(placeholder).toMatchSnapshot();
	});
	it('Test image placeholder', async () => {
		await insertBlock('Image Maxi');

		const placeholder = await page.$eval(
			'.maxi-image-block__placeholder',
			div => div.innerHTML
		);
		await page.waitForTimeout(500);
		expect(placeholder).toMatchSnapshot();
	});
});
