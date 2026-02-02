import {
	buildContainerPGroupAction,
	buildContainerPGroupAttributeChanges,
} from './containerGroups';
import {
	RESPONSIVE_BREAKPOINTS,
	extractBreakpointToken,
	normalizeValueWithBreakpoint,
} from './layoutAGroup';
import { parsePaletteColor } from './shared/attributeParsers';
import {
	buildTextStyleGroupAction,
	buildTextStyleGroupAttributeChanges,
	getTextStyleGroupSidebarTarget,
} from './shared/textStyleGroup';

const textPGroup = (() => {
const clampOpacity = value => Math.min(1, Math.max(0, value));

const extractPaletteColor = message => {
	const lower = String(message || '').toLowerCase();
	if (!lower.includes('palette')) return null;
	if (
		/(opacity|alpha|transparen)/.test(lower) &&
		!/(palette\s*color|color\s*palette)/.test(lower)
	) {
		return null;
	}
	const match = message.match(
		/\b(?:palette\s*color|color\s*palette|palette)\b[^\d]*(\d{1,2})\b/i
	);
	if (!match) return null;
	const num = Number.parseInt(match[1], 10);
	return Number.isFinite(num) ? num : null;
};

const extractPaletteOpacity = message => {
	const lower = String(message || '').toLowerCase();
	if (!lower.includes('palette')) return null;
	if (!/(opacity|alpha|transparen)/.test(lower)) return null;

	const percentMatch = message.match(/(\d+(?:\.\d+)?)\s*%/);
	if (percentMatch) {
		const percent = Number.parseFloat(percentMatch[1]);
		if (!Number.isFinite(percent)) return null;
		return clampOpacity(percent / 100);
	}

	const rawMatch = message.match(
		/\b(?:opacity|alpha|transparen(?:cy|t))\b[^0-9]*(-?\d+(?:\.\d+)?)/i
	);
	if (rawMatch) {
		const raw = Number.parseFloat(rawMatch[1]);
		if (!Number.isFinite(raw)) return null;
		return clampOpacity(raw > 1 ? raw / 100 : raw);
	}

	return null;
};

const extractPaletteStatus = message => {
	const lower = String(message || '').toLowerCase();
	if (!lower.includes('palette')) return null;
	if (/\bpalette\b[^\d]*(\d{1,2})\b/.test(lower)) return null;

	if (/(disable|off|stop|remove|no).*palette/.test(lower)) return false;
	if (/(enable|use|turn\s*on|activate).*palette/.test(lower)) return true;
	if (/use\s+custom\s+color/.test(lower)) return false;

	return null;
};

const extractPaletteScStatus = message => {
	const lower = String(message || '').toLowerCase();
	if (!/(style\s*card|stylecard|style-card)/.test(lower)) return null;
	if (!/palette|color/.test(lower)) return null;
	if (/\bpalette\b[^\d]*(\d{1,2})\b/.test(lower)) return null;

	if (/(disable|off|stop|remove|no)\b/.test(lower)) return false;
	if (/(enable|use|turn\s*on|activate|sync|link)\b/.test(lower)) return true;

	return null;
};

const extractPreviewStatus = message => {
	const lower = String(message || '').toLowerCase();
	if (!lower.includes('preview')) return null;
	if (/(disable|off|hide|remove|false)/.test(lower)) return false;
	if (/(enable|on|show|true)/.test(lower)) return true;
	return null;
};

const buildTextPGroupAction = (message, { scope = 'selection' } = {}) => {
	const actionType = scope === 'page' ? 'update_page' : 'update_selection';
	const actionTarget = actionType === 'update_page' ? { target_block: 'text' } : {};
	const lower = String(message || '').toLowerCase();
	const isHover = /\bhover\b/.test(lower);
	const breakpoint = extractBreakpointToken(message);

	const paletteOpacity = extractPaletteOpacity(message);
	if (Number.isFinite(paletteOpacity)) {
		return {
			action: actionType,
			property: isHover ? 'palette_opacity_hover' : 'palette_opacity',
			value: breakpoint ? { value: paletteOpacity, breakpoint } : paletteOpacity,
			message: 'Text palette opacity updated.',
			...actionTarget,
		};
	}

	const paletteScStatus = extractPaletteScStatus(message);
	if (typeof paletteScStatus === 'boolean') {
		return {
			action: actionType,
			property: isHover ? 'palette_sc_status_hover' : 'palette_sc_status',
			value: breakpoint ? { value: paletteScStatus, breakpoint } : paletteScStatus,
			message: 'Text palette style card status updated.',
			...actionTarget,
		};
	}

	const paletteColor = extractPaletteColor(message);
	if (Number.isFinite(paletteColor)) {
		return {
			action: actionType,
			property: isHover ? 'palette_color_hover' : 'palette_color',
			value: breakpoint ? { value: paletteColor, breakpoint } : paletteColor,
			message: 'Text palette color updated.',
			...actionTarget,
		};
	}

	const paletteStatus = extractPaletteStatus(message);
	if (typeof paletteStatus === 'boolean') {
		return {
			action: actionType,
			property: isHover ? 'palette_status_hover' : 'palette_status',
			value: breakpoint ? { value: paletteStatus, breakpoint } : paletteStatus,
			message: 'Text palette status updated.',
			...actionTarget,
		};
	}

	const previewStatus = extractPreviewStatus(message);
	if (typeof previewStatus === 'boolean') {
		return {
			action: actionType,
			property: 'preview',
			value: previewStatus,
			message: previewStatus ? 'Text preview enabled.' : 'Text preview disabled.',
			...actionTarget,
		};
	}

	const containerAction = buildContainerPGroupAction(message, { scope });
	if (containerAction) {
		if (actionType === 'update_page') {
			containerAction.target_block = 'text';
		}
		return containerAction;
	}

	return null;
};

const normalizePaletteValue = rawValue => {
	if (
		rawValue &&
		typeof rawValue === 'object' &&
		!Array.isArray(rawValue)
	) {
		if (rawValue.palette !== undefined) return rawValue.palette;
		if (rawValue.color !== undefined) return rawValue.color;
		if (rawValue.value !== undefined) return rawValue.value;
	}
	return rawValue;
};

const normalizeOpacityValue = rawValue => {
	const raw = normalizePaletteValue(rawValue);
	if (raw === null || raw === undefined) return null;
	if (typeof raw === 'string') {
		const percentMatch = raw.match(/(\d+(?:\.\d+)?)\s*%/);
		if (percentMatch) {
			const percent = Number.parseFloat(percentMatch[1]);
			return Number.isFinite(percent) ? clampOpacity(percent / 100) : null;
		}
	}
	const num = Number(raw);
	if (!Number.isFinite(num)) return null;
	return clampOpacity(num > 1 ? num / 100 : num);
};

const buildPaletteChanges = (key, value, { isHover = false, transform } = {}) => {
	const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
	const transformed = transform ? transform(rawValue) : rawValue;
	if (transformed === null || transformed === undefined) return null;

	const breakpoints = breakpoint ? [breakpoint] : RESPONSIVE_BREAKPOINTS;
	const changes = {};

	breakpoints.forEach(bp => {
		const suffix = `-${bp}${isHover ? '-hover' : ''}`;
		changes[`${key}${suffix}`] = transformed;
	});

	if (isHover) {
		changes['typography-status-hover'] = true;
	}

	return changes;
};

const buildPaletteStatusChanges = (value, { isHover = false } = {}) =>
	buildPaletteChanges('palette-status', value, {
		isHover,
		transform: raw => (raw === null || raw === undefined ? null : Boolean(raw)),
	});

const buildPaletteScStatusChanges = (value, { isHover = false } = {}) =>
	buildPaletteChanges('palette-sc-status', value, {
		isHover,
		transform: raw => (raw === null || raw === undefined ? null : Boolean(raw)),
	});

const buildPaletteOpacityChanges = (value, { isHover = false } = {}) =>
	buildPaletteChanges('palette-opacity', value, {
		isHover,
		transform: raw => normalizeOpacityValue(raw),
	});

const buildPaletteColorChanges = (value, { isHover = false } = {}) => {
	const changes = buildPaletteChanges('palette-color', value, {
		isHover,
		transform: raw => {
			const numeric = Number(normalizePaletteValue(raw));
			return Number.isFinite(numeric) ? numeric : null;
		},
	});

	if (!changes) return null;

	const { breakpoint } = normalizeValueWithBreakpoint(value);
	const breakpoints = breakpoint ? [breakpoint] : RESPONSIVE_BREAKPOINTS;
	breakpoints.forEach(bp => {
		const suffix = `-${bp}${isHover ? '-hover' : ''}`;
		changes[`palette-status${suffix}`] = true;
	});

	return changes;
};

const buildTextPGroupAttributeChanges = (property, value) => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');

	switch (normalized) {
		case 'padding':
		case 'padding_top':
		case 'padding_bottom':
		case 'padding_left':
		case 'padding_right':
		case 'position':
		case 'position_top':
		case 'position_right':
		case 'position_bottom':
		case 'position_left':
			return buildContainerPGroupAttributeChanges(property, value);
		case 'palette_color':
			return buildPaletteColorChanges(value, { isHover: false });
		case 'palette_color_hover':
			return buildPaletteColorChanges(value, { isHover: true });
		case 'palette_status':
			return buildPaletteStatusChanges(value, { isHover: false });
		case 'palette_status_hover':
			return buildPaletteStatusChanges(value, { isHover: true });
		case 'palette_opacity':
			return buildPaletteOpacityChanges(value, { isHover: false });
		case 'palette_opacity_hover':
			return buildPaletteOpacityChanges(value, { isHover: true });
		case 'palette_sc_status':
			return buildPaletteScStatusChanges(value, { isHover: false });
		case 'palette_sc_status_hover':
			return buildPaletteScStatusChanges(value, { isHover: true });
		case 'preview':
			return { preview: Boolean(value) };
		default:
			return null;
	}
};

const getTextPGroupSidebarTarget = property => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');

	if (
		[
			'padding',
			'padding_top',
			'padding_bottom',
			'padding_left',
			'padding_right',
		].includes(normalized)
	) {
		return { tabIndex: 0, accordion: 'margin / padding' };
	}

	if (
		[
			'position',
			'position_top',
			'position_right',
			'position_bottom',
			'position_left',
		].includes(normalized)
	) {
		return { tabIndex: 1, accordion: 'position' };
	}

	if (
		[
			'palette_color',
			'palette_color_hover',
			'palette_status',
			'palette_status_hover',
			'palette_opacity',
			'palette_opacity_hover',
			'palette_sc_status',
			'palette_sc_status_hover',
		].includes(normalized)
	) {
		return { tabIndex: 0, accordion: 'typography' };
	}

	if (normalized === 'preview') {
		return { tabIndex: 0, accordion: 'block settings' };
	}

	return null;
};

