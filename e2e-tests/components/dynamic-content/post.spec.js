/**
 * WordPress dependencies
 */
import {
	createNewPost,
	setClipboardData,
	pressKeyWithModifier,
	wpDataSelect,
} from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import { postCodeEditor } from './content';
import { openPreviewPage } from '../../utils';

describe('Dynamic content', () => {
	it('Should return post DC content', async () => {
		// Create the test post first
		await createNewPost();
		await page.keyboard.type('Test Post for DC', { delay: 50 });
		await page.keyboard.press('Enter');
		await page.keyboard.type('This is test content for dynamic content testing.');

		// Publish the post
		await page.click('.editor-post-publish-panel__toggle');
		await page.waitForSelector('.editor-post-publish-button');
		await page.click('.editor-post-publish-button');
		await page.waitForSelector('.post-publish-panel__postpublish');

		// Get the published post ID and data
		const postId = await page.evaluate(() => {
			const editor = wp.data.select('core/editor');
			return {
				id: editor.getCurrentPostId(),
				title: editor.getEditedPostAttribute('title'),
				content: editor.getEditedPostAttribute('content'),
			};
		});

		// Create a new post to test DC display
		await createNewPost();

		const post = {
			id: postId.id,
			title: { rendered: postId.title },
			content: { rendered: postId.content },
			excerpt: { rendered: '' },
		};

		// Set code editor as clipboard data with real post ID
		const codeEditor = postCodeEditor.replaceAll(
			'"dc-id":1',
			`"dc-id":${post.id}`
		);
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

		// Check backend - use test post data
		const expectedResults = {
			title: 'Test Post for DC',
			content: 'This is test content for dynamic content testing.',
			excerpt: 'This is test content for dynamic content testing.',
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

		const frontResults = [
			...frontTitleResults,
			...frontContentResults,
			...frontExcerptResults,
			...frontAuthorResults,
		];

		expect(frontResults.every(result => result)).toBe(true);
	});
});
