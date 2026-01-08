/* eslint-disable no-await-in-loop */
/* eslint-disable no-return-await */
/**
 * WordPress dependencies
 */
import { createNewPost, saveDraft } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	openPreviewPage,
	insertMaxiBlock,
	updateAllBlockUniqueIds,
} from '../utils';

describe('sc-variable', () => {
	it('Check sc-vars', async () => {
		await createNewPost();
		await insertMaxiBlock(page, 'Divider Maxi');
		await updateAllBlockUniqueIds(page);

		await page.waitForTimeout(2000);
		await saveDraft();
		await page.waitForTimeout(2000);

		await page.evaluate(() => window.location.reload());

		await page.waitForTimeout(5000);

		// Wait for the SC vars element and ensure content is fully generated
		await page.waitForSelector('#maxi-blocks-sc-vars-inline-css');

		// Wait for content to be complete by checking for all breakpoints
		await page.waitForFunction(
			() => {
				const el = document.getElementById(
					'maxi-blocks-sc-vars-inline-css'
				);
				if (!el) return false;
				const content = el.textContent || el.innerText || el.innerHTML;
				if (!content) return false;
				// Check that all breakpoints are present and content is substantial
				const hasAllBreakpoints = [
					'general',
					'xxl',
					'xl',
					'l',
					'm',
					's',
					'xs',
				].every(bp => content.includes(`-${bp}:`));
				// Also verify minimum content length to ensure it's fully generated
				const hasMinimumContent = content.length > 10000;
				return hasAllBreakpoints && hasMinimumContent;
			},
			{ timeout: 15000 }
		);

		const scVariable = await page.$eval(
			'#maxi-blocks-sc-vars-inline-css',
			content =>
				(
					content.textContent ||
					content.innerText ||
					content.innerHTML
				).trim()
		);

		expect(scVariable).toMatchSnapshot();

		const previewPage = await openPreviewPage(page);
		await previewPage.waitForSelector('.entry-content');

		// Wait for the SC vars element and ensure content is fully generated on preview page
		await previewPage.waitForSelector('#maxi-blocks-sc-vars-inline-css');

		// Wait for content to be complete by checking for all breakpoints
		await previewPage.waitForFunction(
			() => {
				const el = document.getElementById(
					'maxi-blocks-sc-vars-inline-css'
				);
				if (!el) return false;
				const content = el.textContent || el.innerText || el.innerHTML;
				if (!content) return false;
				// Check that all breakpoints are present and content is substantial
				const hasAllBreakpoints = [
					'general',
					'xxl',
					'xl',
					'l',
					'm',
					's',
					'xs',
				].every(bp => content.includes(`-${bp}:`));
				// Also verify minimum content length to ensure it's fully generated
				const hasMinimumContent = content.length > 10000;
				return hasAllBreakpoints && hasMinimumContent;
			},
			{ timeout: 15000 }
		);

		const scVariableFront = await previewPage.$eval(
			'#maxi-blocks-sc-vars-inline-css',
			content =>
				(
					content.textContent ||
					content.innerText ||
					content.innerHTML
				).trim()
		);

		expect(scVariableFront).toMatchSnapshot();
	});
});
