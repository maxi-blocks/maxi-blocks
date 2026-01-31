import {
	buildContainerPGroupAction,
	buildContainerPGroupAttributeChanges,
} from './containerGroups';
import {
	RESPONSIVE_BREAKPOINTS,
	extractBreakpointToken,
	normalizeValueWithBreakpoint,
} from './layoutAGroup';

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
