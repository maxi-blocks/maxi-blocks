/**
 * WordPress dependencies
 */
import { pressKeyWithModifier } from '@wordpress/e2e-test-utils';

const addTypographyStyle = async page => {
	// Weight, Transform, Style, Decoration
	const weightSelector = await page.$(
		'.maxi-typography-control__weight .maxi-base-control__field select'
	);
	await weightSelector.select('300');

	const transformSelector = await page.$(
		'.maxi-typography-control__transform .maxi-base-control__field select'
	);
	await transformSelector.select('capitalize');

	const fontStyleSelector = await page.$(
		'.maxi-typography-control__font-style .maxi-base-control__field select'
	);
	await fontStyleSelector.select('italic');

	const decorationSelector = await page.$(
		'.maxi-typography-control__decoration .maxi-base-control__field select'
	);
	await decorationSelector.select('overline');
};

export default addTypographyStyle;
