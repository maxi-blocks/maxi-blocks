/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
import { addCustomCSS, getBlockStyle, getEditedPostContent } from '../../utils';

describe('Video Maxi', () => {
	it('Video Maxi does not break', async () => {
		await createNewPost();
		await insertBlock('Video Maxi');

		expect(await getEditedPostContent(page)).toMatchSnapshot();
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
	it('Video Maxi Custom CSS', async () => {
		await expect(await addCustomCSS(page)).toMatchSnapshot();
	}, 500000);
});
