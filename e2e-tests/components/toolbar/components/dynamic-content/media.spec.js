/**
 * WordPress dependencies
 */
import {
	createNewPost,
	setClipboardData,
	pressKeyWithModifier,
	openPreviewPage,
} from '@wordpress/e2e-test-utils';
import addImageToLibrary from '../../../../utils/addImageToLibrary';

/**
 * Internal dependencies
 */
import { mediaCodeEditor } from './content';

describe('Dynamic content', () => {
	test('Should return media DC content', async () => {
		await createNewPost();
		await addImageToLibrary(page);

		// Set code editor as clipboard data
		const codeEditor = mediaCodeEditor;
		await setClipboardData({ plainText: codeEditor });

		// Set title
		await page.keyboard.type('Page DC test');

		// Add code editor
		await page.keyboard.press('Enter');
		await pressKeyWithModifier('primary', 'v');

		await page.waitForSelector('.maxi-text-block__content', {
			visible: true,
		});
		await page.waitForTimeout(1000);

		// Check backend
		const expectedResults = {
			title: 'Delete Key',
			content: 'Delete Key',
			excerpt: 'Delete Key',
			author: 'admin',
		};

		const titleBlocks = ['text-maxi-1', 'text-maxi-8', 'text-maxi-15'];
		const contentBlocks = ['text-maxi-2', 'text-maxi-9', 'text-maxi-16'];
		const excerptBlocks = ['text-maxi-3', 'text-maxi-10', 'text-maxi-17'];
		// const dateBlocks = ['text-maxi-4', 'text-maxi-11', 'text-maxi-18']; // TODO: Check if it's date format
		const authorBlocks = ['text-maxi-5', 'text-maxi-12', 'text-maxi-19'];

		const getBackResults = async (block, type) =>
			page.$eval(
				`.maxi-text-block[uniqueid="${block}"] .maxi-text-block__content`,
				(el, expect) => el.innerText === expect,
				expectedResults[type]
			);

		const titleResults = await Promise.all(
			titleBlocks.map(block => getBackResults(block, 'title'))
		);
		const contentResults = await Promise.all(
			contentBlocks.map(block => getBackResults(block, 'content'))
		);
		const excerptResults = await Promise.all(
			excerptBlocks.map(block => getBackResults(block, 'excerpt'))
		);
		const authorResults = await Promise.all(
			authorBlocks.map(block => getBackResults(block, 'author'))
		);

		const results = [
			...titleResults,
			...contentResults,
			...excerptResults,
			...authorResults,
		];

		expect(results.every(result => result)).toBe(true);

		// Check frontend
		const previewPage = await openPreviewPage();
		await previewPage.waitForSelector(
			'#text-maxi-1.maxi-text-block .maxi-text-block__content',
			{
				visible: true,
			}
		);
		await previewPage.waitForTimeout(1000);

		const getFrontResults = async (block, type) =>
			previewPage.$eval(
				`#${block}.maxi-text-block .maxi-text-block__content`,
				(el, expect) => el.innerText === expect,
				expectedResults[type]
			);

		const frontTitleResults = await Promise.all(
			titleBlocks.map(block => getFrontResults(block, 'title'))
		);
		const frontContentResults = await Promise.all(
			contentBlocks.map(block => getFrontResults(block, 'content'))
		);
		const frontExcerptResults = await Promise.all(
			excerptBlocks.map(block => getFrontResults(block, 'excerpt'))
		);
		const frontAuthorResults = await Promise.all(
			authorBlocks.map(block => getFrontResults(block, 'author'))
		);

		const frontResults = [
			...frontTitleResults,
			...frontContentResults,
			...frontExcerptResults,
			...frontAuthorResults,
		];

		expect(frontResults.every(result => result)).toBe(true);
	});
});
