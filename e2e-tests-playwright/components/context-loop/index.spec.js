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

/**
 * Helper function to setup a test post with content
 */
async function setupTestPost(admin, editor, pageUtils, clipboardContent) {
	await admin.createNewPost({ title: 'Page CL test' });
	await editor.insertBlock({ name: 'core/paragraph' });
	await pageUtils.setClipboardData({ html: clipboardContent });
	await pageUtils.pressKeys('primary+v');
}

/**
 * Helper function to wait for content to load and verify expected results in editor
 */
async function verifyEditorResults(page, expectedResults) {
	await page.waitForSelector('.maxi-text-block__content', {
		state: 'visible',
	});
	await page.waitForFunction(() => {
		const element = document.querySelector('.maxi-text-block__content');
		return element && element.innerText !== 'No content found';
	});

	for (const [block, expectedText] of Object.entries(expectedResults)) {
		const actualText = await page.$eval(
			`.maxi-text-block.${block} .maxi-text-block__content`,
			el => el.innerText
		);
		expect(actualText).toBe(expectedText);
	}
}

/**
 * Helper function to verify expected results in preview page
 */
async function verifyPreviewResults(editor, expectedResults) {
	const previewPage = await editor.openPreviewPage();

	await previewPage.waitForSelector(
		'.maxi-text-block .maxi-text-block__content',
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
}

test.describe('Context Loop', () => {
	// Skip this suite on browsers other than Chromium due to shared posts setup conflicts when running in parallel
	test.skip(
		({ browserName }) => browserName !== 'chromium',
		'Skipped on other browsers'
	);

	test.beforeAll(async ({ requestUtils }, testInfo) => {
		if (testInfo.project.name !== 'chromium') {
			return;
		}

		await requestUtils.deleteAllPosts();

		const pages = ['Post 1', 'Post 2', 'Post 3', 'Post 4', 'Post 5'];

		for (const title of pages) {
			await requestUtils.createPost({ title, status: 'publish' });
		}
	});

	test.afterAll(async ({ requestUtils }, testInfo) => {
		if (testInfo.project.name !== 'chromium') {
			return;
		}

		await requestUtils.deleteAllPosts();
	});

	test('Should return inherited from context loop DC content', async ({
		page,
		admin,
		pageUtils,
		editor,
	}) => {
		await setupTestPost(admin, editor, pageUtils, contextLoopCodeEditor);

		const expectedResults = {
			'cl-text-1': 'Post 2',
			'cl-text-2': 'Post 3',
			'cl-text-3': 'Post 1',
		};

		await verifyEditorResults(page, expectedResults);
		await verifyPreviewResults(editor, expectedResults);
	});

	test('Should work with group inside the column containing the blocks', async ({
		page,
		admin,
		pageUtils,
		editor,
	}) => {
		await setupTestPost(admin, editor, pageUtils, codeEditorWithGroups);

		const expectedResults = {
			'cl-text-1': 'Post 2',
			'cl-text-2': 'Post 3',
			'cl-text-3': 'Post 1',
		};

		await verifyEditorResults(page, expectedResults);
		await verifyPreviewResults(editor, expectedResults);
	});

	test('Should work with row inside another row', async ({
		page,
		admin,
		pageUtils,
		editor,
	}) => {
		await setupTestPost(admin, editor, pageUtils, rowInsideRowCL);

		const expectedResults = {
			'cl-text-1': 'Post 2',
			'cl-text-2': 'Post 3',
			'cl-text-3': 'Post 5',
		};

		await verifyEditorResults(page, expectedResults);
		await verifyPreviewResults(editor, expectedResults);
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
		await expect(page.locator('.maxi-pagination')).toBeVisible();

		// Turn off CL
		const toggleSwitchOff = page
			.locator('.maxi-context-loop .maxi-toggle-switch input')
			.first();
		await toggleSwitchOff.click();

		// Check that pagination is removed
		await expect(page.locator('.maxi-pagination')).not.toBeVisible();
	});
});
