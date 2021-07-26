/**
 * WordPress
 */
import {
	createNewPost,
	insertBlock,
	getEditedPostContent,
} from '@wordpress/e2e-test-utils';

describe('Container Maxi', () => {
	it('Container Maxi does not break', async () => {
		await createNewPost();
		await insertBlock('Container Maxi');

		expect(await getEditedPostContent()).toMatchSnapshot();
	});
});
