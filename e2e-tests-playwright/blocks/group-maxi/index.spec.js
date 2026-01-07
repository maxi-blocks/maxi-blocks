/**
 * WordPress dependencies
 */
import { expect } from '@wordpress/e2e-test-utils-playwright';

/**
 * Internal dependencies
 */
import {
	addCustomCSS,
	getBlockStyle,
	getEditedPostContent,
	insertMaxiBlock,
	test,
	updateAllBlockUniqueIds,
} from '../../utils';

test.describe('Group Maxi', () => {
	test('Group Maxi does not break', async ({ admin, editor, page }) => {
		await admin.createNewPost();
		await insertMaxiBlock(editor, page, 'Group Maxi');

		await updateAllBlockUniqueIds(page);

		await expect(await getEditedPostContent(page, editor)).toMatchSnapshot(
			'group-maxi__content.html'
		);
		await page.waitForTimeout(300);
		await expect(await getBlockStyle(page)).toMatchSnapshot(
			'group-maxi__style.css'
		);
	});

	test('Group Maxi Custom CSS', async ({ admin, editor, page }) => {
		await admin.createNewPost();
		await insertMaxiBlock(editor, page, 'Group Maxi');
		await updateAllBlockUniqueIds(page);

		await expect(await addCustomCSS(page)).toMatchSnapshot(
			'group-custom-css__style.css'
		);
	});
});
