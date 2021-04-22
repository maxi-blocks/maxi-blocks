/**
 * WordPress
 */
import {
	createNewPost,
	insertBlock,
	getEditedPostContent,
	pressKeyWithModifier,
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

	it('Test Text Maxi split', async () => {
		await createNewPost();

		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing Text Maxi...onSplit');
		await page.keyboard.press('ArrowLeft');
		await page.keyboard.press('ArrowLeft');
		await page.keyboard.press('ArrowLeft');
		await page.keyboard.press('ArrowLeft');
		await page.keyboard.press('ArrowLeft');
		await page.keyboard.press('ArrowLeft');
		await page.keyboard.press('ArrowLeft');
		await page.keyboard.press('Enter');

		expect(await getEditedPostContent()).toMatchSnapshot();
	});

	it('Test Text Maxi merge', async () => {
		await insertBlock('Text Maxi');
		await page.keyboard.type('Test Text Maxi...');
		await insertBlock('Text Maxi');
		await page.keyboard.type('...OnMerge');
		await page.keyboard.press('ArrowLeft');
		await page.keyboard.press('ArrowLeft');
		await page.keyboard.press('ArrowLeft');
		await page.keyboard.press('ArrowLeft');
		await page.keyboard.press('ArrowLeft');
		await page.keyboard.press('ArrowLeft');
		await page.keyboard.press('ArrowLeft');
		await page.keyboard.press('ArrowLeft');
		await page.keyboard.press('ArrowLeft');
		await page.keyboard.press('ArrowLeft');
		await page.keyboard.press('ArrowLeft');
		await page.keyboard.press('Delete');

		expect(await getEditedPostContent()).toMatchSnapshot();
	});

	it('Testing the split in a Text Maxi with bold', async () => {
		await insertBlock('Text Maxi');
		await page.keyboard.type('Testing Text Maxi Bold');
		pressKeyWithModifier('shift', 'ArrowLeft');
		pressKeyWithModifier('shift', 'ArrowLeft');
		pressKeyWithModifier('shift', 'ArrowLeft');
		pressKeyWithModifier('shift', 'ArrowLeft');
		await page.$eval('.toolbar-item__bold', button => button.click());
		await page.keyboard.press('ArrowLeft');
		await page.keyboard.press('Enter');

		expect(await getEditedPostContent()).toMatchSnapshot();
	});
});
