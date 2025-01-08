/**
 * WordPress dependencies
 */
import {
	createNewPost,
	setClipboardData,
	pressKeyWithModifier,
} from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import { authorCodeEditor } from './content';
import { openPreviewPage } from '../../utils';

describe('Dynamic content', () => {
	it('Should return author DC content', async () => {
		await createNewPost();

		// Set code editor as clipboard data
		const codeEditor = authorCodeEditor;
		await setClipboardData({ plainText: codeEditor });

		// Set title
		await page.keyboard.type('Author DC test', { delay: 350 });

		// Add code editor
		await page.keyboard.press('Enter');
		await pressKeyWithModifier('primary', 'v');

		await page.waitForSelector('.maxi-text-block__content', {
			visible: true,
		});
		await page.waitForTimeout(1000);

		// Check backend
		const expectedResults = {
			'text-dc-1': 'admin',
			'text-dc-2': 'No content found',
			'text-dc-3': 'No content found',
			'text-dc-4': 'http://localhost:8889/?author=1',
			'text-dc-5': 'http://localhost:8889',
		};

		const getBackResults = async (block, expect) =>
			page.$eval(
				`.maxi-text-block.${block} .maxi-text-block__content`,
				(el, _expect) => el.innerText === _expect,
				expect
			);

		const results = Object.entries(expectedResults).map(
			async ([block, expect]) => getBackResults(block, expect)
		);

		expect(results.every(result => result)).toBe(true);

		// Check frontend
		const previewPage = await openPreviewPage(page);
		await previewPage.waitForSelector(
			'.text-dc-1.maxi-text-block .maxi-text-block__content',
			{
				visible: true,
			}
		);
		await previewPage.waitForTimeout(1000);

		const getFrontResults = async (block, expect) =>
			previewPage.$eval(
				`.${block}.maxi-text-block .maxi-text-block__content`,
				(el, _expect) => el.innerText === _expect,
				expect
			);

		const frontResults = Object.entries(expectedResults).map(
			async ([block, expect]) => getFrontResults(block, expect)
		);

		expect(frontResults.every(result => result)).toBe(true);
	});
});
