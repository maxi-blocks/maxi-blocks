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

	it('ButtonMaxi', async () => {
		await insertBlock('Button Maxi');
		await page.keyboard.type('Button Maxi');

		expect(await getEditedPostContent()).toMatchSnapshot();
	});
});
