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

	const options = await page.$$(
		'.maxi-tabs-control__sidebar-settings-tabs button'
	);

	if (!options || options.length === 0) {
		throw new Error(
			'openSidebarTab: Could not find sidebar settings tabs buttons. Make sure the sidebar is open and contains tab buttons.'
		);
	}

	const optionsLength = options.length;

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

	await options[tabIndex].click();

	const wrapperElement = await page.$(
		`.maxi-accordion-control__item[data-name="${item}"]`
	);

	if (!wrapperElement) {
		throw new Error(
			`openSidebarTab: Could not find accordion item with data-name="${item}". Make sure the item exists in the current tab.`
		);
	}

	const button = await wrapperElement.$(
		'.maxi-accordion-control__item__button'
	);

	if (!button) {
		throw new Error(
			`openSidebarTab: Could not find accordion button for item "${item}". The accordion item may be malformed.`
		);
	}

	const content = await wrapperElement.$(
		'.maxi-accordion-control__item__panel'
	);

	if (!content) {
		throw new Error(
			`openSidebarTab: Could not find accordion content panel for item "${item}". The accordion item may be malformed.`
		);
	}

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
