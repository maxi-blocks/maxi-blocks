/* eslint-disable no-await-in-loop */
import openSidebarTab from './openSidebarTab';
import getBlockStyle from './getBlockStyle';

const checkCSS = async ({ page, cssInstances }) => {
	for (let i = 0; i < cssInstances; i += 1) {
		const textarea = page.locator(
			`.maxi-css-code-editor--${i + 1} textarea`
		);
		await textarea.fill('background: red');

		const validate = page.locator(
			`.maxi-css-code-editor__validate-button--${i + 1}`
		);
		await validate.click();
	}
};

const addCustomCSS = async page => {
	await openSidebarTab(page, 'advanced', 'custom css');

	const customCssSelector = page.locator(
		'.maxi-accordion-control__item[data-name="custom css"] select'
	);

	const optionValues = await customCssSelector.locator('option').all();

	for (let i = 1; i < optionValues.length; i += 1) {
		const value = await optionValues[i].getAttribute('value');
		await customCssSelector.selectOption(value);

		const instances = await page.locator('.maxi-css-code-editor').count();
		await checkCSS({ page, cssInstances: instances });
	}

	return getBlockStyle(page);
};

export default addCustomCSS;