return {
	buildTextPGroupAction,
	buildTextPGroupAttributeChanges,
	getTextPGroupSidebarTarget,
};
})();

export const {
	buildTextPGroupAction,
	buildTextPGroupAttributeChanges,
	getTextPGroupSidebarTarget,
} = textPGroup;

// textCGroup
const textCGroup = (() => {
const extractCssVar = message => {
	const match = String(message || '').match(/var\(--[a-z0-9-_]+\)/i);
	return match ? match[0] : null;
};

const extractHexColor = message => {
	const match = String(message || '').match(
		/#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})(?![0-9a-fA-F])/i
	);
	return match ? match[0] : null;
};

const extractTypographyHoverStatus = message => {
	const lower = String(message || '').toLowerCase();
	if (!/\bhover\b/.test(lower)) return null;
	if (!/(text|typography|font)/.test(lower)) return null;
	if (/(disable|off|remove|no)\b/.test(lower)) return false;
	if (/(enable|on|show|use|activate)\b/.test(lower)) return true;
	return null;
};

const extractTextColorIntent = message => {
	const lower = String(message || '').toLowerCase();
	if (/(text\s*shadow|shadow\s*text)/.test(lower)) return null;
	if (/(background|bg|highlight)/.test(lower)) return null;
	if (!/(text|font|colou?r)/.test(lower)) return null;

	const isHover = /\bhover\b/.test(lower);
	const palette = parsePaletteColor(message);
	const cssVar = extractCssVar(message);
	const hex = extractHexColor(message);
	const value = palette ?? cssVar ?? hex;
	if (value === null || value === undefined) return null;
	return { isHover, value };
};

const extractCustomFormats = message => {
	const lower = String(message || '').toLowerCase();
	if (!/custom\s*formats?/.test(lower)) return null;
	const start = message.indexOf('{');
	const end = message.lastIndexOf('}');
	if (start === -1 || end <= start) return null;
	const jsonSlice = message.slice(start, end + 1);
	try {
		return JSON.parse(jsonSlice);
	} catch (error) {
		return null;
	}
};

const extractFontSizeValue = message => {
	const lower = String(message || '').toLowerCase();
	if (!/(font|text)\s*size|type\s*size/.test(lower)) return null;

	const numericMatch = message.match(
		/(?:font|text)\s*size[^0-9]*(-?\d+(?:\.\d+)?)(px|%|em|rem|vh|vw|ch)?/i
	);
	if (numericMatch) {
		const value = Number.parseFloat(numericMatch[1]);
		if (!Number.isFinite(value)) return null;
		return { value, unit: numericMatch[2] || 'px' };
	}

	if (/\bsubtitle\b/.test(lower)) return { value: 1.25, unit: 'rem' };
	if (/\bdisplay\b/.test(lower)) return { value: 4, unit: 'rem' };
	if (/\btitle\b/.test(lower)) return { value: 2.5, unit: 'rem' };

	return null;
};

const extractFontWeightValue = message => {
	const lower = String(message || '').toLowerCase();
	const hasWeightKeyword =
		/(weight|bold|light|medium|regular|heavy|black|thin|semi|extra)/.test(lower);
	if (!hasWeightKeyword) return null;

	const numericMatch = lower.match(/\b(?:font\s*weight|weight)\b[^0-9]*([1-9]00)\b/);
	if (numericMatch) {
		const value = Number.parseInt(numericMatch[1], 10);
		if (Number.isFinite(value)) return value;
	}

	const weightMap = [
		[/\bthin\b/, 100],
		[/\bextra\s*light\b|\bextralight\b/, 200],
		[/\blight\b/, 300],
		[/\bregular\b|\bnormal\b/, 400],
		[/\bmedium\b/, 600],
		[/\bsemi\s*bold\b|\bsemibold\b/, 600],
		[/\bbold\b|\bbolder\b/, 700],
		[/\bextra\s*bold\b|\bextrabold\b|\bheavy\b/, 800],
		[/\bblack\b/, 900],
	];

	for (const [pattern, value] of weightMap) {
		if (pattern.test(lower)) return value;
	}

	return null;
};

const extractFontStyleValue = message => {
	const lower = String(message || '').toLowerCase();
	const hasStyleKeyword = /(italic|oblique|upright|regular|normal|roman)/.test(lower);
	const hasStyleContext = /(font|text)\s*style/.test(lower);
	if (!hasStyleKeyword && !hasStyleContext) return null;

	if (/\bitalic\b/.test(lower)) return 'italic';
	if (/\boblique\b/.test(lower)) return 'oblique';
	if (/\b(normal|regular|upright|roman|reset)\b/.test(lower)) return 'normal';
	return null;
};

const extractFontFamilyValue = message => {
	const lower = String(message || '').toLowerCase();
	if (/font\s*size|text\s*size|type\s*size/.test(lower)) return null;

	const quoted = message.match(/["']([^"']+)["']/);
	if (quoted && quoted[1]) return quoted[1].trim();

	if (/\bsans[-\s]?serif\b/.test(lower)) return 'sans-serif';
	if (/\bserif\b/.test(lower)) return 'serif';
	if (/\bmono(?:space)?\b/.test(lower)) return 'monospace';
	if (/\bsystem\s*ui\b|\bsystem\b/.test(lower)) return 'system-ui';
	if (/\b(inherit|default|reset)\b/.test(lower)) return 'inherit';

	if (!/(font\s*family|typeface|font)\b/.test(lower)) return null;

	const familyMatch = message.match(
		/\b(?:font\s*family|typeface|font)\b\s*(?:to|is|=)?\s*([a-z0-9][a-z0-9\s-]{1,40})/i
	);
	if (familyMatch && familyMatch[1]) {
		const stopWords = new Set([
			'for',
			'on',
			'in',
			'with',
			'and',
			'text',
			'heading',
			'title',
			'paragraph',
			'body',
			'copy',
			'label',
			'block',
		]);
		const tokens = familyMatch[1].trim().split(/\s+/);
		const cleanedTokens = [];
		for (const token of tokens) {
			const lowerToken = token.toLowerCase();
			if (stopWords.has(lowerToken)) break;
			if (/(bold|italic|normal|regular|weight|size)/.test(lowerToken)) break;
			cleanedTokens.push(token);
		}
		const cleaned = cleanedTokens.join(' ').trim();
		if (cleaned) return cleaned;
	}

	return null;
};

const normalizeColorValue = rawValue => {
	if (
		rawValue &&
		typeof rawValue === 'object' &&
		!Array.isArray(rawValue)
	) {
		if (rawValue.palette !== undefined) {
			return { isPalette: true, value: rawValue.palette };
		}
		if (rawValue.color !== undefined) {
			return { isPalette: false, value: rawValue.color };
		}
		if (rawValue.value !== undefined) {
			const isPalette = typeof rawValue.value === 'number';
			return { isPalette, value: rawValue.value };
		}
	}
	const isPalette = typeof rawValue === 'number';
	return { isPalette, value: rawValue };
};

const buildTextColorChanges = (value, { isHover = false } = {}) => {
	const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
	if (rawValue === null || rawValue === undefined) return null;

	const { isPalette, value: colorValue } = normalizeColorValue(rawValue);
	const breakpoints = breakpoint ? [breakpoint] : RESPONSIVE_BREAKPOINTS;
	const suffix = isHover ? '-hover' : '';
	const changes = {};

	breakpoints.forEach(bp => {
		changes[`palette-status-${bp}${suffix}`] = isPalette;
		changes[`palette-color-${bp}${suffix}`] = isPalette ? colorValue : '';
		changes[`color-${bp}${suffix}`] = isPalette ? '' : colorValue;
	});

	if (isHover) {
		changes['typography-status-hover'] = true;
	}

	return changes;
};

const buildCustomFormatsChanges = (value, { isHover = false } = {}) => {
	if (!value || typeof value !== 'object') return null;
	return {
		[isHover ? 'custom-formats-hover' : 'custom-formats']: value,
	};
};

const buildTextCGroupAction = (message, { scope = 'selection' } = {}) => {
	const actionType = scope === 'page' ? 'update_page' : 'update_selection';
	const actionTarget = actionType === 'update_page' ? { target_block: 'text' } : {};
	const lower = String(message || '').toLowerCase();
	const isHover = /\bhover\b/.test(lower);
	const breakpoint = extractBreakpointToken(message);

	const typographyHoverStatus = extractTypographyHoverStatus(message);
	if (typeof typographyHoverStatus === 'boolean') {
		return {
			action: actionType,
			property: 'typography_status_hover',
			value: typographyHoverStatus,
			message: typographyHoverStatus
				? 'Text hover styles enabled.'
				: 'Text hover styles disabled.',
			...actionTarget,
		};
	}

	const fontSize = extractFontSizeValue(message);
	if (fontSize) {
		const value = breakpoint ? { ...fontSize, breakpoint } : fontSize;
		return {
			action: actionType,
			property: isHover ? 'text_font_size_hover' : 'text_font_size',
			value,
			message: isHover ? 'Text hover font size updated.' : 'Text font size updated.',
			...actionTarget,
		};
	}

	const fontWeight = extractFontWeightValue(message);
	if (fontWeight !== null && fontWeight !== undefined) {
		const value = breakpoint ? { value: fontWeight, breakpoint } : fontWeight;
		return {
			action: actionType,
			property: isHover ? 'text_weight_hover' : 'text_weight',
			value,
			message: isHover ? 'Text hover font weight updated.' : 'Text font weight updated.',
			...actionTarget,
		};
	}

	const fontStyle = extractFontStyleValue(message);
	if (fontStyle) {
		const value = breakpoint ? { value: fontStyle, breakpoint } : fontStyle;
		return {
			action: actionType,
			property: isHover ? 'text_font_style_hover' : 'text_font_style',
			value,
			message: isHover ? 'Text hover font style updated.' : 'Text font style updated.',
			...actionTarget,
		};
	}

	const fontFamily = extractFontFamilyValue(message);
	if (fontFamily) {
		const value = breakpoint ? { value: fontFamily, breakpoint } : fontFamily;
		return {
			action: actionType,
			property: isHover ? 'text_font_family_hover' : 'text_font_family',
			value,
			message: isHover ? 'Text hover font family updated.' : 'Text font family updated.',
			...actionTarget,
		};
	}

	const customFormats = extractCustomFormats(message);
	if (customFormats) {
		return {
			action: actionType,
			property: /\bhover\b/.test(lower)
				? 'custom_formats_hover'
				: 'custom_formats',
			value: customFormats,
			message: 'Custom formats updated.',
			...actionTarget,
		};
	}

	const colorIntent = extractTextColorIntent(message);
	if (colorIntent) {
		const property = colorIntent.isHover ? 'text_color_hover' : 'text_color';
		const value = breakpoint
			? { value: colorIntent.value, breakpoint }
			: colorIntent.value;
		return {
			action: actionType,
			property,
			value,
			message: colorIntent.isHover
				? 'Text hover color updated.'
				: 'Text color updated.',
			...actionTarget,
		};
	}

	const sharedStyleAction = buildTextStyleGroupAction(message, {
		scope,
		targetBlock: 'text',
	});
	if (sharedStyleAction) {
		return sharedStyleAction;
	}

	return null;
};

const buildTextCGroupAttributeChanges = (property, value) => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');

	switch (normalized) {
		case 'text_color':
			return buildTextColorChanges(value, { isHover: false });
		case 'text_color_hover':
			return buildTextColorChanges(value, { isHover: true });
		case 'custom_formats':
			return buildCustomFormatsChanges(value, { isHover: false });
		case 'custom_formats_hover':
			return buildCustomFormatsChanges(value, { isHover: true });
		case 'typography_status_hover':
			return { 'typography-status-hover': Boolean(value) };
		default:
			return buildTextStyleGroupAttributeChanges(property, value);
	}
};

const getTextCGroupSidebarTarget = property => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');

	if (
		[
			'text_font_family',
			'text_font_family_hover',
			'text_font_size',
			'text_font_size_hover',
			'text_font_style',
			'text_font_style_hover',
			'text_weight',
			'text_weight_hover',
			'text_color',
			'text_color_hover',
			'custom_formats',
			'custom_formats_hover',
			'typography_status_hover',
		].includes(normalized)
	) {
		return { tabIndex: 0, accordion: 'typography' };
	}

	return getTextStyleGroupSidebarTarget(property);
};

