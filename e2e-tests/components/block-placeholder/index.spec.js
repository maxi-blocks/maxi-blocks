/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	getEditedPostContent,
} from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import { getBlockAttributes } from '../../utils';

describe('Block Placeholder', () => {
	it('Checking the block placeholder', async () => {
		await createNewPost();
		await insertBlock('Text Maxi');
		const paragraph = await page.$(
			'.rich-text.block-editor-rich-text__editable.maxi-text-block__content span'
		);

		expect(paragraph).toMatchSnapshot();
	});
});
