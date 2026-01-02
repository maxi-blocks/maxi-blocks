/**
 * External dependencies
 */
import { cloneDeep, merge } from 'lodash';

/**
 * Internal dependencies
 */
import standardSC from '@maxi-core/defaults/defaultSC.json';
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
			primary: '#db2777',
			hover: '#9d174d',
			soft: '#fdf2f8',
			shadow: '#e5d5da',
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
			primary: '#0284c7',
			hover: '#0369a1',
			soft: '#f8fafc',
			shadow: '#cbd5e1',
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
			primary: '#7c3aed',
			hover: '#6d28d9',
			soft: '#f5f3ff',
			shadow: '#ddd6fe',
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
			primary: '#ea580c',
			hover: '#c2410c',
			soft: '#fef2f2',
			shadow: '#eac6bc',
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
			primary: '#a27b5c',
			hover: '#846144',
			soft: '#fafaf9',
			shadow: '#e7e5e4',
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
			primary: '#22d3ee',
			hover: '#0891b2',
			soft: '#1e293b',
			shadow: '#000000',
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

export const openStyleCardsEditor = () => {
	if (typeof document === 'undefined') return;
	const button = document.getElementById('maxi-button__style-cards');
	if (button) {
		button.click();
	}
};

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

	const condensedPrompt = normalizedPrompt.replace(/[\s-]+/g, '');
	const colorName = Object.keys(CSS_COLOR_KEYWORDS)
		.sort((a, b) => b.length - a.length)
		.find(keyword =>
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
		const [r, g, b] = hexToRgbString(hex)
			.split(',')
			.map(value => Number(value));
		const { h, s, l } = rgbToHsl(r, g, b);
		const adjusted = hslToRgb(h, s, clamp(l + delta, 5, 95));
		return rgbToHex(adjusted);
	};

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

	const primary = baseHex;
	const hover = rgbToHex(
		hslToRgb(h, clamp(s + 5, 15, 100), clamp(l - 12, 20, 60))
	);
	const soft = rgbToHex(
		hslToRgb(h, clamp(s * 0.35, 8, 25), clamp(l + 45, 90, 98))
	);
	const shadow = rgbToHex(
		hslToRgb(h, clamp(s * 0.45, 10, 40), clamp(l - 45, 10, 30))
	);

	return {
		primary,
		hover,
		soft,
		shadow,
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
	lightColors[2] = hexToRgbString(palette.soft);
	lightColors[4] = hexToRgbString(palette.primary);
	lightColors[6] = hexToRgbString(palette.hover);
	lightColors[8] = hexToRgbString(palette.shadow);
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
			nextSC.light.styleCard[level]['color'] = '#444444';
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

	const vibeKey = getVibeFromPrompt(prompt);
	const vibe = vibeKey ? VIBE_DICTIONARY[vibeKey] : null;
	const resolvedTheme =
		normalizeThemeValue(theme) || getThemeFromPrompt(prompt);
	const resolvedColor =
		normalizeThemeValue(color) ||
		parseColorFromPrompt(prompt) ||
		(resolvedTheme && CSS_COLOR_KEYWORDS[resolvedTheme]);
	const defaultPalette =
		(vibe?.palette || (resolvedTheme && THEME_PALETTES[resolvedTheme])) ||
		(resolvedColor ? generatePaletteFromBase(resolvedColor) : null);
	const fallbackPalette = getPaletteFromStyleCard(activeSC.value);
	const palette =
		defaultPalette ||
		((shouldLighten(prompt) || shouldDarken(prompt)) &&
		fallbackPalette
			? fallbackPalette
			: null);
	if (!palette) return null;

	const adjustedPalette = shouldLighten(prompt)
		? adjustPaletteLightness(palette, 10)
		: shouldDarken(prompt)
			? adjustPaletteLightness(palette, -10)
			: palette;

	const nextStyleCards = cloneDeep(styleCards);
	const isCustom = activeSC.value?.type === 'user';
	const shouldOpenEditor =
		typeof openEditor === 'boolean'
			? openEditor
			: shouldOpenStyleCardEditorFromPrompt(prompt);

	Object.keys(nextStyleCards).forEach(key => {
		delete nextStyleCards[key].selected;
	});

	if (isCustom) {
		nextStyleCards[activeSC.key] = applyPaletteToLight(
			nextStyleCards[activeSC.key],
			adjustedPalette
		);
		if (vibe) {
			nextStyleCards[activeSC.key] = applyTypographyToStyleCard(
				nextStyleCards[activeSC.key],
				vibe,
				prompt
			);
		}
		
		// [NEW] Smart Element Coloring
		if (resolvedColor && (prompt.includes('heading') || prompt.includes('title'))) {
			const headingLevels = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
			headingLevels.forEach(level => {
				if (!nextStyleCards[activeSC.key].light.styleCard[level]) {
					nextStyleCards[activeSC.key].light.styleCard[level] = {};
				}
				nextStyleCards[activeSC.key].light.styleCard[level]['color'] = resolvedColor;
				nextStyleCards[activeSC.key].light.styleCard[level]['palette-status'] = false;
				nextStyleCards[activeSC.key].light.styleCard[level]['color-global'] = false;
			});
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
	const { key: newKey, card: newCard } = createCustomStyleCard(
		activeSC.value,
		timestamp,
		adjustedPalette,
		vibeName
	);
	Object.keys(nextStyleCards).forEach(key => {
		nextStyleCards[key].status = '';
	});
	if (vibe) {
		nextStyleCards[newKey] = applyTypographyToStyleCard(
			newCard,
			vibe,
			prompt
		);
	} else {
		nextStyleCards[newKey] = newCard;
	}
	
	// [NEW] Smart Element Coloring
	if (resolvedColor && (prompt.includes('heading') || prompt.includes('title'))) {
		console.log('[ThemeEngine] Applying heading color:', resolvedColor);
		const headingLevels = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
		headingLevels.forEach(level => {
			if (!nextStyleCards[newKey].light.styleCard[level]) {
				nextStyleCards[newKey].light.styleCard[level] = {};
			}
			nextStyleCards[newKey].light.styleCard[level]['color'] = resolvedColor;
			nextStyleCards[newKey].light.styleCard[level]['color-general'] = resolvedColor;
			nextStyleCards[newKey].light.styleCard[level]['palette-status'] = false;
			nextStyleCards[newKey].light.styleCard[level]['color-global'] = false;
		});
	} else {
		console.log('[ThemeEngine] No heading color match. Resolved:', resolvedColor, 'Prompt:', prompt);
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
