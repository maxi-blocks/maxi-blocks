/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
import { addCustomCSS, getBlockStyle, getEditedPostContent } from '../../utils';

describe('Number Counter Maxi', () => {
	it('Number Counter Maxi does not break', async () => {
		await createNewPost();
		await insertBlock('Number Counter Maxi');

		expect(await getEditedPostContent(page)).toMatchSnapshot();
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
	it('Number Counter Custom CSS', async () => {
		await expect(await addCustomCSS(page)).toMatchSnapshot();
	}, 500000);
});
