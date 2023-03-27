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

		expect(await getAttributes('content')).toMatchSnapshot();
	});
});
