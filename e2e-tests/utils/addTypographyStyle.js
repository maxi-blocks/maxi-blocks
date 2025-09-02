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
	whiteSpace,
	wordSpacing,
	bottomGap,
	isStyleCards = false,
}) => {
	const response = {};

	await page.waitForTimeout(200);
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
	if (!isStyleCards && orientation)
		await orientationSelector.select(orientation);

	if (!isStyleCards)
		response.orientation = await getElementAttribute(
			orientationSelector,
			'value'
		);

	const directionSelector = await instance.$(
		'.maxi-typography-control__direction .maxi-base-control__field select'
	);
	if (!isStyleCards && direction) await directionSelector.select(direction);
	if (!isStyleCards)
		response.direction = await getElementAttribute(
			directionSelector,
			'value'
		);

	const textIndentInput = await instance.$(
		'.maxi-typography-control__text-indent input'
	);

	if (indent) {
		textIndentInput.focus();
		await pressKeyWithModifier('primary', 'a');
		await textIndentInput.type(`${indent}`, { delay: 350 });
		await page.waitForTimeout(500);
	}
	response.indent = await getElementAttribute(textIndentInput, 'value');

	// White space
	const whiteSpaceSelector = await instance.$(
		'.maxi-typography-control__white-space .maxi-base-control__field select'
	);
	if (whiteSpace) await whiteSpaceSelector.select(whiteSpace);
	response.whiteSpace = await getElementAttribute(
		whiteSpaceSelector,
		'value'
	);

	// Word spacing
	const wordSpaceInput = await instance.$(
		'.maxi-typography-control__word-spacing input'
	);
	if (wordSpacing) {
		wordSpaceInput.focus();
		await pressKeyWithModifier('primary', 'a');
		await wordSpaceInput.type(`${wordSpacing}`, { delay: 350 });
		await page.waitForTimeout(500);
	}
	response.wordSpacing = await getElementAttribute(wordSpaceInput, 'value');

	// Bottom gap
	const bottomGapInput = await instance.$(
		'.maxi-typography-control__bottom-gap input'
	);

	if (bottomGapInput) {
		if (bottomGap) {
			bottomGapInput.focus();
			await pressKeyWithModifier('primary', 'a');
			await bottomGapInput.type(`${bottomGap}`, { delay: 350 });
			await page.waitForTimeout(500);
		}

		response.bottomGap = await getElementAttribute(bottomGapInput, 'value');
	}

	if ('_frame' in instance) await instance._frame.waitForTimeout(150);
	else await instance.waitForTimeout(150);

	return response;
};

export default addTypographyStyle;
