/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	getEditedPostContent,
} from '@wordpress/e2e-test-utils';
import {
	addBackgroundLayerCanvas,
	getBlockStyle,
	addCustomCSS,
} from '../../utils';

describe('Number Counter Maxi', () => {
	it('Number Counter Maxi does not break', async () => {
		await createNewPost();
		await insertBlock('Number Counter Maxi');

		expect(await getEditedPostContent()).toMatchSnapshot();

		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
	it('Number Counter Custom CSS', async () => {
		await addBackgroundLayerCanvas(page, 'canvas', 'color');
		await expect(await addCustomCSS(page)).toMatchSnapshot();
	}, 500000);
});
