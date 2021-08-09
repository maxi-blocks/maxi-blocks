/* eslint-disable no-undef */
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
	const button = await page.$('.edit-post-header-preview__button-external');
	await button.click(); // Wait for the new tab to open.
	await page.waitForTimeout(100);

	while (openTabs.length < expectedTabsCount) {
		await page.waitForTimeout(1);
		openTabs = await browser.pages();
	}

	const previewPage = last(openTabs);

	return previewPage;
};

export default openPreviewPage;
