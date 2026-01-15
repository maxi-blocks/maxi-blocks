/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import {
	getBlockStyle,
	getPaletteAttributes,
	getColorRGBAString,
} from '@extensions/styles';

/**
 * External dependencies
 */
import { isNil } from 'lodash';

export const rgbToHex = color => {
	if (isNil(color)) return '';

	const rgb = color.match(
		/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i
	);

	return rgb && rgb.length === 4
		? `#${`0${parseInt(rgb[1], 10).toString(16)}`.slice(-2)}${`0${parseInt(
				rgb[2],
				10
		  ).toString(16)}`.slice(-2)}${`0${parseInt(rgb[3], 10).toString(
				16
		  )}`.slice(-2)}`
		: '';
};

export const fitSvg = svgCode => {
	const template = document.createElement('div');

	template.setAttribute('id', 'maxi-temporary-elem');
	template.innerHTML = svgCode.trim();
	document.querySelector('body').append(template);

	const bbox = document.querySelector('#maxi-temporary-elem svg').getBBox();

	const SVGElement = document.querySelector('#maxi-temporary-elem svg');
	SVGElement.setAttribute(
		'viewBox',
		`${bbox.x}, ${bbox.y}, ${bbox.width}, ${bbox.height}`
	);
	SVGElement.removeAttribute('width');
	SVGElement.removeAttribute('height');

	const newSvgCode = document.querySelector(
		'#maxi-temporary-elem svg'
	).outerHTML;

	document.querySelector('#maxi-temporary-elem').remove();

	return newSvgCode;
};

