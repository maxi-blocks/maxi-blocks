/**
 * External dependencies
 */
import { cloneDeep, merge } from 'lodash';

/**
 * Internal dependencies
 */
import standardSC from '@maxi-core/defaults/defaultSC.json';
import { openStyleCardsEditor } from '@editor/style-cards/utils';
import getActiveStyleCard from './getActiveStyleCard';

const THEME_PALETTES = {
	green: {
		primary: '#22c55e',
		hover: '#16a34a',
		soft: '#f0fdf4',
		shadow: '#1f2d24',
	},
	blue: {
		primary: '#3b82f6',
		hover: '#2563eb',
		soft: '#eff6ff',
		shadow: '#1e293b',
	},
};

const VIBE_DICTIONARY = {
	feminine: {
		headingFont: {
			family: 'Playfair Display',
			weight: 600,
		},
		bodyFont: {
			family: 'Montserrat',
			weight: 300,
			lineHeight: 1.6,
			lineHeightUnit: 'em',
			letterSpacing: 0.02,
			letterSpacingUnit: 'em',
		},
		buttonText: {
			textTransform: 'uppercase',
			letterSpacing: 0.1,
			letterSpacingUnit: 'em',
		},
		palette: {
			1: '#ffffff', // White background
			2: '#fdf2f8', // Soft pink background
			3: '#9ca3af', // Muted gray text
			4: '#db2777', // Primary pink
			5: '#831843', // Dark pink heading
			6: '#9d174d', // Hover pink
			7: '#fce7f3', // Light pink surface
			8: '#e5d5da', // Pink shadow
		},
	},
	'modern corporate': {
		headingFont: {
			family: 'Inter',
			weight: 700,
			letterSpacing: -0.02,
			letterSpacingUnit: 'em',
		},
		bodyFont: {
			family: 'Inter',
			weight: 400,
		},
		palette: {
			1: '#ffffff', // White background
			2: '#f8fafc', // Slate light
			3: '#64748b', // Slate muted
			4: '#0284c7', // Primary blue
			5: '#0f172a', // Slate dark heading
			6: '#0369a1', // Hover blue
			7: '#e2e8f0', // Slate surface
			8: '#cbd5e1', // Slate shadow
		},
	},
	'bold startup': {
		headingFont: {
			family: 'Syne',
			weight: 800,
			textTransform: 'uppercase',
		},
		bodyFont: {
			family: 'Plus Jakarta Sans',
			weight: 450,
		},
		palette: {
			1: '#ffffff', // White background
			2: '#f5f3ff', // Violet light
			3: '#6b7280', // Gray muted
			4: '#7c3aed', // Primary violet
			5: '#1f2937', // Dark heading
			6: '#6d28d9', // Hover violet
			7: '#ede9fe', // Violet surface
			8: '#ddd6fe', // Violet shadow
		},
	},
	'retro vintage': {
		headingFont: {
			family: 'Fraunces',
			weight: 600,
		},
		bodyFont: {
			family: 'Space Mono',
			weight: 400,
		},
		palette: {
			1: '#fefce8', // Cream background
			2: '#fef2f2', // Warm white
			3: '#78716c', // Stone muted
			4: '#ea580c', // Primary orange
			5: '#44403c', // Stone dark heading
			6: '#c2410c', // Hover orange
			7: '#fef3c7', // Amber surface
			8: '#eac6bc', // Warm shadow
		},
	},
	'luxury boutique': {
		headingFont: {
			family: 'Cormorant Garamond',
			weight: 300,
		},
		bodyFont: {
			family: 'Montserrat',
			weight: 300,
			lineHeight: 1.8,
			lineHeightUnit: 'em',
			letterSpacing: 0.05,
			letterSpacingUnit: 'em',
		},
		palette: {
			1: '#ffffff', // White background
			2: '#fafaf9', // Stone light
			3: '#78716c', // Stone muted
			4: '#a27b5c', // Primary brown
			5: '#292524', // Stone dark heading
			6: '#846144', // Hover brown
			7: '#f5f5f4', // Stone surface
			8: '#e7e5e4', // Stone shadow
		},
	},
	'tech dark': {
		headingFont: {
			family: 'Space Grotesk',
			weight: 500,
		},
		bodyFont: {
			family: 'Inter',
			weight: 400,
		},
		palette: {
			1: '#0f172a', // Dark background
			2: '#1e293b', // Slate dark
			3: '#94a3b8', // Slate light muted
			4: '#22d3ee', // Primary cyan
			5: '#f8fafc', // Light heading
			6: '#0891b2', // Hover cyan
			7: '#334155', // Slate medium
			8: '#000000', // Black shadow
		},
	},
};

