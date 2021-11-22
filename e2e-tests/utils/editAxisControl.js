/* eslint-disable no-await-in-loop */

/**
 * External dependencies
 */
import { pressKeyWithModifier } from '@wordpress/e2e-test-utils';
import { isNaN, isArray } from 'lodash';

/**
 *
 * $1 		AxisControl Jest handle element
 * const axisControlInstance = accordion.$('.maxi-axis-control__margin'))
 *
 * array = [1, 2, 3, 4]
 */
// syncOption = all, axis , none
const editAxisControl = async ({
	page,
	instance,
	syncOption,
	values,
	unit,
	testReset = false,
	resetAllBefore = false,
	resetAllAfter = false,
	// pressReset,
}) => {
	const pressReset = async page => {
		await page.$eval('.maxi-axis-control__unit-header button', button =>
			button.click()
		);
	};

	if (syncOption) {
		await instance.$$eval('.maxi-axis-control__header button', button =>
			button[`${syncOption}`].click()
		);
	}

	if (resetAllBefore)
		// reset
		await instance.$eval('.maxi-axis-control__unit-header button', button =>
			button.click()
		);

	if (unit) {
		// change unit
		const selector = await instance.$('.maxi-axis-control__units select');

		await selector.select(unit);
	}

	// Change values
	const inputs = await instance.$$(
		'.maxi-axis-control__content__item input[type="number"]'
	);

	for (let i = 0; i < inputs.length; i += 1) {
		const el = inputs[i];

		await el.focus();
		await pressKeyWithModifier('primary', 'a');

		const newValue = !isArray(values) ? values : values[i];

		if (newValue === 'auto') {
			await instance.$$eval(
				'.maxi-axis-control__item-auto input',
				(inputs, _i) => inputs[_i].click(),
				i
			);
		}
		// Ensure is a number
		if (!isNaN(+newValue)) await page.keyboard.type(newValue);
	}

	// if (testRest)
	if (resetAllAfter)
		// reset
		await instance.$eval('.maxi-axis-control__unit-header button', button =>
			button.click()
		);
};

export default editAxisControl;
