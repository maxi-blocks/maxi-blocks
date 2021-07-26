/**
 * WordPress
 */
import {
	createNewPost,
	insertBlock,
	getEditedPostContent,
} from '@wordpress/e2e-test-utils';

describe('Number Counter Maxi', () => {
	beforeEach(async () => {
		await createNewPost();
	});

	it('Number Counter Maxi does not break', async () => {
		await insertBlock('Number Counter Maxi');

		expect(await getEditedPostContent()).toMatchSnapshot();
	});
});
