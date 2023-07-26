/**
 * WordPress dependencies
 */
import { pressKeyWithModifier } from '@wordpress/e2e-test-utils';

const editAdvancedNumberControl = async ({
	page,
	instance,
	newNumber,
	newValue,
}) => {
	await instance.waitForSelector('input');
	await instance.$eval('input', select => select.focus());

	await pressKeyWithModifier('primary', 'a');
	await page.keyboard.type(newNumber);

	if (newValue) {
		const selector = await instance.$('select');
		await selector.select(newValue);
	}
};

export default editAdvancedNumberControl;
