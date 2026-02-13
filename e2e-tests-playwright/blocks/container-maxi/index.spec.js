/**
 * WordPress dependencies
 */
import { expect } from '@wordpress/e2e-test-utils-playwright';

/**
 * Internal dependencies
 */
import {
	addBackgroundLayer,
	addCustomCSS,
	getBlockStyle,
	getEditedPostContent,
	insertMaxiBlock,
	test,
	updateAllBlockUniqueIds,
} from '../../utils';

test.describe('Container Maxi', () => {
	test('Container Maxi does not break', async ({ admin, editor, page }) => {
		await admin.createNewPost();
		await insertMaxiBlock(editor, page, 'Container Maxi');

		await updateAllBlockUniqueIds(page);

		await expect(await getEditedPostContent(page, editor)).toMatchSnapshot(
			'container-maxi-does-not-break__content.html'
		);

		await page.waitForTimeout(300);
		await expect(await getBlockStyle(page)).toMatchSnapshot(
			'container-maxi-does-not-break__style.css'
		);
	});

	test('Container Maxi Custom CSS', async ({ admin, editor, page }) => {
		await admin.createNewPost();
		await insertMaxiBlock(editor, page, 'Container Maxi');

		await updateAllBlockUniqueIds(page);

		await addBackgroundLayer(page, 'color');
		await addBackgroundLayer(page, 'color');

		await expect(await addCustomCSS(page)).toMatchSnapshot(
			'container-maxi-custom-css__style.css'
		);
	});
});
