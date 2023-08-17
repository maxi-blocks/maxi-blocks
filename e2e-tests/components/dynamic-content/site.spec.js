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
import { siteCodeEditor } from './content';

describe('Dynamic content', () => {
	it.skip('Should return site DC content', async () => {
		await createNewPost();

		// Set code editor as clipboard data
		const codeEditor = siteCodeEditor;
		await setClipboardData({ plainText: codeEditor });

		// Set title
		await page.keyboard.type('Site DC test');

		// Add code editor
		await page.keyboard.press('Enter');
		await pressKeyWithModifier('primary', 'v');

		await page.waitForSelector('.maxi-text-block__content', {
			visible: true,
		});
		await page.waitForTimeout(1000);

		// Check backend
		const expectedResults = {
			'text-maxi-1se8ef1z-u': 'maxi-blocks',
			'text-maxi-2se8ef1z-u': 'No content found',
			'text-maxi-3se8ef1z-u': 'http://localhost:8889',
			'text-maxi-4se8ef1z-u': 'wordpress@example.com',
			'text-maxi-5se8ef1z-u': 'en_US',
		};

		const getBackResults = async (block, expect) =>
			page.$eval(
				`.maxi-text-block[uniqueid="${block}"] .maxi-text-block__content`,
				(el, _expect) => el.innerText === _expect,
				expect
			);

		const results = Object.entries(expectedResults).map(
			async ([block, expect]) => getBackResults(block, expect)
		);

		expect(results.every(result => result)).toBe(true);

		// Check frontend
		const previewPage = await openPreviewPage();
		await previewPage.waitForSelector(
			'#text-maxi-1se8ef1z-u.maxi-text-block .maxi-text-block__content',
			{
				visible: true,
			}
		);
		await previewPage.waitForTimeout(1000);

		const getFrontResults = async (block, expect) =>
			previewPage.$eval(
				`#${block}.maxi-text-block .maxi-text-block__content`,
				(el, _expect) => el.innerText === _expect,
				expect
			);

		const frontResults = Object.entries(expectedResults).map(
			async ([block, expect]) => getFrontResults(block, expect)
		);

		expect(frontResults.every(result => result)).toBe(true);
	});
});
