/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	getEditedPostContent,
} from '@wordpress/e2e-test-utils';
import { getBlockStyle, addCustomCSS, waitForAttribute } from '../../utils';

describe('Number Counter Maxi', () => {
	it('Number Counter Maxi does not break', async () => {
		await createNewPost();
		await insertBlock('Number Counter Maxi');

		await waitForAttribute(page, [
			'maxi-version-current',
			'maxi-version-on-creating',
		]);

		expect(await getEditedPostContent()).toMatchSnapshot();
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
	it('Number Counter Custom CSS', async () => {
		await expect(await addCustomCSS(page)).toMatchSnapshot();
	}, 500000);
});
