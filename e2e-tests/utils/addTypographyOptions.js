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
	// size
	if (size) {
		await instance.$$eval(
			'.maxi-tabs-content .maxi-typography-control__text-options-tabs .maxi-tabs-content input',
			select => select[0].focus()
		);
		await page.keyboard.type(size, { delay: 150 });
	}

	// line-height
	if (lineHeight) {
		await instance.$$eval(
			'.maxi-tabs-content .maxi-typography-control__text-options-tabs .maxi-tabs-content input',
			select => select[2].focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type(lineHeight, { delay: 150 });
	}

	// letter-spacing
	if (letterSpacing) {
		await instance.$$eval(
			'.maxi-tabs-content .maxi-typography-control__text-options-tabs .maxi-tabs-content input',
			select => select[4].focus()
		);
		await page.keyboard.type(letterSpacing, { delay: 150 });
	}
};

export default addTypographyOptions;