export const svgAttributesReplacer = (
	svgCode,
	target = 'svg',
	iconType = null,
	layerOrder = null
) => {
	const { getSelectedBlockClientId, getBlock } = select('core/block-editor');
	const clientId = getSelectedBlockClientId();
	const block = clientId ? getBlock(clientId) : null;
	let currentAttributes = block?.attributes;
	const blockStyle = getBlockStyle(clientId);

	const fallbackFill = 'var(--maxi-icon-block-orange)';
	const fallbackStroke = '#081219';

	let resolvedFill = fallbackFill;
	let resolvedStroke = fallbackStroke;

	if (currentAttributes) {
		let fillPrefix;
		let strokePrefix;

		if (target === 'svg') {
			// For SVG target, always use svg-fill- and svg-line-
			fillPrefix = 'svg-fill-';
			strokePrefix = 'svg-line-';
		} else if (target === 'image-shape') {
			// For image-shape target, use just 'list-' for both fill and stroke
			fillPrefix = 'list-';
			strokePrefix = 'list-';
		} else if (target === 'shape' && iconType === 'bg-shape') {
			// For background-shape target, use background-svg- for both fill and stroke
			fillPrefix = 'background-svg-';
			strokePrefix = 'background-svg-';

			// Get attributes from the specific background layer if layerOrder is provided
			if (layerOrder && currentAttributes['background-layers']) {
				const bgLayer = currentAttributes['background-layers'].find(
					layer => layer.order === layerOrder
				);
				if (bgLayer) {
					currentAttributes = bgLayer;
				}
			}
		} else if (target === 'icon' && iconType) {
			// Handle specific iconType cases
			switch (iconType) {
				case 'video-icon-play':
					fillPrefix = 'play-icon-fill-';
					strokePrefix = 'play-icon-stroke-';
					break;
				case 'video-icon-close':
					fillPrefix = 'close-icon-fill-';
					strokePrefix = 'close-icon-stroke-';
					break;
				case 'accordion-icon-active':
					fillPrefix = 'active-icon-fill-';
					strokePrefix = 'active-icon-stroke-';
					break;
				case 'image-shape':
					// Use just 'list-' for both fill and stroke
					fillPrefix = 'list-';
					strokePrefix = 'list-';
					break;
				case 'search-icon-close':
					fillPrefix = 'close-icon-fill-';
					strokePrefix = 'close-icon-stroke-';
					break;
				default:
					// Fallback for other iconType cases
					fillPrefix = 'icon-fill-';
					strokePrefix = 'icon-stroke-';
					break;
			}
		} else {
			// Default case for icon target without iconType
			fillPrefix = 'icon-fill-';
			strokePrefix = 'icon-stroke-';
		}

		const {
			paletteStatus: fillPaletteStatus,
			paletteSCStatus: fillPaletteSCStatus,
			paletteColor: fillPaletteColor,
			paletteOpacity: fillPaletteOpacity,
			color: fillDirectColor,
		} = getPaletteAttributes({
			obj: currentAttributes,
			prefix: fillPrefix,
			breakpoint: iconType === 'bg-shape' ? 'general' : null,
		});

		const {
			paletteStatus: strokePaletteStatus,
			paletteSCStatus: strokePaletteSCStatus,
			paletteColor: strokePaletteColor,
			paletteOpacity: strokePaletteOpacity,
			color: strokeDirectColor,
		} = getPaletteAttributes({
			obj: currentAttributes,
			prefix: strokePrefix,
			breakpoint: iconType === 'bg-shape' ? 'general' : null,
		});

		const fillPaletteColorVar =
			fillPaletteColor != null ? `color-${fillPaletteColor}` : null;
		const fillPaletteSCColor = fillPaletteColorVar;
		const strokePaletteColorVar =
			strokePaletteColor != null ? `color-${strokePaletteColor}` : null;
		const strokePaletteSCColor = strokePaletteColorVar;

		resolvedFill =
			fillPaletteColorVar && (fillPaletteStatus || fillPaletteSCStatus)
				? getColorRGBAString(
						fillPaletteSCStatus
							? {
									firstVar: fillPaletteSCColor,
									opacity: fillPaletteOpacity,
									blockStyle,
							  }
							: {
									firstVar:
										target === 'icon'
											? 'icon-fill'
											: 'svg-fill',
									secondVar: fillPaletteColorVar,
									opacity: fillPaletteOpacity,
									blockStyle,
							  }
				  )
				: fillDirectColor || fallbackFill;

		resolvedStroke =
			strokePaletteColorVar &&
			(strokePaletteStatus || strokePaletteSCStatus)
				? getColorRGBAString(
						strokePaletteSCStatus
							? {
									firstVar: strokePaletteSCColor,
									opacity: strokePaletteOpacity,
									blockStyle,
							  }
							: {
									firstVar:
										target === 'icon'
											? 'icon-stroke'
											: 'svg-stroke',
									secondVar: strokePaletteColorVar,
									opacity: strokePaletteOpacity,
									blockStyle,
							  }
				  )
				: strokeDirectColor || fallbackStroke;
	}

	const fillRegExp = /fill:[^n]+?(?=})/g;
	const fillStr = `fill:${resolvedFill}`;

	// Changed from +? to *? to handle empty fill="" attributes
	const fillRegExp2 = /[^-]fill="[^n]*?(?=")/g;
	const fillStr2 = ` fill="${resolvedFill}`;

	const strokeRegExp = /stroke:[^n]+?(?=})/g;
	const strokeStr = `stroke:${resolvedStroke}`;

	// Changed from +? to *? to handle empty stroke="" attributes
	const strokeRegExp2 = /[^-]stroke="[^n]*?(?=")/g;
	const strokeStr2 = ` stroke="${resolvedStroke}`;

	let result = svgCode
		.replace(fillRegExp, fillStr)
		.replace(fillRegExp2, fillStr2)
		.replace(strokeRegExp, strokeStr)
		.replace(strokeRegExp2, strokeStr2);

	// For shapes, add fill to SVG element if not present
	if (target === 'shape' || target === 'image-shape') {
		// Check if SVG element has a fill attribute
		if (!/<svg[^>]*\sfill=/i.test(result)) {
			// Add fill attribute to the SVG element
			result = result.replace(/<svg/i, `<svg fill="${resolvedFill}"`);
		}
	}

	return result;
};

