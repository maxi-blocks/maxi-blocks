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
	await page.waitForTimeout(500);
	await instance.waitForSelector('input');
	await instance.$eval('input', select => select.focus());
	await page.waitForTimeout(400);

	await pressKeyWithModifier('primary', 'a');
	await page.keyboard.type(newNumber, { delay: 400 });
	await page.waitForTimeout(400);

	if (newValue) {
		const selector = await instance.$('select');
		await selector.select(newValue);
		await page.waitForTimeout(400);
	}
};

export default editAdvancedNumberControl;
