/* eslint-disable no-await-in-loop */
/**
 * WordPress dependencies
 */
import {
	createNewPost,
	openPreviewPage,
	pressKeyWithModifier,
	publishPost,
	selectBlockByClientId,
	setClipboardData,
	trashAllPosts,
} from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import contextLoopCodeEditor, {
	codeEditorWithGroups,
	rowInsideRowCL,
} from './content';
import { insertMaxiBlock, openSidebarTab } from '../../utils';
import goThroughBlocks from '../../utils/goThroughBlocks';

describe('Context Loop', () => {
	beforeAll(async () => {
		const pages = ['Post 1', 'Post 2', 'Post 3'];

		for (const title of pages) {
			await createNewPost({ title });
			await publishPost();
		}
	});

	it('Should return inherited from context loop DC content', async () => {
		await createNewPost();
		await page.reload();

		// Set code editor as clipboard data
		const codeEditor = contextLoopCodeEditor;
		await setClipboardData({ plainText: codeEditor });

		// Set title
		await page.keyboard.type('Page CL test', { delay: 350 });

		// Add code editor
		await page.keyboard.press('Enter');
		await pressKeyWithModifier('primary', 'v');

		await page.waitForSelector('.maxi-text-block__content', {
			visible: true,
		});
		await page.waitForTimeout(1000);

		const expectedResults = {
			'cl-text-1': 'Post 2',
			'cl-text-2': 'Post 1',
			'cl-text-3': 'Post 1',
		};

		const getBackResults = async block =>
			page.$eval(
				`.maxi-text-block.${block} .maxi-text-block__content`,
				(el, expect) => {
					return el.innerText === expect;
				},
				expectedResults[block]
			);

		const results = await Promise.all(
			Object.keys(expectedResults).map(async block =>
				getBackResults(block)
			)
		);

		// await page.waitForTimeout(20000);
		expect(results.every(result => result)).toBe(true);

		// Check frontend
		const previewPage = await openPreviewPage();

		await previewPage.waitForSelector(
			'.cl-text-3.maxi-text-block .maxi-text-block__content',
			{
				visible: true,
			}
		);
		await previewPage.waitForTimeout(1000);

		const getFrontResults = async block =>
			previewPage.$eval(
				`.${block}.maxi-text-block .maxi-text-block__content`,
				(el, expect) => el.innerText === expect,
				expectedResults[block]
			);

		const frontResults = await Promise.all(
			Object.keys(expectedResults).map(async block =>
				getFrontResults(block)
			)
		);

		expect(frontResults.every(result => result)).toBe(true);

		await previewPage.close();
	});

	it('Should work with group inside the column containing the blocks', async () => {
		await createNewPost();
		await page.reload();

		// Set code editor as clipboard data
		const codeEditor = codeEditorWithGroups;
		await setClipboardData({ plainText: codeEditor });

		// Set title
		await page.keyboard.type('Page CL test', { delay: 350 });

		// Add code editor
		await page.keyboard.press('Enter');
		await pressKeyWithModifier('primary', 'v');

		await page.waitForSelector('.maxi-text-block__content', {
			visible: true,
		});
		await page.waitForTimeout(1000);

		const expectedResults = {
			'cl-text-1': 'Post 2',
			'cl-text-2': 'Post 1',
			'cl-text-3': 'Post 1',
		};

		const getBackResults = async block =>
			page.$eval(
				`.maxi-text-block.${block} .maxi-text-block__content`,
				(el, expect) => {
					return el.innerText === expect;
				},
				expectedResults[block]
			);

		const results = await Promise.all(
			Object.keys(expectedResults).map(async block =>
				getBackResults(block)
			)
		);

		// await page.waitForTimeout(20000);
		expect(results.every(result => result)).toBe(true);

		// Check frontend
		const previewPage = await openPreviewPage();

		await previewPage.waitForSelector(
			'.cl-text-3.maxi-text-block .maxi-text-block__content',
			{
				visible: true,
			}
		);
		await previewPage.waitForTimeout(1000);

		const getFrontResults = async block =>
			previewPage.$eval(
				`.${block}.maxi-text-block .maxi-text-block__content`,
				(el, expect) => el.innerText === expect,
				expectedResults[block]
			);

		const frontResults = await Promise.all(
			Object.keys(expectedResults).map(async block =>
				getFrontResults(block)
			)
		);

		expect(frontResults.every(result => result)).toBe(true);

		await previewPage.close();
	});

	it('Should work with row inside another row', async () => {
		await createNewPost();
		await page.reload();

		// Set code editor as clipboard data
		const codeEditor = rowInsideRowCL;
		await setClipboardData({ plainText: codeEditor });

		// Set title
		await page.keyboard.type('Page CL test', { delay: 350 });

		// Add code editor
		await page.keyboard.press('Enter');
		await pressKeyWithModifier('primary', 'v');

		await page.waitForSelector('.maxi-text-block__content', {
			visible: true,
		});
		await page.waitForTimeout(1000);

		const expectedResults = {
			'cl-text-1': 'Post 2',
			'cl-text-2': 'Post 1',
			'cl-text-3': 'Post 1',
		};

		const getBackResults = async block =>
			page.$eval(
				`.maxi-text-block.${block} .maxi-text-block__content`,
				(el, expect) => {
					return el.innerText === expect;
				},
				expectedResults[block]
			);

		const results = await Promise.all(
			Object.keys(expectedResults).map(async block =>
				getBackResults(block)
			)
		);

		// await page.waitForTimeout(20000);
		expect(results.every(result => result)).toBe(true);

		// Check frontend
		const previewPage = await openPreviewPage();

		await previewPage.waitForSelector(
			'.cl-text-3.maxi-text-block .maxi-text-block__content',
			{
				visible: true,
			}
		);
		await previewPage.waitForTimeout(1000);

		const getFrontResults = async block =>
			previewPage.$eval(
				`.${block}.maxi-text-block .maxi-text-block__content`,
				(el, expect) => el.innerText === expect,
				expectedResults[block]
			);

		const frontResults = await Promise.all(
			Object.keys(expectedResults).map(async block =>
				getFrontResults(block)
			)
		);

		expect(frontResults.every(result => result)).toBe(true);

		await previewPage.close();
	});

	it('Should remove pagination when CL is disabled', async () => {
		await createNewPost();

		// Set title
		await page.keyboard.type('Page CL test', { delay: 350 });

		await page.keyboard.press('Enter');

		await insertMaxiBlock(page, 'Container Maxi');

		const blocks = await page.evaluate(() => {
			return wp.data.select('core/block-editor').getBlocks();
		});

		let rowClientId;
		goThroughBlocks(blocks, block => {
			if (block.name === 'maxi-blocks/row-maxi') {
				rowClientId = block.clientId;
			}
		});

		await selectBlockByClientId(rowClientId);

		const accordionPanel = await openSidebarTab(
			page,
			'style',
			'context loop'
		);

		await page.waitForTimeout(1000);

		// Turn on CL
		const toggleSwitch = await accordionPanel.$(
			'.maxi-context-loop .maxi-toggle-switch:nth-child(1) input'
		);
		await toggleSwitch.evaluate(el => el.click());

		// Select author type
		const authorTypeControl = await accordionPanel.$(
			'.maxi-context-loop-control__type'
		);
		const authorTypeSelect = await authorTypeControl.$('select');
		await authorTypeSelect.select('users');

		// Select by date relation
		const relationControl = await accordionPanel.waitForSelector(
			'.maxi-context-loop-control__relation'
		);
		const relationSelect = await relationControl.$('select');
		await relationSelect.select('by-date');

		// Turn on Pagination
		const paginationControl = await accordionPanel.$(
			'.maxi-context-loop-control__pagination'
		);
		const paginationInput = await paginationControl.$('input');
		await paginationInput.evaluate(el => el.click());

		// Check that pagination is displayed
		expect(
			await page.evaluate(() => {
				const pagination = document.querySelector('.maxi-pagination');
				return pagination !== null;
			})
		).toBe(true);

		// Turn off CL
		const toggleSwitchOff = await accordionPanel.$(
			'.maxi-context-loop .maxi-toggle-switch:nth-child(1) input'
		);
		await toggleSwitchOff.evaluate(el => el.click());

		// Check that pagination is removed
		expect(
			await page.evaluate(() => {
				const pagination = document.querySelector('.maxi-pagination');
				return pagination === null;
			})
		).toBe(true);
	});

	// TODO:
	// Should be an author:current page code editor (or any other FSE) with accumulator and check that it works

	afterAll(async () => {
		await page.bringToFront();
		await trashAllPosts();
	});
});
