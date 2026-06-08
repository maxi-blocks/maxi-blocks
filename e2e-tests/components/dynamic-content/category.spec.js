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
import { openPreviewPage, getEditorFrame } from '../../utils';

describe('Dynamic content', () => {
	it('Should return categories DC content', async () => {
		await createNewPost();

		/**
		 * Fetch categories with retry logic for CI environments
		 * WordPress REST API can be slower in GitHub Actions
		 */
		const fetchCategoriesWithRetry = async (maxRetries = 3) => {
			let attempt = 1;

			const attemptFetch = async () => {
				try {
					// First call to set the results on the store
					await wpDataSelect(
						'core',
						'getEntityRecords',
						'taxonomy',
						'category'
					);
					await page.waitForTimeout(2000);

					// Second call to actually get the data
					const categories = await wpDataSelect(
						'core',
						'getEntityRecords',
						'taxonomy',
						'category',
						{ per_page: 10 }
					);

					if (!categories || categories.length === 0) {
						throw new Error('No categories returned from API');
					}

					return categories;
				} catch (error) {
					if (attempt === maxRetries) {
						throw new Error(
							`Failed to fetch categories after ${maxRetries} attempts. Last error: ${error.message}`
						);
					}

					// Wait before retry with exponential backoff
					await page.waitForTimeout(2000 * attempt);
					attempt += 1;
					return attemptFetch();
				}
			};

			return attemptFetch();
		};

		const categories = await fetchCategoriesWithRetry();

		// Find first category with count > 0, or fall back to first category
		const category =
			(categories && categories.find(cat => cat.count > 0)) ||
			(categories && categories[0]);

		if (!category) {
			throw new Error('No categories found in WordPress');
		}

		const getExpectedResults = selectedCategory => ({
			title: selectedCategory.name,
			description: selectedCategory.description || 'No content found',
			slug: selectedCategory.slug,
			parent:
				selectedCategory.parent === 0 ? 'No parent' : 'Has parent',
			count:
				selectedCategory.count > 0
					? String(selectedCategory.count)
					: 'No content found',
			link: selectedCategory.link,
		});

		const byIdBlocksByType = {
			title: ['text-dc-title-1'],
			description: ['text-dc-description-1'],
			slug: ['text-dc-slug-1'],
			parent: ['text-dc-parent-1'],
			count: ['text-dc-count-1'],
			link: ['text-dc-link-1'],
		};
		const randomBlocksByType = {
			title: ['text-dc-title-2'],
			description: ['text-dc-description-2'],
			slug: ['text-dc-slug-2'],
			parent: ['text-dc-parent-2'],
			count: ['text-dc-count-2'],
			link: ['text-dc-link-2'],
		};
		const randomBlockClasses = Object.values(randomBlocksByType).flat();
		const allDynamicBlockClasses = [
			...Object.values(byIdBlocksByType).flat(),
			...randomBlockClasses,
		];

		// Set code editor as clipboard data with real category ID
		const codeEditor = catCodeEditor.replaceAll(
			'"dc-id":1',
			`"dc-id":${category.id}`
		);
		await setClipboardData({ plainText: codeEditor });

		const frame = await getEditorFrame(page);

		/**
		 * Wait for the editor to be ready for input
		 */
		await frame.waitForSelector(
			'.editor-post-title__input, .wp-block-post-title',
			{
				visible: true,
				timeout: 10000,
			}
		);
		await page.waitForTimeout(500);

		// Set title
		await page.keyboard.type('Categories DC test', { delay: 350 });

		// Add code editor
		await page.keyboard.press('Enter');
		await page.waitForTimeout(500);
		await pressKeyWithModifier('primary', 'v');

		/**
		 * Wait for blocks to be inserted and rendered
		 * Dynamic content blocks need time to fetch and render data
		 */
		await frame.waitForSelector('.maxi-text-block__content', {
			visible: true,
			timeout: 15000,
		});

		/**
		 * Wait for the target dynamic content blocks to be fully loaded.
		 */
		await frame.waitForFunction(
			blockClasses => {
				return blockClasses.every(blockClass => {
					const content = document.querySelector(
						`.${blockClass}.maxi-text-block .maxi-text-block__content`
					);
					const text =
						content && content.innerText && content.innerText.trim();

					return text && text !== '$text-to-replace';
				});
			},
			{ timeout: 15000 },
			allDynamicBlockClasses
		);

		await page.waitForTimeout(2000);

		// Check backend - use actual category data
		const expectedResults = getExpectedResults(category);

		const getBackResults = async (block, type, expectedResultSet) =>
			frame.$eval(
				`.${block}.maxi-text-block .maxi-text-block__content`,
				(el, expect) => el.innerText === expect,
				expectedResultSet[type]
			);

		const getBackResultSet = (blocksByType, expectedResultSet) =>
			Promise.all(
				Object.entries(blocksByType).flatMap(([type, blocks]) =>
					blocks.map(block =>
						getBackResults(block, type, expectedResultSet)
					)
				)
			);

		const getBlockHasContent = async (targetPage, block) =>
			targetPage.$eval(
				`.${block}.maxi-text-block .maxi-text-block__content`,
				el => {
					const text = el.innerText.trim();
					return text.length > 0 && text !== '$text-to-replace';
				}
			);
		const getBlocksHaveContent = (targetPage, blocks) =>
			Promise.all(
				blocks.map(block => getBlockHasContent(targetPage, block))
			);

		const byIdResults = await getBackResultSet(
			byIdBlocksByType,
			expectedResults
		);
		const randomResults = await getBlocksHaveContent(
			frame,
			randomBlockClasses
		);
		const results = [...byIdResults, ...randomResults];

		expect(results.every(result => result)).toBe(true);

		// Check frontend
		const previewPage = await openPreviewPage(page);

		/**
		 * Wait for frontend content to load with retry logic
		 * Frontend dynamic content can take time to render in CI
		 */
		await previewPage.waitForSelector(
			'.text-dc-title-1.maxi-text-block .maxi-text-block__content',
			{
				visible: true,
				timeout: 15000,
			}
		);

		/**
		 * Ensure dynamic content is fully loaded on frontend.
		 */
		await previewPage.waitForFunction(
			blockClasses => {
				return blockClasses.every(blockClass => {
					const content = document.querySelector(
						`.${blockClass}.maxi-text-block .maxi-text-block__content`
					);
					const text =
						content && content.innerText && content.innerText.trim();

					return text && text !== '$text-to-replace';
				});
			},
			{ timeout: 15000 },
			allDynamicBlockClasses
		);

		await previewPage.waitForTimeout(1000);

		const getFrontResults = async (block, type, expectedResultSet) =>
			previewPage.$eval(
				`.${block}.maxi-text-block .maxi-text-block__content`,
				(el, expect) => el.innerText === expect,
				expectedResultSet[type]
			);

		const getFrontResultSet = (blocksByType, expectedResultSet) =>
			Promise.all(
				Object.entries(blocksByType).flatMap(([type, blocks]) =>
					blocks.map(block =>
						getFrontResults(block, type, expectedResultSet)
					)
				)
			);

		const frontByIdResults = await getFrontResultSet(
			byIdBlocksByType,
			expectedResults
		);
		const frontRandomResults = await getBlocksHaveContent(
			previewPage,
			randomBlockClasses
		);

		const frontResults = [...frontByIdResults, ...frontRandomResults];

		expect(frontResults.every(result => result)).toBe(true);
	}, 90000);
});
