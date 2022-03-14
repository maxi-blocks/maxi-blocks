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
	// size, line-height, letter-spacing
	await instance.$$eval(
		'.maxi-tabs-content .maxi-typography-control__text-options-tabs .maxi-tabs-content input',
		select => select[0].focus()
	);

	await pressKeyWithModifier('primary', 'a');
	await page.keyboard.type(size);
	await page.waitForTimeout(150);

	// line-height
	await instance.$$eval(
		'.maxi-tabs-content .maxi-typography-control__text-options-tabs .maxi-tabs-content input',
		select => select[2].focus()
	);

	await pressKeyWithModifier('primary', 'a');
	await page.keyboard.type(lineHeight);
	await page.waitForTimeout(150);

	// letter-spacing
	await instance.$$eval(
		'.maxi-tabs-content .maxi-typography-control__text-options-tabs .maxi-tabs-content input',
		select => select[4].focus()
	);

	await pressKeyWithModifier('primary', 'a');
	await page.keyboard.type(letterSpacing);
	await page.waitForTimeout(150);
};

export default addTypographyOptions;
