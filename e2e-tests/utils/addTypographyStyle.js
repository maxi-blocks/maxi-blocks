/**
 * WordPress dependencies
 */
import { pressKeyWithModifier } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import getElementAttribute from './getElementAttribute';

const addTypographyStyle = async ({
	instance,
	weight,
	transform,
	style,
	decoration,
	orientation,
	direction,
	indent,
}) => {
	const response = {};
	// Weight, Transform, Style, Decoration
	const weightSelector = await instance.$(
		'.maxi-typography-control__weight .maxi-base-control__field select'
	);
	if (weight) await weightSelector.select(`${weight}`);
	response.weight = await getElementAttribute(weightSelector, 'value');

	const transformSelector = await instance.$(
		'.maxi-typography-control__transform .maxi-base-control__field select'
	);
	if (transform) await transformSelector.select(transform);
	response.transform = await getElementAttribute(transformSelector, 'value');

	const fontStyleSelector = await instance.$(
		'.maxi-typography-control__font-style .maxi-base-control__field select'
	);
	if (style) await fontStyleSelector.select(style);
	response.style = await getElementAttribute(fontStyleSelector, 'value');

	const decorationSelector = await instance.$(
		'.maxi-typography-control__decoration .maxi-base-control__field select'
	);
	if (decoration) await decorationSelector.select(decoration);
	response.decoration = await getElementAttribute(
		decorationSelector,
		'value'
	);

	const orientationSelector = await instance.$(
		'.maxi-typography-control__orientation .maxi-base-control__field select'
	);
	if (orientation) await orientationSelector.select(orientation);

	response.orientation = await getElementAttribute(
		orientationSelector,
		'value'
	);

	const directionSelector = await instance.$(
		'.maxi-typography-control__direction .maxi-base-control__field select'
	);
	if (direction) await directionSelector.select(direction);
	response.direction = await getElementAttribute(directionSelector, 'value');

	const textIndentInput = await instance.$(
		'.maxi-typography-control__text-indent input'
	);

	if (indent) {
		textIndentInput.focus();
		await pressKeyWithModifier('primary', 'a');
		await textIndentInput.type(`${indent}`);
	}
	response.indent = await getElementAttribute(textIndentInput, 'value');

	await instance._frame.waitForTimeout(150);

	return response;
};

export default addTypographyStyle;
