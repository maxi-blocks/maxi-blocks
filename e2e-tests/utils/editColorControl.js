/**
 * WordPress dependencies
 */
import { pressKeyWithModifier } from '@wordpress/e2e-test-utils';

/**
 * External dependencies
 */
import { isNumber } from 'lodash';

const editColorControl = async ({
	page,
	instance,
	paletteStatus = true,
	colorPalette,
	customColor,
	opacity,
}) => {
	// select colorPalette
	if (paletteStatus && isNumber(colorPalette))
		await instance.$eval(
			`.maxi-color-palette-control .maxi-color-control__palette-container button[data-item="${colorPalette}"]`,
			button => button.click()
		);

	// select customColor
	if (!paletteStatus && customColor) {
		await page.waitForTimeout(3500);

		await instance.$eval('.maxi-opacity-control button', button =>
			button.click()
		);
		await page.waitForTimeout(3500);

		await instance.$eval(
			'.maxi-color-control .maxi-toggle-switch input',
			button => button.click()
		);
		await page.waitForTimeout(3500);

		await page.$eval('.maxi-color-control__color input', input =>
			input.focus()
		);
		await page.waitForTimeout(3500);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type(customColor);
	}

	// change opacity
	if (opacity) {
		await page.$eval(
			'.maxi-color-control .maxi-opacity-control .maxi-advanced-number-control__value',
			input => input.focus()
		);

		await page.waitForTimeout(150);
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type(`${opacity}`, { delay: 350 });
	}
};

export default editColorControl;
