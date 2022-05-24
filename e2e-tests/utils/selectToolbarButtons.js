const selectToolbarButtons = async (page, button) => {
	await page.$eval(
		`.toolbar-wrapper .toolbar-item__${button} button`,
		button => button.click()
	);
};

export default selectToolbarButtons;
