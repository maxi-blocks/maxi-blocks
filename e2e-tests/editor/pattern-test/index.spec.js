/**
 * WordPress dependencies
 */
import {
	createNewPost,
	saveDraft,
	getEditedPostContent,
	setPostContent,
} from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import basePattern from './pattern';

describe('Pattern', () => {
	it('Checking pattern generate', async () => {
		await createNewPost();
		await setPostContent(basePattern);

		await saveDraft();

		expect(await getEditedPostContent()).toMatchSnapshot();
		// expect(await getBlockStyle(page)).toMatchSnapshot();
		// Checkeas frontend

		// Reload + snapshot again (snapshot de conteniido(html) y de styles)
	});
});
