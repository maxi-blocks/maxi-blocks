/**
 * WordPress
 */
import {
	createNewPost,
	insertBlock,
	getEditedPostContent,
} from '@wordpress/e2e-test-utils';
/**
 * Interactive dependencies
 */
import { modalMock } from '../../utils';

describe('Shape Maxi', () => {
	it('Shape Maxi does not break', async () => {
		await createNewPost();
		await insertBlock('Shape Maxi');

		await modalMock(page, { type: 'block-shape' });

		expect(await getEditedPostContent()).toMatchSnapshot();
	});
});
