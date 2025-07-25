/**
 * WordPress dependencies
 */
import { createNewPost } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import { insertMaxiBlock, updateAllBlockUniqueIds } from '../../utils';

describe('Breadcrumbs', () => {
	it('Test breadcrumbs', async () => {
		await createNewPost();
		await page.waitForTimeout(1500);
		await insertMaxiBlock(page, 'Container Maxi');

		await updateAllBlockUniqueIds(page);

		await page.waitForSelector('.maxi-row-block__template button');
		await page.$eval('.maxi-row-block__template button', button =>
			button.click()
		);
		await page.waitForSelector('.maxi-column-block');

		// Select column
		await page.$eval('.maxi-column-block', column => column.focus());

		// Open appender on Column Maxi
		await page.$eval(
			'.maxi-column-block .block-editor-button-block-appender',
			button => button.click()
		);

		// Add Group Maxi - wait for inserter to be fully ready
		await page.waitForTimeout(1000);
		await page.keyboard.type('group', { delay: 200 });
		await page.waitForTimeout(1500); // Longer wait for CI environments
		await page.waitForSelector(
			'.editor-block-list-item-maxi-blocks-group-maxi',
			{ timeout: 15000 }
		);
		await page.$eval(
			'.editor-block-list-item-maxi-blocks-group-maxi',
			button => button.click()
		);
		await page.waitForSelector('.maxi-group-block');

		// Open appender on Group Maxi
		await page.$eval(
			'.maxi-group-block .block-editor-button-block-appender',
			button => button.click()
		);
		await page.waitForTimeout(1000);

		// Add Row Maxi - clear any existing search and wait longer
		await page.keyboard.press('Escape'); // Clear any existing search
		await page.waitForTimeout(500);
		await page.$eval(
			'.maxi-group-block .block-editor-button-block-appender',
			button => button.click()
		);
		await page.waitForTimeout(1000);
		await page.keyboard.type('row', { delay: 200 });
		await page.waitForTimeout(1500); // Longer wait for CI environments
		await page.waitForSelector(
			'.editor-block-list-item-maxi-blocks-row-maxi',
			{ timeout: 20000 }
		);
		await page.$eval(
			'.editor-block-list-item-maxi-blocks-row-maxi',
			button => button.click()
		);
		await page.waitForTimeout(500);

		// Select Row and add Column
		await page.waitForSelector('.maxi-row-block__template');
		await page.$eval('.maxi-row-block__template button', button =>
			button.click()
		);
		await page.waitForTimeout(500);

		// Select column
		await page.$$eval('.maxi-column-block', columns =>
			columns[columns.length - 1].focus()
		);

		const breadCrumbsHTML = await page.$eval(
			'ul.maxi-breadcrumbs',
			breadcrumbs => breadcrumbs.innerHTML.trim()
		);

		const regex =
			/^<li class="maxi-breadcrumbs__item"><span class="maxi-breadcrumbs__item__content" target="[^"]*">Container Maxi<\/span><\/li><li class="maxi-breadcrumbs__item"><span class="maxi-breadcrumbs__item__content" target="[^"]*">Row Maxi<\/span><\/li><li class="maxi-breadcrumbs__item"><span class="maxi-breadcrumbs__item__content" target="[^"]*">Column Maxi<\/span><\/li><li class="maxi-breadcrumbs__item"><span class="maxi-breadcrumbs__item__content" target="[^"]*">Group Maxi<\/span><\/li><li class="maxi-breadcrumbs__item"><span class="maxi-breadcrumbs__item__content" target="[^"]*">Row Maxi<\/span><\/li><li class="maxi-breadcrumbs__item"><span class="maxi-breadcrumbs__item__content" target="[^"]*">Column Maxi<\/span><\/li>$/gm;
		const result = regex.test(breadCrumbsHTML);

		expect(result).toBeTruthy();
	});
});
