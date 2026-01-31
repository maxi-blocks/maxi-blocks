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
			return null;
	}
};

const getTextCGroupSidebarTarget = property => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');

	if (
		[
			'text_color',
			'text_color_hover',
			'custom_formats',
			'custom_formats_hover',
			'typography_status_hover',
		].includes(normalized)
	) {
		return { tabIndex: 0, accordion: 'typography' };
	}

	return null;
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
