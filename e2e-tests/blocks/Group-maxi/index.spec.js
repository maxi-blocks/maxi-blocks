/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
import { addCustomCSS, getBlockStyle, getEditedPostContent } from '../../utils';

describe('Group Maxi', () => {
	it('Group Maxi does not break', async () => {
		await createNewPost();
		await insertBlock('Group Maxi');

		expect(await getEditedPostContent(page)).toMatchSnapshot();
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
	it('Group Maxi Custom CSS', async () => {
		await expect(await addCustomCSS(page)).toMatchSnapshot();
	}, 500000);
});
