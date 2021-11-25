/* eslint-disable no-await-in-loop */

/**
 * External dependencies
 */
import { pressKeyWithModifier } from '@wordpress/e2e-test-utils';
import { isNumber } from 'lodash';

const editColorControl = async ({
	page,
	instance,
	colorPalette,
	paletteOpacity,
	customColor,
	customOpacity,
}) => {
	if (isNumber(colorPalette)) {
		await page.$eval(
			`.maxi-background-control .maxi-color-control button[data-item="${colorPalette}"]`,
			button => button.click()
		);
	}

	if (paletteOpacity) {
		// change unit
		await instance.$eval('.maxi-opacity-control input', input =>
			input.focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type(paletteOpacity);
	}

	if (customColor) {
		await instance.$eval('.maxi-opacity-control button', button =>
			button.click()
		);

		await instance.$eval(
			'.maxi-color-control .maxi-toggle-switch input',
			button => button.click()
		);

		await page.$eval('.maxi-color-control__color input', input =>
			input.focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type(customColor);

		await page.waitForTimeout(150);

		if (customOpacity) {
			await page.$$eval(
				'.maxi-color-control .maxi-opacity-control input',
				input => input[2].focus()
			);

			await page.waitForTimeout(150);
			await pressKeyWithModifier('primary', 'a');
			await page.keyboard.type(customOpacity);
		}
	}
};

export default editColorControl;
