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
			button[0].click()
		);

		// Select column
		await page.$eval('.maxi-column-block', column => column.focus());

		// Open appender on Column Maxi
		await page.$eval(
			'.maxi-column-block .block-editor-button-block-appender',
			button => button.click()
		);

		debugger;
		// Add Group Maxi
		await page.keyboard.type('group');
		await page.waitForSelector(
			'.editor-block-list-item-maxi-blocks-group-maxi'
		);
		await page.$eval(
			'.editor-block-list-item-maxi-blocks-group-maxi',
			button => button.click()
		);

		// Open appender on Group Maxi
		await page.waitForSelector('.maxi-group-block');
		await page.$eval(
			'.maxi-group-block .block-editor-button-block-appender',
			button => button.click()
		);

		// Add Row Maxi
		await page.keyboard.type('row');
		await page.waitForSelector(
			'.editor-block-list-item-maxi-blocks-row-maxi'
		);
		await page.$eval(
			'.editor-block-list-item-maxi-blocks-row-maxi',
			button => button.click()
		);

		// Select Row and add Column
		await page.waitForSelector('.maxi-row-block__template');
		await page.$eval('.maxi-row-block__template button', button =>
			button.click()
		);

		// Select column
		await page.$$eval('.maxi-column-block', columns =>
			columns[columns.length - 1].focus()
		);

		const breadCrumbsHTML = await page.$eval(
			'ul.maxi-breadcrumbs',
			breadcrumbs => breadcrumbs.innerHTML.trim()
		);

		const regex = new RegExp(
			/^<li class="maxi-breadcrumbs__item"><span class="maxi-breadcrumbs__item__content" target="[^"]*">Container Maxi<\/span><\/li><li class="maxi-breadcrumbs__item"><span class="maxi-breadcrumbs__item__content" target="[^"]*">Row Maxi<\/span><\/li><li class="maxi-breadcrumbs__item"><span class="maxi-breadcrumbs__item__content" target="[^"]*">Column Maxi<\/span><\/li><li class="maxi-breadcrumbs__item"><span class="maxi-breadcrumbs__item__content" target="[^"]*">Group Maxi<\/span><\/li><li class="maxi-breadcrumbs__item"><span class="maxi-breadcrumbs__item__content" target="[^"]*">Row Maxi<\/span><\/li><li class="maxi-breadcrumbs__item"><span class="maxi-breadcrumbs__item__content" target="[^"]*">Column Maxi<\/span><\/li>$/gm
		);
		const result = regex.test(breadCrumbsHTML);

		expect(result).toBeTruthy();
	});
});
