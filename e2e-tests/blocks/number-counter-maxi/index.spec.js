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
	updateAllBlockUniqueIds,
} from '../../utils';

describe('Number Counter Maxi', () => {
	it('Number Counter Maxi does not break', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Number Counter Maxi');

		await updateAllBlockUniqueIds(page);

		expect(await getEditedPostContent(page)).toMatchSnapshot();
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
	it('Number Counter Custom CSS', async () => {
		await expect(await addCustomCSS(page)).toMatchSnapshot();
	}, 500000);
});
