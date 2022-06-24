/**
 * External dependencies
 */

const checkColumnPicker = async page => {
	const columnsStyles = await page.$$(
		'.components-column-pattern .components-column-pattern__templates button'
	);
	const expect1Column = ['50%', '25%', '75%', '20%', '80%'];
	const expect2Column = ['50%', '75%', '25%', '80%', '20%'];

	for (let i = 0; i < columnsStyles.length; i += 1) {
		const buttonSelector = await page.$$(
			'.components-column-pattern .components-column-pattern__templates button'
		);

		await buttonSelector[i].click();
		debugger;
		const column1 = await page.$eval(
			'.maxi-column-block',
			block => block.style.cssText
		);

		const column2 = await page.$$eval(
			'.maxi-column-block',
			block => block[1].style.cssText
		);

		const expect1 = `position: relative; user-select: auto; width: ${expect1Column[i]}; max-width: 100%; min-width: 1%; box-sizing: border-box;`;
		const expect2 = `position: relative; user-select: auto; width: ${expect2Column[i]}; max-width: 100%; min-width: 1%; box-sizing: border-box;`;

		if (expect1 !== column1) {
			console.error(
				`The first column has an error with the width, expected with ${expect1Column[i]}`
			);
		}
		if (expect2 !== column2) {
			console.error(
				`The second column has an error with the width, expected with ${expect2Column[i]}`
			);
		}
	}
	return true;
};

export default checkColumnPicker;
