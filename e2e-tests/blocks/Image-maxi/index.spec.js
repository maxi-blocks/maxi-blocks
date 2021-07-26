/**
 * WordPress
 */
import {
	createNewPost,
	insertBlock,
	getEditedPostContent,
} from '@wordpress/e2e-test-utils';

describe('Image Maxi', () => {
	it('Image Maxi does not break', async () => {
		await createNewPost();
		await insertBlock('Image Maxi');

		expect(await getEditedPostContent()).toMatchSnapshot();
	});
});
