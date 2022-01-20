/**
 * WordPress dependencies
 */

const addTypographyStyle = async ({
	page,
	decoration,
	weight,
	transform,
	style,
}) => {
	// Weight, Transform, Style, Decoration
	const weightSelector = await page.$(
		'.maxi-typography-control__weight .maxi-base-control__field select'
	);
	await weightSelector.select(weight);

	const transformSelector = await page.$(
		'.maxi-typography-control__transform .maxi-base-control__field select'
	);
	await transformSelector.select(transform);

	const fontStyleSelector = await page.$(
		'.maxi-typography-control__font-style .maxi-base-control__field select'
	);
	await fontStyleSelector.select(style);

	const decorationSelector = await page.$(
		'.maxi-typography-control__decoration .maxi-base-control__field select'
	);
	await decorationSelector.select(decoration);
};

export default addTypographyStyle;
