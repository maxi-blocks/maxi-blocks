/**
 * WordPress dependencies
 */

import { pressKeyWithModifier } from '@wordpress/e2e-test-utils';

const addTypographyStyle = async ({
	instance,
	decoration,
	weight,
	transform,
	style,
	orientation,
	direction,
	indent,
}) => {
	// Weight, Transform, Style, Decoration
	const weightSelector = await instance.$(
		'.maxi-typography-control__weight .maxi-base-control__field select'
	);
	await weightSelector.select(weight);

	const transformSelector = await instance.$(
		'.maxi-typography-control__transform .maxi-base-control__field select'
	);
	await transformSelector.select(transform);

	const fontStyleSelector = await instance.$(
		'.maxi-typography-control__font-style .maxi-base-control__field select'
	);
	await fontStyleSelector.select(style);

	const decorationSelector = await instance.$(
		'.maxi-typography-control__decoration .maxi-base-control__field select'
	);
	await decorationSelector.select(decoration);

	const orientationSelector = await instance.$(
		'.maxi-typography-control__orientation .maxi-base-control__field select'
	);
	await orientationSelector.select(orientation);

	const directionSelector = await instance.$(
		'.maxi-typography-control__direction .maxi-base-control__field select'
	);
	await directionSelector.select(direction);

	const textIndextInput = await instance.$(
		'.maxi-typography-control__text-indent input'
	);

	textIndextInput.focus();
	await pressKeyWithModifier('primary', 'a');
	await textIndextInput.type(indent);
};

export default addTypographyStyle;
