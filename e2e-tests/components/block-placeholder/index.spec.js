/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';

describe('BlockPlaceholder', () => {
	it('Checking the block placeholder', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');

		const paragraph = await page.$eval(
			'.rich-text.block-editor-rich-text__editable.maxi-text-block__content ',
			select => select.innerHTML
		);

		expect(paragraph).toMatchSnapshot();
	});
});
