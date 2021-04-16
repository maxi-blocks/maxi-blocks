/**
 * WordPress
 */
import {
	createNewPost,
	insertBlock,
	getEditedPostContent,
	clearLocalStorage,
	setBrowserViewport,
} from '@wordpress/e2e-test-utils';
// import {
// 	activatePlugin,
// 	enablePageDialogAccept,
// 	isOfflineMode,
// 	trashAllPosts,
// } from '@wordpress/e2e-test-utils';

// jest.setTimeout(1000000);
jest.setTimeout(20000);

describe('TextMaxi', () => {
	// beforeEach(async () => {
	// 	await createNewPost();
	// 	jest.setTimeout(100000);
	// });

	test('Writes a sentence on Text Maxi', async () => {
		await createNewPost();

		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing Text Maxi');

		expect(await getEditedPostContent()).toMatchSnapshot();
	});

	test('text maxi split', async () => {
		await createNewPost();

		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing Text Maxi split');
		await page.keyboard.press('ArrowLeft');
		await page.keyboard.press('Enter');
		await browser.restart;

		expect(await getEditedPostContent()).toMatchSnapshot();
	});

	afterAll(async () => {
		await clearLocalStorage();
		await setBrowserViewport('large');
	});
});
