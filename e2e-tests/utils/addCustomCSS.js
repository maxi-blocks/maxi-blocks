/**
 * External dependencies
 */
import openSidebarTab from './openSidebarTab';
import getBlockStyle from './getBlockStyle';

const checkCSS = async ({ page, cssInstances }) => {
	for (let i = 0; i < cssInstances.length; i += 1) {
		const cssTextArea = await cssInstances[i].$('textarea');
		await page.waitForTimeout(100);

		await cssTextArea.focus();

		await page.keyboard.type('background: red');

		// validate css

		await page.$$eval(
			'.maxi-additional__css button',
			(buttons, _i) => buttons[_i].click(),
			i
		);
		await page.waitForTimeout(250);
	}
};

const addCustomCSS = async page => {
	const accordionTab = await openSidebarTab(page, 'advanced', 'custom css');

	const customCssSelector = await accordionTab.$('select');
	const customCssValues = await customCssSelector.$$('option');

	for (let i = 1; i < customCssValues.length; i += 1) {
		const optionLabel = await customCssValues[i].evaluate(
			option => option.value
		);

		await customCssSelector.select(optionLabel);

		const cssInstances = await page.$$('.maxi-additional__css');

		await checkCSS({ page, cssInstances });
	}

	return getBlockStyle(page); // !!!!!!!
};

export default addCustomCSS;
