/**
 * WordPress dependencies
 */
import {
	createNewPost,
	setClipboardData,
	pressKeyWithModifier,
} from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import { postCodeEditor } from './content';
import { openPreviewPage } from '../../utils';

describe('Dynamic content', () => {
	it('Should return post DC content', async () => {
		await createNewPost();

		// Set code editor as clipboard data
		const codeEditor = postCodeEditor;
		await setClipboardData({ plainText: codeEditor });

		// Set title
		await page.keyboard.type('Post DC test', { delay: 350 });

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

		const titleBlocks = ['text-dc-title-1', 'text-dc-title-2'];
		const contentBlocks = ['text-dc-content-1', 'text-dc-content-2'];
		const excerptBlocks = ['text-dc-excerpt-1', 'text-dc-excerpt-2'];
		const authorBlocks = ['text-dc-author-1', 'text-dc-author-2'];
		const categoriesBlocks = [
			'text-dc-categories-1',
			'text-dc-categories-2',
		];
		const tagBlocks = ['text-dc-tags-1', 'text-dc-tags-2'];

		const getBackResults = async (block, type) =>
			page.$eval(
				`.${block}.maxi-text-block .maxi-text-block__content`,
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

		// Check that at least one block in each pair returns valid content
		const titlePass = titleResults.some(result => result);
		const contentPass = contentResults.some(result => result);
		const excerptPass = excerptResults.some(result => result);
		const authorPass = authorResults.some(result => result);
		const categoriesPass = categoriesResults.some(result => result);
		const tagPass = tagResults.some(result => result);

		expect(titlePass).toBe(true);
		expect(contentPass).toBe(true);
		expect(excerptPass).toBe(true);
		expect(authorPass).toBe(true);
		expect(categoriesPass).toBe(true);
		expect(tagPass).toBe(true);

		// Check frontend
		const previewPage = await openPreviewPage(page);
		await previewPage.waitForSelector(
			'.text-dc-title-1.maxi-text-block .maxi-text-block__content',
			{
				visible: true,
			}
		);
		await previewPage.waitForTimeout(1000);

		const getFrontResults = async (block, type) =>
			previewPage.$eval(
				`.${block}.maxi-text-block .maxi-text-block__content`,
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

		// Check that at least one block in each pair returns valid content
		const frontTitlePass = frontTitleResults.some(result => result);
		const frontContentPass = frontContentResults.some(result => result);
		const frontExcerptPass = frontExcerptResults.some(result => result);
		const frontAuthorPass = frontAuthorResults.some(result => result);

		expect(frontTitlePass).toBe(true);
		expect(frontContentPass).toBe(true);
		expect(frontExcerptPass).toBe(true);
		expect(frontAuthorPass).toBe(true);
	});
});
