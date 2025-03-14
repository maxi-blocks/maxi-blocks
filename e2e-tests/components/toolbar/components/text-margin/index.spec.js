/**
 * WordPress dependencies
 */
import { createNewPost, pressKeyWithModifier } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	getAttributes,
	openSidebarTab,
	insertMaxiBlock,
	updateAllBlockUniqueIds,
} from '../../../../utils';

describe('Text margin', () => {
	it('Check text margin', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Text Maxi');

		await updateAllBlockUniqueIds(page);

		// Wait for toolbar to be visible
		await page.waitForSelector('.toolbar-wrapper');

		// open editor
		await page.$eval(
			'.toolbar-wrapper .toolbar-item__text-margin',
			button => button.click()
		);

		// edit margin
		await page.$eval(
			'.components-popover__content .maxi-axis-control__content__item__margin .maxi-advanced-number-control__value',
			button => button.focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type('66', { delay: 350 });

		expect(await getAttributes('margin-bottom-xl')).toStrictEqual('66');

		// Check changes in sidebar
		await openSidebarTab(page, 'style', 'margin padding');

		const margin = await page.$eval(
			'.maxi-axis-control__margin .maxi-axis-control__content__item__margin input',
			input => input.value
		);

		expect(margin).toStrictEqual('66');
	});
});
