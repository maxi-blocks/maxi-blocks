/**
 * WordPress
 */
import {
	createNewPost,
	insertBlock,
	getEditedPostContent,
} from '@wordpress/e2e-test-utils';

describe('Group Maxi', () => {
	beforeEach(async () => {
		await createNewPost();
	});

	it('Group Maxi', async () => {
		await insertBlock('Group Maxi');

		expect(await getEditedPostContent()).toMatchSnapshot();
	});
});
