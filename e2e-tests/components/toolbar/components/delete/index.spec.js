/**
 * WordPress dependencies
 */
import { createNewPost } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import { insertMaxiBlock, updateAllBlockUniqueIds } from '../../../../utils';

describe('Delete block', () => {
	it('Check delete block', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Text Maxi');

		await updateAllBlockUniqueIds(page);

		await page.keyboard.type('Block 1', { delay: 100 });

		// TODO: https://github.com/maxi-blocks/maxi-blocks/issues/5806
		// await page.waitForTimeout(300);
		// Remove the maxi-block-inserter__last element content
		// await page.evaluate(() => {
		// 	const element = document.querySelector(
		// 		'.maxi-block-inserter__last'
		// 	);
		// 	if (element) element.textContent = '';
		// });

		// await page.waitForTimeout(300);

		await page.keyboard.type('Block 1', { delay: 300 });

		const textContent = await page.$eval(
			'.is-root-container.block-editor-block-list__layout',
			content => content.outerText
		);

		expect(textContent).toStrictEqual('Block 1');

		// delete block
		await page.$eval(
			'.toolbar-wrapper .toolbar-item.toolbar-item__more-settings button',
			button => button.click()
		);

		await page.$eval(
			'.components-popover__content .toolbar-item__delete button',
			button => button.click()
		);

		await page.waitForTimeout(500);
		// TODO: https://github.com/maxi-blocks/maxi-blocks/issues/5806
		// Remove the maxi-block-inserter__last element content
		// await page.evaluate(() => {
		// 	const element = document.querySelector(
		// 		'.maxi-block-inserter__last'
		// 	);
		// 	if (element) element.textContent = '';
		// });
		// check block not exist
		const textContentBeforeDelete = await page.$eval(
			'.is-root-container.block-editor-block-list__layout',
			content => content.outerText
		);

		expect(textContentBeforeDelete.length).toStrictEqual(1);
	});
});
