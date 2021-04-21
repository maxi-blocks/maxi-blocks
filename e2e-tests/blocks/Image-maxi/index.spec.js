/**
 * WordPress
 */
import {
	createNewPost,
	insertBlock,
	getEditedPostContent,
} from '@wordpress/e2e-test-utils';

describe('Image Maxi', () => {
	beforeEach(async () => {
		await createNewPost();
	});

	it('Image Maxi does not break', async () => {
		await insertBlock('Image Maxi');

		expect(await getEditedPostContent()).toMatchSnapshot();
	});
});
