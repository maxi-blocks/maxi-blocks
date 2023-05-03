/* eslint-disable no-await-in-loop */
/**
 * WordPress dependencies
 */
import {
	createNewPost,
	openPreviewPage,
	pressKeyWithModifier,
	publishPost,
	setClipboardData,
	trashAllPosts,
} from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import contextLoopCodeEditor from './content';

describe('Context Loop', () => {
	beforeAll(async () => {
		const pages = ['@Post 1', '@Post 2', '@Post 3'];

		for (const title of pages) {
			await createNewPost({ title });
			await publishPost();
		}
	});

	it.skip('Should return inherited from context loop DC content', async () => {
		await createNewPost();

		// Set code editor as clipboard data
		const codeEditor = contextLoopCodeEditor;
		await setClipboardData({ plainText: codeEditor });

		// Set title
		await page.keyboard.type('Page CL test');

		// Add code editor
		await page.keyboard.press('Enter');
		await pressKeyWithModifier('primary', 'v');

		await page.waitForSelector('.maxi-text-block__content', {
			visible: true,
		});
		await page.waitForTimeout(1000);

		const expectedResults = {
			'text-maxi-1': '@Post 2',
			'text-maxi-2': '@Post 1',
			'text-maxi-3': '@Post 3',
		};

		const getBackResults = async block =>
			page.$eval(
				`.maxi-text-block[uniqueid="${block}"] .maxi-text-block__content`,
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

		expect(results.every(result => result)).toBe(true);

		// Check frontend
		const previewPage = await openPreviewPage();

		await previewPage.waitForSelector(
			'#text-maxi-3.maxi-text-block .maxi-text-block__content',
			{
				visible: true,
			}
		);
		await previewPage.waitForTimeout(1000);

		const getFrontResults = async block =>
			previewPage.$eval(
				`#${block}.maxi-text-block .maxi-text-block__content`,
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

	afterAll(async () => {
		await page.bringToFront();
		await trashAllPosts();
	});
});