const hexToRgbString = hex => {
	const sanitized = hex.replace('#', '').trim();
	const normalized =
		sanitized.length === 3
			? sanitized
				.split('')
				.map(value => `${value}${value}`)
				.join('')
			: sanitized;

	const intValue = parseInt(normalized, 16);
	const r = (intValue >> 16) & 255;
	const g = (intValue >> 8) & 255;
	const b = intValue & 255;
	return `${r},${g},${b}`;
};

const CSS_COLOR_KEYWORDS = {
	aliceblue: '#f0f8ff',
	antiquewhite: '#faebd7',
	aqua: '#00ffff',
	aquamarine: '#7fffd4',
	azure: '#f0ffff',
	beige: '#f5f5dc',
	bisque: '#ffe4c4',
	black: '#000000',
	blanchedalmond: '#ffebcd',
	blue: '#0000ff',
	blueviolet: '#8a2be2',
	brown: '#a52a2a',
	burlywood: '#deb887',
	cadetblue: '#5f9ea0',
	chartreuse: '#7fff00',
	chocolate: '#d2691e',
	coral: '#ff7f50',
	cornflowerblue: '#6495ed',
	cornsilk: '#fff8dc',
	crimson: '#dc143c',
	cyan: '#00ffff',
	darkblue: '#00008b',
	darkcyan: '#008b8b',
	darkgoldenrod: '#b8860b',
	darkgray: '#a9a9a9',
	darkgreen: '#006400',
	darkgrey: '#a9a9a9',
	darkkhaki: '#bdb76b',
	darkmagenta: '#8b008b',
	darkolivegreen: '#556b2f',
	darkorange: '#ff8c00',
	darkorchid: '#9932cc',
	darkred: '#8b0000',
	darksalmon: '#e9967a',
	darkseagreen: '#8fbc8f',
	darkslateblue: '#483d8b',
	darkslategray: '#2f4f4f',
	darkslategrey: '#2f4f4f',
	darkturquoise: '#00ced1',
	darkviolet: '#9400d3',
	deeppink: '#ff1493',
	deepskyblue: '#00bfff',
	dimgray: '#696969',
	dimgrey: '#696969',
	dodgerblue: '#1e90ff',
	firebrick: '#b22222',
	floralwhite: '#fffaf0',
	forestgreen: '#228b22',
	fuchsia: '#ff00ff',
	gainsboro: '#dcdcdc',
	ghostwhite: '#f8f8ff',
	gold: '#ffd700',
	goldenrod: '#daa520',
	gray: '#808080',
	green: '#008000',
	greenyellow: '#adff2f',
	grey: '#808080',
	honeydew: '#f0fff0',
	hotpink: '#ff69b4',
	indianred: '#cd5c5c',
	indigo: '#4b0082',
	ivory: '#fffff0',
	khaki: '#f0e68c',
	lavender: '#e6e6fa',
	lavenderblush: '#fff0f5',
	lawngreen: '#7cfc00',
	lemonchiffon: '#fffacd',
	lightblue: '#add8e6',
	lightcoral: '#f08080',
	lightcyan: '#e0ffff',
	lightgoldenrodyellow: '#fafad2',
	lightgray: '#d3d3d3',
	lightgreen: '#90ee90',
	lightgrey: '#d3d3d3',
	lightpink: '#ffb6c1',
	lightsalmon: '#ffa07a',
	lightseagreen: '#20b2aa',
	lightskyblue: '#87cefa',
	lightslategray: '#778899',
	lightslategrey: '#778899',
	lightsteelblue: '#b0c4de',
	lightyellow: '#ffffe0',
	lime: '#00ff00',
	limegreen: '#32cd32',
	linen: '#faf0e6',
	magenta: '#ff00ff',
	maroon: '#800000',
	mediumaquamarine: '#66cdaa',
	mediumblue: '#0000cd',
	mediumorchid: '#ba55d3',
	mediumpurple: '#9370db',
	mediumseagreen: '#3cb371',
	mediumslateblue: '#7b68ee',
	mediumspringgreen: '#00fa9a',
	mediumturquoise: '#48d1cc',
	mediumvioletred: '#c71585',
	midnightblue: '#191970',
	mintcream: '#f5fffa',
	mistyrose: '#ffe4e1',
	moccasin: '#ffe4b5',
	navajowhite: '#ffdead',
	navy: '#000080',
	oldlace: '#fdf5e6',
	olive: '#808000',
	olivedrab: '#6b8e23',
	orange: '#ffa500',
	orangered: '#ff4500',
	orchid: '#da70d6',
	palegoldenrod: '#eee8aa',
	palegreen: '#98fb98',
	paleturquoise: '#afeeee',
	palevioletred: '#db7093',
	papayawhip: '#ffefd5',
	peachpuff: '#ffdab9',
	peru: '#cd853f',
	pink: '#ffc0cb',
	plum: '#dda0dd',
	powderblue: '#b0e0e6',
	purple: '#800080',
	rebeccapurple: '#663399',
	red: '#ff0000',
	rosybrown: '#bc8f8f',
	royalblue: '#4169e1',
	saddlebrown: '#8b4513',
	salmon: '#fa8072',
	sandybrown: '#f4a460',
	seagreen: '#2e8b57',
	seashell: '#fff5ee',
	sienna: '#a0522d',
	silver: '#c0c0c0',
	skyblue: '#87ceeb',
	slateblue: '#6a5acd',
	slategray: '#708090',
	slategrey: '#708090',
	snow: '#fffafa',
	springgreen: '#00ff7f',
	steelblue: '#4682b4',
	tan: '#d2b48c',
	teal: '#008080',
	thistle: '#d8bfd8',
	tomato: '#ff6347',
	turquoise: '#40e0d0',
	violet: '#ee82ee',
	wheat: '#f5deb3',
	white: '#ffffff',
	whitesmoke: '#f5f5f5',
	yellow: '#ffff00',
	yellowgreen: '#9acd32',
};

