const editGlobalStyles = async ({ page, block, type }) => {
	await page.waitForTimeout(150);

	await page.$eval(
		`.maxi-blocks-sc__type--${block} .maxi-style-cards-control__toggle${
			type ? `-${type}` : ''
		}-color-global input`,
		button => button.click()
	);
	await page.waitForTimeout(150);

	await page.$$eval(
		'.maxi-color-control__palette .maxi-color-control__palette-container button',
		button => button[3].click()
	);

	await page.waitForTimeout(150);
};
export default editGlobalStyles;
