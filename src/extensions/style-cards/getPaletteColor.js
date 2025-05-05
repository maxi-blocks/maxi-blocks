/**
 * Internal dependencies
 */
import getBlockStyle from '@extensions/styles/getBlockStyle';
import getActiveStyleCard from './getActiveStyleCard';
import { isString } from 'lodash';

const getPaletteColor = ({ clientId, color, blockStyle: rawBlockStyle }) => {
	const activeStyleCard = getActiveStyleCard();
	const blockStyle = rawBlockStyle ?? getBlockStyle(clientId);

	if (
		!activeStyleCard ||
		!activeStyleCard.value ||
		Object.keys(activeStyleCard.value).length === 0
	) {
		return getComputedStyle(document.documentElement).getPropertyValue(
			`--maxi-${blockStyle}-color-${color}`
		);
	}

	const SCValue = activeStyleCard.value;

	// Check if color is a custom color ID (string starting with 'custom-')
	if (isString(color) && color.startsWith('custom-')) {
		// Get custom colors array
		const customColors =
			SCValue[blockStyle]?.styleCard?.color?.customColors || [];

		// Find the custom color by ID
		const customColor = customColors.find(cc => cc.id === color);

		// Return the color value if found
		if (customColor) {
			return customColor.value;
		}

		// If not found, fall back to the first palette color
		return (
			SCValue[blockStyle]?.styleCard?.color?.[1] ||
			SCValue[blockStyle]?.defaultStyleCard?.color?.[1]
		);
	}

	// Regular numeric palette color
	return (
		SCValue[blockStyle]?.styleCard?.color?.[color] ||
		SCValue[blockStyle]?.defaultStyleCard?.color?.[color]
	);
};

export default getPaletteColor;