const CSS_COLOR_KEYWORDS_SORTED = Object.keys(CSS_COLOR_KEYWORDS).sort(
	(a, b) => b.length - a.length
);

const normalizeThemeValue = themeValue => {
	if (!themeValue) return null;
	return String(themeValue).trim().toLowerCase();
};

export const getThemeFromPrompt = prompt => {
	if (!prompt) return null;
	const normalizedPrompt = normalizeThemeValue(prompt);
	if (!normalizedPrompt) return null;

	const matches = Object.keys(THEME_PALETTES).find(themeKey =>
		normalizedPrompt.includes(themeKey)
	);

	return matches || null;
};

const LIGHTER_KEYWORDS = [
	'lighter',
	'lighten',
	'brighten',
	'brighter',
	'less dark',
	'more light',
];

const DARKER_KEYWORDS = ['darker', 'darken', 'deeper'];

export const shouldOpenStyleCardEditorFromPrompt = prompt => {
	if (!prompt) return false;
	const normalizedPrompt = normalizeThemeValue(prompt);
	if (!normalizedPrompt) return false;

	return [
		'color',
		'colour',
		'colors',
		'colours',
		'palette',
		'theme',
		'vibe',
		'feminine',
		'boutique',
		'luxury',
		'retro',
		'vintage',
		'corporate',
		'startup',
		'tech dark',
		'font',
		'typography',
		'style card',
		'stylecard',
		...LIGHTER_KEYWORDS,
		...DARKER_KEYWORDS,
	].some(keyword => normalizedPrompt.includes(keyword));
};

