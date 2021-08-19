/**
 * WordPress
 */
import {
	createNewPost,
	insertBlock,
	getEditedPostContent,
} from '@wordpress/e2e-test-utils';

describe('Row Maxi', () => {
	it('Row Maxi does not break', async () => {
		await createNewPost();
		await insertBlock('Container Maxi');

		await page.$$eval('.maxi-row-block__template button', button =>
			button[1].click()
		);
		expect(await getEditedPostContent()).toMatchSnapshot();
	});

	it('Row Maxi does not break in a group', async () => {
		await createNewPost();
		await insertBlock('Group Maxi');

		const addBlock = await page.$(
			'.maxi-group-block__group .maxi-block-placeholder__button'
		);

		await addBlock.click();
		await page.waitForTimeout(150);
		await page.keyboard.type('Row Maxi', { delay: 100 });

		await page.$eval(
			'.block-editor-inserter__quick-inserter-results button',
			button => button.click()
		);

		await page.$$eval('.maxi-row-block__template button', button =>
			button[1].click()
		);

		expect(await getEditedPostContent()).toMatchSnapshot();
	});
});
