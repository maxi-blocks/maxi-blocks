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

	const options = await page.$$(
		'.maxi-tabs-control__sidebar-settings-tabs button'
	);

	const optionsLength = options.length;

	const tabs =
		optionsLength === 3
			? ['style', 'canvas', 'advanced']
			: ['style', 'advanced'];

	await options[tabs.indexOf(tab)].click();

	const wrapperElement = await page.$(
		`.maxi-accordion-control__item[data-name="${item}"]`
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

	await page.waitForSelector(
		`.maxi-accordion-control__item[data-name="${item}"] .maxi-accordion-control__item__panel:not([hidden])`
	);

	return content;
};

export default openSidebarTab;