export const isColorLight = color => {
	// Handle empty or invalid color
	if (!color || color === '') {
		return false;
	}

	const hex = color.replace('#', '');
	const colorRed = parseInt(hex.substr(0, 2), 16);
	const colorGreen = parseInt(hex.substr(2, 2), 16);
	const colorBlue = parseInt(hex.substr(4, 2), 16);

	// Check if color is close to white (all RGB values are high)
	// A color blends into white background when all RGB components are > 200
	// This catches white, light gray, light pastels, etc. but not bright colors like pure red
	const minRGB = Math.min(colorRed, colorGreen, colorBlue);
	const avgRGB = (colorRed + colorGreen + colorBlue) / 3;

	// Color is considered "light" (will blend with white) if:
	// - Average RGB is high (> 210) AND
	// - Minimum RGB value is also high (> 180)
	// This ensures all components are light, not just one bright channel
	const result = avgRGB > 210 && minRGB > 180;

	return result;
};

/**
 * Resolves nested CSS variables to actual color values
 * Handles formats like: var(--maxi-light-icon-stroke,rgba(var(--maxi-light-color-1,255,255,255),1))
 *
 * @param {string} colorValue - Color value that may contain CSS variables
 * @returns {string} Resolved color value or fallback RGB value
 */
const resolveCSSVariable = colorValue => {
	if (!colorValue || !colorValue.includes('var(')) {
		return colorValue;
	}

	// Recursively resolve nested var() calls
	let resolved = colorValue;
	let hasVar = true;
	let iterations = 0;
	const maxIterations = 5; // Prevent infinite loops

	while (hasVar && iterations < maxIterations) {
		iterations += 1;

		// Match var(--variable-name, fallback)
		// Use a more sophisticated regex to handle nested parentheses
		const varMatch = resolved.match(/var\(([^,)]+)(?:,([^)]+))?\)/);

		if (!varMatch) {
			break;
		}

		const varName = varMatch[1].trim();
		const fallback = varMatch[2] ? varMatch[2].trim() : '';

		// Try to get computed value from CSS variable
		const computedValue = window
			.getComputedStyle(document.documentElement)
			.getPropertyValue(varName)
			.trim();

		// Replace the var() with either computed value or fallback
		if (computedValue) {
			resolved = resolved.replace(varMatch[0], computedValue);
		} else if (fallback) {
			resolved = resolved.replace(varMatch[0], fallback);
		} else {
			// No value and no fallback
			return '';
		}
	}

	return resolved;
};

/**
 * Helper function to extract color value with properly balanced parentheses
 * @param {string} str        - The string to extract from
 * @param {number} startIndex - The index where the color value starts
 * @returns {string} The extracted color value
 */
const extractColorValue = (str, startIndex) => {
	let depth = 0;
	let i = startIndex;

	while (i < str.length) {
		const char = str[i];
		if (char === '(') {
			depth += 1;
		} else if (char === ')') {
			depth -= 1;
			if (depth === 0) {
				return str.substring(startIndex, i + 1);
			}
		} else if (
			depth === 0 &&
			(char === '"' || char === "'" || char === ' ')
		) {
			return str.substring(startIndex, i);
		}
		i += 1;
	}

	return str.substring(startIndex, i);
};

/**
 * Detects if an SVG code contains predominantly light colors by analyzing fill and stroke attributes
 * Handles both direct color values and CSS variables
 *
 * @param {string} svgCode - The SVG code to analyze
 * @returns {boolean} True if the SVG has light colors (white or bright colors)
 */
