/* eslint-disable no-await-in-loop */
/**
 * External dependencies
 */
import openSidebarTab from './openSidebarTab';
import getBlockStyle from './getBlockStyle';

const checkCSS = async ({ page, cssInstances }) => {
	for (let i = 0; i < cssInstances.length; i += 1) {
		const instance = await cssInstances[i];
		const labelForCss = await instance.evaluate(el =>
			Array.from(el.classList)
				.find(className => className.includes('maxi-css-code-editor--'))
				.replace('maxi-css-code-editor--', '')
		);

		await page.waitForSelector(
			`.maxi-css-code-editor--${labelForCss} textarea`
		);
		await page.$eval(`.maxi-css-code-editor--${labelForCss} textarea`, el =>
			el.focus()
		);

		await page.keyboard.type('background: red', { delay: 350 });
		await page.waitForTimeout(200);

		// validate css
		await page.waitForSelector(
			`.maxi-css-code-editor__validate-button--${labelForCss}`
		);
		await page.click(
			`.maxi-css-code-editor__validate-button--${labelForCss}`
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

		const cssInstances = await page.$$('.maxi-css-code-editor');

		await checkCSS({ page, cssInstances });
	}

	return getBlockStyle(page);
};

export default addCustomCSS;
