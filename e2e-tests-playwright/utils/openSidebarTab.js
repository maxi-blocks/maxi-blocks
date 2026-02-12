const openSidebarTab = async (page, tab, item) => {
	if (!page) {
		throw new Error(
			'openSidebarTab: "page" parameter is required and cannot be null or undefined'
		);
	}
	if (!tab || typeof tab !== 'string') {
		throw new Error(
			'openSidebarTab: "tab" parameter must be a non-empty string'
		);
	}
	if (!item || typeof item !== 'string') {
		throw new Error(
			'openSidebarTab: "item" parameter must be a non-empty string'
		);
	}

	// Open the sidebar if it's closed
	const sidebarButton = page.locator(
		'button[aria-label="Settings"][aria-expanded="false"]'
	);
	if (await sidebarButton.isVisible()) {
		await sidebarButton.click();
	}

	const options = await page.locator(
		'.maxi-tabs-control__sidebar-settings-tabs button'
	);

	const optionsLength = await options.count();

	const tabs =
		optionsLength === 3
			? ['style', 'canvas', 'advanced']
			: ['style', 'advanced'];

	const tabIndex = tabs.indexOf(tab);
	if (tabIndex === -1) {
		throw new Error(
			`openSidebarTab: Invalid tab "${tab}". Available tabs: ${tabs.join(
				', '
			)}`
		);
	}

	await options.nth(tabIndex).click();

	const wrapperElement = await page.locator(
		`.maxi-accordion-control__item[data-name="${item}"]`
	);

	const button = await wrapperElement.locator(
		'.maxi-accordion-control__item__button'
	);

	const content = await wrapperElement.locator(
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
