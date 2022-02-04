/**
 * WordPress dependencies
 */
import { pressKeyWithModifier } from '@wordpress/e2e-test-utils';

/**
 * External dependencies
 */

const editAdvancedNumberControl = async ({
	page,
	instance,
	newNumber,
	newValue,
	valueInstance,
}) => {
	await page.$eval(`${instance} input`, select => select.focus());

	await pressKeyWithModifier('primary', 'a');
	await page.keyboard.type(newNumber);

	if (valueInstance) {
		const selector = await page.$(
			`.maxi-advanced-number-control ${valueInstance} select`
		);
		await selector.select(newValue);
	}
};

export default editAdvancedNumberControl;
