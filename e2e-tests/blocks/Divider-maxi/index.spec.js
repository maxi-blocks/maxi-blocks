/**
 * WordPress
 */
import {
	createNewPost,
	insertBlock,
	getEditedPostContent,
} from '@wordpress/e2e-test-utils';

describe('Divider Maxi', () => {
	beforeEach(async () => {
		await createNewPost();
	});

	it('Divider Maxi does not break ', async () => {
		await insertBlock('Divider Maxi');

		expect(await getEditedPostContent()).toMatchSnapshot();
	});
});
