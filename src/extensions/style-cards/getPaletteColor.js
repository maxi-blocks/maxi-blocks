/**
 * Internal dependencies
 */
import getBlockStyle from '@extensions/styles/getBlockStyle';
import getActiveStyleCard from './getActiveStyleCard';

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

	// Handle custom colors
	if (typeof color === 'string' && color.startsWith('custom-')) {
		const customIndex = parseInt(color.replace('custom-', ''), 10);
		const customColors = SCValue.color?.customColors || [];

		if (customColors[customIndex]) {
			// Extract RGB values from the custom color (which is in rgba format)
			const colorString = customColors[customIndex];

			// Check if it's an rgba format
			const rgbaMatch = colorString.match(
				/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/
			);
			if (rgbaMatch) {
				return `${rgbaMatch[1]}, ${rgbaMatch[2]}, ${rgbaMatch[3]}`;
			}

			// If it's a hex color, convert to RGB
			if (colorString.startsWith('#')) {
				const hex = colorString.replace('#', '');
				const r = parseInt(hex.substr(0, 2), 16);
				const g = parseInt(hex.substr(2, 2), 16);
				const b = parseInt(hex.substr(4, 2), 16);
				return `${r}, ${g}, ${b}`;
			}

			// Return the color as is if we can't extract RGB values
			return customColors[customIndex];
		}

		return '0, 0, 0'; // Default black if custom color not found
	}

	return (
		SCValue[blockStyle]?.styleCard?.color?.[color] ||
		SCValue[blockStyle]?.defaultStyleCard?.color?.[color]
	);
};

export default getPaletteColor;
