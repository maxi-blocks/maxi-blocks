/**
 * WordPress dependencies
 */
import {
	ensureSidebarOpened,
	openDocumentSettingsSidebar,
} from '@wordpress/e2e-test-utils';

const openSidebar = async (page, item) => {
	await openDocumentSettingsSidebar();
	await ensureSidebarOpened();

	const sidebar = await page.$('.maxi-sidebar');
	const wrapperElement = await page.$(
		`.maxi-accordion-control__item[data-name="${item}"]`
	);
	const button = await wrapperElement.$(
		'.maxi-accordion-control__item__button'
	);
	const content = await wrapperElement.$(
		'.maxi-accordion-control__item__panel'
	);

	// Close all elements
	const sidebarButtons = await sidebar.$$(
		'.maxi-accordion-control__item__button'
	);
	for (let i = 0; i < sidebarButtons.length; i += 1) {
		const el = sidebarButtons[i];

		el.evaluate(el => {
			if (el.getAttribute('aria-expanded'))
				el.setAttribute('aria-expanded', false);
		});
	}

	// Hide panels
	const sidebarPanels = await sidebar.$$(
		'.maxi-accordion-control__item__panel'
	);
	for (let i = 0; i < sidebarPanels.length; i += 1) {
		const el = sidebarPanels[i];

		el.evaluate(el => {
			if (!el.getAttribute('hidden')) el.setAttribute('hidden', '');
		});
	}

	// Open accordion
	await button.evaluate(el => el.setAttribute('aria-expanded', true));
	await content.evaluate(el => el.removeAttribute('hidden'));

	return content;
};

export default openSidebar;
