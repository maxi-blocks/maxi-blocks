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

		await page.keyboard.type('test.com', { delay: 200 });
		await page.keyboard.press('Enter');

		await page.waitForTimeout(200);

		// Click on all options
		await page.$$eval(
			'.maxi-link-control__options .maxi-toggle-switch input',
			inputs => inputs.forEach(input => input.click())
		);

		expect(await getAttributes('linkSettings')).toMatchSnapshot();
	});
});
