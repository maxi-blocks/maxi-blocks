<<<<<<< Updated upstream
import openSidebar from './openSidebar';

const addBackgroundLayer = async (page, type, isHover = false) => {
	const accordion = await openSidebar(page, 'background');
	await accordion.$$eval(
		'.maxi-tabs-control--disable-padding button',
		(button, _isHover) => button[+_isHover].click(),
		isHover
	);

=======
const addBackgroundLayer = async (page, type) => {
>>>>>>> Stashed changes
	await page.$eval(
		'.maxi-background-control .maxi-loader-control__dropdown-selector-title',
		button => button.click()
	);

	await page.waitForTimeout(250);

	const addLayer = await page.$eval(
		`.components-popover__content .maxi-loader-content .maxi-loader-control__content-item-${type}`,
		button => button.click()
	);

	return addLayer;
};

export default addBackgroundLayer;
