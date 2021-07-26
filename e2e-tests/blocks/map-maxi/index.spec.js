/**
 * WordPress
 */
import {
	createNewPost,
	insertBlock,
	getEditedPostContent,
} from '@wordpress/e2e-test-utils';

describe('Map Maxi', () => {
	beforeEach(async () => {
		await createNewPost();
	});

	it('Map Maxi does not break', async () => {
		await insertBlock('Map Maxi');

		expect(await getEditedPostContent()).toMatchSnapshot();
	});
});
