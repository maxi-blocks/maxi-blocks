/* eslint-disable no-await-in-loop */
/**
 * External dependencies
 */
import { last } from 'lodash';

const openPreviewPage = async page => {
	let openTabs = await browser.pages();

	const expectedTabsCount = openTabs.length + 1;
	await page.waitForSelector(
		'.block-editor-post-preview__button-toggle:not([disabled])'
	);
	await page.click('.block-editor-post-preview__button-toggle');
	await page.waitForTimeout(100);
	await page.waitForSelector('.edit-post-header-preview__button-external');

	// Wait a bit more to ensure the button is fully rendered and clickable
	await page.waitForTimeout(200);

	// Use evaluate for more reliable clicking with retry logic
	let clickSuccess = false;
	let retries = 3;

	while (!clickSuccess && retries > 0) {
		try {
			await page.evaluate(() => {
				const button = document.querySelector(
					'.edit-post-header-preview__button-external'
				);
				if (button && button.offsetParent !== null) {
					button.click();
					return true;
				}
				throw new Error('Button not found or not visible');
			});
			clickSuccess = true;
		} catch (error) {
			retries -= 1;
			if (retries > 0) {
				await page.waitForTimeout(300);
			} else {
				throw new Error(
					'Failed to click preview button after all retries'
				);
			}
		}
	}

	// Wait for the new tab to open
	await page.waitForTimeout(200);

	while (openTabs.length < expectedTabsCount) {
		await page.waitForTimeout(1);
		openTabs = await browser.pages();
	}

	const previewPage = last(openTabs);

	return previewPage;
};

export default openPreviewPage;
