/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';

describe('Placeholder', () => {
	it('Test template library placeholder', async () => {
		await createNewPost();

		await page.$eval('.maxi-toolbar-layout button', button =>
			button.click()
		);

		// display template library
		await page.$eval(
			'.maxi-responsive-selector .action-buttons__button',
			button => button.click()
		);

		// close modal
		await page.$eval(
			'.maxi-library-modal .components-modal__header button',
			closeModal => closeModal.click()
		);

		// check placeholder
		const placeholder = await page.$eval(
			'.maxi-placeholder ',
			div => div.innerHTML
		);
		await page.waitForTimeout(500);
		expect(placeholder).toMatchSnapshot();
	});

	it('Test icon placeholder', async () => {
		await insertBlock('Icon Maxi');

		// close modal
		await page.$eval('.components-modal__header button', button =>
			button.click()
		);

		// check icon placeholder
		const placeholder = await page.$eval(
			'.maxi-svg-icon-block__placeholder',
			div => div.innerHTML
		);
		await page.waitForTimeout(500);
		expect(placeholder).toMatchSnapshot();
	});
	it('Test image placeholder', async () => {
		await insertBlock('Image Maxi');

		// check image placeholder
		const placeholder = await page.$eval(
			'.maxi-image-block__placeholder',
			div => div.innerHTML
		);
		await page.waitForTimeout(500);
		expect(placeholder).toMatchSnapshot();
	});
});
