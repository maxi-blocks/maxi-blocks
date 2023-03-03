/**
 * WordPress dependencies
 */
import { createNewPost } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	addCustomCSS,
	getBlockStyle,
	getEditedPostContent,
	insertMaxiBlock,
} from '../../utils';

describe('Video Maxi', () => {
	it('Video Maxi does not break', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Video Maxi');

		expect(await getEditedPostContent(page)).toMatchSnapshot();
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
	it('Video Maxi Custom CSS', async () => {
		await expect(await addCustomCSS(page)).toMatchSnapshot();
	}, 500000);
});
