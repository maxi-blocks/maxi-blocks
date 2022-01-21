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

	await page.keyboard.type(size);

	// line-height
	await instance.$$eval(
		'.maxi-tabs-content .maxi-typography-control__text-options-tabs .maxi-tabs-content input',
		select => select[2].focus()
	);

	await pressKeyWithModifier('primary', 'a');
	await page.keyboard.type(lineHeight);

	// letter-spacing
	await instance.$$eval(
		'.maxi-tabs-content .maxi-typography-control__text-options-tabs .maxi-tabs-content input',
		select => select[4].focus()
	);
	await page.keyboard.type(letterSpacing);
};

export default addTypographyOptions;
