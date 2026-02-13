/* eslint-disable no-await-in-loop */
import openSidebarTab from './openSidebarTab';
import getBlockStyle from './getBlockStyle';

const checkCSS = async ({ page, cssInstances }) => {
	for (let i = 0; i < cssInstances; i += 1) {
		const textarea = page.locator(
			`.maxi-css-code-editor--${i + 1} textarea`
		);
		await textarea.fill('background: red');
		await textarea.blur();
		// Wait for debounced onChange and React state update to propagate
		// before filling next textarea, to avoid race conditions where
		// the next update overwrites this one due to stale value prop.
		// eslint-disable-next-line no-await-in-loop, playwright/no-wait-for-timeout
		await page.waitForTimeout(300);
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
