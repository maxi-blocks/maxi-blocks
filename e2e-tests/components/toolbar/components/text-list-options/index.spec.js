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

describe('Text list options', () => {
	it('Check text list options', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Text Maxi');
		await updateAllBlockUniqueIds(page);
		await page.keyboard.type('Testing Text Maxi', { delay: 100 });

		// open editor
		await page.$eval(
			'.toolbar-wrapper .toolbar-item__list-options',
			button => button.click()
		);

		// select number list
		await page.$eval(
			'.components-popover__content .toolbar-item__popover__list-options .toolbar-item__popover__list-options__button.has-icon',
			button => button.click()
		);

		expect(await getAttributes('typeOfList')).toStrictEqual('ol');

		// select dotted list
		await insertMaxiBlock(page, 'Text Maxi');
		await updateAllBlockUniqueIds(page);
		await page.keyboard.type('Testing Text Maxi', { delay: 100 });

		// open editor
		await page.$eval(
			'.toolbar-wrapper .toolbar-item__list-options',
			button => button.click()
		);

		await page.$$eval(
			'.components-popover__content .toolbar-item__popover__list-options .toolbar-item__popover__list-options__button.has-icon',
			button => button[1].click()
		);

		expect(await getAttributes('typeOfList')).toStrictEqual('ul');
	});
});
