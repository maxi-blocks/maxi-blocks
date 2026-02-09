/**
 * WordPress dependencies
 */
import {
	ensureSidebarOpened,
	openDocumentSettingsSidebar,
} from '@wordpress/e2e-test-utils';

const openSidebarTab = async (page, tab, item) => {
	await openDocumentSettingsSidebar();
	await ensureSidebarOpened();

	// Wait for tabs to be available
	await page.waitForSelector(
		'.maxi-tabs-control__sidebar-settings-tabs button',
		{ timeout: 10000 }
	);

	// Wait for sidebar content to be stable
	await page.waitForTimeout(300);

	const options = await page.$$(
		'.maxi-tabs-control__sidebar-settings-tabs button'
	);

	const optionsLength = options.length;

	const tabs =
		optionsLength === 3
			? ['style', 'canvas', 'advanced']
			: ['style', 'advanced'];

	const targetTabIndex = tabs.indexOf(tab);

	// Check if tab is already active
	const isActive = await options[targetTabIndex].evaluate(
		btn =>
			btn.classList.contains('is-active') ||
			btn.getAttribute('aria-selected') === 'true'
	);

	// Only click if not already active
	if (!isActive) {
		await options[targetTabIndex].click();
		// Give the tab switch time to process
		await page.waitForTimeout(800);
	} else {
		// Even if active, give a small delay for any pending updates
		await page.waitForTimeout(300);
	}

	// Wait for accordion item to be rendered after tab switch
	// Increased timeout for CI environments
	await page.waitForSelector(
		`.maxi-accordion-control__item[data-name="${item}"]`,
		{ timeout: 30000, visible: true }
	);

	const wrapperElement = await page.$(
		`.maxi-accordion-control__item[data-name="${item}"]`
	);

	// Additional safety check
	if (!wrapperElement) {
		throw new Error(
			`Accordion item with data-name="${item}" not found after waiting`
		);
	}

	// Wait for button to exist within wrapper
	await page.waitForSelector(
		`.maxi-accordion-control__item[data-name="${item}"] .maxi-accordion-control__item__button`,
		{ timeout: 5000 }
	);

	const button = await wrapperElement.$(
		'.maxi-accordion-control__item__button'
	);
	const content = await wrapperElement.$(
		'.maxi-accordion-control__item__panel'
	);

	// Open accordion in case is closed
	await button.evaluate(el => {
		if (el.getAttribute('aria-expanded') === 'false') el.click();
	});

	// Wait for panel to be visible
	await page.waitForSelector(
		`.maxi-accordion-control__item[data-name="${item}"] .maxi-accordion-control__item__panel:not([hidden])`,
		{ timeout: 5000 }
	);

	return content;
};

export default openSidebarTab;
