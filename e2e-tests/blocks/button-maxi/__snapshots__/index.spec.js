/**
 * WordPress
 */
import {
	createNewPost,
	insertBlock,
	getEditedPostContent,
} from '@wordpress/e2e-test-utils';

describe('Button Maxi', () => {
	beforeEach(async () => {
		await createNewPost();
	});

	it('Button Maxi does not break ', async () => {
		await insertBlock('Button Maxi');

		expect(await getEditedPostContent()).toMatchSnapshot();
	});
});
