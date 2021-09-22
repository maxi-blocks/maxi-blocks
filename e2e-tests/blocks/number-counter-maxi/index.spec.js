/**
 * WordPress
 */
import {
	createNewPost,
	insertBlock,
	getEditedPostContent,
} from '@wordpress/e2e-test-utils';

describe('Number Counter Maxi', () => {
	it('Number Counter Maxi does not break', async () => {
		await createNewPost();
		await insertBlock('Number Counter Maxi');

		expect(await getEditedPostContent()).toMatchSnapshot();
	});
});
