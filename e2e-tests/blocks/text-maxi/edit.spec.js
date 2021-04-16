/**
 * WordPress
 */
import {
	createNewPost,
	insertBlock,
	getEditedPostContent,
} from '@wordpress/e2e-test-utils';

describe('TextMaxi', () => {
	beforeEach(async () => {
		await createNewPost();
	});

	it('Writes a sentence on Text Maxi', async () => {
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing Text Maxi');

		expect(await getEditedPostContent()).toMatchSnapshot();
	});

	it('text maxi split', async () => {
		await createNewPost();

		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing Text Maxi split');
		await page.keyboard.press('ArrowLeft');
		await page.keyboard.press('Enter');
		await browser.restart;

		expect(await getEditedPostContent()).toMatchSnapshot();
	});
});
