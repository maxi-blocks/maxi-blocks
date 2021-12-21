/**
 * WordPress dependencies
 */
import { pressKeyWithModifier } from '@wordpress/e2e-test-utils';

const addTypographyOptions = async ({ page, instance }) => {
	// size, line-height, letter-spacing
	await instance.$$eval(
		'.maxi-tabs-content .maxi-typography-control__text-options-tabs .maxi-tabs-content input',
		select => select[0].focus()
	);

	await page.keyboard.type('11');

	// line-height
	await instance.$$eval(
		'.maxi-tabs-content .maxi-typography-control__text-options-tabs .maxi-tabs-content input',
		select => select[2].focus()
	);

	await pressKeyWithModifier('primary', 'a');
	await page.keyboard.type('22');

	// letter-spacing
	await instance.$$eval(
		'.maxi-tabs-content .maxi-typography-control__text-options-tabs .maxi-tabs-content input',
		select => select[4].focus()
	);
	await page.keyboard.type('33');
};

export default addTypographyOptions;
