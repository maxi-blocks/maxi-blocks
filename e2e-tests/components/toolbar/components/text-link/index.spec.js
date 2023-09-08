/**
 * WordPress dependencies
 */
import { createNewPost } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import { getAttributes, insertMaxiBlock } from '../../../../utils';

describe('Text link', () => {
	it('Check text link', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Text Maxi');
		await page.keyboard.type('Testing Text Maxi', { delay: 100 });

		// open editor
		await page.$eval('.toolbar-wrapper .toolbar-item__text-link', button =>
			button.click()
		);

		await page.waitForTimeout(200);

		await page.waitForSelector('.block-editor-url-input__input');

		await page.waitForTimeout(200);

		await page.keyboard.type('test.com', { delay: 100 });
		await page.keyboard.press('Enter');

		// Click on all options
		await page.$$eval(
			'.maxi-link-control__options .maxi-toggle-switch input',
			inputs => inputs.forEach(input => input.click())
		);

		expect(await getAttributes('content')).toMatchSnapshot();
	});
});
