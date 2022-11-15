/**
 * WordPress dependencies
 */
import { pressKeyTimes, pressKeyWithModifier } from '@wordpress/e2e-test-utils';

const addTypographyOptions = async ({
	page,
	instance,
	size,
	lineHeight,
	letterSpacing,
}) => {
	// size
	if (size) {
		await instance.$$eval('.maxi-typography-control__size input', select =>
			select[0].focus()
		);
		await pressKeyTimes('Backspace', '4');
		await page.keyboard.type(`${size}`, { delay: 150 });
	}

	// line-height
	if (lineHeight) {
		await instance.$$eval(
			'.maxi-typography-control__line-height input',
			select => select[0].focus()
		);

		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type(`${lineHeight}`, { delay: 150 });
	}

	// letter-spacing
	if (letterSpacing) {
		await instance.$$eval(
			'.maxi-typography-control__letter-spacing input',
			select => select[0].focus()
		);
		await pressKeyWithModifier('primary', 'a');
		await page.keyboard.type(`${letterSpacing}`, { delay: 150 });
	}

	await page.waitForTimeout(150);
};

export default addTypographyOptions;
