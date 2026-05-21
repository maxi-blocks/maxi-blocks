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

	// Wait for the button to have a valid href (href may be populated async)
	await page
		.waitForFunction(
			() => {
				const button = document.querySelector(
					'.edit-post-header-preview__button-external'
				);
				return (
					button &&
					button.href &&
					button.href.startsWith('http')
				);
			},
			{ timeout: 5000 }
		)
		.catch(() => {});

	// Wait a bit more to ensure the button is fully rendered and clickable
	await page.waitForTimeout(200);

	const previewHref = await page.$eval(
		'.edit-post-header-preview__button-external',
		button => button.href || button.getAttribute('href')
	);

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

	for (let i = 0; i < 500 && openTabs.length < expectedTabsCount; i += 1) {
		await page.waitForTimeout(1);
		openTabs = await browser.pages();
	}

	let previewPage = last(openTabs);

	if (openTabs.length < expectedTabsCount) {
		previewPage = await browser.newPage();
		if (!previewHref) {
			throw new Error(
				'Preview tab did not open and preview URL could not be determined'
			);
		}
		await previewPage.goto(previewHref, {
			waitUntil: 'domcontentloaded',
			timeout: 30000,
		});
	}

	// Wait for the preview page to finish navigating before returning,
	// so that subsequent waitForSelector calls measure from page-ready,
	// not from when the tab was opened.
	await previewPage
		.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 30000 })
		.catch(() => {});

	return previewPage;
};

export default openPreviewPage;
