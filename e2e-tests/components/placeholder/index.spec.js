/**
 * WordPress dependencies
 */
import { createNewPost } from '@wordpress/e2e-test-utils';

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

		// label

		const placeholderLabel = await page.$eval(
			'.maxi-placeholder .maxi-placeholder__label',
			label => label.innerHTML
		);
		await page.waitForTimeout(500);
		expect(placeholderLabel).toMatchSnapshot();

		// placeholder

		const placeholderInstructions = await page.$eval(
			'.maxi-placeholder .maxi-placeholder__instructions',
			instructions => instructions.innerHTML
		);
		await page.waitForTimeout(500);
		expect(placeholderInstructions).toMatchSnapshot();

		// Launch the Library
		await page.waitForTimeout(500);
		await page.$eval(
			'.maxi-placeholder .maxi-placeholder__fieldset button',
			button => button.click()
		);

		const library = await page.$eval(
			'.components-modal__content .components-modal__header-heading-container h1',
			modal => modal.innerHTML
		);

		await page.waitForTimeout(500);
		expect(library).toMatchSnapshot();
	});
});
