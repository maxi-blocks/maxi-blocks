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
import { catCodeEditor } from './content';
import { openPreviewPage } from '../../utils';

describe('Dynamic content', () => {
	it('Should return categories DC content', async () => {
		await createNewPost();

		// Fetch a category that has posts
		// First call to set the results on the store
		await wpDataSelect('core', 'getEntityRecords', 'taxonomy', 'category');
		await page.waitForTimeout(1000);

		// Second call to actually get the data
		const categories = await wpDataSelect(
			'core',
			'getEntityRecords',
			'taxonomy',
			'category',
			{ per_page: 10 }
		);

		// Find first category with count > 0, or fall back to first category
		const category =
			(categories && categories.find(cat => cat.count > 0)) ||
			(categories && categories[0]);

		if (!category) {
			throw new Error('No categories found in WordPress');
		}

		// Set code editor as clipboard data with real category ID
		const codeEditor = catCodeEditor.replaceAll(
			'"dc-id":1',
			`"dc-id":${category.id}`
		);
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

		// Check backend - use actual category data
		const expectedResults = {
			title: category.name,
			description: category.description || 'No content found',
			slug: category.slug,
			parent: category.parent === 0 ? 'No parent' : 'Has parent',
			count:
				category.count > 0
					? String(category.count)
					: 'No content found',
			link: category.link,
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
