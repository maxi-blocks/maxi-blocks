/**
 * Internal dependencies
 */
import getBlockStyle from '@extensions/styles/getBlockStyle';
import getActiveStyleCard from './getActiveStyleCard';
import extractRGBValues from './extractRGBValues';

/**
 * Cache for CSS variable values to avoid expensive getComputedStyle calls
 */
const cssVariableCache = new Map();

/**
 * Get CSS variable value with caching
 */
const getCachedCSSVariable = variableName => {
	if (cssVariableCache.has(variableName)) {
		return cssVariableCache.get(variableName);
	}

	const value = getComputedStyle(document.documentElement)
		.getPropertyValue(variableName)
		.trim();

	cssVariableCache.set(variableName, value);
	return value;
};

/**
 * Clear CSS variable cache (call when style card changes)
 */
export const clearCSSVariableCache = () => {
	cssVariableCache.clear();
};

/**
 * Fallback function to get custom color from CSS variables
 */
const getCustomColorFromCSS = (blockStyle, customIndex) => {
	// Try with the specified block style first
	const cssValueSpecific = getCachedCSSVariable(
		`--maxi-${blockStyle}-color-custom-${customIndex}`
	);

	if (cssValueSpecific) {
		return cssValueSpecific;
	}

	// Try with the opposite block style (light/dark) as a fallback
	const oppositeStyle = blockStyle === 'light' ? 'dark' : 'light';
	const cssValueOpposite = getCachedCSSVariable(
		`--maxi-${oppositeStyle}-color-custom-${customIndex}`
	);

	if (cssValueOpposite) {
		return cssValueOpposite;
	}

	// Fallback to a default color
	return '0, 0, 0';
};

/**
 * Retrieves the palette color value.
 *
 * @param {Object}        props            - The properties object.
 * @param {string}        props.clientId   - The client ID.
 * @param {string|number} props.color      - The color value (1-8 for standard palette, or large number for custom).
 * @param {string}        props.blockStyle - The block style.
 *
 * @return {string} The palette color value in RGB format.
 */
const getPaletteColor = ({ clientId, color, blockStyle = '' }) => {
	const activeStyleCard = getActiveStyleCard();
	const resolvedBlockStyle = blockStyle || getBlockStyle(clientId);

	if (
		!activeStyleCard ||
		!activeStyleCard.value ||
		Object.keys(activeStyleCard.value).length === 0
	) {
		// Check if it's a custom color
		if (typeof color === 'string' && color.startsWith('custom-')) {
			const customIndex = parseInt(color.replace('custom-', ''), 10);
			return getCustomColorFromCSS(resolvedBlockStyle, customIndex);
		}

		return getCachedCSSVariable(
			`--maxi-${resolvedBlockStyle}-color-${color}`
		);
	}

	const SCValue = activeStyleCard.value;

	// Handle custom colors
	if (typeof color === 'string' && color.startsWith('custom-')) {
		const customIndex = parseInt(color.replace('custom-', ''), 10);

		// Try to get custom colors from multiple possible locations in order of specificity
		const customColorsLocations = [
			// First check current style
			SCValue[resolvedBlockStyle]?.styleCard?.color?.customColors,
			// Then try the color root object (backward compatibility)
			SCValue.color?.customColors,
			// Then try defaultStyleCard
			SCValue[resolvedBlockStyle]?.defaultStyleCard?.color?.customColors,
			// Try the opposite style (light/dark)
			SCValue[resolvedBlockStyle === 'light' ? 'dark' : 'light']
				?.styleCard?.color?.customColors,
			SCValue[resolvedBlockStyle === 'light' ? 'dark' : 'light']
				?.defaultStyleCard?.color?.customColors,
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
		return getCustomColorFromCSS(resolvedBlockStyle, customIndex);
	}

	// Handle numeric custom color IDs (new format)
	if (typeof color === 'number' && color >= 1000) {
		// Try to get custom colors from multiple possible locations
		const customColorsLocations = [
			SCValue[resolvedBlockStyle]?.styleCard?.color?.customColors,
			SCValue.color?.customColors,
			SCValue[resolvedBlockStyle]?.defaultStyleCard?.color?.customColors,
			SCValue[resolvedBlockStyle === 'light' ? 'dark' : 'light']
				?.styleCard?.color?.customColors,
			SCValue[resolvedBlockStyle === 'light' ? 'dark' : 'light']
				?.defaultStyleCard?.color?.customColors,
		];

		// Find first non-empty custom colors array
		const customColors =
			customColorsLocations.find(
				colors => Array.isArray(colors) && colors.length > 0
			) || [];

		// Find custom color by ID
		const customColorObj = customColors.find(
			colorObj => typeof colorObj === 'object' && colorObj.id === color
		);

		if (customColorObj?.value) {
			return extractRGBValues(customColorObj.value);
		}

		// Fallback to palette color 1
		return (
			SCValue[resolvedBlockStyle]?.styleCard?.color?.[1] ||
			SCValue[resolvedBlockStyle]?.defaultStyleCard?.color?.[1] ||
			SCValue[resolvedBlockStyle === 'light' ? 'dark' : 'light']
				?.styleCard?.color?.[1] ||
			SCValue[resolvedBlockStyle === 'light' ? 'dark' : 'light']
				?.defaultStyleCard?.color?.[1] ||
			'0, 0, 0'
		);
	}

	// Return color value from styleCard or defaultStyleCard with better fallbacks
	return (
		SCValue[resolvedBlockStyle]?.styleCard?.color?.[color] ||
		SCValue[resolvedBlockStyle]?.defaultStyleCard?.color?.[color] ||
		// Try opposite style as fallback
		SCValue[resolvedBlockStyle === 'light' ? 'dark' : 'light']?.styleCard
			?.color?.[color] ||
		SCValue[resolvedBlockStyle === 'light' ? 'dark' : 'light']
			?.defaultStyleCard?.color?.[color] ||
		// Default fallback
		'0, 0, 0'
	);
};

export default getPaletteColor;
