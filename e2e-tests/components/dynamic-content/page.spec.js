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
import { pageCodeEditor } from './content';

describe('Dynamic content', () => {
	it('Should return page DC content', async () => {
		await createNewPost();

		// Set code editor as clipboard data
		const codeEditor = pageCodeEditor;
		await setClipboardData({ plainText: codeEditor });

		// Set title
		await page.keyboard.type('Page DC test', { delay: 350 });

		// Add code editor
		await page.keyboard.press('Enter');
		await pressKeyWithModifier('primary', 'v');

		await page.waitForSelector('.maxi-text-block__content', {
			visible: true,
		});
		await page.waitForTimeout(1000);

		// Check backend
		const expectedResults = {
			title: 'Sample Page',
			content:
				'This is an example page. It’s different from a blog post because it will stay in one place and will …',
			excerpt:
				'This is an example page. It’s different from a blog post because it will stay in one place and will …',
			author: 'admin',
		};

		const titleBlocks = ['text-dc-title-1', 'text-dc-title-2'];
		const contentBlocks = ['text-dc-content-1', 'text-dc-content-2'];
		const excerptBlocks = ['text-dc-excerpt-1', 'text-dc-excerpt-2'];
		const authorBlocks = ['text-dc-author-1', 'text-dc-author-2'];

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
