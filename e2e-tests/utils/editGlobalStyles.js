const editGlobalStyles = async ({ page, block, type }) => {
	await page.$eval(
		`.maxi-blocks-sc__type--${block} .maxi-style-cards-control__toggle-${type}-color-global input`,
		button => button.click()
	);

	await page.$$eval(
		'.maxi-color-control__palette .maxi-color-control__palette-container button',
		button => button[3].click()
	);

	await page.$eval(
		`.maxi-blocks-sc__type--${block} .maxi-style-cards-control__toggle-${type}-global input`,
		button => button.click()
	);
};

export default editGlobalStyles;
