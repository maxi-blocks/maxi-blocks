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
import { siteCodeEditor } from './content';
import { openPreviewPage } from '../../utils';

describe('Dynamic content', () => {
	it('Should return site DC content', async () => {
		await createNewPost();

		// Set code editor as clipboard data
		const codeEditor = siteCodeEditor;
		await setClipboardData({ plainText: codeEditor });

		// Set title
		await page.keyboard.type('Site DC test', { delay: 350 });

		// Add code editor
		await page.keyboard.press('Enter');
		await pressKeyWithModifier('primary', 'v');

		await page.waitForSelector('.maxi-text-block__content', {
			visible: true,
		});
		await page.waitForTimeout(1000);

		// Check backend
		const expectedResults = {
			'text-dc-title-1': 'maxi-blocks',
			'text-dc-description-1': 'No content found',
			'text-dc-url-1': 'http://localhost:8889',
			'text-dc-email-1': 'wordpress@example.com',
			'text-dc-language-1': 'en_US',
		};

		const expectedButtonResults = {
			'button-dc-title': 'maxi-blocks',
			'button-dc-description': 'No content found',
			'button-dc-email': 'wordpress@example.com',
		};

		const getBackResults = async (block, expect) =>
			page.$eval(
				`.${block}.maxi-text-block .maxi-text-block__content`,
				(el, _expect) => el.innerText === _expect,
				expect
			);

		const getButtonResults = async (block, expect) =>
			page.$eval(
				`.${block}.maxi-button-block .maxi-button-block__content`,
				(el, _expect) => el.innerText === _expect,
				expect
			);

		const results = Object.entries(expectedResults).map(
			async ([block, expect]) => getBackResults(block, expect)
		);
		const buttonResults = Object.entries(expectedButtonResults).map(
			async ([block, expect]) => getButtonResults(block, expect)
		);

		expect(results.every(result => result)).toBe(true);
		expect(buttonResults.every(result => result)).toBe(true);
		// Check frontend
		const previewPage = await openPreviewPage(page);
		await previewPage.waitForSelector(
			'.text-dc-title-1.maxi-text-block .maxi-text-block__content',
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

		const getFrontButtonResults = async (block, expect) =>
			previewPage.$eval(
				`.${block}.maxi-button-block .maxi-button-block__content`,
				(el, _expect) => el.innerText === _expect,
				expect
			);

		const frontResults = Object.entries(expectedResults).map(
			async ([block, expect]) => getFrontResults(block, expect)
		);
		const frontButtonResults = Object.entries(expectedButtonResults).map(
			async ([block, expect]) => getFrontButtonResults(block, expect)
		);

		expect(frontResults.every(result => result)).toBe(true);
		expect(frontButtonResults.every(result => result)).toBe(true);
	});
});
