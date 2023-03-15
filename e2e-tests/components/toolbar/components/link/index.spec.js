/**
 * WordPress dependencies
 */
import { createNewPost } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import { getAttributes, insertMaxiBlock } from '../../../../utils';

describe('Button link', () => {
	it('Check button link', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Button Maxi');

		// Wait for toolbar to be visible
		await page.waitForSelector('.toolbar-wrapper');

		// open editor
		await page.$eval(
			'.toolbar-wrapper .toolbar-item__link button',
			button => button.click()
		);

		// select open in new tab
		await page.$$eval(
			'.block-editor-link-control__tools .components-base-control__field input',
			button => button[0].click()
		);

		// select no follow
		await page.$$eval(
			'.block-editor-link-control__tools .components-base-control__field input',
			button => button[1].click()
		);

		// select sponsored
		await page.$$eval(
			'.block-editor-link-control__tools .components-base-control__field input',
			button => button[2].click()
		);

		// select UGC
		await page.$$eval(
			'.block-editor-link-control__tools .components-base-control__field input',
			button => button[3].click()
		);

		// add Url
		await page.$eval(
			'.block-editor-link-control__search-input-wrapper input',
			input => input.focus()
		);
		await page.keyboard.type('test.com', { delay: 100 });
		await page.keyboard.press('Enter');

		expect(await getAttributes('linkSettings')).toMatchSnapshot();
	});
});