return {
	buildTextCGroupAction,
	buildTextCGroupAttributeChanges,
	getTextCGroupSidebarTarget,
};
})();

export const {
	buildTextCGroupAction,
	buildTextCGroupAttributeChanges,
	getTextCGroupSidebarTarget,
} = textCGroup;

// textListGroup (list styles)
const textListGroup = (() => {
const clampOpacity = value => Math.min(1, Math.max(0, value));
const LIST_CONTEXT_REGEX =
	/\b(list|lists|bullet|bullets|bullet\s*points?|marker|markers|numbered|numbering|checkmarks?)\b/i;

const extractCssVar = message => {
	const match = String(message || '').match(/var\(--[a-z0-9-_]+\)/i);
	return match ? match[0] : null;
};

const extractHexColor = message => {
	const match = String(message || '').match(
		/#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})(?![0-9a-fA-F])/i
	);
	return match ? match[0] : null;
};

const normalizeValueWithUnit = rawValue => {
	if (
		rawValue &&
		typeof rawValue === 'object' &&
		!Array.isArray(rawValue) &&
		Object.prototype.hasOwnProperty.call(rawValue, 'value')
	) {
		return {
			value: rawValue.value,
			unit: rawValue.unit || null,
			breakpoint: rawValue.breakpoint || null,
		};
	}
	return { value: rawValue, unit: null, breakpoint: null };
};

const normalizeRawValue = rawValue => {
	if (
		rawValue &&
		typeof rawValue === 'object' &&
		!Array.isArray(rawValue) &&
		Object.prototype.hasOwnProperty.call(rawValue, 'value')
	) {
		return rawValue.value;
	}
	return rawValue;
};

const parseUnitValue = (rawValue, fallbackUnit = 'px') => {
	if (rawValue === null || rawValue === undefined) {
		return { value: 0, unit: fallbackUnit };
	}

	if (typeof rawValue === 'object' && !Array.isArray(rawValue)) {
		const size = rawValue.value ?? rawValue.size ?? rawValue.width ?? rawValue.height;
		const unit = rawValue.unit || fallbackUnit;
		return { value: Number(size) || 0, unit };
	}

	if (typeof rawValue === 'number') {
		return { value: rawValue, unit: fallbackUnit };
	}

	const raw = String(rawValue).trim();
	const match = raw.match(/^(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?$/i);
	if (match) {
		return { value: Number(match[1]), unit: match[2] || fallbackUnit };
	}

	const parsed = Number.parseFloat(raw);
	return { value: Number.isNaN(parsed) ? 0 : parsed, unit: fallbackUnit };
};

const extractUnitValue = (message, patterns, fallbackUnit) => {
	const lower = String(message || '').toLowerCase();
	const matchesPattern = patterns.some(pattern => pattern.test(lower));
	if (!matchesPattern) return null;

	const match = String(message || '').match(
		/(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?/i
	);
	if (!match) return null;

	return {
		value: Number.parseFloat(match[1]),
		unit: match[2] || fallbackUnit,
	};
};

const normalizePaletteValue = rawValue => {
	if (
		rawValue &&
		typeof rawValue === 'object' &&
		!Array.isArray(rawValue)
	) {
		if (rawValue.palette !== undefined) return rawValue.palette;
		if (rawValue.color !== undefined) return rawValue.color;
		if (rawValue.value !== undefined) return rawValue.value;
	}
	return rawValue;
};

const normalizeOpacityValue = rawValue => {
	const raw = normalizePaletteValue(rawValue);
	if (raw === null || raw === undefined) return null;
	if (typeof raw === 'string') {
		const percentMatch = raw.match(/(\d+(?:\.\d+)?)\s*%/);
		if (percentMatch) {
			const percent = Number.parseFloat(percentMatch[1]);
			return Number.isFinite(percent) ? clampOpacity(percent / 100) : null;
		}
	}
	const num = Number(raw);
	if (!Number.isFinite(num)) return null;
	return clampOpacity(num > 1 ? num / 100 : num);
};

const buildActionValue = (value, unit, breakpoint) => {
	const payload = { value, unit };
	if (breakpoint) payload.breakpoint = breakpoint;
	return payload;
};

const buildListUnitChanges = (key, value, fallbackUnit) => {
	const { value: rawValue, unit, breakpoint } = normalizeValueWithUnit(value);
	const parsed = parseUnitValue(unit ? { value: rawValue, unit } : rawValue, fallbackUnit);
	const breakpoints = breakpoint ? [breakpoint] : RESPONSIVE_BREAKPOINTS;
	const changes = {};

	breakpoints.forEach(bp => {
		changes[`${key}-${bp}`] = parsed.value;
		changes[`${key}-unit-${bp}`] = parsed.unit;
	});

	return changes;
};

const buildListValueChanges = (key, value) => {
	const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
	if (rawValue === null || rawValue === undefined) return null;
	const breakpoints = breakpoint ? [breakpoint] : RESPONSIVE_BREAKPOINTS;
	const changes = {};

	breakpoints.forEach(bp => {
		changes[`${key}-${bp}`] = rawValue;
	});

	return changes;
};

const buildListPaletteColorChanges = value => {
	const numeric = Number(normalizePaletteValue(value));
	if (!Number.isFinite(numeric)) return null;
	return {
		'list-palette-status': true,
		'list-palette-color': numeric,
		'list-color': '',
	};
};

const buildListPaletteOpacityChanges = value => {
	const opacity = normalizeOpacityValue(value);
	if (opacity === null || opacity === undefined) return null;
	return { 'list-palette-opacity': opacity };
};

const buildListPaletteStatusChanges = value => {
	if (value === null || value === undefined) return null;
	return { 'list-palette-status': Boolean(value) };
};

const buildListPaletteScStatusChanges = value => {
	if (value === null || value === undefined) return null;
	return { 'list-palette-sc-status': Boolean(value) };
};

const buildListColorChanges = value => {
	const normalized = normalizePaletteValue(value);
	if (normalized === null || normalized === undefined) return null;
	const numeric = Number(normalized);
	if (Number.isFinite(numeric) && typeof normalized !== 'string') {
		return buildListPaletteColorChanges(numeric);
	}
	if (Number.isFinite(numeric) && /^\d+$/.test(String(normalized))) {
		return buildListPaletteColorChanges(numeric);
	}
	return {
		'list-palette-status': false,
		'list-palette-color': '',
		'list-color': normalized,
	};
};

const extractListStatus = message => {
	const lower = String(message || '').toLowerCase();
	if (!LIST_CONTEXT_REGEX.test(lower)) return null;
	if (/(palette|colou?r|marker|indent|spacing|position|start|reverse|reversed|style)/.test(lower)) {
		return null;
	}
	if (/(remove|disable|clear|off|no)\b.*\b(list|bullets?|numbered|checkmarks?)\b/.test(lower)) {
		return false;
	}
	if (/(enable|use|turn\s*on|activate|make)\b.*\b(list|bullets?|numbered|checkmarks?)\b/.test(lower)) {
		return true;
	}
	return null;
};

const extractListType = message => {
	const lower = String(message || '').toLowerCase();
	if (!LIST_CONTEXT_REGEX.test(lower)) return null;
	if (/\b(ordered|numbered)\b/.test(lower)) return 'ol';
	if (/\b(unordered|bulleted|bullets?)\b/.test(lower)) return 'ul';
	return null;
};

const extractListStylePosition = message => {
	const lower = String(message || '').toLowerCase();
	if (!LIST_CONTEXT_REGEX.test(lower)) return null;
	if (!/style\s*position|bullets?\s*(inside|outside)|markers?\s*(inside|outside)/.test(lower)) return null;
	if (/\binside\b/.test(lower)) return 'inside';
	if (/\boutside\b/.test(lower)) return 'outside';
	return null;
};

const extractListTextPosition = message => {
	const lower = String(message || '').toLowerCase();
	if (!LIST_CONTEXT_REGEX.test(lower)) return null;
	if (!/text\s*position/.test(lower)) return null;

	const positions = [
		'baseline',
		'sub',
		'super',
		'text-top',
		'top',
		'middle',
		'text-bottom',
		'bottom',
	];
	for (const pos of positions) {
		if (lower.includes(pos)) return pos;
	}
	return null;
};

const extractListStyle = message => {
	const lower = String(message || '').toLowerCase();
	if (!LIST_CONTEXT_REGEX.test(lower)) return null;
	if (!/list\s*style|style\b/.test(lower)) return null;

	const styleMap = {
		disc: 'disc',
		circle: 'circle',
		square: 'square',
		decimal: 'decimal',
		'lower alpha': 'lower-alpha',
		'lower-alpha': 'lower-alpha',
		'upper roman': 'upper-roman',
		'upper-roman': 'upper-roman',
		none: 'none',
		custom: 'custom',
	};

	const entries = Object.entries(styleMap);
	for (const [label, value] of entries) {
		if (lower.includes(label)) return value;
	}

	return null;
};

const extractListStyleCustom = message => {
	const lower = String(message || '').toLowerCase();
	if (!LIST_CONTEXT_REGEX.test(lower)) return null;
	if (!/custom/.test(lower)) return null;
	if (!/(marker|bullet|list\s*style|list)/.test(lower)) return null;

	const quoted = String(message || '').match(/["'`]{1}([^"'`]+)["'`]{1}/);
	if (quoted && quoted[1]) return quoted[1].trim();

	return null;
};

const extractListStart = message => {
	const lower = String(message || '').toLowerCase();
	if (!LIST_CONTEXT_REGEX.test(lower)) return null;
	const match = String(message || '').match(
		/\b(start(?:\s+from)?|begin(?:\s+at)?)\b[^\d-]*(-?\d+)/i
	);
	if (!match) return null;
	const num = Number.parseInt(match[2], 10);
	return Number.isFinite(num) ? num : null;
};

const extractListReversed = message => {
	const lower = String(message || '').toLowerCase();
	if (!LIST_CONTEXT_REGEX.test(lower)) return null;
	if (/\b(reverse|reversed|descending)\b/.test(lower)) return true;
	if (/\b(normal|ascending)\b.*\border\b/.test(lower)) return false;
	return null;
};

const extractListPaletteOpacity = message => {
	const lower = String(message || '').toLowerCase();
	if (!LIST_CONTEXT_REGEX.test(lower)) return null;
	if (!/palette/.test(lower)) return null;
	if (!/(opacity|alpha|transparen)/.test(lower)) return null;

	const percentMatch = message.match(/(\d+(?:\.\d+)?)\s*%/);
	if (percentMatch) {
		const percent = Number.parseFloat(percentMatch[1]);
		if (!Number.isFinite(percent)) return null;
		return clampOpacity(percent / 100);
	}

	const rawMatch = message.match(
		/\b(?:opacity|alpha|transparen(?:cy|t))\b[^0-9]*(-?\d+(?:\.\d+)?)/i
	);
	if (rawMatch) {
		const raw = Number.parseFloat(rawMatch[1]);
		if (!Number.isFinite(raw)) return null;
		return clampOpacity(raw > 1 ? raw / 100 : raw);
	}

	return null;
};

const extractListPaletteStatus = message => {
	const lower = String(message || '').toLowerCase();
	if (!LIST_CONTEXT_REGEX.test(lower)) return null;
	if (!/palette/.test(lower)) return null;

	if (/(disable|off|remove|no)\b.*palette/.test(lower)) return false;
	if (/(enable|use|turn\s*on|activate)\b.*palette/.test(lower)) return true;
	if (/use\s+custom\s+color/.test(lower)) return false;

	return null;
};

const extractListPaletteScStatus = message => {
	const lower = String(message || '').toLowerCase();
	if (!LIST_CONTEXT_REGEX.test(lower)) return null;
	if (!/(style\s*card|stylecard|style-card)/.test(lower)) return null;
	if (!/palette|color/.test(lower)) return null;

	if (/(disable|off|remove|no)\b/.test(lower)) return false;
	if (/(enable|use|turn\s*on|activate|sync|link)\b/.test(lower)) return true;

	return null;
};

const extractListPaletteColor = message => {
	const lower = String(message || '').toLowerCase();
	if (!LIST_CONTEXT_REGEX.test(lower)) return null;
	if (!/palette/.test(lower)) return null;
	const palette = parsePaletteColor(message);
	return Number.isFinite(palette) ? palette : null;
};

const extractListColorValue = message => {
	const lower = String(message || '').toLowerCase();
	if (!LIST_CONTEXT_REGEX.test(lower)) return null;
	if (!/colou?r/.test(lower)) return null;
	if (/palette/.test(lower)) return null;
	const palette = parsePaletteColor(message);
	const cssVar = extractCssVar(message);
	const hex = extractHexColor(message);
	const value = palette ?? cssVar ?? hex;
	return value === null || value === undefined ? null : value;
};

const buildTextListGroupAction = (message, { scope = 'selection' } = {}) => {
	const lower = String(message || '').toLowerCase();
	if (!LIST_CONTEXT_REGEX.test(lower)) return null;

	const actionType = scope === 'page' ? 'update_page' : 'update_selection';
	const actionTarget = actionType === 'update_page' ? { target_block: 'text' } : {};
	const breakpoint = extractBreakpointToken(message);

	const listStatus = extractListStatus(message);
	if (listStatus === false) {
		return {
			action: actionType,
			property: 'is_list',
			value: listStatus,
			message: listStatus ? 'List enabled.' : 'List disabled.',
			...actionTarget,
		};
	}

	const listType = extractListType(message);
	if (listType) {
		return {
			action: actionType,
			property: 'list_type',
			value: listType,
			message: 'List type updated.',
			...actionTarget,
		};
	}

	const listStyleCustom = extractListStyleCustom(message);
	if (listStyleCustom) {
		return {
			action: actionType,
			property: 'list_style_custom',
			value: listStyleCustom,
			message: 'Custom list marker updated.',
			...actionTarget,
		};
	}

	const listStyle = extractListStyle(message);
	if (listStyle) {
		return {
			action: actionType,
			property: 'list_style',
			value: listStyle,
			message: 'List style updated.',
			...actionTarget,
		};
	}

	const listStart = extractListStart(message);
	if (Number.isFinite(listStart)) {
		return {
			action: actionType,
			property: 'list_start',
			value: listStart,
			message: 'List start updated.',
			...actionTarget,
		};
	}

	const listReversed = extractListReversed(message);
	if (typeof listReversed === 'boolean') {
		return {
			action: actionType,
			property: 'list_reversed',
			value: listReversed,
			message: 'List order updated.',
			...actionTarget,
		};
	}

	const listStylePosition = extractListStylePosition(message);
	if (listStylePosition) {
		return {
			action: actionType,
			property: 'list_style_position',
			value: breakpoint
				? { value: listStylePosition, breakpoint }
				: listStylePosition,
			message: 'List style position updated.',
			...actionTarget,
		};
	}

	const listTextPosition = extractListTextPosition(message);
	if (listTextPosition) {
		return {
			action: actionType,
			property: 'list_text_position',
			value: breakpoint
				? { value: listTextPosition, breakpoint }
				: listTextPosition,
			message: 'List text position updated.',
			...actionTarget,
		};
	}

	const listIndent = extractUnitValue(
		message,
		[/list\s*indent/, /list\s*indentation/, /indent\s*list/],
		'px'
	);
	if (listIndent) {
		return {
			action: actionType,
			property: 'list_indent',
			value: buildActionValue(listIndent.value, listIndent.unit, breakpoint),
			message: 'List indent updated.',
			...actionTarget,
		};
	}

	const listGap = extractUnitValue(
		message,
		[/list\s*gap/, /gap\s*between\s*(markers?|bullets?|numbers?)/],
		'em'
	);
	if (listGap) {
		return {
			action: actionType,
			property: 'list_gap',
			value: buildActionValue(listGap.value, listGap.unit, breakpoint),
			message: 'List gap updated.',
			...actionTarget,
		};
	}

	const markerIndent = extractUnitValue(
		message,
		[/marker\s*indent/, /bullet\s*indent/, /marker\s*spacing/],
		'em'
	);
	if (markerIndent) {
		return {
			action: actionType,
			property: 'list_marker_indent',
			value: buildActionValue(
				markerIndent.value,
				markerIndent.unit,
				breakpoint
			),
			message: 'List marker indent updated.',
			...actionTarget,
		};
	}

	const markerSize = extractUnitValue(
		message,
		[/marker\s*size/, /bullet\s*size/, /marker\s*width/],
		'em'
	);
	if (markerSize) {
		return {
			action: actionType,
			property: 'list_marker_size',
			value: buildActionValue(markerSize.value, markerSize.unit, breakpoint),
			message: 'List marker size updated.',
			...actionTarget,
		};
	}

	const markerHeight = extractUnitValue(
		message,
		[/marker\s*height/, /bullet\s*height/],
		'em'
	);
	if (markerHeight) {
		return {
			action: actionType,
			property: 'list_marker_height',
			value: buildActionValue(
				markerHeight.value,
				markerHeight.unit,
				breakpoint
			),
			message: 'List marker height updated.',
			...actionTarget,
		};
	}

	const markerLineHeight = extractUnitValue(
		message,
		[/marker\s*line\s*height/, /bullet\s*line\s*height/],
		'em'
	);
	if (markerLineHeight) {
		return {
			action: actionType,
			property: 'list_marker_line_height',
			value: buildActionValue(
				markerLineHeight.value,
				markerLineHeight.unit,
				breakpoint
			),
			message: 'List marker line height updated.',
			...actionTarget,
		};
	}

	const markerOffset = extractUnitValue(
		message,
		[
			/marker\s*offset/,
			/bullet\s*offset/,
			/marker\s*vertical\s*offset/,
		],
		'px'
	);
	if (markerOffset) {
		return {
			action: actionType,
			property: 'list_marker_vertical_offset',
			value: buildActionValue(
				markerOffset.value,
				markerOffset.unit,
				breakpoint
			),
			message: 'List marker offset updated.',
			...actionTarget,
		};
	}

	const paragraphSpacing = extractUnitValue(
		message,
		[/paragraph\s*spacing/, /list\s*spacing/, /item\s*spacing/],
		'em'
	);
	if (paragraphSpacing) {
		return {
			action: actionType,
			property: 'list_paragraph_spacing',
			value: buildActionValue(
				paragraphSpacing.value,
				paragraphSpacing.unit,
				breakpoint
			),
			message: 'List paragraph spacing updated.',
			...actionTarget,
		};
	}

	const paletteOpacity = extractListPaletteOpacity(message);
	if (Number.isFinite(paletteOpacity)) {
		return {
			action: actionType,
			property: 'list_palette_opacity',
			value: paletteOpacity,
			message: 'List palette opacity updated.',
			...actionTarget,
		};
	}

	const paletteScStatus = extractListPaletteScStatus(message);
	if (typeof paletteScStatus === 'boolean') {
		return {
			action: actionType,
			property: 'list_palette_sc_status',
			value: paletteScStatus,
			message: 'List style card palette status updated.',
			...actionTarget,
		};
	}

	const paletteStatus = extractListPaletteStatus(message);
	if (typeof paletteStatus === 'boolean') {
		return {
			action: actionType,
			property: 'list_palette_status',
			value: paletteStatus,
			message: 'List palette status updated.',
			...actionTarget,
		};
	}

	const paletteColor = extractListPaletteColor(message);
	if (Number.isFinite(paletteColor)) {
		return {
			action: actionType,
			property: 'list_palette_color',
			value: paletteColor,
			message: 'List palette color updated.',
			...actionTarget,
		};
	}

	const listColor = extractListColorValue(message);
	if (listColor !== null) {
		return {
			action: actionType,
			property: 'list_color',
			value: listColor,
			message: 'List color updated.',
			...actionTarget,
		};
	}

	if (listStatus === true) {
		return {
			action: actionType,
			property: 'is_list',
			value: listStatus,
			message: 'List enabled.',
			...actionTarget,
		};
	}

	return null;
};

const LIST_PROPERTY_ALIASES = {
	islist: 'is_list',
	listtype: 'list_type',
	typeoflist: 'list_type',
	liststyle: 'list_style',
	liststylecustom: 'list_style_custom',
	liststart: 'list_start',
	listreversed: 'list_reversed',
	liststyleposition: 'list_style_position',
	listtextposition: 'list_text_position',
	listpalettecolor: 'list_palette_color',
	listpaletteopacity: 'list_palette_opacity',
	listpalettestatus: 'list_palette_status',
	listpalettescstatus: 'list_palette_sc_status',
	listcolor: 'list_color',
	listgap: 'list_gap',
	listmarkerheight: 'list_marker_height',
	listmarkerlineheight: 'list_marker_line_height',
};

const buildTextListGroupAttributeChanges = (property, value) => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');
	const mapped =
		LIST_PROPERTY_ALIASES[normalized.toLowerCase()] || normalized;
	const rawValue = normalizeRawValue(value);

	switch (mapped) {
		case 'list_color':
			return buildListColorChanges(rawValue);
		case 'list_palette_color':
			return buildListPaletteColorChanges(rawValue);
		case 'list_palette_opacity':
			return buildListPaletteOpacityChanges(rawValue);
		case 'list_palette_status':
			return buildListPaletteStatusChanges(rawValue);
		case 'list_palette_sc_status':
			return buildListPaletteScStatusChanges(rawValue);
		case 'list_gap':
			return buildListUnitChanges('list-gap', value, 'em');
		case 'list_indent':
			return buildListUnitChanges('list-indent', value, 'px');
		case 'list_marker_indent':
			return buildListUnitChanges('list-marker-indent', value, 'em');
		case 'list_marker_size':
			return buildListUnitChanges('list-marker-size', value, 'em');
		case 'list_marker_height':
			return buildListUnitChanges('list-marker-height', value, 'em');
		case 'list_marker_line_height':
			return buildListUnitChanges('list-marker-line-height', value, 'em');
		case 'list_marker_vertical_offset':
			return buildListUnitChanges('list-marker-vertical-offset', value, 'px');
		case 'list_paragraph_spacing':
			return buildListUnitChanges('list-paragraph-spacing', value, 'em');
		case 'list_style_position':
			return buildListValueChanges('list-style-position', value);
		case 'list_text_position':
			return buildListValueChanges('list-text-position', value);
		case 'is_list':
			if (Boolean(rawValue)) {
				return {
					isList: true,
					typeOfList: 'ul',
					listStyle: 'disc',
					listStyleCustom: '',
					...buildListValueChanges('list-style-position', 'outside'),
				};
			}
			return { isList: false };
		case 'list_type':
			if (rawValue === 'ol') {
				return {
					typeOfList: 'ol',
					isList: true,
					listStyle: 'decimal',
					listStyleCustom: '',
				};
			}
			if (rawValue === 'ul') {
				return {
					typeOfList: 'ul',
					isList: true,
					listStyle: 'disc',
					listStyleCustom: '',
				};
			}
			return {
				typeOfList: rawValue,
				isList: true,
			};
		case 'list_style': {
			const orderedStyles = new Set([
				'decimal',
				'details',
				'lower-roman',
				'upper-roman',
				'lower-alpha',
				'upper-alpha',
				'decimal-leading-zero',
			]);
			const unorderedStyles = new Set([
				'disc',
				'circle',
				'square',
				'custom',
				'disclosure-open',
				'disclosure-closed',
				'none',
			]);

			const changes = {
				listStyle: rawValue,
				isList: true,
			};

			if (orderedStyles.has(rawValue)) changes.typeOfList = 'ol';
			if (unorderedStyles.has(rawValue)) changes.typeOfList = 'ul';

			return changes;
		}
		case 'list_style_custom':
			return {
				listStyleCustom: rawValue,
				listStyle: 'custom',
				typeOfList: 'ul',
				isList: true,
			};
		case 'list_start':
			return {
				listStart: rawValue,
				typeOfList: 'ol',
				isList: true,
			};
		case 'list_reversed':
			return {
				listReversed: Boolean(rawValue),
				typeOfList: 'ol',
				isList: true,
			};
		default:
			return null;
	}
};

const getTextListGroupSidebarTarget = property => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');
	const mapped =
		LIST_PROPERTY_ALIASES[normalized.toLowerCase()] || normalized;

	if (
		[
			'is_list',
			'list_type',
			'list_style',
			'list_style_custom',
			'list_start',
			'list_reversed',
			'list_color',
			'list_palette_color',
			'list_palette_opacity',
			'list_palette_status',
			'list_palette_sc_status',
			'list_gap',
			'list_indent',
			'list_marker_indent',
			'list_marker_size',
			'list_marker_height',
			'list_marker_line_height',
			'list_marker_vertical_offset',
			'list_paragraph_spacing',
			'list_style_position',
			'list_text_position',
		].includes(mapped)
	) {
		return { tabIndex: 0, accordion: 'list options' };
	}

	return null;
};

return {
	buildTextListGroupAction,
	buildTextListGroupAttributeChanges,
	getTextListGroupSidebarTarget,
};
})();

export const {
	buildTextListGroupAction,
	buildTextListGroupAttributeChanges,
	getTextListGroupSidebarTarget,
} = textListGroup;

// textLGroup (link styles)
const textLGroup = (() => {
const clampOpacity = value => Math.min(1, Math.max(0, value));

const extractCssVar = message => {
	const match = String(message || '').match(/var\(--[a-z0-9-_]+\)/i);
	return match ? match[0] : null;
};

const extractHexColor = message => {
	const match = String(message || '').match(
		/#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})(?![0-9a-fA-F])/i
	);
	return match ? match[0] : null;
};

const extractPaletteOpacity = message => {
	const lower = String(message || '').toLowerCase();
	if (!/opacity|alpha|transparen/.test(lower)) return null;

	const percentMatch = message.match(/(\d+(?:\.\d+)?)\s*%/);
	if (percentMatch) {
		const percent = Number.parseFloat(percentMatch[1]);
		if (!Number.isFinite(percent)) return null;
		return clampOpacity(percent / 100);
	}

	const rawMatch = message.match(
		/\b(?:opacity|alpha|transparen(?:cy|t))\b[^0-9]*(-?\d+(?:\.\d+)?)/i
	);
	if (rawMatch) {
		const raw = Number.parseFloat(rawMatch[1]);
		if (!Number.isFinite(raw)) return null;
		return clampOpacity(raw > 1 ? raw / 100 : raw);
	}

	return null;
};

const getLinkState = message => {
	const lower = String(message || '').toLowerCase();
	if (/\bhover\b/.test(lower)) return 'hover';
	if (/\bactive\b/.test(lower)) return 'active';
	if (/\bvisited\b/.test(lower)) return 'visited';
	return 'base';
};

const getLinkPrefix = state => {
	if (state === 'hover') return 'link-hover-';
	if (state === 'active') return 'link-active-';
	if (state === 'visited') return 'link-visited-';
	return 'link-';
};

const getStateSuffix = state => (state === 'base' ? '' : `_${state}`);

const normalizePaletteValue = rawValue => {
	if (
		rawValue &&
		typeof rawValue === 'object' &&
		!Array.isArray(rawValue)
	) {
		if (rawValue.palette !== undefined) return rawValue.palette;
		if (rawValue.color !== undefined) return rawValue.color;
		if (rawValue.value !== undefined) return rawValue.value;
	}
	return rawValue;
};

const normalizeOpacityValue = rawValue => {
	const raw = normalizePaletteValue(rawValue);
	if (raw === null || raw === undefined) return null;
	if (typeof raw === 'string') {
		const percentMatch = raw.match(/(\d+(?:\.\d+)?)\s*%/);
		if (percentMatch) {
			const percent = Number.parseFloat(percentMatch[1]);
			return Number.isFinite(percent) ? clampOpacity(percent / 100) : null;
		}
	}
	const num = Number(raw);
	if (!Number.isFinite(num)) return null;
	return clampOpacity(num > 1 ? num / 100 : num);
};

const normalizeColorValue = rawValue => {
	if (
		rawValue &&
		typeof rawValue === 'object' &&
		!Array.isArray(rawValue)
	) {
		if (rawValue.palette !== undefined) {
			return { isPalette: true, value: rawValue.palette };
		}
		if (rawValue.color !== undefined) {
			return { isPalette: false, value: rawValue.color };
		}
		if (rawValue.value !== undefined) {
			const isPalette = typeof rawValue.value === 'number';
			return { isPalette, value: rawValue.value };
		}
	}
	const isPalette = typeof rawValue === 'number';
	return { isPalette, value: rawValue };
};

const buildLinkColorChanges = (value, { state = 'base' } = {}) => {
	const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
	if (rawValue === null || rawValue === undefined) return null;

	const { isPalette, value: colorValue } = normalizeColorValue(rawValue);
	const breakpoints = breakpoint ? [breakpoint] : RESPONSIVE_BREAKPOINTS;
	const prefix = getLinkPrefix(state);
	const changes = {};

	breakpoints.forEach(bp => {
		changes[`${prefix}palette-status-${bp}`] = isPalette;
		changes[`${prefix}palette-color-${bp}`] = isPalette ? colorValue : '';
		changes[`${prefix}color-${bp}`] = isPalette ? '' : colorValue;
	});

	return changes;
};

const buildLinkPaletteColorChanges = (value, { state = 'base' } = {}) => {
	const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
	const numeric = Number(normalizePaletteValue(rawValue));
	if (!Number.isFinite(numeric)) return null;
	const breakpoints = breakpoint ? [breakpoint] : RESPONSIVE_BREAKPOINTS;
	const prefix = getLinkPrefix(state);
	const changes = {};

	breakpoints.forEach(bp => {
		changes[`${prefix}palette-status-${bp}`] = true;
		changes[`${prefix}palette-color-${bp}`] = numeric;
		changes[`${prefix}color-${bp}`] = '';
	});

	return changes;
};

const buildLinkPaletteOpacityChanges = (value, { state = 'base' } = {}) => {
	const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
	const opacity = normalizeOpacityValue(rawValue);
	if (opacity === null || opacity === undefined) return null;
	const breakpoints = breakpoint ? [breakpoint] : RESPONSIVE_BREAKPOINTS;
	const prefix = getLinkPrefix(state);
	const changes = {};

	breakpoints.forEach(bp => {
		changes[`${prefix}palette-opacity-${bp}`] = opacity;
	});

	return changes;
};

const buildLinkPaletteStatusChanges = (value, { state = 'base' } = {}) => {
	const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
	const status = rawValue === null || rawValue === undefined ? null : Boolean(rawValue);
	if (status === null) return null;
	const breakpoints = breakpoint ? [breakpoint] : RESPONSIVE_BREAKPOINTS;
	const prefix = getLinkPrefix(state);
	const changes = {};

	breakpoints.forEach(bp => {
		changes[`${prefix}palette-status-${bp}`] = status;
	});

	return changes;
};

const buildLinkPaletteScStatusChanges = (value, { state = 'base' } = {}) => {
	const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
	const status = rawValue === null || rawValue === undefined ? null : Boolean(rawValue);
	if (status === null) return null;
	const breakpoints = breakpoint ? [breakpoint] : RESPONSIVE_BREAKPOINTS;
	const prefix = getLinkPrefix(state);
	const changes = {};

	breakpoints.forEach(bp => {
		changes[`${prefix}palette-sc-status-${bp}`] = status;
	});

	return changes;
};

const extractLinkPaletteStatus = message => {
	const lower = String(message || '').toLowerCase();
	if (!/palette/.test(lower)) return null;
	if (/(disable|off|remove|no)\b.*palette/.test(lower)) return false;
	if (/(enable|use|turn\s*on|activate)\b.*palette/.test(lower)) return true;
	return null;
};

const extractLinkPaletteScStatus = message => {
	const lower = String(message || '').toLowerCase();
	if (!/(style\s*card|stylecard|style-card)/.test(lower)) return null;
	if (/(disable|off|remove|no)\b/.test(lower)) return false;
	if (/(enable|use|turn\s*on|activate|sync|link)\b/.test(lower)) return true;
	return null;
};

const extractLinkPaletteColor = message => {
	const lower = String(message || '').toLowerCase();
	if (!/palette|color/.test(lower)) return null;
	const palette = parsePaletteColor(message);
	return Number.isFinite(palette) ? palette : null;
};

const extractLinkColorValue = message => {
	const lower = String(message || '').toLowerCase();
	if (!/colou?r/.test(lower)) return null;
	const palette = parsePaletteColor(message);
	const cssVar = extractCssVar(message);
	const hex = extractHexColor(message);
	const value = palette ?? cssVar ?? hex;
	return value === null || value === undefined ? null : value;
};

const buildTextLGroupAction = (message, { scope = 'selection' } = {}) => {
	const lower = String(message || '').toLowerCase();
	if (!/\blink(s)?\b/.test(lower)) return null;
	if (
		!/(colou?r|palette|opacity|alpha|transparen|style\s*card|stylecard|style-card)/.test(
			lower
		)
	) {
		return null;
	}

	const actionType = scope === 'page' ? 'update_page' : 'update_selection';
	const actionTarget = actionType === 'update_page' ? { target_block: 'text' } : {};
	const breakpoint = extractBreakpointToken(message);
	const state = getLinkState(message);
	const suffix = getStateSuffix(state);

	const paletteOpacity = extractPaletteOpacity(message);
	if (Number.isFinite(paletteOpacity)) {
		return {
			action: actionType,
			property: `link_palette_opacity${suffix}`,
			value: breakpoint ? { value: paletteOpacity, breakpoint } : paletteOpacity,
			message: 'Link palette opacity updated.',
			...actionTarget,
		};
	}

	const paletteScStatus = extractLinkPaletteScStatus(message);
	if (typeof paletteScStatus === 'boolean') {
		return {
			action: actionType,
			property: `link_palette_sc_status${suffix}`,
			value: breakpoint
				? { value: paletteScStatus, breakpoint }
				: paletteScStatus,
			message: 'Link style card palette status updated.',
			...actionTarget,
		};
	}

	const paletteStatus = extractLinkPaletteStatus(message);
	if (typeof paletteStatus === 'boolean') {
		return {
			action: actionType,
			property: `link_palette_status${suffix}`,
			value: breakpoint
				? { value: paletteStatus, breakpoint }
				: paletteStatus,
			message: 'Link palette status updated.',
			...actionTarget,
		};
	}

	const paletteColor = extractLinkPaletteColor(message);
	if (Number.isFinite(paletteColor)) {
		return {
			action: actionType,
			property: `link_palette_color${suffix}`,
			value: breakpoint ? { value: paletteColor, breakpoint } : paletteColor,
			message: 'Link palette color updated.',
			...actionTarget,
		};
	}

	const colorValue = extractLinkColorValue(message);
	if (colorValue !== null) {
		return {
			action: actionType,
			property: `link_color${suffix}`,
			value: breakpoint ? { value: colorValue, breakpoint } : colorValue,
			message: 'Link color updated.',
			...actionTarget,
		};
	}

	return null;
};

const buildTextLGroupAttributeChanges = (property, value) => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');
	if (!normalized.startsWith('link_')) return null;

	const stateMatch = normalized.match(/_(hover|active|visited)$/);
	const state = stateMatch ? stateMatch[1] : 'base';
	const key = stateMatch
		? normalized.slice(0, -stateMatch[0].length)
		: normalized;

	switch (key) {
		case 'link_color':
			return buildLinkColorChanges(value, { state });
		case 'link_palette_color':
			return buildLinkPaletteColorChanges(value, { state });
		case 'link_palette_opacity':
			return buildLinkPaletteOpacityChanges(value, { state });
		case 'link_palette_status':
			return buildLinkPaletteStatusChanges(value, { state });
		case 'link_palette_sc_status':
			return buildLinkPaletteScStatusChanges(value, { state });
		default:
			return null;
	}
};

const getTextLGroupSidebarTarget = property => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');
	if (!normalized.startsWith('link_')) return null;
	const stateMatch = normalized.match(/_(hover|active|visited)$/);
	const state = stateMatch ? stateMatch[1] : 'link';
	return { tabIndex: 0, accordion: 'link', state };
};

return {
	buildTextLGroupAction,
	buildTextLGroupAttributeChanges,
	getTextLGroupSidebarTarget,
};
})();

export const {
	buildTextLGroupAction,
	buildTextLGroupAttributeChanges,
	getTextLGroupSidebarTarget,
} = textLGroup;

const TEXT_TYPOGRAPHY_SIDEBAR_PROPERTIES = new Set([
	'text_letter_spacing',
	'text_letter_spacing_hover',
	'flow_text_letter_spacing',
	'letter_spacing',
]);

export const getTextTypographySidebarTarget = property => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');
	if (!TEXT_TYPOGRAPHY_SIDEBAR_PROPERTIES.has(normalized)) return null;
	return { tabIndex: 0, accordion: 'typography' };
};
