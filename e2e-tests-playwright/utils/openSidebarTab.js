const openSidebarTab = async (page, tab, item) => {
	// Open the sidebar if it's closed
	const sidebarButton = page.locator(
		'button[aria-label="Settings"][aria-expanded="false"]'
	);
	if (sidebarButton && (await sidebarButton.isVisible())) {
		await sidebarButton.click();
	}

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
