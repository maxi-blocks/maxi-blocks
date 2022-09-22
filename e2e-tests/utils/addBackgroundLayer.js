import openSidebarTab from './openSidebarTab';

const addBackgroundLayer = async (page, type, isHover = false) => {
	const accordion = await openSidebarTab(page, 'style', 'background layer');
	await accordion.$$eval(
		'.maxi-tabs-control button',
		(button, _isHover) => button[+_isHover].click(),
		isHover
	);

	const selector = await page.$('.maxi-background-control__add-layer select');

	await selector.select(type);
};

export default addBackgroundLayer;
