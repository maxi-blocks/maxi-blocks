/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	getEditedPostContent,
} from '@wordpress/e2e-test-utils';

describe('Breadcrumbs', () => {
	it('Test breadcrumbs', async () => {
		await createNewPost();
		await insertBlock('Container Maxi');
		await page.$$eval('.maxi-row-block__template button', button =>
			button[1].click()
		);

		// select add block
		await page.$$eval(
			'.block-editor-block-list__layout .block-list-appender .components-dropdown.block-editor-inserter button',
			button => button[0].click()
		);

		// select group
		await page.keyboard.type('group');
		await page.$$eval(
			'.block-editor-inserter__quick-inserter .block-editor-inserter__quick-inserter-results button',
			button => button[0].click()
		);

		// select add block
		await page.$$eval(
			'.block-editor-block-list__layout .block-list-appender .components-dropdown.block-editor-inserter button',
			button => button[0].click()
		);

		// select row
		await page.keyboard.type('row');
		await page.$$eval(
			'.block-editor-inserter__quick-inserter .block-editor-inserter__quick-inserter-results button',
			button => button[0].click()
		);

		// select number/style of columns
		await page.$$eval('.maxi-row-block__template button', button =>
			button[1].click()
		);

		expect(await getEditedPostContent()).toMatchSnapshot();
	});
});
