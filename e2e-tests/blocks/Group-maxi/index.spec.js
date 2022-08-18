/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	getEditedPostContent,
} from '@wordpress/e2e-test-utils';
import { getBlockStyle, addCustomCSS, waitForAttribute } from '../../utils';

describe('Group Maxi', () => {
	it('Group Maxi does not break', async () => {
		await createNewPost();
		await insertBlock('Group Maxi');

		await waitForAttribute(page, [
			'maxi-version-current',
			'maxi-version-on-creating',
		]);

		expect(await getEditedPostContent()).toMatchSnapshot();
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
	it('Group Maxi Custom CSS', async () => {
		await expect(await addCustomCSS(page)).toMatchSnapshot();
	}, 500000);
});
