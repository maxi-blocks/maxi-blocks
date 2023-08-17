/**
 * WordPress dependencies
 */
import {
	createNewPost,
	setClipboardData,
	pressKeyWithModifier,
	openPreviewPage,
	wpDataSelect,
} from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import { mediaCodeEditor } from './content';
import addImageToLibrary from '../../utils/addImageToLibrary';

describe('Dynamic content', () => {
	it.skip('Should return media DC content', async () => {
		await createNewPost();
		await addImageToLibrary(page);

		// Need a first call to set the results on the store
		await wpDataSelect(
			'core',
			'getEntityRecords',
			'postType',
			'attachment'
		);
		await page.waitForTimeout(500);

		const mediaEntities = await wpDataSelect(
			'core',
			'getEntityRecords',
			'postType',
			'attachment'
		);
		const mediaElement = mediaEntities[0];

		// Set code editor as clipboard data
		const codeEditor = mediaCodeEditor.replaceAll(
			'"dc-id":91',
			`"dc-id":${mediaElement.id}`
		);
		await setClipboardData({ plainText: codeEditor });

		// Set title
		await page.keyboard.type('Media DC test');

		// Add code editor
		await page.keyboard.press('Enter');
		await pressKeyWithModifier('primary', 'v');

		await page.waitForSelector('.maxi-text-block__content', {
			visible: true,
		});
		await page.waitForTimeout(1000);

		// Check backend
		const expectedResults = {
			title: 'Delete Key',
			content: 'Delete Key',
			excerpt: 'Delete Key',
			author: 'admin',
		};

		const titleBlocks = ['text-maxi-4se8ef1z-u', 'text-maxi-4se8ef1z-u5'];
		const contentBlocks = ['text-maxi-2', 'text-maxi-4se8ef1z-u6'];
		const excerptBlocks = ['text-maxi-3', 'text-maxi-4se8ef1z-u7'];
		const authorBlocks = ['text-maxi-5', 'text-maxi-4se8ef1z-u9'];

		const getBackResults = async (block, type) =>
			page.$eval(
				`.maxi-text-block[uniqueid="${block}"] .maxi-text-block__content`,
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
			'#text-maxi-4se8ef1z-u.maxi-text-block .maxi-text-block__content',
			{
				visible: true,
			}
		);
		await previewPage.waitForTimeout(1000);

		const getFrontResults = async (block, type) =>
			previewPage.$eval(
				`#${block}.maxi-text-block .maxi-text-block__content`,
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
