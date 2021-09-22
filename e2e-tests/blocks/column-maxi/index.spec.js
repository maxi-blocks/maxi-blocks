/**
 * WordPress
 */
import {
	createNewPost,
	insertBlock,
	getEditedPostContent,
} from '@wordpress/e2e-test-utils';

describe('Column Maxi', () => {
	it('Column Maxi does not break', async () => {
		await createNewPost();
		await insertBlock('Container Maxi');

		await page.$$eval('.maxi-row-block__template button', button =>
			button[0].click()
		);
		expect(await getEditedPostContent()).toMatchSnapshot();
	});
});
