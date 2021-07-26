/**
 * WordPress
 */
import {
	createNewPost,
	insertBlock,
	getEditedPostContent,
} from '@wordpress/e2e-test-utils';

describe('Group Maxi', () => {
	it('Group Maxi does not break', async () => {
		await createNewPost();
		await insertBlock('Group Maxi');

		expect(await getEditedPostContent()).toMatchSnapshot();
	});
});
