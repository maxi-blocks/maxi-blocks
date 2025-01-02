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
import { catCodeEditor } from './content';

describe('Dynamic content', () => {
	it('Should return categories DC content', async () => {
		await createNewPost();

		// Set code editor as clipboard data
		const codeEditor = catCodeEditor;
		await setClipboardData({ plainText: codeEditor });

		// Set title
		await page.keyboard.type('Categories DC test', { delay: 350 });

		// Add code editor
		await page.keyboard.press('Enter');
		await pressKeyWithModifier('primary', 'v');

		await page.waitForSelector('.maxi-text-block__content', {
			visible: true,
		});
		await page.waitForTimeout(5000);

		// Check backend
		const expectedResults = {
			title: 'Uncategorized',
			description: 'No content found',
			slug: 'uncategorized',
			parent: 'No parent',
			count: '1',
			link: 'http://localhost:8889/?cat=1',
		};

		const titleBlocks = ['text-dc-title-1', 'text-dc-title-2'];
		const descriptionBlocks = [
			'text-dc-description-1',
			'text-dc-description-2',
		];
		const slugBlocks = ['text-dc-slug-1', 'text-dc-slug-2'];
		const parentBlocks = ['text-dc-parent-1', 'text-dc-parent-2'];
		const countBlocks = ['text-dc-count-1', 'text-dc-count-2'];
		const linkBlocks = ['text-dc-link-1', 'text-dc-link-2'];

		const getBackResults = async (block, type) =>
			page.$eval(
				`.${block}.maxi-text-block .maxi-text-block__content`,
				(el, expect) => el.innerText === expect,
				expectedResults[type]
			);

		const titleResults = await Promise.all(
			titleBlocks.map(async block => getBackResults(block, 'title'))
		);
		const descriptionResults = await Promise.all(
			descriptionBlocks.map(async block =>
				getBackResults(block, 'description')
			)
		);
		const slugResults = await Promise.all(
			slugBlocks.map(async block => getBackResults(block, 'slug'))
		);
		const parentResults = await Promise.all(
			parentBlocks.map(async block => getBackResults(block, 'parent'))
		);
		const countResults = await Promise.all(
			countBlocks.map(async block => getBackResults(block, 'count'))
		);
		const linkResults = await Promise.all(
			linkBlocks.map(async block => getBackResults(block, 'link'))
		);
		const results = [
			...titleResults,
			...descriptionResults,
			...slugResults,
			...parentResults,
			...countResults,
			...linkResults,
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
			descriptionBlocks.map(async block =>
				getFrontResults(block, 'description')
			)
		);
		const frontExcerptResults = await Promise.all(
			slugBlocks.map(async block => getFrontResults(block, 'slug'))
		);
		const frontAuthorResults = await Promise.all(
			parentBlocks.map(async block => getFrontResults(block, 'parent'))
		);
		const frontCountResults = await Promise.all(
			countBlocks.map(async block => getFrontResults(block, 'count'))
		);
		const frontLinkResults = await Promise.all(
			linkBlocks.map(async block => getFrontResults(block, 'link'))
		);

		const frontResults = [
			...frontTitleResults,
			...frontContentResults,
			...frontExcerptResults,
			...frontAuthorResults,
			...frontCountResults,
			...frontLinkResults,
		];

		expect(frontResults.every(result => result)).toBe(true);
	});
});
