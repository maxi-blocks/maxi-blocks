/**
 * WordPress
 */
import {
	createNewPost,
	insertBlock,
	getEditedPostContent,
} from '@wordpress/e2e-test-utils';
import { getBlockStyle, addCustomCSS } from '../../utils';

describe('Divider Maxi', () => {
	it('Divider Maxi does not break', async () => {
		await createNewPost();
		await insertBlock('Divider Maxi');

		expect(await getEditedPostContent()).toMatchSnapshot();

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});

	it('Divider Custom CSS', async () => {
		await expect(await addCustomCSS(page)).toMatchSnapshot();
	}, 500000);
});
