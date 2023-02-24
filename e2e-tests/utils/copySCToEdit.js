const copySCToEdit = async (page, newName) => {
	// Click Customize Card button
	await page.waitForSelector('.maxi-style-cards-customise-card-button');
	await page.$eval('.maxi-style-cards-customise-card-button', button =>
		button.click()
	);

	// Input the new SC name
	await page.waitForSelector('.maxi-style-cards__sc__save > input');
	await page.$eval('.maxi-style-cards__sc__save > input', input =>
		input.focus()
	);
	await page.keyboard.type(newName);

	await page.waitForSelector(
		'.maxi-style-cards__sc__save > button:nth-child(2)'
	);
	await page.$eval(
		'.maxi-style-cards__sc__save > button:nth-child(2)',
		button => button.click()
	);
};

export default copySCToEdit;
