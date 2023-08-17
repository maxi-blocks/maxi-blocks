/**
 * WordPress dependencies
 */
import {
	createNewPost,
	setClipboardData,
	pressKeyWithModifier,
	openPreviewPage,
} from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import { postCodeEditor } from './content';

describe('Dynamic content', () => {
	it.skip('Should return post DC content', async () => {
		await createNewPost();

		// Set code editor as clipboard data
		const codeEditor = postCodeEditor;
		await setClipboardData({ plainText: codeEditor });

		// Set title
		await page.keyboard.type('Post DC test');

		// Add code editor
		await page.keyboard.press('Enter');
		await pressKeyWithModifier('primary', 'v');

		await page.waitForSelector('.maxi-text-block__content', {
			visible: true,
		});
		await page.waitForTimeout(5000);

		// Check backend
		const expectedResults = {
			title: 'Hello world!',
			content:
				'Welcome to WordPress. This is your first post. Edit or delete it, then start writing!',
			excerpt:
				'Welcome to WordPress. This is your first post. Edit or delete it, then start writing!',
			author: 'admin',
			categories: 'Uncategorized',
			tags: 'No content found',
		};

		const titleBlocks = ['text-maxi-4se8ef1z-u', 'text-maxi-4se8ef1z-u5'];
		const contentBlocks = ['text-maxi-2', 'text-maxi-4se8ef1z-u6'];
		const excerptBlocks = ['text-maxi-3', 'text-maxi-4se8ef1z-u7'];
		const authorBlocks = ['text-maxi-5', 'text-maxi-4se8ef1z-u9'];
		const categoriesBlocks = ['text-maxi-9'];
		const tagBlocks = ['text-maxi-4se8ef1z-u0'];

		const getBackResults = async (block, type) =>
			page.$eval(
				`.maxi-text-block[uniqueid="${block}"] .maxi-text-block__content`,
				(el, expect) => el.innerText === expect,
				expectedResults[type]
			);

		const titleResults = await Promise.all(
			titleBlocks.map(async block => getBackResults(block, 'title'))
		);
		const contentResults = await Promise.all(
			contentBlocks.map(async block => getBackResults(block, 'content'))
		);
		const excerptResults = await Promise.all(
			excerptBlocks.map(async block => getBackResults(block, 'excerpt'))
		);
		const authorResults = await Promise.all(
			authorBlocks.map(async block => getBackResults(block, 'author'))
		);
		const categoriesResults = await Promise.all(
			categoriesBlocks.map(async block =>
				getBackResults(block, 'categories')
			)
		);
		const tagResults = await Promise.all(
			tagBlocks.map(async block => getBackResults(block, 'tags'))
		);

		const results = [
			...titleResults,
			...contentResults,
			...excerptResults,
			...authorResults,
			...categoriesResults,
			...tagResults,
		];

		expect(results.every(result => result)).toBe(true);

		// Check frontend
		const previewPage = await openPreviewPage();
		await previewPage.waitForSelector(
			'#text-maxi-4se8ef1z-u.maxi-text-block .maxi-text-block__content',
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
			titleBlocks.map(async block => getFrontResults(block, 'title'))
		);
		const frontContentResults = await Promise.all(
			contentBlocks.map(async block => getFrontResults(block, 'content'))
		);
		const frontExcerptResults = await Promise.all(
			excerptBlocks.map(async block => getFrontResults(block, 'excerpt'))
		);
		const frontAuthorResults = await Promise.all(
			authorBlocks.map(async block => getFrontResults(block, 'author'))
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
