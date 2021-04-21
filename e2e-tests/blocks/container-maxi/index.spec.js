/**
 * WordPress
 */
import {
	createNewPost,
	insertBlock,
	getEditedPostContent,
} from '@wordpress/e2e-test-utils';

describe('Container Maxi', () => {
	beforeEach(async () => {
		await createNewPost();
	});

	it('Container Maxi does not break ', async () => {
		await insertBlock('Container Maxi');

		expect(await getEditedPostContent()).toMatchSnapshot();
	});
});
