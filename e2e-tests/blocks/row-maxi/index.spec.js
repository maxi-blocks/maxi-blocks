/**
 * WordPress dependencies
 */
import { createNewPost } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	getBlockStyle,
	addCustomCSS,
	getEditedPostContent,
	insertMaxiBlock,
	updateAllBlockUniqueIds,
} from '../../utils';

describe('Row Maxi', () => {
	it('Row Maxi does not break', async () => {
		await createNewPost();
		await page.waitForTimeout(1500);
		await insertMaxiBlock(page, 'Container Maxi');
		await updateAllBlockUniqueIds(page);

		await page.waitForSelector('.maxi-row-block__template button');
		await page.waitForTimeout(100);
		await page.$$eval('.maxi-row-block__template button', button =>
			button[1].click()
		);
		await page.waitForSelector('.maxi-column-block');

		await updateAllBlockUniqueIds(page);

		expect(await getEditedPostContent(page)).toMatchSnapshot();
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
	it('Row Maxi Custom CSS', async () => {
		await expect(await addCustomCSS(page)).toMatchSnapshot();
	}, 500000);
});
