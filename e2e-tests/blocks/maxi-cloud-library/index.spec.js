/**
 * WordPress dependencies
 */
import { createNewPost } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import { getEditedPostContent, insertMaxiBlock } from '../../utils';

describe('Maxi Cloud Library', () => {
	it('Maxi Cloud Library does not break', async () => {
		/* await createNewPost();
		await insertMaxiBlock(page, 'Maxi Cloud Library');

		expect(await getEditedPostContent(page)).toMatchSnapshot(); */
	});
});
