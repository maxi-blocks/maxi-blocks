/* eslint-disable no-await-in-loop */

/**
 * External dependencies
 */
import { isNaN } from 'lodash';

const editAxisControl = async ({
	page,
	instance,
	syncOption,
	values,
	unit,
	resetAllBefore = false,
	resetAllAfter = false,
}) => {
	if (syncOption) {
		await instance
			.locator(
				`.maxi-axis-control__header button[aria-label="${syncOption}"]`
			)
			.click();
	}

	if (resetAllBefore) {
		// reset
		await instance
			.locator('.maxi-axis-control__unit-header button')
			.click();
	}

	if (unit) {
		// change unit
		const selector = instance.locator('select');
		await selector.selectOption(unit);
	}

	// Change values
	const inputs = await instance
		.locator('.maxi-axis-control__content__item input[type="number"]')
		.all();

	for (let i = 0; i < inputs.length; i += 1) {
		const el = inputs[i];

		const newValue = Array.isArray(values) ? values[i] : values;

		if (newValue === 'auto') {
			await instance
				.locator('.maxi-axis-control__item-auto input')
				.nth(i)
				.click();
		} else if (!isNaN(+newValue)) {
			// Ensure is a number
			await el.fill(String(newValue));
		}
	}

	if (resetAllAfter) {
		await instance
			.locator('.maxi-axis-control__unit-header button')
			.click();
	}
};

export default editAxisControl;
