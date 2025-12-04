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

	const options = await page.$$(
		'.maxi-tabs-control__sidebar-settings-tabs button'
	);

	const optionsLength = options.length;

	const tabs =
		optionsLength === 3
			? ['style', 'canvas', 'advanced']
			: ['style', 'advanced'];

	await options[tabs.indexOf(tab)].click();

	// Wait for accordion item to be rendered after tab switch
	await page.waitForSelector(
		`.maxi-accordion-control__item[data-name="${item}"]`,
		{ timeout: 10000 }
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
