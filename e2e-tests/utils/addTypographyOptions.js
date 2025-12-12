/**
 * WordPress dependencies
 */
import { pressKeyWithModifier } from '@wordpress/e2e-test-utils';

const addTypographyOptions = async ({
	page,
	instance,
	size,
	lineHeight,
	letterSpacing,
}) => {
	// click on the typography advanced settings if it's not open
	const isAdvancedSettingsOpen = await page.evaluate(
		() => !!document.querySelector('.maxi-typography-control__text-indent')
	);
	if (!isAdvancedSettingsOpen) {
		const advancedSettingsSelector = await page.$(
			'.maxi-typography-control__advanced-toggle button.maxi-typography-control-button'
		);
		if (advancedSettingsSelector) await advancedSettingsSelector.click();
	}
	// size
	if (size) {
		await page.waitForTimeout(500);

		await instance.$$eval('.maxi-typography-control__size input', select =>
			select[0].focus()
		);
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type(`${size}`, { delay: 350 });
	}

	// line-height
	if (lineHeight) {
		await page.waitForTimeout(300);
		await instance.$$eval(
			'.maxi-typography-control__line-height input',
			select => select[0].focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type(`${lineHeight}`, { delay: 350 });
	}

	// letter-spacing
	if (letterSpacing) {
		await page.waitForTimeout(300);
		await instance.$$eval(
			'.maxi-typography-control__letter-spacing input',
			select => select[0].focus()
		);
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type(`${letterSpacing}`, { delay: 350 });
	}

	await page.waitForTimeout(150);
};

export default addTypographyOptions;
