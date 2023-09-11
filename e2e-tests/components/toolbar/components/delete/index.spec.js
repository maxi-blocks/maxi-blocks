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

		// check block not exist
		const textContentBeforeDelete = await page.$eval(
			'.is-root-container.block-editor-block-list__layout',
			content => content.outerText
		);

		expect(textContentBeforeDelete.length).toStrictEqual(1);
	});
});
