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

/**
 * Wait for SC vars element to be generated and fully populated
 *
 * @param {Object} pageContext - The page or previewPage object to wait on
 * @param {number} timeout - Maximum time to wait in milliseconds
 */
const waitForScVarsGeneration = async (pageContext, timeout = 15000) => {
	// Wait for the SC vars element and ensure content is fully generated
	await pageContext.waitForSelector('#maxi-blocks-sc-vars-inline-css', {
		timeout
	});

	// Wait for content to be complete by checking for all breakpoints
	await pageContext.waitForFunction(
		() => {
			const el = document.getElementById('maxi-blocks-sc-vars-inline-css');
			if (!el) return false;
			const content = el.textContent || el.innerText || el.innerHTML;
			if (!content) return false;
			// Check that all breakpoints are present and content is substantial
			const hasAllBreakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs']
				.every(bp => content.includes(`-${bp}:`));
			// Also verify minimum content length to ensure it's fully generated
			const hasMinimumContent = content.length > 10000;
			return hasAllBreakpoints && hasMinimumContent;
		},
		{ timeout }
	);

	// Wait for content to stabilize by checking it doesn't change
	await pageContext.waitForFunction(
		() => {
			return new Promise((resolve) => {
				const el = document.getElementById('maxi-blocks-sc-vars-inline-css');
				if (!el) {
					resolve(false);
					return;
				}

				let previousContent = el.textContent || el.innerText || el.innerHTML;
				let stableCount = 0;
				const requiredStableChecks = 3;

				const checkInterval = setInterval(() => {
					const currentContent = el.textContent || el.innerText || el.innerHTML;

					if (currentContent === previousContent) {
						stableCount++;
						if (stableCount >= requiredStableChecks) {
							clearInterval(checkInterval);
							resolve(true);
						}
					} else {
						stableCount = 0;
						previousContent = currentContent;
					}
				}, 200);

				// Failsafe timeout
				setTimeout(() => {
					clearInterval(checkInterval);
					resolve(stableCount >= requiredStableChecks);
				}, 5000);
			});
		},
		{ timeout }
	);
};

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

		await waitForScVarsGeneration(page);

		const scVariable = await page.$eval(
			'#maxi-blocks-sc-vars-inline-css',
			content => (content.textContent || content.innerText || content.innerHTML).trim()
		);

		expect(scVariable).toMatchSnapshot();

		const previewPage = await openPreviewPage(page);
		await previewPage.waitForSelector('.entry-content');

		// Give the preview page time to fully load and render styles
		await previewPage.waitForTimeout(2000);

		await waitForScVarsGeneration(previewPage);

		const scVariableFront = await previewPage.$eval(
			'#maxi-blocks-sc-vars-inline-css',
			content => (content.textContent || content.innerText || content.innerHTML).trim()
		);

		expect(scVariableFront).toMatchSnapshot();
	});
});
