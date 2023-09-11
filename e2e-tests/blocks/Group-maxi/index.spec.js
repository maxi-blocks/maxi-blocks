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

describe('Group Maxi', () => {
	it('Group Maxi does not break', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Group Maxi');

		await updateAllBlockUniqueIds(page);

		expect(await getEditedPostContent(page)).toMatchSnapshot();
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
	it('Group Maxi Custom CSS', async () => {
		await expect(await addCustomCSS(page)).toMatchSnapshot();
	}, 500000);
});
