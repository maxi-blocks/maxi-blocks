/**
 * WordPress dependencies
 */
import { createNewPost, insertBlock } from '@wordpress/e2e-test-utils';
import { getBlockStyle, addCustomCSS, getEditedPostContent } from '../../utils';

describe('Row Maxi', () => {
	it('Row Maxi does not break', async () => {
		await createNewPost();
		await insertBlock('Container Maxi');
		await page.waitForSelector('.maxi-row-block');

		await page.$$eval('.maxi-row-block__template button', button =>
			button[1].click()
		);
		await page.waitForSelector('.maxi-column-block');

		expect(await getEditedPostContent(page)).toMatchSnapshot();
		expect(await getBlockStyle(page)).toMatchSnapshot();
	});
	it('Row Maxi Custom CSS', async () => {
		await expect(await addCustomCSS(page)).toMatchSnapshot();
	}, 500000);
});
