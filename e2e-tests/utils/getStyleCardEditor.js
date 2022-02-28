const getStyleCardEditor = async ({ page, accordion }) => {
	await page.$eval(
		'.edit-post-header .edit-post-header__toolbar .maxi-toolbar-layout button',
		button => button.click()
	);
	await page.waitForTimeout(250);

	// select SC
	await page.$eval('.maxi-responsive-selector .style-card-button', button =>
		button.click()
	);

	// maxi
	await page.$eval(
		`.maxi-accordion-control .maxi-blocks-sc__type--${accordion} .maxi-accordion-control__item__button`,
		button => button.click()
	);
};

export default getStyleCardEditor;
