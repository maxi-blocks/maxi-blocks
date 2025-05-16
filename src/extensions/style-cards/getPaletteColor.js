/**
 * Internal dependencies
 */
import getBlockStyle from '@extensions/styles/getBlockStyle';
import getActiveStyleCard from './getActiveStyleCard';

/**
 * Fallback function to get custom color from CSS variables
 */
const getCustomColorFromCSS = (blockStyle, customIndex) => {
	// Try with the specified block style first
	const cssValueSpecific = getComputedStyle(document.documentElement)
		.getPropertyValue(`--maxi-${blockStyle}-color-custom-${customIndex}`)
		.trim();

	if (cssValueSpecific) {
		return cssValueSpecific;
	}

	// Try with the opposite block style (light/dark) as a fallback
	const oppositeStyle = blockStyle === 'light' ? 'dark' : 'light';
	const cssValueOpposite = getComputedStyle(document.documentElement)
		.getPropertyValue(`--maxi-${oppositeStyle}-color-custom-${customIndex}`)
		.trim();

	if (cssValueOpposite) {
		return cssValueOpposite;
	}

	// Fallback to a default color
	return '0, 0, 0';
};

/**
 * Extract RGB values from a color string
 */
const extractRGBValues = colorString => {
	if (!colorString) return '0, 0, 0';

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
	return colorString;
};

const getPaletteColor = ({ clientId, color, blockStyle: rawBlockStyle }) => {
	const activeStyleCard = getActiveStyleCard();
	const blockStyle = rawBlockStyle ?? getBlockStyle(clientId);

	if (
		!activeStyleCard ||
		!activeStyleCard.value ||
		Object.keys(activeStyleCard.value).length === 0
	) {
		// Check if it's a custom color
		if (typeof color === 'string' && color.startsWith('custom-')) {
			const customIndex = parseInt(color.replace('custom-', ''), 10);
			return getCustomColorFromCSS(blockStyle, customIndex);
		}

		return getComputedStyle(document.documentElement).getPropertyValue(
			`--maxi-${blockStyle}-color-${color}`
		);
	}

	const SCValue = activeStyleCard.value;

	// Handle custom colors
	if (typeof color === 'string' && color.startsWith('custom-')) {
		const customIndex = parseInt(color.replace('custom-', ''), 10);

		// Try to get custom colors from multiple possible locations in order of specificity
		const customColorsLocations = [
			// First check current style
			SCValue[blockStyle]?.styleCard?.color?.customColors,
			// Then try the color root object (backward compatibility)
			SCValue.color?.customColors,
			// Then try defaultStyleCard
			SCValue[blockStyle]?.defaultStyleCard?.color?.customColors,
			// Try the opposite style (light/dark)
			SCValue[blockStyle === 'light' ? 'dark' : 'light']?.styleCard?.color
				?.customColors,
			SCValue[blockStyle === 'light' ? 'dark' : 'light']?.defaultStyleCard
				?.color?.customColors,
		];

		// Find first non-empty custom colors array
		const customColors =
			customColorsLocations.find(
				colors => Array.isArray(colors) && colors.length > 0
			) || [];

		// If the specific custom color exists in the array
		if (customColors[customIndex]) {
			const customColor = customColors[customIndex];
			// Handle both old string format and new object format
			const colorValue =
				typeof customColor === 'object' && customColor.value
					? customColor.value
					: customColor;
			return extractRGBValues(colorValue);
		}

		// If we can't find the custom color in the style card, try to get it from CSS variables
		return getCustomColorFromCSS(blockStyle, customIndex);
	}

	// Return color value from styleCard or defaultStyleCard with better fallbacks
	return (
		SCValue[blockStyle]?.styleCard?.color?.[color] ||
		SCValue[blockStyle]?.defaultStyleCard?.color?.[color] ||
		// Try opposite style as fallback
		SCValue[blockStyle === 'light' ? 'dark' : 'light']?.styleCard?.color?.[
			color
		] ||
		SCValue[blockStyle === 'light' ? 'dark' : 'light']?.defaultStyleCard
			?.color?.[color] ||
		// Default fallback
		'0, 0, 0'
	);
};

export default getPaletteColor;
