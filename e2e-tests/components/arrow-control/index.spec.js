/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	getEditedPostContent,
} from '@wordpress/e2e-test-utils';
// import { getBlockAttributes } from '../../utils';

describe('arrow control', () => {
	beforeEach(async () => {
		await createNewPost();
	});
	it('cheking the arrow control', async () => {
		await insertBlock('Container Maxi');
		await page.$eval(
			'.interface-pinned-items .components-button.has-icon',
			button => button.click()
		);
		await expect(await getEditedPostContent()).toMatchSnapshot();
	});
});
