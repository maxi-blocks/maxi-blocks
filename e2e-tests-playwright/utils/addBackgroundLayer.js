import openSidebarTab from './openSidebarTab';

const addBackgroundLayer = async (page, type, isHover = false) => {
	const accordion = await openSidebarTab(page, 'style', 'background layer');
	await accordion
		.locator('.maxi-tabs-control button')
		.nth(isHover ? 1 : 0)
		.click();

	const selector = page.locator('.maxi-background-control__add-layer select');

	await selector.selectOption(type);
};

export default addBackgroundLayer;
