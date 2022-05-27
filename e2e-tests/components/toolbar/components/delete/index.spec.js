/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import { getAttributes, getBlockStyle } from '../../../../utils';

describe('Delete block', () => {
	it('Check delete block', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		await page.keyboard.type('Block 1', { delay: 100 });

		const textContent = await page.$eval(
			'.is-root-container.block-editor-block-list__layout div',
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

		await insertBlock('Text Maxi');
		await page.keyboard.type('Block 2', { delay: 100 });
		const textContentBeforeDelete = await page.$eval(
			'.is-root-container.block-editor-block-list__layout div',
			content => content.outerText
		);

		expect(textContentBeforeDelete).toStrictEqual('Block 2');
	});
});