export const isSVGColorLight = svgCode => {
	if (!svgCode || typeof svgCode !== 'string') {
		return false;
	}

	// Extract all fill and stroke color values using a manual parser for nested parentheses
	const allColorMatches = [];
	const patterns = [/fill[:=]["']?/gi, /stroke[:=]["']?/gi];

	patterns.forEach(pattern => {
		let match;
		// Reset lastIndex for global regex
		pattern.lastIndex = 0;
		// eslint-disable-next-line no-cond-assign
		while ((match = pattern.exec(svgCode)) !== null) {
			const startIdx = match.index + match[0].length;
			const colorValue = extractColorValue(svgCode, startIdx);
			if (colorValue) {
				allColorMatches.push(
					`${match[0].replace(/[:=]["']?$/, '')}="${colorValue}"`
				);
			}
		}
	});

	// If no colors found, return false
	if (allColorMatches.length === 0) {
		return false;
	}

	// Extract actual color values and check brightness
	let lightColorCount = 0;
	const colors = [];

	allColorMatches.forEach(match => {
		// Extract the color value from the match
		let colorValue = match
			.replace(/^(fill|stroke)[:=]["']?/i, '')
			.replace(/["']?$/g, '')
			.trim();

		// Resolve CSS variables to actual colors
		if (colorValue.includes('var(')) {
			colorValue = resolveCSSVariable(colorValue);
		}

		// Skip if we couldn't resolve the color
		if (!colorValue) {
			return;
		}

		// Check if color is light
		if (
			colorValue.toLowerCase() === 'white' ||
			colorValue === '#fff' ||
			colorValue === '#ffffff'
		) {
			lightColorCount += 1;
			colors.push({ color: colorValue, isLight: true });
		} else if (colorValue.startsWith('#')) {
			const isLight = isColorLight(colorValue);
			if (isLight) {
				lightColorCount += 1;
			}
			colors.push({ color: colorValue, isLight });
		} else if (colorValue.startsWith('rgb')) {
			// Convert RGB/RGBA to hex and check
			const rgbMatch = colorValue.match(/(\d+),\s*(\d+),\s*(\d+)/);
			if (rgbMatch) {
				const r = parseInt(rgbMatch[1], 10);
				const g = parseInt(rgbMatch[2], 10);
				const b = parseInt(rgbMatch[3], 10);

				// Check if RGB values indicate light/white color
				// Using the same logic as isColorLight but inline for RGB values
				const minRGB = Math.min(r, g, b);
				const avgRGB = (r + g + b) / 3;
				const isLight = avgRGB > 210 && minRGB > 180;

				const hexColor = `#${r.toString(16).padStart(2, '0')}${g
					.toString(16)
					.padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

				if (isLight) {
					lightColorCount += 1;
				}
				colors.push({
					color: colorValue,
					hex: hexColor,
					rgb: { r, g, b },
					minRGB,
					avgRGB,
					isLight,
				});
			}
		}
	});

	const hasLightColors = lightColorCount > 0;

	return hasLightColors;
};

export const getVarValue = currentColor => {
	return window
		.getComputedStyle(document.documentElement)
		.getPropertyValue(
			currentColor
				.substr(currentColor.lastIndexOf('var(') + 4)
				.replaceAll(')', '')
		);
};

export const svgCurrentColorStatus = (blockStyle, target = 'svg') => {
	const { getSelectedBlockClientId, getBlock } = select('core/block-editor');
	const clientId = getSelectedBlockClientId();

	const currentAttributes = getBlock(clientId)?.attributes;

	if (!currentAttributes) return null;

	const { receiveActiveStyleCardValue } = select('maxiBlocks/style-cards');

	const lineColorGlobal = receiveActiveStyleCardValue(
		'line-color',
		getBlockStyle(clientId),
		'icon'
	);
	const lineColorGlobalStatus = receiveActiveStyleCardValue(
		'line-color-global',
		getBlockStyle(clientId),
		'icon'
	);

	const colorType =
		target === 'icon' ? '' : target === 'svg' ? '-line' : '-fill';

	const iconPaletteAttr = getPaletteAttributes({
		obj: currentAttributes,
		prefix: 'icon-',
	});

	const iconPaletteStatus = iconPaletteAttr.paletteStatus;
	const iconPaletteColor = iconPaletteAttr.paletteColor;
	const iconColor = iconPaletteAttr.color;

	const iconInheritColor = currentAttributes['icon-inherit']
		? !iconPaletteStatus
			? rgbToHex(iconColor)
			: rgbToHex(
					`rgba(${getVarValue(
						`var(--maxi-${blockStyle}-color-${iconPaletteColor})`
					)}, 1)`
			  )
		: '';

	const { paletteStatus, paletteColor, color } = getPaletteAttributes({
		obj: currentAttributes,
		prefix: `${target}${colorType}-`,
	});

	const currentColor = !paletteStatus
		? rgbToHex(color)
		: rgbToHex(
				`rgba(${getVarValue(
					`var(--maxi-${blockStyle}-color-${paletteColor})`
				)},1)`
		  );

	const result =
		target === 'svg' && lineColorGlobalStatus
			? isColorLight(rgbToHex(lineColorGlobal))
			: isColorLight(
					target === 'icon' && currentAttributes['icon-inherit']
						? iconInheritColor
						: currentColor
			  );

	return result;
};
