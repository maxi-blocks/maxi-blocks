/**
 * WordPress
 */
import {
	createNewPost,
	insertBlock,
	getEditedPostContent,
} from '@wordpress/e2e-test-utils';
import { getBlockStyle } from '../../utils';

describe('Map Maxi', () => {
	it('Map Maxi does not break', async () => {
		await createNewPost();
		await insertBlock('Map Maxi');

		expect(await getEditedPostContent()).toMatchSnapshot();

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
});
