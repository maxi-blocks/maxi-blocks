import openSidebarTab from './openSidebarTab';

const addBackgroundLayer = async (page, type, isHover = false) => {
	const accordion = await openSidebarTab(page, 'style', 'background layer');
	await accordion.$$eval(
		'.maxi-tabs-control--disable-padding button',
		(button, _isHover) => button[+_isHover].click(),
		isHover
	);

	const selector = await page.$('.maxi-background-control select');

	const addLayer = await selector.select(type);

	return addLayer;
};

export default addBackgroundLayer;
