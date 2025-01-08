/**
 * WordPress dependencies
 */
import { createNewPost } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	getAttributes,
	insertMaxiBlock,
	openPreviewPage,
	updateAllBlockUniqueIds,
} from '../../../../utils';

describe('Button link', () => {
	it('Check button link', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Button Maxi');

		await updateAllBlockUniqueIds(page);

		// Wait for toolbar to be visible
		await page.waitForSelector('.toolbar-wrapper');

		// open editor
		await page.$eval(
			'.toolbar-wrapper .toolbar-item__link button',
			button => button.click()
		);

		await page.waitForTimeout(200);
		await page.waitForSelector('.block-editor-url-input__input');
		await page.waitForTimeout(200);
		await page.focus('.block-editor-url-input__input');

		await page.keyboard.type('test.com', { delay: 100 });
		await page.keyboard.press('Enter');

		await page.waitForTimeout(200);

		// Click on all options
		await page.$$eval(
			'.maxi-link-control__options .maxi-toggle-switch input',
			inputs => inputs.forEach(input => input.click())
		);

		expect(await getAttributes('linkSettings')).toMatchSnapshot();
	});

	it('Should work correctly with dynamic content', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Button Maxi');

		await page.waitForSelector('.toolbar-wrapper');

		// open DC editor
		await page.$eval(
			'.toolbar-wrapper .toolbar-item__dynamic-content',
			button => button.click()
		);

		await page.waitForSelector('.maxi-dynamic-content');

		// Enable DC
		await page.$eval(
			'.maxi-dynamic-content .maxi-toggle-switch input',
			checkbox => checkbox.click()
		);
		await page.waitForTimeout(200);

		// Select "Site" as DC type
		const select = await page.$(
			'.maxi-dynamic-content .maxi-select-control__input'
		);
		await select.select('settings');
		await page.waitForTimeout(200);

		// open editor
		await page.$eval(
			'.toolbar-wrapper .toolbar-item__link button',
			button => button.click()
		);

		await page.waitForSelector('.maxi-link-control');

		// Enable DC link
		await page.$eval(
			'.toolbar-item__link-popover .maxi-toggle-switch__toggle input',
			checkbox => checkbox.click()
		);
		await page.waitForTimeout(200);

		expect(await getAttributes('dc-')).toMatchSnapshot();

		const previewPage = await openPreviewPage(page);

		await previewPage.waitForTimeout(1000);
		const href = await previewPage.$eval(
			'a.maxi-button-block__button',
			button => button.getAttribute('href')
		);

		expect(href).toStrictEqual('http://localhost:8889');
	});
});
