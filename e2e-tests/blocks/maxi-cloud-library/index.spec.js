/**
 * WordPress
 */
import {
	createNewPost,
	insertBlock,
	getEditedPostContent,
} from '@wordpress/e2e-test-utils';

describe('Maxi Cloud Library', () => {
	beforeEach(async () => {
		await createNewPost();
	});

	it('Maxi Cloud Library does not break', async () => {
		await insertBlock('Maxi Cloud Library');

		expect(await getEditedPostContent()).toMatchSnapshot();
	});
});
