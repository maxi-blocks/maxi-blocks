/* eslint-disable no-await-in-loop */
/**
 * WordPress dependencies
 */
import { expect } from '@wordpress/e2e-test-utils-playwright';
/**
 * Internal dependencies
 */
import { openSidebarTab, test } from '../../utils';
import {
	contextLoopCodeEditor,
	codeEditorWithGroups,
	rowInsideRowCL,
} from './content';

test.describe('Context Loop', () => {
	test.beforeEach(async ({ page, admin, editor, requestUtils }) => {
		await requestUtils.deleteAllPosts();

		const pages = ['Post 1', 'Post 2', 'Post 3', 'Post 4', 'Post 5'];

		for (const title of pages) {
			await admin.createNewPost({ title, page });
			await editor.publishPost({ page });
		}
	});

	test.afterEach(async ({ requestUtils }) => {
		await requestUtils.deleteAllPosts();
	});

	test('Should return inherited from context loop DC content', async ({
		page,
		admin,
		pageUtils,
		editor,
	}) => {
		await admin.createNewPost({ title: 'Page CL test' });

		await editor.insertBlock({ name: 'core/paragraph' });

		await pageUtils.setClipboardData({ html: contextLoopCodeEditor });
		await pageUtils.pressKeys('primary+v');

		await page.waitForSelector('.maxi-text-block__content', {
			visible: true,
		});
		await page.waitForFunction(() => {
			const element = document.querySelector('.maxi-text-block__content');
			return element && element.innerText !== 'No content found';
		});

		const expectedResults = {
			'cl-text-1': 'Post 2',
			'cl-text-2': 'Post 3',
			'cl-text-3': 'Post 1',
		};

		for (const [block, expectedText] of Object.entries(expectedResults)) {
			const actualText = await page.$eval(
				`.maxi-text-block.${block} .maxi-text-block__content`,
				el => el.innerText
			);
			expect(actualText).toBe(expectedText);
		}

		// Check frontend
		const previewPage = await editor.openPreviewPage();

		await previewPage.waitForSelector(
			'.cl-text-3.maxi-text-block .maxi-text-block__content',
			{
				visible: true,
			}
		);

		for (const [block, expectedText] of Object.entries(expectedResults)) {
			const actualText = await previewPage.$eval(
				`.${block}.maxi-text-block .maxi-text-block__content`,
				el => el.innerText
			);
			expect(actualText).toBe(expectedText);
		}

		await previewPage.close();
	});

	test('Should work with group inside the column containing the blocks', async ({
		page,
		admin,
		pageUtils,
		editor,
	}) => {
		await admin.createNewPost({ title: 'Page CL test' });

		await editor.insertBlock({ name: 'core/paragraph' });

		await pageUtils.setClipboardData({ html: codeEditorWithGroups });
		await pageUtils.pressKeys('primary+v');

		await page.waitForSelector('.maxi-text-block__content', {
			visible: true,
		});
		await page.waitForFunction(() => {
			const element = document.querySelector('.maxi-text-block__content');
			return element && element.innerText !== 'No content found';
		});

		const expectedResults = {
			'cl-text-1': 'Post 2',
			'cl-text-2': 'Post 3',
			'cl-text-3': 'Post 1',
		};

		for (const [block, expectedText] of Object.entries(expectedResults)) {
			const actualText = await page.$eval(
				`.maxi-text-block.${block} .maxi-text-block__content`,
				el => el.innerText
			);
			expect(actualText).toBe(expectedText);
		}

		// Check frontend
		const previewPage = await editor.openPreviewPage();

		await previewPage.waitForSelector(
			'.cl-text-3.maxi-text-block .maxi-text-block__content',
			{
				visible: true,
			}
		);

		for (const [block, expectedText] of Object.entries(expectedResults)) {
			const actualText = await previewPage.$eval(
				`.${block}.maxi-text-block .maxi-text-block__content`,
				el => el.innerText
			);
			expect(actualText).toBe(expectedText);
		}

		await previewPage.close();
	});

	test('Should work with row inside another row', async ({
		page,
		admin,
		pageUtils,
		editor,
	}) => {
		await admin.createNewPost({ title: 'Page CL test' });

		await editor.insertBlock({ name: 'core/paragraph' });

		await pageUtils.setClipboardData({ html: rowInsideRowCL });
		await pageUtils.pressKeys('primary+v');

		await page.waitForSelector('.maxi-text-block__content', {
			visible: true,
		});
		await page.waitForFunction(() => {
			const element = document.querySelector('.maxi-text-block__content');
			return element && element.innerText !== 'No content found';
		});

		const expectedResults = {
			'cl-text-1': 'Post 2',
			'cl-text-2': 'Post 3',
			'cl-text-3': 'Post 5',
		};

		for (const [block, expectedText] of Object.entries(expectedResults)) {
			const actualText = await page.$eval(
				`.maxi-text-block.${block} .maxi-text-block__content`,
				el => el.innerText
			);
			expect(actualText).toBe(expectedText);
		}

		// Check frontend
		const previewPage = await editor.openPreviewPage();

		await previewPage.waitForSelector(
			'.cl-text-3.maxi-text-block .maxi-text-block__content',
			{
				visible: true,
			}
		);

		for (const [block, expectedText] of Object.entries(expectedResults)) {
			const actualText = await previewPage.$eval(
				`.${block}.maxi-text-block .maxi-text-block__content`,
				el => el.innerText
			);
			expect(actualText).toBe(expectedText);
		}

		await previewPage.close();
	});

	test('Should remove pagination when CL is disabled', async ({
		page,
		admin,
		pageUtils,
		editor,
	}) => {
		await admin.createNewPost({ title: 'Page CL test' });

		await editor.insertBlock({ name: 'maxi-blocks/container-maxi' });

		// Wait for the container to be inserted
		await page.waitForSelector('.maxi-container-block', {
			visible: true,
		});

		// Find the row block inside the container
		const rowBlock = page.locator('.maxi-row-block').first();
		await rowBlock.click();

		// Click on the Style tab
		await openSidebarTab(page, 'style', 'context loop');

		// Turn on CL
		const toggleSwitch = page
			.locator('.maxi-context-loop .maxi-toggle-switch input')
			.first();
		await toggleSwitch.click();

		// Select author type
		const typeSelect = page.locator(
			'.maxi-context-loop-control__type select'
		);
		await typeSelect.selectOption('users');

		// Select by date relation
		const relationSelect = page.locator(
			'.maxi-context-loop-control__relation select'
		);
		await relationSelect.selectOption('by-date');

		// Turn on Pagination
		const paginationToggle = page.locator(
			'.maxi-context-loop-control__pagination input'
		);
		await paginationToggle.click();

		// Check that pagination is displayed
		const paginationVisible = await page
			.locator('.maxi-pagination')
			.isVisible();
		expect(paginationVisible).toBe(true);

		// Turn off CL
		const toggleSwitchOff = page
			.locator('.maxi-context-loop .maxi-toggle-switch input')
			.first();
		await toggleSwitchOff.click();

		// Check that pagination is removed
		const paginationHidden = await page
			.locator('.maxi-pagination')
			.isVisible();
		expect(paginationHidden).toBe(false);
	});
});