export { openStyleCardsEditor };

const shouldLighten = prompt => {
	if (!prompt) return false;
	const normalizedPrompt = normalizeThemeValue(prompt);
	if (!normalizedPrompt) return false;
	return LIGHTER_KEYWORDS.some(keyword => normalizedPrompt.includes(keyword));
};

const shouldDarken = prompt => {
	if (!prompt) return false;
	const normalizedPrompt = normalizeThemeValue(prompt);
	if (!normalizedPrompt) return false;
	return DARKER_KEYWORDS.some(keyword => normalizedPrompt.includes(keyword));
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const rgbToHsl = (r, g, b) => {
	const red = r / 255;
	const green = g / 255;
	const blue = b / 255;

	const max = Math.max(red, green, blue);
	const min = Math.min(red, green, blue);
	const delta = max - min;
	let h = 0;
	let s = 0;
	const l = (max + min) / 2;

	if (delta !== 0) {
		s = delta / (1 - Math.abs(2 * l - 1));
		switch (max) {
			case red:
				h = ((green - blue) / delta) % 6;
				break;
			case green:
				h = (blue - red) / delta + 2;
				break;
			default:
				h = (red - green) / delta + 4;
				break;
		}
		h = Math.round(h * 60);
		if (h < 0) h += 360;
	}

	return {
		h,
		s: Math.round(s * 100),
		l: Math.round(l * 100),
	};
};

const hslToRgb = (h, s, l) => {
	const saturation = s / 100;
	const lightness = l / 100;

	const c = (1 - Math.abs(2 * lightness - 1)) * saturation;
	const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
	const m = lightness - c / 2;
	let r = 0;
	let g = 0;
	let b = 0;

	if (h >= 0 && h < 60) {
		r = c;
		g = x;
		b = 0;
	} else if (h >= 60 && h < 120) {
		r = x;
		g = c;
		b = 0;
	} else if (h >= 120 && h < 180) {
		r = 0;
		g = c;
		b = x;
	} else if (h >= 180 && h < 240) {
		r = 0;
		g = x;
		b = c;
	} else if (h >= 240 && h < 300) {
		r = x;
		g = 0;
		b = c;
	} else {
		r = c;
		g = 0;
		b = x;
	}

	return {
		r: Math.round((r + m) * 255),
		g: Math.round((g + m) * 255),
		b: Math.round((b + m) * 255),
	};
};

const rgbToHex = ({ r, g, b }) => {
	const toHex = value => value.toString(16).padStart(2, '0');
	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const parseHexColor = input => {
	const match = input.match(/#([0-9a-f]{3}|[0-9a-f]{6})\b/i);
	return match ? match[0] : null;
};

const parseRgbColor = input => {
	const match = input.match(
		/\brgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/i
	);
	if (!match) return null;
	const r = clamp(Number(match[1]), 0, 255);
	const g = clamp(Number(match[2]), 0, 255);
	const b = clamp(Number(match[3]), 0, 255);
	return rgbToHex({ r, g, b });
};

const parseRgbString = input => {
	const match = input
		? String(input).match(/\b(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\b/)
		: null;
	if (!match) return null;
	const r = clamp(Number(match[1]), 0, 255);
	const g = clamp(Number(match[2]), 0, 255);
	const b = clamp(Number(match[3]), 0, 255);
	return rgbToHex({ r, g, b });
};

export const parseColorFromPrompt = prompt => {
	if (!prompt) return null;
	const normalizedPrompt = normalizeThemeValue(prompt);
	if (!normalizedPrompt) return null;

	const hexMatch = parseHexColor(normalizedPrompt);
	if (hexMatch) return hexMatch;

	const rgbMatch = parseRgbColor(normalizedPrompt);
	if (rgbMatch) return rgbMatch;

	const rgbStringMatch = parseRgbString(normalizedPrompt);
	if (rgbStringMatch) return rgbStringMatch;

	const condensedPrompt = normalizedPrompt.replace(/[\s-]+/g, '');
	const colorName = CSS_COLOR_KEYWORDS_SORTED.find(keyword =>
		condensedPrompt.includes(keyword)
	);

	return colorName ? CSS_COLOR_KEYWORDS[colorName] : null;
};

const getVibeFromPrompt = prompt => {
	if (!prompt) return null;
	const normalizedPrompt = normalizeThemeValue(prompt);
	if (!normalizedPrompt) return null;

	if (normalizedPrompt.includes('feminine')) return 'feminine';
	if (normalizedPrompt.includes('modern corporate')) return 'modern corporate';
	if (normalizedPrompt.includes('bold startup')) return 'bold startup';
	if (
		normalizedPrompt.includes('retro') ||
		normalizedPrompt.includes('vintage')
	)
		return 'retro vintage';
	if (
		normalizedPrompt.includes('luxury') ||
		normalizedPrompt.includes('boutique')
	)
		return 'luxury boutique';
	if (normalizedPrompt.includes('tech dark')) return 'tech dark';

	return null;
};

const isMoreFeminine = prompt => {
	if (!prompt) return false;
	const normalizedPrompt = normalizeThemeValue(prompt);
	if (!normalizedPrompt) return false;
	return normalizedPrompt.includes('more feminine');
};

const isSoftFeminine = prompt => {
	if (!prompt) return false;
	const normalizedPrompt = normalizeThemeValue(prompt);
	if (!normalizedPrompt) return false;
	return (
		normalizedPrompt.includes('soft feminine') ||
		normalizedPrompt.includes('minimalist feminine')
	);
};

const adjustPaletteLightness = (palette, delta) => {
	const adjustColor = hex => {
		if (!hex) return null;
		const [r, g, b] = hexToRgbString(hex)
			.split(',')
			.map(value => Number(value));
		const { h, s, l } = rgbToHsl(r, g, b);
		const adjusted = hslToRgb(h, s, clamp(l + delta, 5, 95));
		return rgbToHex(adjusted);
	};

	// Handle numbered palette (1-8)
	if (palette[1] !== undefined) {
		const newPalette = {};
		for (let i = 1; i <= 8; i++) {
			if (palette[i]) {
				newPalette[i] = adjustColor(palette[i]);
			}
		}
		return newPalette;
	}

	// Handle legacy named palette
	return {
		primary: adjustColor(palette.primary),
		hover: adjustColor(palette.hover),
		soft: adjustColor(palette.soft),
		shadow: adjustColor(palette.shadow),
	};
};

const generatePaletteFromBase = baseHex => {
	const baseRgb = hexToRgbString(baseHex)
		.split(',')
		.map(value => Number(value));
	const [r, g, b] = baseRgb;
	const { h, s, l } = rgbToHsl(r, g, b);

	// Generate all 8 palette slots from the base color
	return {
		1: '#ffffff', // White background
		2: rgbToHex(hslToRgb(h, clamp(s * 0.35, 8, 25), clamp(l + 45, 90, 98))), // Soft/light
		3: rgbToHex(hslToRgb(h, clamp(s * 0.4, 10, 30), clamp(l - 20, 40, 60))), // Muted
		4: baseHex, // Primary
		5: rgbToHex(hslToRgb(h, clamp(s + 10, 20, 100), clamp(l - 35, 15, 35))), // Dark heading
		6: rgbToHex(hslToRgb(h, clamp(s + 5, 15, 100), clamp(l - 12, 20, 60))), // Hover
		7: rgbToHex(hslToRgb(h, clamp(s * 0.5, 5, 20), clamp(l + 35, 85, 95))), // Surface
		8: rgbToHex(hslToRgb(h, clamp(s * 0.45, 10, 40), clamp(l - 45, 10, 30))), // Shadow
	};
};

const getPaletteFromStyleCard = styleCard => {
	const light = styleCard?.light;
	const styleColors = light?.styleCard?.color || {};
	const defaultColors = light?.defaultStyleCard?.color || {};
	const primary = parseRgbString(styleColors[4] || defaultColors[4]);
	const hover = parseRgbString(styleColors[6] || defaultColors[6]);
	const soft = parseRgbString(styleColors[2] || defaultColors[2]);
	const shadow = parseRgbString(styleColors[8] || defaultColors[8]);

	if (!primary || !hover || !soft || !shadow) return null;

	return {
		primary,
		hover,
		soft,
		shadow,
	};
};

const ensureStyleCardColor = sc => {
	const nextSC = cloneDeep(sc);
	if (!nextSC.light) nextSC.light = { styleCard: {}, defaultStyleCard: {} };
	if (!nextSC.light.styleCard) nextSC.light.styleCard = {};
	if (!nextSC.light.styleCard.color) nextSC.light.styleCard.color = {};
	return nextSC;
};

const applyPaletteToLight = (styleCard, palette) => {
	const nextSC = ensureStyleCardColor(styleCard);
	const lightColors = nextSC.light.styleCard.color;
	
	// Apply all 8 palette slots
	// Support both numbered format (1-8) and legacy named format (primary, hover, soft, shadow)
	if (palette[1] !== undefined) {
		// New numbered format
		for (let i = 1; i <= 8; i++) {
			if (palette[i]) {
				lightColors[i] = hexToRgbString(palette[i]);
			}
		}
	} else {
		// Legacy named format (backwards compatibility)
		if (palette.soft) lightColors[2] = hexToRgbString(palette.soft);
		if (palette.primary) lightColors[4] = hexToRgbString(palette.primary);
		if (palette.hover) lightColors[6] = hexToRgbString(palette.hover);
		if (palette.shadow) lightColors[8] = hexToRgbString(palette.shadow);
	}
	return nextSC;
};

const applyTypographyToStyleCard = (styleCard, vibe, prompt) => {
	if (!vibe) return styleCard;
	const nextSC = cloneDeep(styleCard);
	if (!nextSC.light) {
		nextSC.light = { styleCard: {}, defaultStyleCard: {} };
	}
	if (!nextSC.light.styleCard) {
		nextSC.light.styleCard = {};
	}
	const heading = vibe.headingFont;
	const body = vibe.bodyFont;
	const buttonText = vibe.buttonText;

	const headingLevels = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
	headingLevels.forEach(level => {
		if (!nextSC.light?.styleCard?.[level]) {
			nextSC.light.styleCard[level] = {};
		}
		nextSC.light.styleCard[level]['font-family-general'] =
			heading.family;
		nextSC.light.styleCard[level]['font-weight-general'] =
			heading.weight;
		if (heading.letterSpacing !== undefined) {
			nextSC.light.styleCard[level]['letter-spacing-general'] =
				heading.letterSpacing;
			nextSC.light.styleCard[level]['letter-spacing-unit-general'] =
				heading.letterSpacingUnit || 'em';
		}
		if (heading.textTransform) {
			nextSC.light.styleCard[level]['text-transform-general'] =
				heading.textTransform;
		}
	});

	if (!nextSC.light?.styleCard?.p) {
		nextSC.light.styleCard.p = {};
	}
	nextSC.light.styleCard.p['font-family-general'] = body.family;
	nextSC.light.styleCard.p['font-weight-general'] = body.weight;
	if (body.lineHeight) {
		nextSC.light.styleCard.p['line-height-general'] = body.lineHeight;
		nextSC.light.styleCard.p['line-height-unit-general'] =
			body.lineHeightUnit || 'em';
	}
	if (body.letterSpacing !== undefined) {
		nextSC.light.styleCard.p['letter-spacing-general'] =
			body.letterSpacing;
		nextSC.light.styleCard.p['letter-spacing-unit-general'] =
			body.letterSpacingUnit || 'em';
	}

	if (buttonText) {
		if (!nextSC.light?.styleCard?.button) {
			nextSC.light.styleCard.button = {};
		}
		nextSC.light.styleCard.button['text-transform-general'] =
			buttonText.textTransform;
		nextSC.light.styleCard.button['letter-spacing-general'] =
			buttonText.letterSpacing;
		nextSC.light.styleCard.button['letter-spacing-unit-general'] =
			buttonText.letterSpacingUnit || 'em';
	}

	if (vibe === VIBE_DICTIONARY.feminine && isMoreFeminine(prompt)) {
		nextSC.light.styleCard.h1['font-size-general'] =
			(nextSC.light.styleCard.h1['font-size-general'] || 45) + 6;
		nextSC.light.styleCard.p['font-weight-general'] =
			Math.max(200, body.weight - 100);
	}

	if (vibe === VIBE_DICTIONARY.feminine && isSoftFeminine(prompt)) {
		if (!nextSC.light.styleCard.color) {
			nextSC.light.styleCard.color = {};
		}
		nextSC.light.styleCard.color[4] = hexToRgbString('#f5f5f4');
		headingLevels.forEach(level => {
			nextSC.light.styleCard[level]['color'] = hexToRgbString('#444444');
			nextSC.light.styleCard[level]['color-global'] = false;
			nextSC.light.styleCard[level]['palette-status'] = false;
		});
	}

	return nextSC;
};

const createCustomStyleCard = (sourceSC, timestamp, palette, name) => {
	const newKey = `sc_${timestamp}`;
	const newCard = merge(cloneDeep(standardSC.sc_maxi), cloneDeep(sourceSC));
	newCard.name = name || `Custom-SC-${timestamp}`;
	newCard.status = 'active';
	newCard.type = 'user';
	newCard.updated = timestamp;
	const themedCard = applyPaletteToLight(newCard, palette);

	return { key: newKey, card: themedCard };
};

const HEADING_LEVELS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

const applyHeadingColor = (styleCard, hexColor, includePaletteOpacity = false) => {
	if (!styleCard || !hexColor) return styleCard;
	const rgbColor = hexToRgbString(hexColor);

	if (!styleCard.light) {
		styleCard.light = { styleCard: {}, defaultStyleCard: {} };
	}
	if (!styleCard.light.styleCard) {
		styleCard.light.styleCard = {};
	}

	HEADING_LEVELS.forEach(level => {
		if (!styleCard.light.styleCard[level]) {
			styleCard.light.styleCard[level] = {};
		}
		styleCard.light.styleCard[level]['palette-status'] = false;
		styleCard.light.styleCard[level]['color-global'] = true;
		styleCard.light.styleCard[level]['color'] = rgbColor;
		if (includePaletteOpacity) {
			styleCard.light.styleCard[level]['palette-opacity'] = 1;
		}
	});

	return styleCard;
};

export const applyThemeToStyleCards = ({
	styleCards,
	theme,
	prompt,
	color,
	openEditor,
	timestamp = Date.now(),
}) => {
	if (!styleCards) return null;

	const activeSC = getActiveStyleCard(styleCards);
	if (!activeSC) return null;

	const promptText = typeof prompt === 'string' ? prompt : '';
	const promptTextLower = promptText.toLowerCase();
	const vibeKey = getVibeFromPrompt(promptText);
	
	const vibe = vibeKey ? VIBE_DICTIONARY[vibeKey] : null;
	const resolvedTheme =
		normalizeThemeValue(theme) || getThemeFromPrompt(promptText);
	const resolvedColor =
		parseColorFromPrompt(color) ||
		parseColorFromPrompt(promptText) ||
		(resolvedTheme && CSS_COLOR_KEYWORDS[resolvedTheme]);

	const defaultPalette =
		(vibe?.palette || (resolvedTheme && THEME_PALETTES[resolvedTheme])) ||
		(resolvedColor ? generatePaletteFromBase(resolvedColor) : null);

	const fallbackPalette = getPaletteFromStyleCard(activeSC.value);
	const palette =
		defaultPalette ||
		((shouldLighten(promptText) || shouldDarken(promptText)) &&
		fallbackPalette
			? fallbackPalette
			: null);

	if (!palette) {
		return null;
	}

	const adjustedPalette = shouldLighten(promptText)
		? adjustPaletteLightness(palette, 10)
		: shouldDarken(promptText)
			? adjustPaletteLightness(palette, -10)
			: palette;

	const nextStyleCards = cloneDeep(styleCards);
	const isCustom = activeSC.value?.type === 'user';
	const shouldOpenEditor =
		typeof openEditor === 'boolean'
			? openEditor
			: shouldOpenStyleCardEditorFromPrompt(promptText);

	Object.keys(nextStyleCards).forEach(key => {
		delete nextStyleCards[key].selected;
	});

	if (isCustom) {
		// Check if this is a heading-only color request
		const isHeadingOnlyRequest = resolvedColor && 
			/\b(heading|headers?|title)\b/i.test(promptText) &&
			!/\b(palette|theme|site|everything|all colors?)\b/i.test(promptText);
		
		if (isHeadingOnlyRequest) {
			// Only apply heading colors, skip palette changes
			applyHeadingColor(nextStyleCards[activeSC.key], resolvedColor, true);
		} else {
			// Apply full palette changes
			nextStyleCards[activeSC.key] = applyPaletteToLight(
				nextStyleCards[activeSC.key],
				adjustedPalette
			);
			if (vibe) {
				nextStyleCards[activeSC.key] = applyTypographyToStyleCard(
					nextStyleCards[activeSC.key],
					vibe,
					promptText
				);
			}
			
			// [NEW] Smart Element Coloring (for non-heading-only requests)
			if (
				resolvedColor &&
				(promptTextLower.includes('heading') || promptTextLower.includes('title'))
			) {
				applyHeadingColor(nextStyleCards[activeSC.key], resolvedColor, false);
			}
		}

		nextStyleCards[activeSC.key].pendingChanges = true;
		nextStyleCards[activeSC.key].selected = true;
		if (shouldOpenEditor) {
			openStyleCardsEditor();
		}
		return {
			styleCards: nextStyleCards,
			updatedKey: activeSC.key,
			createdNew: false,
		};
	}

	const vibeName = vibeKey
		? `${vibeKey.replace(/\s+/g, '-')}-${timestamp}`
		: null;
	
	// Check if this is a heading-only color request (same logic as above)
	const isHeadingOnlyRequest = resolvedColor && 
		/\b(heading|headers?|title)\b/i.test(promptText) &&
		!/\b(palette|theme|site|everything|all colors?)\b/i.test(promptText);
	
	// For heading-only requests, use original palette from source card
	const paletteForNewCard = isHeadingOnlyRequest 
		? (fallbackPalette || adjustedPalette)
		: adjustedPalette;
	
	const { key: newKey, card: newCard } = createCustomStyleCard(
		activeSC.value,
		timestamp,
		paletteForNewCard,
		vibeName
	);
	Object.keys(nextStyleCards).forEach(key => {
		nextStyleCards[key].status = '';
	});
	if (vibe) {
		nextStyleCards[newKey] = applyTypographyToStyleCard(
			newCard,
			vibe,
			promptText
		);
	} else {
		nextStyleCards[newKey] = newCard;
	}
	
	// Smart Element Coloring for heading-only requests
	if (isHeadingOnlyRequest) {
		applyHeadingColor(nextStyleCards[newKey], resolvedColor, true);
	} else if (
		resolvedColor &&
		(promptTextLower.includes('heading') || promptTextLower.includes('title'))
	) {
		// Fallback for combined requests
		applyHeadingColor(nextStyleCards[newKey], resolvedColor, true);
	}
	nextStyleCards[newKey].pendingChanges = true;
	nextStyleCards[newKey].selected = true;
	if (shouldOpenEditor) {
		openStyleCardsEditor();
	}
	return {
		styleCards: nextStyleCards,
		updatedKey: newKey,
		createdNew: true,
	};
};

export default applyThemeToStyleCards;
