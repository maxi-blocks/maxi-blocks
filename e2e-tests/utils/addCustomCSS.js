/* eslint-disable no-await-in-loop */
/**
 * External dependencies
 */
import openSidebarTab from './openSidebarTab';
import getBlockStyle from './getBlockStyle';

const checkCSS = async ({ page, cssInstances }) => {
	for (let i = 0; i < cssInstances.length; i += 1) {
		await page.waitForSelector(`.maxi-css-code-editor--${i + 1} textarea`);
		await page.$eval(`.maxi-css-code-editor--${i + 1} textarea`, el =>
			el.focus()
		);

		// Type a valid declaration; semicolon avoids malformed concatenation
		await page.keyboard.type('background: red');
		await page.waitForTimeout(200);

		// validate css
		await page.waitForSelector(
			`.maxi-css-code-editor__validate-button--${i + 1}`
		);
		await page.click(`.maxi-css-code-editor__validate-button--${i + 1}`);
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

		const cssInstances = await page.$$('.maxi-css-code-editor');

		await checkCSS({ page, cssInstances });
	}

	return getBlockStyle(page);
};

export default addCustomCSS;
