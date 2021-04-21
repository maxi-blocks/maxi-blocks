/**
 * WordPress
 */
import {
	createNewPost,
	insertBlock,
	getEditedPostContent,
} from '@wordpress/e2e-test-utils';

describe('Font Icon Maxi', () => {
	beforeEach(async () => {
		await createNewPost();
	});

	it('Font Icon Maxi', async () => {
		await insertBlock('Font Icon Maxi');

		expect(await getEditedPostContent()).toMatchSnapshot();
	});
});
