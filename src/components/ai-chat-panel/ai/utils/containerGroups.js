import { select } from '@wordpress/data';
import {
	buildLayoutAGroupAction,
	buildResponsiveBooleanChanges,
	buildResponsiveValueChanges,
	extractBreakpointToken as extractLayoutBreakpointToken,
	normalizeValueWithBreakpoint as normalizeLayoutValueWithBreakpoint,
} from './layoutAGroup';
import {
	RESPONSIVE_BREAKPOINTS,
	extractNumericValue,
	extractBreakpointToken,
	extractBreakpointValue,
	parsePaletteColor,
	parseBorderStyle,
	parseBorderWidth,
	parseBorderRadius,
	parseShadowPreset,
} from './shared/attributeParsers';
import {
	parseBackgroundLayerCommand,
	applyBackgroundLayerCommand,
	isBackgroundLayerCommand,
} from './shared/backgroundLayers';

// containerAGroup
const containerAGroup = (() => {
const extractNumericValue = (message, patterns) => {
	if (!message) return null;
	for (const pattern of patterns) {
		const match = message.match(pattern);
		if (match && match[1]) {
			const num = Number.parseFloat(match[1]);
			if (Number.isFinite(num)) return num;
		}
	}
	return null;
};

const extractArrowStatus = message => {
	const lower = String(message || '').toLowerCase();
	if (!lower.includes('arrow')) return null;
	if (/(show|enable|add).*(callout\s*)?arrow/.test(lower)) return true;
	if (/(hide|disable|remove).*(callout\s*)?arrow/.test(lower)) return false;
	return null;
};

const extractArrowSide = message => {
	const lower = String(message || '').toLowerCase();
	if (!lower.includes('arrow')) return null;
	if (/\barrow\b.*\btop\b|\btop\b.*\barrow\b/.test(lower)) return 'top';
	if (/\barrow\b.*\bbottom\b|\bbottom\b.*\barrow\b/.test(lower)) return 'bottom';
	if (/\barrow\b.*\bleft\b|\bleft\b.*\barrow\b/.test(lower)) return 'left';
	if (/\barrow\b.*\bright\b|\bright\b.*\barrow\b/.test(lower)) return 'right';
	return null;
};

const extractArrowPosition = message =>
	extractNumericValue(message, [
		/(?:arrow\s*(?:position|pos)|position\s*of\s*arrow)\s*(?:to|=|:|is)?\s*(\d+(?:\.\d+)?)/i,
		/\barrow\b.*\bposition\b.*?(\d+(?:\.\d+)?)/i,
	]);

const extractArrowWidth = message =>
	extractNumericValue(message, [
		/(?:arrow\s*width|width\s*of\s*arrow)\s*(?:to|=|:|is)?\s*(\d+(?:\.\d+)?)/i,
		/\barrow\b.*?(\d+(?:\.\d+)?)\s*(?:px)?\s*(?:wide|width)/i,
	]);

const buildContainerAGroupAction = (message, { scope = 'selection' } = {}) => {
	const actionType = scope === 'page' ? 'update_page' : 'update_selection';
	const actionTarget = actionType === 'update_page' ? { target_block: 'container' } : {};
	const breakpoint = extractLayoutBreakpointToken(message);

	const arrowStatus = extractArrowStatus(message);
	if (typeof arrowStatus === 'boolean') {
		return {
			action: actionType,
			property: 'arrow_status',
			value: breakpoint ? { value: arrowStatus, breakpoint } : arrowStatus,
			message: arrowStatus ? 'Callout arrow shown.' : 'Callout arrow hidden.',
			...actionTarget,
		};
	}

	const arrowSide = extractArrowSide(message);
	if (arrowSide) {
		return {
			action: actionType,
			property: 'arrow_side',
			value: breakpoint ? { value: arrowSide, breakpoint } : arrowSide,
			message: 'Arrow side set.',
			...actionTarget,
		};
	}

	const arrowPosition = extractArrowPosition(message);
	if (Number.isFinite(arrowPosition)) {
		return {
			action: actionType,
			property: 'arrow_position',
			value: breakpoint ? { value: arrowPosition, breakpoint } : arrowPosition,
			message: 'Arrow position set.',
			...actionTarget,
		};
	}

	const arrowWidth = extractArrowWidth(message);
	if (Number.isFinite(arrowWidth)) {
		return {
			action: actionType,
			property: 'arrow_width',
			value: breakpoint ? { value: arrowWidth, breakpoint } : arrowWidth,
			message: 'Arrow width set.',
			...actionTarget,
		};
	}

	const layoutAction = buildLayoutAGroupAction(message, {
		scope,
		targetBlock: 'container',
		propertyMap: {
			alignItems: 'align_items_flex',
			alignContent: 'align_content',
			justifyContent: 'justify_content',
		},
	});
	if (layoutAction) {
		return layoutAction;
	}

	return null;
};

const buildContainerAGroupAttributeChanges = (
	property,
	value,
	{ block, attributes } = {}
) => {
	if (!property) return null;

	switch (property) {
		case 'arrow_status': {
			const { value: rawValue, breakpoint } = normalizeLayoutValueWithBreakpoint(value);
			const status = Boolean(rawValue);
			return breakpoint
				? { [`arrow-status-${breakpoint}`]: status }
				: buildResponsiveBooleanChanges('arrow-status', status);
		}
		case 'arrow_side': {
			const { value: rawValue, breakpoint } = normalizeLayoutValueWithBreakpoint(value);
			const side = String(rawValue || 'bottom');
			return breakpoint
				? { [`arrow-side-${breakpoint}`]: side }
				: buildResponsiveValueChanges('arrow-side', side);
		}
		case 'arrow_position': {
			const { value: rawValue, breakpoint } = normalizeLayoutValueWithBreakpoint(value);
			const pos = Number(rawValue);
			const finalPos = Number.isFinite(pos) ? pos : 0;
			return breakpoint
				? { [`arrow-position-${breakpoint}`]: finalPos }
				: buildResponsiveValueChanges('arrow-position', finalPos);
		}
		case 'arrow_width': {
			const { value: rawValue, breakpoint } = normalizeLayoutValueWithBreakpoint(value);
			const width = Number(rawValue);
			const finalWidth = Number.isFinite(width) ? width : 0;
			return breakpoint
				? { [`arrow-width-${breakpoint}`]: finalWidth }
				: buildResponsiveValueChanges('arrow-width', finalWidth);
		}
		case 'align_items_flex': {
			const { value: rawValue, breakpoint } = normalizeLayoutValueWithBreakpoint(value);
			const alignValue = String(rawValue || '');
			const direction = String(block?.attributes?.['flex-direction-general'] || '').toLowerCase();
			const isColumn = direction.startsWith('column');
			const isMainAxisAlign = ['flex-start', 'center', 'flex-end'].includes(alignValue);
			const key = isColumn && isMainAxisAlign ? 'justify-content' : 'align-items';
			if (breakpoint) {
				return { [`${key}-${breakpoint}`]: alignValue };
			}
			return { [`${key}-general`]: alignValue };
		}
		case 'align_content': {
			const { value: rawValue, breakpoint } = normalizeLayoutValueWithBreakpoint(value);
			const alignValue = String(rawValue || '');
			return breakpoint
				? { [`align-content-${breakpoint}`]: alignValue }
				: { 'align-content-general': alignValue };
		}
		case 'justify_content': {
			const { value: rawValue, breakpoint } = normalizeLayoutValueWithBreakpoint(value);
			const justifyValue = String(rawValue || '');
			return breakpoint
				? { [`justify-content-${breakpoint}`]: justifyValue }
				: { 'justify-content-general': justifyValue };
		}
		default:
			return null;
	}
};

const getContainerAGroupSidebarTarget = property => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');

	if (
		['arrow_status', 'arrow_side', 'arrow_position', 'arrow_width'].includes(
			normalized
		)
	) {
		return { tabIndex: 0, accordion: 'callout arrow' };
	}

	if (
		[
			'align_items',
			'align_items_flex',
			'align_content',
			'justify_content',
			'flex_direction',
			'flex_wrap',
			'gap',
			'row_gap',
			'column_gap',
		].includes(normalized)
	) {
		return { tabIndex: 1, accordion: 'flexbox' };
	}

	return null;
};

return {
	extractArrowStatus,
	extractArrowSide,
	extractArrowPosition,
	extractArrowWidth,
	buildContainerAGroupAction,
	buildContainerAGroupAttributeChanges,
	getContainerAGroupSidebarTarget,
};
})();

export const {
	extractArrowStatus,
	extractArrowSide,
	extractArrowPosition,
	extractArrowWidth,
	buildContainerAGroupAction,
	buildContainerAGroupAttributeChanges,
	getContainerAGroupSidebarTarget,
} = containerAGroup;

// containerBGroup
const containerBGroup = (() => {
const extractValueFromPatterns = (message, patterns) => {
	if (!message) return null;
	for (const pattern of patterns) {
		const match = message.match(pattern);
		if (match && match[1]) return match[1].trim();
	}
	return null;
};

const normalizeValueWithBreakpoint = rawValue => {
	if (
		rawValue &&
		typeof rawValue === 'object' &&
		!Array.isArray(rawValue) &&
		Object.prototype.hasOwnProperty.call(rawValue, 'value')
	) {
		return {
			value: rawValue.value,
			breakpoint: rawValue.breakpoint || null,
		};
	}

	return { value: rawValue, breakpoint: null };
};



const extractBlockStyle = message => {
	const lower = String(message || '').toLowerCase();
	if (!/block\s*style|style\s*card|style\s*variant|style\s*mode/.test(lower)) {
		return null;
	}
	if (lower.includes('dark')) return 'dark';
	if (lower.includes('light')) return 'light';
	if (lower.includes('default') || lower.includes('inherit')) return 'default';
	return null;
};

const extractBackgroundHoverStatus = message => {
	const lower = String(message || '').toLowerCase();
	if (!lower.includes('hover') || !lower.includes('background')) return null;
	if (/(enable|show|turn\s*on|activate)/.test(lower)) return true;
	if (/(disable|hide|turn\s*off|deactivate)/.test(lower)) return false;
	return null;
};

const extractBorderConfig = message => {
	const lower = String(message || '').toLowerCase();
	if (!/(border|outline)/.test(lower)) return null;
	const isHover = /hover/.test(lower);
	if (/(remove|clear|no)\s+border/.test(lower)) {
		return { isHover, value: 'none' };
	}
	const width = parseBorderWidth(message);
	const style = parseBorderStyle(message);
	const color = parsePaletteColor(message);
	if (width === null && !style && color === null) return null;
	return {
		isHover,
		value: {
			width: width ?? 2,
			style: style || 'solid',
			color: color ?? 3,
			opacity: 100,
		},
	};
};

const extractBorderRadiusHover = message => {
	const lower = String(message || '').toLowerCase();
	if (!lower.includes('hover')) return null;
	if (!/(corner|radius|rounded)/.test(lower)) return null;
	const radius = parseBorderRadius(message);
	return Number.isFinite(radius) ? radius : null;
};

const extractBoxShadowConfig = message => {
	const lower = String(message || '').toLowerCase();
	if (!lower.includes('shadow')) return null;
	const isHover = /hover/.test(lower);
	if (/(remove|clear|no)\s+shadow/.test(lower)) {
		return { isHover, value: 'none' };
	}
	const preset = parseShadowPreset(message);
	const palette = parsePaletteColor(message);
	if (!preset && palette === null) return null;
	return {
		isHover,
		value: {
			...(preset || { x: 0, y: 10, blur: 30, spread: 0, opacity: 12 }),
			color: palette ?? 8,
			inset: false,
		},
	};
};

const buildBorderChanges = (value, { isHover = false } = {}) => {
	const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
	const isRemoval = rawValue === 'none' || rawValue === null || rawValue === 0;
	const config =
		rawValue && typeof rawValue === 'object' && !Array.isArray(rawValue)
			? rawValue
			: {};
	const width = isRemoval ? 0 : Number(config.width ?? 2);
	const style = isRemoval ? 'none' : String(config.style || 'solid');
	const color = config.color ?? 3;
	const opacity = config.opacity ?? 100;
	const scStatus = Boolean(config.scStatus || false);
	const isPalette = typeof color === 'number';
	const breakpoints = breakpoint ? [breakpoint] : RESPONSIVE_BREAKPOINTS;
	const changes = {};

	breakpoints.forEach(bp => {
		const suffix = `-${bp}${isHover ? '-hover' : ''}`;
		changes[`border-style${suffix}`] = style;
		changes[`border-top-width${suffix}`] = width;
		changes[`border-bottom-width${suffix}`] = width;
		changes[`border-left-width${suffix}`] = width;
		changes[`border-right-width${suffix}`] = width;
		changes[`border-sync-width${suffix}`] = 'all';
		changes[`border-unit-width${suffix}`] = 'px';
		changes[`border-palette-status${suffix}`] = isPalette;
		changes[`border-palette-color${suffix}`] = isPalette ? color : '';
		changes[`border-color${suffix}`] = isPalette
			? `var(--maxi-color-${color})`
			: color || '';
		changes[`border-palette-opacity${suffix}`] = isPalette ? opacity : '';
		changes[`border-palette-sc-status${suffix}`] = scStatus;
	});

	if (isHover) {
		changes['border-status-hover'] = !isRemoval;
	}

	return changes;
};

const buildBorderRadiusChanges = (value, { isHover = false } = {}) => {
	const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
	const radius = Number.isFinite(Number(rawValue)) ? Number(rawValue) : 8;
	const breakpoints = breakpoint ? [breakpoint] : RESPONSIVE_BREAKPOINTS;
	const changes = {};

	breakpoints.forEach(bp => {
		const suffix = `-${bp}${isHover ? '-hover' : ''}`;
		changes[`border-top-left-radius${suffix}`] = radius;
		changes[`border-top-right-radius${suffix}`] = radius;
		changes[`border-bottom-left-radius${suffix}`] = radius;
		changes[`border-bottom-right-radius${suffix}`] = radius;
		changes[`border-sync-radius${suffix}`] = 'all';
		changes[`border-unit-radius${suffix}`] = 'px';
	});

	return changes;
};

const buildBoxShadowChanges = (value, { isHover = false } = {}) => {
	const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
	const isRemoval = rawValue === 'none' || rawValue === null || rawValue === 0;
	const config =
		rawValue && typeof rawValue === 'object' && !Array.isArray(rawValue)
			? rawValue
			: {};
	const x = Number(config.x ?? 0);
	const y = Number(config.y ?? 10);
	const blur = Number(config.blur ?? 30);
	const spread = Number(config.spread ?? 0);
	const color = config.color ?? 8;
	const opacity = config.opacity ?? 12;
	const inset = Boolean(config.inset || false);
	const isPalette = typeof color === 'number';
	const breakpoints = breakpoint ? [breakpoint] : RESPONSIVE_BREAKPOINTS;
	const changes = {};

	if (isHover) {
		changes['box-shadow-status-hover'] = !isRemoval;
	}

	if (isRemoval) {
		return changes;
	}

	breakpoints.forEach(bp => {
		const suffix = `-${bp}${isHover ? '-hover' : ''}`;
		changes[`box-shadow-horizontal${suffix}`] = x;
		changes[`box-shadow-vertical${suffix}`] = y;
		changes[`box-shadow-blur${suffix}`] = blur;
		changes[`box-shadow-spread${suffix}`] = spread;
		changes[`box-shadow-inset${suffix}`] = inset;
		changes[`box-shadow-horizontal-unit${suffix}`] = 'px';
		changes[`box-shadow-vertical-unit${suffix}`] = 'px';
		changes[`box-shadow-blur-unit${suffix}`] = 'px';
		changes[`box-shadow-spread-unit${suffix}`] = 'px';
		changes[`box-shadow-palette-status${suffix}`] = isPalette;
		changes[`box-shadow-palette-color${suffix}`] = isPalette ? color : '';
		changes[`box-shadow-palette-opacity${suffix}`] = isPalette ? opacity : '';
		changes[`box-shadow-palette-sc-status${suffix}`] = false;
		changes[`box-shadow-color${suffix}`] = isPalette ? '' : color || '';
	});

	return changes;
};

const buildBreakpointChanges = value => {
	const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
	if (breakpoint) {
		const numeric = Number(rawValue);
		if (!Number.isFinite(numeric)) return null;
		return { [`breakpoints-${breakpoint}`]: numeric };
	}

	if (rawValue && typeof rawValue === 'object' && !Array.isArray(rawValue)) {
		const changes = {};
		Object.entries(rawValue).forEach(([key, val]) => {
			if (!RESPONSIVE_BREAKPOINTS.includes(key)) return;
			const numeric = Number(val);
			if (Number.isFinite(numeric)) {
				changes[`breakpoints-${key}`] = numeric;
			}
		});
		return Object.keys(changes).length ? changes : null;
	}

	const numeric = Number(rawValue);
	if (!Number.isFinite(numeric)) return null;
	return { 'breakpoints-general': numeric };
};

const buildContainerBGroupAction = (message, { scope = 'selection' } = {}) => {
	const actionType = scope === 'page' ? 'update_page' : 'update_selection';
	const actionTarget =
		actionType === 'update_page' ? { target_block: 'container' } : {};

	const blockStyle = extractBlockStyle(message);
	if (blockStyle) {
		return {
			action: actionType,
			property: 'block_style',
			value: blockStyle,
			message: 'Block style updated.',
			...actionTarget,
		};
	}

	const breakpointToken = extractBreakpointToken(message);
	const breakpointValue = extractBreakpointValue(message);
	if (breakpointToken && Number.isFinite(breakpointValue)) {
		return {
			action: actionType,
			property: 'breakpoints',
			value: { value: breakpointValue, breakpoint: breakpointToken },
			message: 'Breakpoint updated.',
			...actionTarget,
		};
	}

	const backgroundHoverStatus = extractBackgroundHoverStatus(message);
	if (typeof backgroundHoverStatus === 'boolean') {
		return {
			action: actionType,
			property: 'block_background_status_hover',
			value: backgroundHoverStatus,
			message: backgroundHoverStatus
				? 'Hover background enabled.'
				: 'Hover background disabled.',
			...actionTarget,
		};
	}

	const backgroundLayerCommand = parseBackgroundLayerCommand(message);
	if (backgroundLayerCommand) {
		return {
			action: actionType,
			property: backgroundLayerCommand.isHover
				? 'background_layers_hover'
				: 'background_layers',
			value: backgroundLayerCommand,
			message: 'Background layer updated.',
			...actionTarget,
		};
	}

	const borderRadiusHover = extractBorderRadiusHover(message);
	if (Number.isFinite(borderRadiusHover)) {
		return {
			action: actionType,
			property: 'border_radius_hover',
			value: borderRadiusHover,
			message: 'Hover corners updated.',
			...actionTarget,
		};
	}

	const borderConfig = extractBorderConfig(message);
	if (borderConfig) {
		return {
			action: actionType,
			property: borderConfig.isHover ? 'border_hover' : 'border',
			value: borderConfig.value,
			message: borderConfig.isHover ? 'Hover border updated.' : 'Border updated.',
			...actionTarget,
		};
	}

	const shadowConfig = extractBoxShadowConfig(message);
	if (shadowConfig) {
		return {
			action: actionType,
			property: shadowConfig.isHover ? 'box_shadow_hover' : 'box_shadow',
			value: shadowConfig.value,
			message: shadowConfig.isHover ? 'Hover shadow updated.' : 'Shadow updated.',
			...actionTarget,
		};
	}

	return null;
};

const buildContainerBGroupAttributeChanges = (
	property,
	value,
	{ attributes } = {}
) => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');

	switch (normalized) {
		case 'background_layers': {
			if (isBackgroundLayerCommand(value)) {
				const currentLayers = attributes?.['background-layers'] || [];
				const updatedLayers = applyBackgroundLayerCommand(
					currentLayers,
					value
				);
				const changes = updatedLayers
					? { 'background-layers': updatedLayers }
					: null;
				if (!changes) return null;
				if (value.enableHover === true) {
					changes['block-background-status-hover'] = true;
				}
				if (value.disableHover === true) {
					changes['block-background-status-hover'] = false;
				}
				return changes;
			}
			const layers = Array.isArray(value)
				? value
				: value && Array.isArray(value.layers)
					? value.layers
					: null;
			return layers ? { 'background-layers': layers } : null;
		}
		case 'background_layers_hover': {
			if (isBackgroundLayerCommand(value)) {
				const currentLayers = attributes?.['background-layers-hover'] || [];
				const updatedLayers = applyBackgroundLayerCommand(
					currentLayers,
					value
				);
				const changes = updatedLayers
					? { 'background-layers-hover': updatedLayers }
					: null;
				if (!changes) return null;
				if (value.enableHover === true) {
					changes['block-background-status-hover'] = true;
				}
				if (value.disableHover === true) {
					changes['block-background-status-hover'] = false;
				}
				return changes;
			}
			const layers = Array.isArray(value)
				? value
				: value && Array.isArray(value.layers)
					? value.layers
					: null;
			return layers ? { 'background-layers-hover': layers } : null;
		}
		case 'block_background_status_hover': {
			return { 'block-background-status-hover': Boolean(value) };
		}
		case 'border':
			return buildBorderChanges(value, { isHover: false });
		case 'border_hover':
			return buildBorderChanges(value, { isHover: true });
		case 'border_radius':
			return buildBorderRadiusChanges(value, { isHover: false });
		case 'border_radius_hover':
			return buildBorderRadiusChanges(value, { isHover: true });
		case 'box_shadow':
			return buildBoxShadowChanges(value, { isHover: false });
		case 'box_shadow_hover':
			return buildBoxShadowChanges(value, { isHover: true });
		case 'block_style':
		case 'blockStyle':
			return { blockStyle: String(value || '').toLowerCase() };
		case 'breakpoints':
			return buildBreakpointChanges(value);
		default:
			return null;
	}
};

const getContainerBGroupSidebarTarget = property => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');

	if (
		[
			'background_layers',
			'background_layers_hover',
			'block_background_status_hover',
		].includes(normalized)
	) {
		return { tabIndex: 0, accordion: 'background / layer' };
	}

	if (
		[
			'border',
			'border_hover',
			'border_radius',
			'border_radius_hover',
		].includes(normalized)
	) {
		return { tabIndex: 0, accordion: 'border' };
	}

	if (['box_shadow', 'box_shadow_hover'].includes(normalized)) {
		return { tabIndex: 0, accordion: 'box shadow' };
	}

	if (['block_style', 'blockStyle'].includes(normalized)) {
		return { tabIndex: 0, accordion: 'block settings' };
	}

	if (normalized === 'breakpoints') {
		return { tabIndex: 1, accordion: 'breakpoint' };
	}

	return null;
};

return {
	buildContainerBGroupAction,
	buildContainerBGroupAttributeChanges,
	getContainerBGroupSidebarTarget,
};
})();

export const {
	buildContainerBGroupAction,
	buildContainerBGroupAttributeChanges,
	getContainerBGroupSidebarTarget,
} = containerBGroup;

// containerCGroup
const containerCGroup = (() => {
const RESPONSIVE_BREAKPOINTS = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const extractQuotedText = message => {
	if (!message) return null;
	const match = message.match(/["']([^"']+)["']/);
	return match ? match[1].trim() : null;
};

const extractValueFromPatterns = (message, patterns) => {
	if (!message) return null;
	for (const pattern of patterns) {
		const match = message.match(pattern);
		if (match && match[1]) return match[1].trim();
	}
	return null;
};

const extractNumericValue = (message, patterns) => {
	if (!message) return null;
	for (const pattern of patterns) {
		const match = message.match(pattern);
		if (match && match[1]) {
			const num = Number.parseFloat(match[1]);
			if (Number.isFinite(num)) return num;
		}
	}
	return null;
};

const extractNumericList = (message, patterns) => {
	if (!message) return [];
	for (const pattern of patterns) {
		const match = message.match(pattern);
		if (match && match[1]) {
			const numbers = match[1]
				.split(/[, ]+/)
				.map(value => Number.parseInt(value.trim(), 10))
				.filter(value => Number.isFinite(value));
			if (numbers.length) return numbers;
		}
	}
	return [];
};

const normalizeValueWithBreakpoint = rawValue => {
	if (
		rawValue &&
		typeof rawValue === 'object' &&
		!Array.isArray(rawValue) &&
		Object.prototype.hasOwnProperty.call(rawValue, 'value')
	) {
		return {
			value: rawValue.value,
			breakpoint: rawValue.breakpoint || null,
		};
	}

	return { value: rawValue, breakpoint: null };
};

const parseUnitValue = (rawValue, fallbackUnit = 'px') => {
	if (rawValue === null || rawValue === undefined) {
		return { value: 0, unit: fallbackUnit };
	}

	if (typeof rawValue === 'number') {
		return { value: rawValue, unit: fallbackUnit };
	}

	if (typeof rawValue === 'object') {
		const size = rawValue.value ?? rawValue.size ?? rawValue.amount ?? rawValue.width;
		const unit = rawValue.unit || fallbackUnit;
		return { value: Number(size) || 0, unit };
	}

	const raw = String(rawValue).trim();
	const match = raw.match(/^(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?$/i);
	if (match) {
		return { value: Number(match[1]), unit: match[2] || fallbackUnit };
	}

	const parsed = Number.parseFloat(raw);
	return { value: Number.isNaN(parsed) ? 0 : parsed, unit: fallbackUnit };
};

const normalizeCss = css => {
	if (!css) return '';
	const trimmed = String(css).trim();
	if (!trimmed) return '';
	return trimmed.endsWith(';') ? trimmed : `${trimmed};`;
};

const splitDeclarations = css =>
	normalizeCss(css)
		.split(';')
		.map(part => String(part).trim())
		.filter(Boolean);

const parseDeclaration = declaration => {
	const raw = String(declaration || '').trim();
	const idx = raw.indexOf(':');
	if (idx === -1) return null;
	const prop = raw.slice(0, idx).trim();
	const value = raw.slice(idx + 1).trim();
	if (!prop) return null;
	return { prop, value };
};

const upsertCss = (baseCss, patchCss) => {
	const map = new Map();

	splitDeclarations(baseCss).forEach(decl => {
		const parsed = parseDeclaration(decl);
		if (!parsed) return;
		map.set(parsed.prop.toLowerCase(), parsed);
	});

	splitDeclarations(patchCss).forEach(decl => {
		const parsed = parseDeclaration(decl);
		if (!parsed) return;
		map.set(parsed.prop.toLowerCase(), parsed);
	});

	return Array.from(map.values())
		.map(({ prop, value }) => `${prop}: ${value};`)
		.join('\n')
		.trim();
};

const mergeCustomCss = (attributes, { css, category, index, breakpoint }) => {
	const bp = breakpoint || 'general';
	const key = `custom-css-${bp}`;
	const existing = attributes?.[key];
	const next = existing ? { ...existing } : {};
	const categoryKey = category || 'container';
	const indexKey = index || 'normal';
	const currentCss = next?.[categoryKey]?.[indexKey] || '';
	const merged = upsertCss(currentCss, css);

	if (!merged) return { [key]: next };

	const nextCategory = next[categoryKey] ? { ...next[categoryKey] } : {};
	nextCategory[indexKey] = merged;
	next[categoryKey] = nextCategory;
	return { [key]: next };
};

const mergeAdvancedCss = (attributes, css, breakpoint = 'general') => {
	if (!css) return null;
	const key = `advanced-css-${breakpoint}`;
	const existing = attributes?.[key];
	const trimmed = String(css).trim();
	if (!existing) return { [key]: trimmed };
	const existingTrimmed = String(existing).trim();
	if (existingTrimmed.includes(trimmed)) return { [key]: existingTrimmed };
	return { [key]: `${existingTrimmed}\n${trimmed}`.trim() };
};

const buildContextLoopAttributeChanges = (value = {}) => {
	if (!value || typeof value !== 'object') return null;

	const changes = {
		'cl-status': value.status === undefined ? true : Boolean(value.status),
		'cl-source': value.source,
		'cl-type': value.type,
		'cl-relation': value.relation,
		'cl-id': value.id,
		'cl-field': value.field,
		'cl-author': value.author,
		'cl-order-by': value.orderBy,
		'cl-order': value.order,
		'cl-pagination': value.pagination,
		'cl-limit-by-archive': value.limitByArchive,
		'cl-accumulator': value.accumulator,
		'cl-grandchild-accumulator': value.grandchildAccumulator,
		'cl-acf-group': value.acfGroup,
		'cl-acf-field-type': value.acfFieldType,
		'cl-acf-char-limit': value.acfCharLimit,
		'cl-pagination-show-page-list': value.showPageList,
		'cl-pagination-previous-text': value.previousText,
		'cl-pagination-next-text': value.nextText,
		'cl-pagination-total': value.paginationTotal,
		'cl-pagination-total-all': value.paginationTotalAll,
	};

	if (value.perPage !== undefined) {
		changes['cl-pagination-per-page'] = Number(value.perPage);
	}

	if (value.paginationPerPage !== undefined) {
		changes['cl-pagination-per-page'] = Number(value.paginationPerPage);
	}

	return Object.fromEntries(
		Object.entries(changes).filter(([, val]) => val !== undefined)
	);
};

const extractLoopPerPage = message =>
	extractNumericValue(message, [
		/(?:per\s*page|per\s*pages|per-page|perpage)\s*(?:to|=|:|is)?\s*(\d+(?:\.\d+)?)/i,
		/(\d+(?:\.\d+)?)\s*(?:posts?|items?|products?)\s*per\s*page/i,
	]);

const extractLoopType = message => {
	const lower = String(message || '').toLowerCase();
	if (/(woocommerce|products?|shop\s*items?)/.test(lower)) {
		return { type: 'product', perPage: 8 };
	}
	if (/(posts?|blog|articles?|news)/.test(lower)) {
		return { type: 'post', perPage: 6 };
	}

	if (/(portfolio|case\s*stud(?:y|ies)|projects?)/.test(lower)) {
		return { type: 'portfolio' };
	}

	if (/(custom\s*post\s*type|post\s*type|cpt)/.test(lower)) {
		const quoted = extractQuotedText(message);
		if (quoted) return { type: quoted };
		const match = message.match(
			/(?:custom\s*post\s*type|post\s*type)\s*(?:to|=|:|is)?\s*([a-z0-9_-]+)/i
		);
		if (match && match[1]) return { type: match[1] };
		return { type: 'custom_post_type' };
	}

	return null;
};

const extractLoopStatus = message => {
	const lower = String(message || '').toLowerCase();
	if (!/(loop|query|context\s*loop|dynamic\s*content)/.test(lower)) return null;
	if (/(disable|stop|remove|turn\s*off)/.test(lower)) return false;
	if (/(enable|start|turn\s*on|activate)/.test(lower)) return true;
	return null;
};

const extractLoopRelation = message => {
	const lower = String(message || '').toLowerCase();
	if (/related/.test(lower)) return 'related';
	return null;
};

const extractLoopOrder = message => {
	const lower = String(message || '').toLowerCase();
	if (/newest|latest|recent/.test(lower)) {
		return { orderBy: 'date', order: 'desc' };
	}
	if (/oldest/.test(lower)) {
		return { orderBy: 'date', order: 'asc' };
	}
	if (/random|shuffle/.test(lower)) {
		return { orderBy: 'rand', order: 'desc' };
	}
	if (/\b(a\s*-\s*z|a\s*to\s*z|alphabetical)\b/.test(lower)) {
		return { orderBy: 'title', order: 'asc' };
	}
	if (/\b(z\s*-\s*a|z\s*to\s*a)\b/.test(lower)) {
		return { orderBy: 'title', order: 'desc' };
	}
	return null;
};

const extractPaginationStatus = message => {
	const lower = String(message || '').toLowerCase();
	if (!lower.includes('pagination')) return null;
	if (/(remove|disable|hide|turn\s*off)/.test(lower)) return false;
	if (/(add|enable|show|turn\s*on)/.test(lower)) return true;
	return null;
};

const extractPaginationPageList = message => {
	const lower = String(message || '').toLowerCase();
	if (!lower.includes('pagination') && !lower.includes('page')) return null;
	if (/load\s*more|infinite/.test(lower)) return false;
	if (/page\s*numbers?|numbers?\s*only/.test(lower)) return true;
	return null;
};

const extractPaginationType = message => {
	const lower = String(message || '').toLowerCase();
	if (!/(pagination|page\s*numbers?|load\s*more|infinite|prev|next)/.test(lower)) {
		return null;
	}
	if (/load\s*more|infinite/.test(lower)) return 'load_more';
	if (/page\s*numbers?|numbers?\s*only/.test(lower)) return 'numbers';
	if (/prev(?:ious)?\s*\/\s*next|prev(?:ious)?\s*and\s*next|prev(?:ious)?\s*next/.test(lower)) {
		return 'simple';
	}
	return null;
};

const extractLoadMoreLabel = message => {
	if (!message) return null;
	if (!/load\s*more/i.test(message)) return null;
	return extractValueFromPatterns(message, [
		/(?:load\s*more)\s*(?:text|label)\s*(?:to|=|:|is)?\s*["']?([^"']+)["']?/i,
	]);
};

const extractPaginationStyle = message => {
	const lower = String(message || '').toLowerCase();
	if (!lower.includes('pagination') && !lower.includes('page numbers')) return null;
	if (/(pill|pills|capsule|rounded)/.test(lower)) return 'pills';
	if (/(button|buttons|boxed|box|square)/.test(lower)) return 'boxed';
	if (/(minimal|simple|text\s*links?)/.test(lower)) return 'minimal';
	return null;
};

const extractPaginationSpacing = message =>
	extractValueFromPatterns(message, [
		/(?:pagination|page\s*numbers?).*?(?:gap|spacing|space)\s*(?:to|=|:|is)?\s*(\d+(?:\.\d+)?\s*(?:px|%|em|rem|vh|vw|ch)?)/i,
		/(?:gap|spacing)\s*(?:between|for)\s*(?:pagination|page\s*numbers?)\s*(?:to|=|:|is)?\s*(\d+(?:\.\d+)?\s*(?:px|%|em|rem|vh|vw|ch)?)/i,
		/\bspace\s*out\s*(?:the\s*)?(?:pagination|page\s*numbers?)\s*(?:to|=|:|is)?\s*(\d+(?:\.\d+)?\s*(?:px|%|em|rem|vh|vw|ch)?)/i,
	]);

const extractPaginationText = message => {
	const lower = String(message || '').toLowerCase();
	if (!lower.includes('pagination') && !lower.includes('page')) return null;

	const prev = extractValueFromPatterns(message, [
		/(?:previous|prev)\s*(?:text|label)\s*(?:to|=|:|is)?\s*["']?([^"']+)["']?/i,
	]);
	const next = extractValueFromPatterns(message, [
		/(?:next)\s*(?:text|label)\s*(?:to|=|:|is)?\s*["']?([^"']+)["']?/i,
	]);

	if (!prev && !next) return null;

	return {
		...(prev ? { previousText: prev } : {}),
		...(next ? { nextText: next } : {}),
	};
};

const extractAuthorFilter = message => {
	const lower = String(message || '').toLowerCase();
	if (!/(author)/.test(lower)) return null;
	if (!/(filter|by|from|only|show).*(author)/.test(lower) && !/author\s*id/i.test(lower)) {
		return null;
	}

	const authorId = extractNumericValue(message, [
		/author\s*id\s*(?:to|=|:|is)?\s*(\d+)/i,
		/author\s*(?:to|=|:|is)?\s*(\d+)/i,
	]);

	const isCurrent = /current\s*author/i.test(lower);
	return {
		relation: 'by-author',
		...(authorId !== null ? { author: authorId } : isCurrent ? { author: 'current' } : {}),
	};
};

const extractIdFilter = message => {
	const lower = String(message || '').toLowerCase();
	if (!/(id|ids|specific\s*posts?|specific\s*pages?)/.test(lower)) return null;

	const ids = extractNumericList(message, [
		/(?:ids?|posts?)\s*(?:to|=|:|is)?\s*([0-9,\s]+)/i,
		/(?:include|only)\s*(?:ids?|posts?)\s*(?:to|=|:|is)?\s*([0-9,\s]+)/i,
		/(?:specific)\s*(?:posts?|pages?)\s*(?:to|=|:|is)?\s*([0-9,\s]+)/i,
	]);
	if (!ids.length) return null;
	return { relation: 'by-id', id: ids[0] };
};

const buildPaginationSpacingChanges = value => {
	const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
	const parsed = parseUnitValue(rawValue, 'px');
	const breakpoints = breakpoint ? [breakpoint] : RESPONSIVE_BREAKPOINTS;
	const changes = {};
	breakpoints.forEach(bp => {
		changes[`cl-pagination-column-gap-${bp}`] = parsed.value;
		changes[`cl-pagination-column-gap-unit-${bp}`] = parsed.unit;
	});
	return changes;
};

const buildPaginationStyleChanges = (preset, attributes) => {
	const style = String(preset || '').toLowerCase();
	const base = {
		'cl-pagination': true,
		'cl-pagination-show-page-list': true,
		'cl-pagination-font-weight-general': '600',
		'cl-pagination-font-size-general': 14,
		'cl-pagination-font-size-unit-general': 'px',
		'cl-pagination-text-decoration-general': 'none',
		'cl-pagination-align-items-general': 'center',
		'cl-pagination-justify-content-general': 'center',
		'cl-pagination-column-gap-general': 10,
		'cl-pagination-column-gap-unit-general': 'px',
		'cl-pagination-row-gap-general': 0,
		'cl-pagination-row-gap-unit-general': 'px',
		'cl-pagination-link-hover-palette-status': true,
		'cl-pagination-link-hover-palette-color': 3,
		'cl-pagination-link-hover-palette-opacity': 100,
		'cl-pagination-link-hover-palette-sc-status': false,
		'cl-pagination-link-current-palette-status': true,
		'cl-pagination-link-current-palette-color': 5,
		'cl-pagination-link-current-palette-opacity': 100,
		'cl-pagination-link-current-palette-sc-status': false,
	};

	let advancedCss = '';

	if (style === 'boxed') {
		base['cl-pagination-column-gap-general'] = 12;
		advancedCss = [
			'.maxi-pagination a { padding: 8px 14px; border: 1px solid var(--p); border-radius: 6px; text-decoration: none; }',
			'.maxi-pagination a:hover { background: var(--bg-2); }',
			'.maxi-pagination .maxi-pagination__link--current { background: var(--highlight); color: var(--bg-1); border-color: var(--highlight); }',
		].join('\n');
	} else if (style === 'pills') {
		base['cl-pagination-column-gap-general'] = 14;
		advancedCss = [
			'.maxi-pagination a { padding: 8px 16px; border: 1px solid var(--p); border-radius: 999px; text-decoration: none; }',
			'.maxi-pagination a:hover { background: var(--bg-2); }',
			'.maxi-pagination .maxi-pagination__link--current { background: var(--highlight); color: var(--bg-1); border-color: var(--highlight); }',
		].join('\n');
	} else {
		// Minimal
		base['cl-pagination-column-gap-general'] = 10;
		base['cl-pagination-font-weight-general'] = '500';
		base['cl-pagination-link-hover-palette-color'] = 4;
		base['cl-pagination-link-current-palette-color'] = 5;
	}

	const changes = { ...base };

	if (advancedCss) {
		const advancedChanges = mergeAdvancedCss(attributes, advancedCss, 'general');
		if (advancedChanges) Object.assign(changes, advancedChanges);
	}

	return changes;
};

const buildPaginationTypeChanges = (type, options = {}) => {
	const normalized = String(type || '').toLowerCase();
	const loadMoreLabel = options.label || 'Load More';

	switch (normalized) {
		case 'load_more':
		case 'load-more':
		case 'load more':
			return {
				'cl-pagination': true,
				'cl-pagination-show-page-list': false,
				'cl-pagination-previous-text': '',
				'cl-pagination-next-text': loadMoreLabel,
			};
		case 'simple':
		case 'prev_next':
		case 'prev-next':
			return {
				'cl-pagination': true,
				'cl-pagination-show-page-list': false,
				'cl-pagination-previous-text': 'Previous',
				'cl-pagination-next-text': 'Next',
			};
		case 'numbers':
		default:
			return {
				'cl-pagination': true,
				'cl-pagination-show-page-list': true,
				'cl-pagination-previous-text': 'Previous',
				'cl-pagination-next-text': 'Next',
			};
	}
};

const buildPaginationLoadMoreLabelChanges = label =>
	buildPaginationTypeChanges('load_more', { label });

const buildColumnGapChanges = value => {
	const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
	const parsed = parseUnitValue(rawValue, 'px');
	const breakpoints = breakpoint ? [breakpoint] : RESPONSIVE_BREAKPOINTS;
	const changes = {};
	breakpoints.forEach(bp => {
		changes[`column-gap-${bp}`] = parsed.value;
		changes[`column-gap-unit-${bp}`] = parsed.unit;
	});
	return changes;
};

const buildCustomLabelChanges = value => {
	const label = typeof value === 'string' ? value : String(value ?? '');
	return { customLabel: label };
};

const buildCustomCssChanges = (value, attributes) => {
	const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
	const config =
		rawValue && typeof rawValue === 'object' && !Array.isArray(rawValue)
			? rawValue
			: { css: rawValue };

	const css = normalizeCss(config.css || config.value || '');
	if (!css || /[{}]/.test(css)) return null;

	const category = config.category || 'container';
	const index = config.index || 'normal';
	const bp = config.breakpoint || breakpoint || 'general';

	return mergeCustomCss(attributes, { css, category, index, breakpoint: bp });
};

const buildClAttributeChanges = value => {
	if (!value || typeof value !== 'object') return null;
	const changes = {};

	if (value.key && value.value !== undefined) {
		const normalizedKey = String(value.key).replace(/_/g, '-');
		changes[normalizedKey] = value.value;
	} else {
		Object.entries(value).forEach(([key, val]) => {
			if (!key) return;
			const normalizedKey = String(key).replace(/_/g, '-');
			if (!normalizedKey.startsWith('cl-')) return;
			changes[normalizedKey] = val;
		});
	}

	return Object.keys(changes).length ? changes : null;
};

const buildContainerCGroupAction = (message, { scope = 'selection' } = {}) => {
	const actionType = scope === 'page' ? 'update_page' : 'update_selection';
	const actionTarget =
		actionType === 'update_page' ? { target_block: 'container' } : {};
	const hasExplicitLoopIntent = /(loop|query|context\s*loop|dynamic\s*content)/i.test(
		message || ''
	);

	const quotedLabel = extractQuotedText(message);
	const labelMatch =
		quotedLabel ||
		extractValueFromPatterns(message, [
			/(?:custom\s*label|block\s*label|rename\s*(?:this)?\s*container)\s*(?:to|=|:|is)?\s*["']?([^"']+)["']?/i,
		]);
	if (labelMatch && /(label|rename|named)/i.test(message || '')) {
		return {
			action: actionType,
			property: 'custom_label',
			value: labelMatch,
			message: 'Custom label updated.',
			...actionTarget,
		};
	}

	const paginationStyle = extractPaginationStyle(message);
	if (paginationStyle) {
		return {
			action: actionType,
			property: 'pagination_style',
			value: paginationStyle,
			message: 'Pagination style updated.',
			...actionTarget,
		};
	}

	let paginationLoadMoreLabel = extractLoadMoreLabel(message);
	if (paginationLoadMoreLabel && !hasExplicitLoopIntent) {
		return {
			action: actionType,
			property: 'pagination_load_more_label',
			value: paginationLoadMoreLabel,
			message: 'Pagination load more label updated.',
			...actionTarget,
		};
	}

	const paginationSpacing = extractPaginationSpacing(message);
	if (paginationSpacing) {
		return {
			action: actionType,
			property: 'pagination_spacing',
			value: paginationSpacing,
			message: 'Pagination spacing updated.',
			...actionTarget,
		};
	}

	const paginationText = extractPaginationText(message);
	if (paginationText) {
		return {
			action: actionType,
			property: 'pagination_text',
			value: paginationText,
			message: 'Pagination labels updated.',
			...actionTarget,
		};
	}

	const loopStatus = extractLoopStatus(message);
	const loopType = extractLoopType(message);
	const loopOrder = extractLoopOrder(message);
	const loopRelation = extractLoopRelation(message);
	const authorFilter = extractAuthorFilter(message);
	const idFilter = extractIdFilter(message);
	const perPage = extractLoopPerPage(message);
	const paginationStatus = extractPaginationStatus(message);
	const paginationShowPages = extractPaginationPageList(message);
	const paginationType = extractPaginationType(message);
	if (!paginationLoadMoreLabel) {
		paginationLoadMoreLabel = extractLoadMoreLabel(message);
	}

	const contextLoop = {};
	if (loopStatus !== null) contextLoop.status = loopStatus;
	if (loopType) {
		contextLoop.type = loopType.type;
		if (loopType.perPage && perPage === null) {
			contextLoop.perPage = loopType.perPage;
		}
	}
	if (perPage !== null) contextLoop.perPage = perPage;
	if (loopOrder) {
		contextLoop.orderBy = loopOrder.orderBy;
		contextLoop.order = loopOrder.order;
	}
	if (loopRelation) contextLoop.relation = loopRelation;
	if (authorFilter) {
		contextLoop.relation = authorFilter.relation;
		if (authorFilter.author !== undefined) {
			contextLoop.author = authorFilter.author;
		}
	}
	if (idFilter) {
		contextLoop.relation = idFilter.relation;
		contextLoop.id = idFilter.id;
	}

	const hasLoopIntent = Object.keys(contextLoop).length > 0;
	if (hasLoopIntent) {
		if (paginationStatus !== null) contextLoop.pagination = paginationStatus;
		if (paginationShowPages !== null)
			contextLoop.showPageList = paginationShowPages;
		if (paginationType) {
			const paginationTypeChanges = buildPaginationTypeChanges(paginationType);
			if ('cl-pagination-show-page-list' in paginationTypeChanges) {
				contextLoop.showPageList = paginationTypeChanges['cl-pagination-show-page-list'];
			}
			if ('cl-pagination-previous-text' in paginationTypeChanges) {
				contextLoop.previousText = paginationTypeChanges['cl-pagination-previous-text'];
			}
			if ('cl-pagination-next-text' in paginationTypeChanges) {
				contextLoop.nextText = paginationTypeChanges['cl-pagination-next-text'];
			}
			contextLoop.pagination = true;
		}
		if (paginationLoadMoreLabel) {
			contextLoop.showPageList = false;
			contextLoop.previousText = '';
			contextLoop.nextText = paginationLoadMoreLabel;
			contextLoop.pagination = true;
		}
		return {
			action: actionType,
			property: 'context_loop',
			value: contextLoop,
			message: 'Context loop updated.',
			...actionTarget,
		};
	}

	if (paginationLoadMoreLabel) {
		return {
			action: actionType,
			property: 'pagination_load_more_label',
			value: paginationLoadMoreLabel,
			message: 'Pagination load more label updated.',
			...actionTarget,
		};
	}

	if (paginationType) {
		return {
			action: actionType,
			property: 'pagination_type',
			value: paginationType,
			message: 'Pagination type updated.',
			...actionTarget,
		};
	}

	if (paginationShowPages !== null) {
		return {
			action: actionType,
			property: 'pagination_show_pages',
			value: paginationShowPages,
			message: 'Pagination page list updated.',
			...actionTarget,
		};
	}

	if (paginationStatus !== null) {
		return {
			action: actionType,
			property: 'pagination',
			value: paginationStatus,
			message: paginationStatus ? 'Pagination enabled.' : 'Pagination disabled.',
			...actionTarget,
		};
	}

	return null;
};

const buildContainerCGroupAttributeChanges = (
	property,
	value,
	{ attributes } = {}
) => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');

	if (
		normalized.startsWith('cl_') &&
		![
			'cl_attributes',
			'cl_attribute',
			'context_loop_attributes',
			'context_loop_attribute',
		].includes(normalized)
	) {
		const key = normalized.replace(/_/g, '-');
		return { [key]: value };
	}

	switch (normalized) {
		case 'context_loop':
			return buildContextLoopAttributeChanges(value);
		case 'pagination':
			return { 'cl-pagination': Boolean(value) };
		case 'pagination_type':
			return buildPaginationTypeChanges(value);
		case 'pagination_load_more_label':
			return buildPaginationLoadMoreLabelChanges(value);
		case 'pagination_show_pages':
			return { 'cl-pagination-show-page-list': Boolean(value) };
		case 'pagination_text': {
			const textValue = value && typeof value === 'object' ? value : {};
			return Object.fromEntries(
				Object.entries({
					'cl-pagination-previous-text': textValue.previousText || textValue.previous,
					'cl-pagination-next-text': textValue.nextText || textValue.next,
				}).filter(([, val]) => val !== undefined)
			);
		}
		case 'pagination_spacing':
			return buildPaginationSpacingChanges(value);
		case 'pagination_style':
			return buildPaginationStyleChanges(value, attributes);
		case 'column_gap':
			return buildColumnGapChanges(value);
		case 'custom_label':
			return buildCustomLabelChanges(value);
		case 'custom_css':
			return buildCustomCssChanges(value, attributes);
		case 'cl_attributes':
		case 'cl_attribute':
		case 'context_loop_attributes':
		case 'context_loop_attribute':
			return buildClAttributeChanges(value);
		default:
			return null;
	}
};

const getContainerCGroupSidebarTarget = property => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');

	if (
		normalized === 'context_loop' ||
		normalized === 'pagination' ||
		normalized === 'pagination_type' ||
		normalized === 'pagination_load_more_label' ||
		normalized === 'pagination_style' ||
		normalized === 'pagination_spacing' ||
		normalized === 'pagination_text' ||
		normalized === 'pagination_show_pages' ||
		normalized === 'cl_attributes' ||
		normalized.startsWith('cl_')
	) {
		return { tabIndex: 0, accordion: 'context loop' };
	}

	if (normalized === 'column_gap') {
		return { tabIndex: 1, accordion: 'flexbox' };
	}

	if (normalized === 'custom_css') {
		return { tabIndex: 1, accordion: 'custom css' };
	}

	if (normalized === 'custom_label') {
		return { tabIndex: 0, accordion: 'block settings' };
	}

	return null;
};

return {
	buildContainerCGroupAction,
	buildContainerCGroupAttributeChanges,
	getContainerCGroupSidebarTarget,
};
})();

export const {
	buildContainerCGroupAction,
	buildContainerCGroupAttributeChanges,
	getContainerCGroupSidebarTarget,
} = containerCGroup;

// containerDGroup
const containerDGroup = (() => {
const normalizeValueWithBreakpoint = rawValue => {
	if (
		rawValue &&
		typeof rawValue === 'object' &&
		!Array.isArray(rawValue) &&
		Object.prototype.hasOwnProperty.call(rawValue, 'value')
	) {
		return {
			value: rawValue.value,
			breakpoint: rawValue.breakpoint || null,
		};
	}

	return { value: rawValue, breakpoint: null };
};

const extractDisplayValue = message => {
	const lower = String(message || '').toLowerCase();

	if (/(?:display\s*(?:to|:)?\s*none|hide|invisible|disappear)/.test(lower)) {
		return 'none';
	}
	if (/display\s*(?:to|:)?\s*block/.test(lower)) return 'block';
	if (/display\s*(?:to|:)?\s*grid/.test(lower)) return 'grid';
	if (/display\s*(?:to|:)?\s*inline-block/.test(lower)) return 'inline-block';
	if (/display\s*(?:to|:)?\s*inline/.test(lower)) return 'inline';
	if (/(?:display\s*(?:to|:)?\s*flex|show|visible|unhide)/.test(lower)) {
		return 'flex';
	}

	return null;
};

const buildDisplayChanges = value => {
	const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
	if (breakpoint) {
		return { [`display-${breakpoint}`]: rawValue };
	}
	return { 'display-general': rawValue };
};

const buildContainerDGroupAction = (message, { scope = 'selection' } = {}) => {
	const displayValue = extractDisplayValue(message);
	if (!displayValue) return null;

	const actionType = scope === 'page' ? 'update_page' : 'update_selection';
	const actionTarget =
		actionType === 'update_page' ? { target_block: 'container' } : {};

	return {
		action: actionType,
		property: 'display',
		value: displayValue,
		message: `Display set to ${displayValue}.`,
		...actionTarget,
	};
};

const buildContainerDGroupAttributeChanges = (property, value) => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');
	if (normalized !== 'display') return null;

	return buildDisplayChanges(value);
};

const getContainerDGroupSidebarTarget = property => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');
	if (normalized === 'display') {
		return { tabIndex: 1, accordion: 'flexbox' };
	}
	return null;
};

return {
	buildContainerDGroupAction,
	buildContainerDGroupAttributeChanges,
	getContainerDGroupSidebarTarget,
};
})();

export const {
	buildContainerDGroupAction,
	buildContainerDGroupAttributeChanges,
	getContainerDGroupSidebarTarget,
} = containerDGroup;

// containerEGroup
const containerEGroup = (() => {
const extractQuotedText = message => {
	if (!message) return null;
	const match = message.match(/["']([^"']+)["']/);
	return match ? match[1].trim() : null;
};

const extractClassNames = message => {
	const lower = String(message || '').toLowerCase();
	if (!/(class|classes)/.test(lower)) return null;

	if (/remove\s*(all\s*)?(custom\s*)?classes?|clear\s*(custom\s*)?classes?/i.test(message)) {
		return '';
	}

	const quoted = extractQuotedText(message);
	if (quoted) return quoted;

	const match = message.match(
		/(?:css\s*classes?|custom\s*classes?|extra\s*classes?|class(?:es)?)\s*(?:to|:|=|is)?\s*([a-z0-9_\-\s]+)/i
	);
	if (match && match[1]) return match[1].trim();

	return null;
};

const buildContainerEGroupAction = (message, { scope = 'selection' } = {}) => {
	const classNames = extractClassNames(message);
	if (classNames === null) return null;

	const actionType = scope === 'page' ? 'update_page' : 'update_selection';
	const actionTarget =
		actionType === 'update_page' ? { target_block: 'container' } : {};

	return {
		action: actionType,
		property: 'extra_class_name',
		value: classNames,
		message: 'Custom classes updated.',
		...actionTarget,
	};
};

const buildContainerEGroupAttributeChanges = (property, value) => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');
	if (!['extra_class_name', 'extra_class', 'extra_classname', 'extraClassName'].includes(normalized)) {
		return null;
	}

	return { extraClassName: value };
};

const getContainerEGroupSidebarTarget = property => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');
	if (normalized === 'extra_class_name' || normalized === 'extra_class') {
		return { tabIndex: 1, accordion: 'add css classes' };
	}
	return null;
};

return {
	buildContainerEGroupAction,
	buildContainerEGroupAttributeChanges,
	getContainerEGroupSidebarTarget,
};
})();

export const {
	buildContainerEGroupAction,
	buildContainerEGroupAttributeChanges,
	getContainerEGroupSidebarTarget,
} = containerEGroup;

// containerFGroup
const containerFGroup = (() => {
const RESPONSIVE_BREAKPOINTS = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const normalizeValueWithBreakpoint = rawValue => {
	if (
		rawValue &&
		typeof rawValue === 'object' &&
		!Array.isArray(rawValue) &&
		Object.prototype.hasOwnProperty.call(rawValue, 'value')
	) {
		return {
			value: rawValue.value,
			unit: rawValue.unit,
			breakpoint: rawValue.breakpoint || null,
		};
	}

	return { value: rawValue, unit: null, breakpoint: null };
};

const parseUnitValue = rawValue => {
	if (rawValue === null || rawValue === undefined) {
		return { value: '0', unit: 'px' };
	}

	if (typeof rawValue === 'number') {
		return { value: String(rawValue), unit: 'px' };
	}

	const raw = String(rawValue).trim();
	if (!raw) return { value: '0', unit: 'px' };

	const match = raw.match(/^(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?$/i);
	if (match) {
		return { value: String(Number(match[1])), unit: match[2] || 'px' };
	}

	return { value: raw, unit: null };
};

const buildBreakpointChanges = (key, value, breakpoint) => {
	if (breakpoint) return { [`${key}-${breakpoint}`]: value };
	return { [`${key}-general`]: value };
};

const buildFlexBasisChanges = rawValue => {
	const { value, unit, breakpoint } = normalizeValueWithBreakpoint(rawValue);
	const parsed = parseUnitValue(value);
	const changes = buildBreakpointChanges('flex-basis', parsed.value, breakpoint);
	if (parsed.unit) {
		Object.assign(
			changes,
			buildBreakpointChanges('flex-basis-unit', parsed.unit, breakpoint)
		);
	}
	return changes;
};

const buildFlexGrowChanges = rawValue => {
	const { value, breakpoint } = normalizeValueWithBreakpoint(rawValue);
	return buildBreakpointChanges('flex-grow', Number(value), breakpoint);
};

const buildFlexShrinkChanges = rawValue => {
	const { value, breakpoint } = normalizeValueWithBreakpoint(rawValue);
	return buildBreakpointChanges('flex-shrink', Number(value), breakpoint);
};

const buildFlexDirectionChanges = rawValue => {
	const { value, breakpoint } = normalizeValueWithBreakpoint(rawValue);
	return buildBreakpointChanges('flex-direction', value, breakpoint);
};

const buildFlexWrapChanges = rawValue => {
	const { value, breakpoint } = normalizeValueWithBreakpoint(rawValue);
	return buildBreakpointChanges('flex-wrap', value, breakpoint);
};

const buildForceAspectRatioChanges = rawValue => {
	const { value, breakpoint } = normalizeValueWithBreakpoint(rawValue);
	return buildBreakpointChanges('force-aspect-ratio', Boolean(value), breakpoint);
};

const buildFullWidthChanges = rawValue => {
	const { value, breakpoint } = normalizeValueWithBreakpoint(rawValue);
	return buildBreakpointChanges('full-width', Boolean(value), breakpoint);
};

const extractFlexBasis = message => {
	const match = String(message || '').match(
		/(?:flex\s*basis|flex-basis)\s*(?:to|:|=|is)?\s*([0-9.\-]+(?:px|%|em|rem|vh|vw|ch)?)/i
	);
	return match ? match[1].trim() : null;
};

const extractFlexNumber = (message, label) => {
	const match = String(message || '').match(
		new RegExp(`(?:${label})\\s*(?:to|:|=|is)?\\s*([0-9.\\-]+)`, 'i')
	);
	return match ? Number(match[1]) : null;
};

const extractFlexDirection = message => {
	const lower = String(message || '').toLowerCase();
	if (!lower.includes('flex')) return null;
	if (/row-reverse/.test(lower)) return 'row-reverse';
	if (/column-reverse/.test(lower)) return 'column-reverse';
	if (/row|horizontal/.test(lower)) return 'row';
	if (/column|vertical/.test(lower)) return 'column';
	return null;
};

const extractFlexWrap = message => {
	const lower = String(message || '').toLowerCase();
	if (!lower.includes('wrap') && !lower.includes('flex')) return null;
	if (/wrap-reverse/.test(lower)) return 'wrap-reverse';
	if (/no\s*wrap|nowrap|single\s*line/.test(lower)) return 'nowrap';
	if (/wrap|multi\s*line|next\s*line/.test(lower)) return 'wrap';
	return null;
};

const extractForceAspectRatio = message => {
	const lower = String(message || '').toLowerCase();
	if (!/aspect\s*ratio/.test(lower)) return null;
	if (/disable|turn\s*off|unlock/.test(lower)) return false;
	if (/force|lock|keep|maintain/.test(lower)) return true;
	return null;
};

const extractFullWidth = message => {
	const lower = String(message || '').toLowerCase();
	if (/full\s*width|edge\s*to\s*edge|100%/.test(lower)) return true;
	return null;
};

const buildContainerFGroupAction = (message, { scope = 'selection' } = {}) => {
	const actionType = scope === 'page' ? 'update_page' : 'update_selection';
	const actionTarget = actionType === 'update_page' ? { target_block: 'container' } : {};

	const flexBasis = extractFlexBasis(message);
	if (flexBasis) {
		return {
			action: actionType,
			property: 'flex_basis',
			value: flexBasis,
			message: 'Flex basis updated.',
			...actionTarget,
		};
	}

	const flexGrow = extractFlexNumber(message, 'flex\\s*grow|flex-grow');
	if (flexGrow !== null) {
		return {
			action: actionType,
			property: 'flex_grow',
			value: flexGrow,
			message: 'Flex grow updated.',
			...actionTarget,
		};
	}

	const flexShrink = extractFlexNumber(message, 'flex\\s*shrink|flex-shrink');
	if (flexShrink !== null) {
		return {
			action: actionType,
			property: 'flex_shrink',
			value: flexShrink,
			message: 'Flex shrink updated.',
			...actionTarget,
		};
	}

	const flexDirection = extractFlexDirection(message);
	if (flexDirection) {
		return {
			action: actionType,
			property: 'flex_direction',
			value: flexDirection,
			message: 'Flex direction updated.',
			...actionTarget,
		};
	}

	const flexWrap = extractFlexWrap(message);
	if (flexWrap) {
		return {
			action: actionType,
			property: 'flex_wrap',
			value: flexWrap,
			message: 'Flex wrap updated.',
			...actionTarget,
		};
	}

	const forceAspect = extractForceAspectRatio(message);
	if (forceAspect !== null) {
		return {
			action: actionType,
			property: 'force_aspect_ratio',
			value: forceAspect,
			message: 'Aspect ratio updated.',
			...actionTarget,
		};
	}

	const fullWidth = extractFullWidth(message);
	if (fullWidth !== null) {
		return {
			action: actionType,
			property: 'full_width',
			value: fullWidth,
			message: 'Full width updated.',
			...actionTarget,
		};
	}

	return null;
};

const buildContainerFGroupAttributeChanges = (property, value) => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');

	switch (normalized) {
		case 'flex_basis':
			return buildFlexBasisChanges(value);
		case 'flex_grow':
			return buildFlexGrowChanges(value);
		case 'flex_shrink':
			return buildFlexShrinkChanges(value);
		case 'flex_direction':
			return buildFlexDirectionChanges(value);
		case 'flex_wrap':
			return buildFlexWrapChanges(value);
		case 'force_aspect_ratio':
			return buildForceAspectRatioChanges(value);
		case 'full_width':
			return buildFullWidthChanges(value);
		default:
			return null;
	}
};

const getContainerFGroupSidebarTarget = property => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');
	if (
		[
			'flex_basis',
			'flex_grow',
			'flex_shrink',
			'flex_direction',
			'flex_wrap',
			'force_aspect_ratio',
			'full_width',
		].includes(normalized)
	) {
		return { tabIndex: 1, accordion: 'flexbox' };
	}
	return null;
};

return {
	buildContainerFGroupAction,
	buildContainerFGroupAttributeChanges,
	getContainerFGroupSidebarTarget,
};
})();

export const {
	buildContainerFGroupAction,
	buildContainerFGroupAttributeChanges,
	getContainerFGroupSidebarTarget,
} = containerFGroup;

// containerHGroup
const containerHGroup = (() => {
const BREAKPOINT_ALIASES = {
	desktop: 'xl',
	tablet: 'm',
	mobile: 'xs',
	phone: 'xs',
};

const normalizeValueWithBreakpoint = rawValue => {
	if (
		rawValue &&
		typeof rawValue === 'object' &&
		!Array.isArray(rawValue) &&
		Object.prototype.hasOwnProperty.call(rawValue, 'value')
	) {
		return {
			value: rawValue.value,
			unit: rawValue.unit,
			breakpoint: rawValue.breakpoint || null,
		};
	}

	return { value: rawValue, unit: null, breakpoint: null };
};

const parseUnitValue = rawValue => {
	if (rawValue === null || rawValue === undefined) {
		return { value: 0, unit: 'px' };
	}

	if (typeof rawValue === 'number') {
		return { value: rawValue, unit: 'px' };
	}

	if (typeof rawValue === 'object') {
		const size = rawValue.value ?? rawValue.size ?? rawValue.amount ?? rawValue.height;
		const unit = rawValue.unit || 'px';
		return { value: Number(size) || 0, unit };
	}

	const raw = String(rawValue).trim();
	const match = raw.match(/^(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?$/i);
	if (match) {
		return { value: Number(match[1]), unit: match[2] || 'px' };
	}

	const parsed = Number.parseFloat(raw);
	return { value: Number.isNaN(parsed) ? 0 : parsed, unit: 'px' };
};

const detectBreakpoint = message => {
	const lower = String(message || '').toLowerCase();
	for (const [alias, bp] of Object.entries(BREAKPOINT_ALIASES)) {
		if (lower.includes(alias)) return bp;
	}
	const match = lower.match(/\b(xx?l|xl|l|m|s|xs)\b/);
	return match ? match[1] : null;
};

const extractHeightValue = message => {
	const lower = String(message || '').toLowerCase();
	if (/\bmax[-\s_]*height\b/.test(lower) || /\bmin[-\s_]*height\b/.test(lower)) {
		return null;
	}
	const match = lower.match(
		/(?:height|tall)\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)(?:\s*(px|%|vh|vw|em|rem|ch))?/i
	);
	if (!match) return null;
	return {
		value: Number(match[1]),
		unit: match[2] || 'px',
	};
};

const buildContainerHGroupAction = (message, { scope = 'selection' } = {}) => {
	const heightValue = extractHeightValue(message);
	if (!heightValue) return null;

	const breakpoint = detectBreakpoint(message);
	const actionType = scope === 'page' ? 'update_page' : 'update_selection';
	const actionTarget = actionType === 'update_page' ? { target_block: 'container' } : {};

	return {
		action: actionType,
		property: 'height',
		value: { ...heightValue, ...(breakpoint ? { breakpoint } : {}) },
		message: 'Height updated.',
		...actionTarget,
	};
};

const buildContainerHGroupAttributeChanges = (property, value) => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');
	if (normalized !== 'height') return null;

	const { value: rawValue, unit, breakpoint } = normalizeValueWithBreakpoint(value);
	if (!breakpoint) return null;

	const parsed = parseUnitValue({ value: rawValue, unit });
	const changes = {
		[`height-${breakpoint}`]: parsed.value,
		[`height-unit-${breakpoint}`]: parsed.unit,
	};
	return changes;
};

const getContainerHGroupSidebarTarget = property => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');
	if (normalized === 'height') {
		return { tabIndex: 0, accordion: 'height / width' };
	}
	return null;
};

return {
	buildContainerHGroupAction,
	buildContainerHGroupAttributeChanges,
	getContainerHGroupSidebarTarget,
};
})();

export const {
	buildContainerHGroupAction,
	buildContainerHGroupAttributeChanges,
	getContainerHGroupSidebarTarget,
} = containerHGroup;

// containerLGroup
const containerLGroup = (() => {
const extractQuotedText = message => {
	if (!message) return null;
	const match = message.match(/["']([^"']+)["']/);
	return match ? match[1].trim() : null;
};

const extractUrl = message => {
	if (!message) return null;
	const quoted = extractQuotedText(message);
	if (quoted && /https?:\/\//i.test(quoted)) return quoted;

	const match = String(message).match(
		/(https?:\/\/[^\s"']+|www\.[^\s"']+|[a-z0-9.-]+\.[a-z]{2,}(?:\/[^\s"']*)?)/i
	);
	return match ? match[1].replace(/[),.]*$/, '') : null;
};

const extractRelFlags = message => {
	const lower = String(message || '').toLowerCase();
	return {
		noFollow: /nofollow/.test(lower),
		sponsored: /sponsored/.test(lower),
		ugc: /\bugc\b/.test(lower),
	};
};

const shouldOpenInNewTab = message => /new\s*tab|_blank|external/i.test(message || '');

const shouldRemoveLink = message =>
	/remove\s*link|unlink|clear\s*link|disable\s*link/i.test(message || '');

const isLinkIntent = message =>
	/(link|clickable|make\s*clickable|card\s*link|link\s*card|link\s*box|link\s*section)/i.test(
		message || ''
	);

const isDynamicLinkIntent = message =>
	/(dynamic\s*link|current\s*post|post\s*url|link\s*to\s*post|link\s*to\s*current)/i.test(
		message || ''
	);

const buildContainerLGroupAction = (message, { scope = 'selection' } = {}) => {
	const url = extractUrl(message);
	const linkIntent = isLinkIntent(message);
	const dynamicIntent = isDynamicLinkIntent(message);
	const logDebug = (...args) => {
		if (typeof window !== 'undefined' && window.maxiBlocksDebug) {
			console.log('[Maxi AI Debug] L-group', ...args);
		}
	};
	logDebug('Input', { message, url, linkIntent, dynamicIntent, scope });
	if (!linkIntent && !dynamicIntent && !url) {
		logDebug('No link intent detected.');
		return null;
	}

	const actionType = scope === 'page' ? 'update_page' : 'update_selection';
	const actionTarget =
		actionType === 'update_page' ? { target_block: 'container' } : {};

	if (isDynamicLinkIntent(message)) {
		logDebug('Dynamic link intent detected.');
		return {
			action: actionType,
			property: 'dc_link',
			value: { status: true, target: 'entity' },
			message: 'Dynamic link enabled.',
			...actionTarget,
		};
	}

	if (shouldRemoveLink(message)) {
		logDebug('Remove link intent detected.');
		return {
			action: actionType,
			property: 'link_settings',
			value: { url: '', opensInNewTab: false },
			message: 'Link removed.',
			...actionTarget,
		};
	}

	const relFlags = extractRelFlags(message);
	const opensInNewTab = shouldOpenInNewTab(message);

	if (!url && !opensInNewTab && !relFlags.noFollow && !relFlags.sponsored && !relFlags.ugc) {
		logDebug('No actionable link settings detected.');
		return null;
	}

	const action = {
		action: actionType,
		property: 'link_settings',
		value: {
			...(url ? { url } : {}),
			opensInNewTab,
			...relFlags,
		},
		message: 'Link settings updated.',
		...actionTarget,
	};
	logDebug('Returning action', action);
	return action;
};

const buildContainerLGroupAttributeChanges = (
	property,
	value,
	{ attributes } = {}
) => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');

	if (normalized === 'link_settings') {
		const incoming = value && typeof value === 'object' ? value : { url: value };
		const existing = attributes?.linkSettings || {};
		const next = {
			...existing,
			...incoming,
		};
		if (incoming.target) {
			next.opensInNewTab = incoming.target === '_blank';
		}
		if (incoming.rel) {
			next.noFollow = /nofollow/.test(incoming.rel);
			next.sponsored = /sponsored/.test(incoming.rel);
			next.ugc = /\bugc\b/.test(incoming.rel);
		}
		if (next.noFollow === undefined) next.noFollow = false;
		if (next.sponsored === undefined) next.sponsored = false;
		if (next.ugc === undefined) next.ugc = false;
		return { linkSettings: next };
	}

	if (normalized === 'dc_link') {
		const payload = value && typeof value === 'object' ? value : {};
		return {
			'dc-link-status': payload.status ?? true,
			...(payload.target ? { 'dc-link-target': payload.target } : {}),
			...(payload.url ? { 'dc-link-url': payload.url } : {}),
		};
	}

	if (normalized === 'dc_link_status') {
		return { 'dc-link-status': Boolean(value) };
	}

	if (normalized === 'dc_link_target') {
		return { 'dc-link-target': value };
	}

	if (normalized === 'dc_link_url') {
		return { 'dc-link-url': value };
	}

	return null;
};

const getContainerLGroupSidebarTarget = property => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');
	if (normalized === 'link_settings' || normalized.startsWith('dc_link')) {
		return { tabIndex: 1, accordion: 'link' };
	}
	return null;
};

return {
	buildContainerLGroupAction,
	buildContainerLGroupAttributeChanges,
	getContainerLGroupSidebarTarget,
};
})();

export const {
	buildContainerLGroupAction,
	buildContainerLGroupAttributeChanges,
	getContainerLGroupSidebarTarget,
} = containerLGroup;

// containerMGroup
const containerMGroup = (() => {
const RESPONSIVE_BREAKPOINTS = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const BREAKPOINT_ALIASES = [
	{
		key: 'xxl',
		regex: /\bxxl\b|extra\s*wide|ultra\s*wide|wide\s*screen|wide\s*desktop/i,
	},
	{ key: 'xl', regex: /\bxl\b|desktop|large\s*screen/i },
	{ key: 'l', regex: /\bl\b|laptop|notebook/i },
	{ key: 'm', regex: /\bm\b|tablet|medium/i },
	{ key: 's', regex: /\bs\b|small/i },
	{ key: 'xs', regex: /\bxs\b|mobile|phone|handset/i },
	{
		key: 'general',
		regex: /\bgeneral\b|base\s*breakpoint|default\s*breakpoint/i,
	},
];

const extractValueFromPatterns = (message, patterns) => {
	if (!message) return null;
	for (const pattern of patterns) {
		const match = message.match(pattern);
		if (match && match[1]) return match[1].trim();
	}
	return null;
};

const extractUnitValue = (message, patterns) => {
	if (!message) return null;
	for (const pattern of patterns) {
		const match = message.match(pattern);
		if (match && match[1]) {
			const value = Number.parseFloat(match[1]);
			if (!Number.isFinite(value)) continue;
			return {
				value,
				unit: match[2] || 'px',
			};
		}
	}
	return null;
};

const extractBreakpointToken = message => {
	const lower = String(message || '').toLowerCase();
	for (const entry of BREAKPOINT_ALIASES) {
		if (entry.regex.test(lower)) return entry.key;
	}
	return null;
};

const normalizeValueWithBreakpoint = rawValue => {
	if (
		rawValue &&
		typeof rawValue === 'object' &&
		!Array.isArray(rawValue) &&
		Object.prototype.hasOwnProperty.call(rawValue, 'value')
	) {
		return {
			value: rawValue.value,
			unit: rawValue.unit,
			breakpoint: rawValue.breakpoint || null,
		};
	}

	return { value: rawValue, unit: null, breakpoint: null };
};

const getResponsiveScaleFactor = breakpoint => {
	if (breakpoint === 'm' || breakpoint === 's') return 0.6;
	if (breakpoint === 'xs') return 0.4;
	return 1;
};

const shouldScaleResponsiveUnit = (unit, forceScale) => {
	if (forceScale) return true;
	const normalizedUnit = String(unit || '').toLowerCase();
	return !['', '-', '%', 'vw', 'vh', 'ch'].includes(normalizedUnit);
};

const roundResponsiveValue = (value, unit) => {
	const numeric = Number(value);
	if (!Number.isFinite(numeric)) return value;
	const normalizedUnit = String(unit || '').toLowerCase();
	if (normalizedUnit === 'px') {
		if (Math.abs(numeric) < 2) return Math.round(numeric * 100) / 100;
		return Math.round(numeric);
	}
	return Math.round(numeric * 100) / 100;
};

const buildResponsiveScaledValues = ({ value, unit, forceScale = false, min = null } = {}) => {
	const numericValue = Number(value);
	const safeValue = Number.isFinite(numericValue) ? numericValue : 0;
	const canScale = shouldScaleResponsiveUnit(unit, forceScale);
	const values = {};

	RESPONSIVE_BREAKPOINTS.forEach(bp => {
		const factor = canScale ? getResponsiveScaleFactor(bp) : 1;
		let nextValue = safeValue * factor;
		if (Number.isFinite(nextValue) && min !== null) {
			nextValue = Math.max(min, nextValue);
		}
		values[bp] = roundResponsiveValue(nextValue, unit);
	});

	return values;
};

const parseUnitValue = (rawValue, fallbackUnit = 'px') => {
	if (rawValue === null || rawValue === undefined) {
		return { value: 0, unit: fallbackUnit };
	}

	if (typeof rawValue === 'number') {
		return { value: rawValue, unit: fallbackUnit };
	}

	if (typeof rawValue === 'object') {
		const size =
			rawValue.value ??
			rawValue.size ??
			rawValue.amount ??
			rawValue.width ??
			rawValue.height;
		const unit = rawValue.unit || fallbackUnit;
		return { value: Number(size) || 0, unit };
	}

	const raw = String(rawValue).trim();
	const match = raw.match(/^(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?$/i);
	if (match) {
		return { value: Number(match[1]), unit: match[2] || fallbackUnit };
	}

	const parsed = Number.parseFloat(raw);
	return { value: Number.isNaN(parsed) ? 0 : parsed, unit: fallbackUnit };
};

const buildMarginChanges = (value, { side = null } = {}) => {
	const { value: rawValue, unit, breakpoint } = normalizeValueWithBreakpoint(value);
	const parsed = parseUnitValue({ value: rawValue, unit });
	const sides = side ? [side] : ['top', 'right', 'bottom', 'left'];
	const syncValue = side ? 'none' : 'all';
	const changes = {};

	if (breakpoint) {
		const suffix = `-${breakpoint}`;
		sides.forEach(sideKey => {
			changes[`margin-${sideKey}${suffix}`] = parsed.value;
			changes[`margin-${sideKey}-unit${suffix}`] = parsed.unit;
		});
		changes[`margin-sync${suffix}`] = syncValue;
		return changes;
	}

	const values = buildResponsiveScaledValues({
		value: parsed.value,
		unit: parsed.unit,
	});

	RESPONSIVE_BREAKPOINTS.forEach(bp => {
		const suffix = `-${bp}`;
		sides.forEach(sideKey => {
			changes[`margin-${sideKey}${suffix}`] = values[bp];
			changes[`margin-${sideKey}-unit${suffix}`] = parsed.unit;
		});
		changes[`margin-sync${suffix}`] = syncValue;
	});

	return changes;
};

const buildSizeChanges = (key, value) => {
	const { value: rawValue, unit, breakpoint } = normalizeValueWithBreakpoint(value);
	const parsed = parseUnitValue({ value: rawValue, unit });
	const changes = {};

	if (breakpoint) {
		const suffix = `-${breakpoint}`;
		changes[`${key}${suffix}`] = parsed.value;
		changes[`${key}-unit${suffix}`] = parsed.unit;
		return changes;
	}

	const values = buildResponsiveScaledValues({
		value: parsed.value,
		unit: parsed.unit,
	});

	RESPONSIVE_BREAKPOINTS.forEach(bp => {
		const suffix = `-${bp}`;
		changes[`${key}${suffix}`] = values[bp];
		changes[`${key}-unit${suffix}`] = parsed.unit;
	});

	return changes;
};

const extractMarginIntent = message => {
	const lower = String(message || '').toLowerCase();
	if (!lower.includes('margin')) return null;

	const sideMatch = lower.match(/\b(top|right|bottom|left)\b/);
	const side = sideMatch ? sideMatch[1] : null;

	const isRemove =
		/\b(remove|clear|reset|delete|unset|none|zero)\b/.test(lower) ||
		/\bno\s+margin\b/.test(lower) ||
		/\bwithout\s+margin\b/.test(lower);

	if (isRemove) {
		return { side, value: 0, unit: 'px' };
	}

	const unitValue = extractUnitValue(message, [
		/margin(?:[-\s_]*(?:top|right|bottom|left))?\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?/i,
		/(?:top|right|bottom|left)[-\s_]*margin\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?/i,
	]);
	if (!unitValue) return null;
	return { side, ...unitValue };
};

const extractMaxWidth = message =>
	extractUnitValue(message, [
		/max(?:imum)?[-\s_]*width\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?/i,
		/(?:limit|constrain|cap)[-\s_]*width\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?/i,
	]);

const extractMinWidth = message =>
	extractUnitValue(message, [
		/min(?:imum)?[-\s_]*width\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?/i,
		/(?:at\s*least)\s*(\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?\s*wide/i,
	]);

const extractMaxHeight = message =>
	extractUnitValue(message, [
		/max(?:imum)?[-\s_]*height\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?/i,
		/(?:limit|constrain|cap)[-\s_]*height\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?/i,
	]);

const extractMinHeight = message =>
	extractUnitValue(message, [
		/min(?:imum)?[-\s_]*height\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?/i,
		/(?:at\s*least)\s*(\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?\s*(?:tall|high)/i,
	]);

const extractMaxiVersion = (message, type) => {
	const lower = String(message || '').toLowerCase();
	if (type === 'current') {
		if (!/maxi\s*version|current\s*version/.test(lower)) return null;
		return extractValueFromPatterns(message, [
			/(?:current\s*maxi\s*version|maxi\s*version\s*current|current\s*version)\s*(?:to|=|:|is)?\s*([0-9a-zA-Z._-]+)/i,
		]);
	}
	if (type === 'origin') {
		if (!/origin\s*version|maxi\s*origin/.test(lower)) return null;
		return extractValueFromPatterns(message, [
			/(?:origin\s*maxi\s*version|maxi\s*origin\s*version|origin\s*version)\s*(?:to|=|:|is)?\s*([0-9a-zA-Z._-]+)/i,
		]);
	}
	return null;
};

const buildActionValue = (value, unit, breakpoint) => {
	if (breakpoint) {
		return { value, unit, breakpoint };
	}
	return unit ? `${value}${unit}` : value;
};

const buildContainerMGroupAction = (message, { scope = 'selection' } = {}) => {
	const actionType = scope === 'page' ? 'update_page' : 'update_selection';
	const actionTarget = actionType === 'update_page' ? { target_block: 'container' } : {};

	const currentVersion = extractMaxiVersion(message, 'current');
	if (currentVersion) {
		return {
			action: actionType,
			property: 'maxi_version_current',
			value: currentVersion,
			message: 'Maxi version updated.',
			...actionTarget,
		};
	}

	const originVersion = extractMaxiVersion(message, 'origin');
	if (originVersion) {
		return {
			action: actionType,
			property: 'maxi_version_origin',
			value: originVersion,
			message: 'Maxi origin version updated.',
			...actionTarget,
		};
	}

	const breakpoint = extractBreakpointToken(message);

	const marginIntent = extractMarginIntent(message);
	if (marginIntent) {
		const property = marginIntent.side ? `margin_${marginIntent.side}` : 'margin';
		const value = buildActionValue(marginIntent.value, marginIntent.unit, breakpoint);
		return {
			action: actionType,
			property,
			value,
			message: 'Margin updated.',
			...actionTarget,
		};
	}

	const maxWidth = extractMaxWidth(message);
	if (maxWidth) {
		return {
			action: actionType,
			property: 'max_width',
			value: buildActionValue(maxWidth.value, maxWidth.unit, breakpoint),
			message: 'Max width updated.',
			...actionTarget,
		};
	}

	const minWidth = extractMinWidth(message);
	if (minWidth) {
		return {
			action: actionType,
			property: 'min_width',
			value: buildActionValue(minWidth.value, minWidth.unit, breakpoint),
			message: 'Min width updated.',
			...actionTarget,
		};
	}

	const maxHeight = extractMaxHeight(message);
	if (maxHeight) {
		return {
			action: actionType,
			property: 'max_height',
			value: buildActionValue(maxHeight.value, maxHeight.unit, breakpoint),
			message: 'Max height updated.',
			...actionTarget,
		};
	}

	const minHeight = extractMinHeight(message);
	if (minHeight) {
		return {
			action: actionType,
			property: 'min_height',
			value: buildActionValue(minHeight.value, minHeight.unit, breakpoint),
			message: 'Min height updated.',
			...actionTarget,
		};
	}

	return null;
};

const buildContainerMGroupAttributeChanges = (property, value) => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');

	switch (normalized) {
		case 'margin':
			return buildMarginChanges(value);
		case 'margin_top':
			return buildMarginChanges(value, { side: 'top' });
		case 'margin_bottom':
			return buildMarginChanges(value, { side: 'bottom' });
		case 'margin_left':
			return buildMarginChanges(value, { side: 'left' });
		case 'margin_right':
			return buildMarginChanges(value, { side: 'right' });
		case 'max_width':
			return buildSizeChanges('max-width', value);
		case 'min_width':
			return buildSizeChanges('min-width', value);
		case 'max_height':
			return buildSizeChanges('max-height', value);
		case 'min_height':
			return buildSizeChanges('min-height', value);
		case 'maxi_version_current':
			return { 'maxi-version-current': String(value ?? '') };
		case 'maxi_version_origin':
			return { 'maxi-version-origin': String(value ?? '') };
		default:
			return null;
	}
};

const getContainerMGroupSidebarTarget = property => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');

	if (
		[
			'margin',
			'margin_top',
			'margin_bottom',
			'margin_left',
			'margin_right',
		].includes(normalized)
	) {
		return { tabIndex: 0, accordion: 'margin / padding' };
	}

	if (
		[
			'min_width',
			'max_width',
			'min_height',
			'max_height',
		].includes(normalized)
	) {
		return { tabIndex: 0, accordion: 'height / width' };
	}

	if (normalized.startsWith('maxi_version')) {
		return { tabIndex: 0, accordion: 'block settings' };
	}

	return null;
};

return {
	buildContainerMGroupAction,
	buildContainerMGroupAttributeChanges,
	getContainerMGroupSidebarTarget,
};
})();

export const {
	buildContainerMGroupAction,
	buildContainerMGroupAttributeChanges,
	getContainerMGroupSidebarTarget,
} = containerMGroup;

// containerOGroup
const containerOGroup = (() => {
const RESPONSIVE_BREAKPOINTS = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const BREAKPOINT_ALIASES = [
	{
		key: 'xxl',
		regex: /\bxxl\b|extra\s*wide|ultra\s*wide|wide\s*screen|wide\s*desktop/i,
	},
	{ key: 'xl', regex: /\bxl\b|desktop|large\s*screen/i },
	{ key: 'l', regex: /\bl\b|laptop|notebook/i },
	{ key: 'm', regex: /\bm\b|tablet|medium/i },
	{ key: 's', regex: /\bs\b|small/i },
	{ key: 'xs', regex: /\bxs\b|mobile|phone|handset/i },
	{
		key: 'general',
		regex: /\bgeneral\b|base\s*breakpoint|default\s*breakpoint/i,
	},
];

const extractNumericValue = (message, patterns) => {
	if (!message) return null;
	for (const pattern of patterns) {
		const match = message.match(pattern);
		if (match && match[1]) {
			const num = Number.parseFloat(match[1]);
			if (Number.isFinite(num)) return num;
		}
	}
	return null;
};

const extractNumericWithUnit = (message, patterns) => {
	if (!message) return null;
	for (const pattern of patterns) {
		const match = message.match(pattern);
		if (match && match[1]) {
			const num = Number.parseFloat(match[1]);
			if (!Number.isFinite(num)) continue;
			return { value: num, unit: match[2] || null };
		}
	}
	return null;
};

const extractBreakpointToken = message => {
	const lower = String(message || '').toLowerCase();
	for (const entry of BREAKPOINT_ALIASES) {
		if (entry.regex.test(lower)) return entry.key;
	}
	return null;
};

const normalizeValueWithBreakpoint = rawValue => {
	if (
		rawValue &&
		typeof rawValue === 'object' &&
		!Array.isArray(rawValue) &&
		Object.prototype.hasOwnProperty.call(rawValue, 'value')
	) {
		return {
			value: rawValue.value,
			breakpoint: rawValue.breakpoint || null,
		};
	}

	return { value: rawValue, breakpoint: null };
};

const clampOpacity = value => {
	const numeric = Number(value);
	if (!Number.isFinite(numeric)) return null;
	return Math.min(1, Math.max(0, numeric));
};

const normalizeOpacityInput = (value, unit) => {
	if (value === null || value === undefined) return null;
	const numeric = Number(value);
	if (!Number.isFinite(numeric)) return null;
	if (unit === '%' || numeric > 1) {
		return clampOpacity(numeric / 100);
	}
	return clampOpacity(numeric);
};

const extractOpacityValue = message => {
	const lower = String(message || '').toLowerCase();
	if (!/opacity|transparent|transparency/.test(lower)) return null;

	const numericWithUnit = extractNumericWithUnit(message, [
		/opacity\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)(%)?/i,
		/(-?\d+(?:\.\d+)?)\s*%?\s*opacity/i,
		/(?:transparent|transparency)\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)(%)?/i,
	]);
	if (!numericWithUnit) return null;

	const value = normalizeOpacityInput(numericWithUnit.value, numericWithUnit.unit);
	return value === null ? null : value;
};

const extractOpacityHoverStatus = message => {
	const lower = String(message || '').toLowerCase();
	if (!/opacity/.test(lower) || !/hover/.test(lower)) return null;
	if (/(disable|turn\s*off|deactivate|remove)/.test(lower)) return false;
	if (/(enable|turn\s*on|activate|add)/.test(lower)) return true;
	return null;
};

const extractOrderValue = message => {
	const lower = String(message || '').toLowerCase();
	if (!lower.includes('order')) return null;
	if (/order\s*by|orderby/.test(lower)) return null;
	if (!/(flex|item|stack|order)/.test(lower)) return null;
	return extractNumericValue(message, [
		/\border\b\s*(?:to|=|:|is)?\s*(-?\d+)/i,
		/(-?\d+)\s*(?:order)\b/i,
	]);
};

const normalizeOverflowValue = value => {
	if (!value) return null;
	const lower = String(value).toLowerCase();
	if (/clip/.test(lower)) return 'clip';
	if (/hidden/.test(lower)) return 'hidden';
	if (/scroll/.test(lower)) return 'scroll';
	if (/auto/.test(lower)) return 'auto';
	if (/visible/.test(lower)) return 'visible';
	return null;
};

const extractOverflowIntent = message => {
	const lower = String(message || '').toLowerCase();
	if (!lower.includes('overflow')) return null;

	let axis = null;
	if (/overflow[-\s_]*x|\bhorizontal\b|\bx\b/.test(lower)) axis = 'x';
	if (/overflow[-\s_]*y|\bvertical\b|\by\b/.test(lower)) {
		axis = axis ? 'both' : 'y';
	}

	const valueMatch = message.match(
		/\boverflow(?:[-\s_]*(?:x|y))?\s*(?:to|=|:|is)?\s*(hidden|scroll|auto|visible|clip)\b/i
	);
	const keywordValue = valueMatch ? valueMatch[1] : null;
	const normalized = normalizeOverflowValue(keywordValue);
	if (!normalized) return null;

	return { axis: axis || 'both', value: normalized };
};

const buildOpacityChanges = (value, { isHover = false } = {}) => {
	const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
	const clamped = clampOpacity(rawValue);
	if (clamped === null) return null;

	const suffix = breakpoint ? `-${breakpoint}` : '-general';
	const key = `opacity${suffix}${isHover ? '-hover' : ''}`;
	const changes = { [key]: clamped };
	if (isHover) {
		changes['opacity-status-hover'] = true;
	}
	return changes;
};

const buildOrderChanges = value => {
	const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
	const numeric = Number(rawValue);
	if (!Number.isFinite(numeric)) return null;
	const key = breakpoint ? `order-${breakpoint}` : 'order-general';
	return { [key]: numeric };
};

const buildOverflowChanges = (axis, value) => {
	const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
	const normalized = normalizeOverflowValue(rawValue);
	if (!normalized) return null;
	const suffix = breakpoint ? `-${breakpoint}` : '-general';
	const key = `overflow-${axis}${suffix}`;
	return { [key]: normalized };
};

const buildContainerOGroupAction = (message, { scope = 'selection' } = {}) => {
	const actionType = scope === 'page' ? 'update_page' : 'update_selection';
	const actionTarget = actionType === 'update_page' ? { target_block: 'container' } : {};

	const opacityHoverStatus = extractOpacityHoverStatus(message);
	if (typeof opacityHoverStatus === 'boolean') {
		return {
			action: actionType,
			property: 'opacity_status_hover',
			value: opacityHoverStatus,
			message: opacityHoverStatus
				? 'Opacity hover enabled.'
				: 'Opacity hover disabled.',
			...actionTarget,
		};
	}

	const opacityValue = extractOpacityValue(message);
	if (opacityValue !== null) {
		const breakpoint = extractBreakpointToken(message);
		const isHover = /\bhover\b/i.test(message || '');
		return {
			action: actionType,
			property: isHover ? 'opacity_hover' : 'opacity',
			value: breakpoint ? { value: opacityValue, breakpoint } : opacityValue,
			message: 'Opacity updated.',
			...actionTarget,
		};
	}

	const orderValue = extractOrderValue(message);
	if (Number.isFinite(orderValue)) {
		const breakpoint = extractBreakpointToken(message);
		return {
			action: actionType,
			property: 'order',
			value: breakpoint ? { value: orderValue, breakpoint } : orderValue,
			message: 'Order updated.',
			...actionTarget,
		};
	}

	const overflowIntent = extractOverflowIntent(message);
	if (overflowIntent) {
		const breakpoint = extractBreakpointToken(message);
		if (overflowIntent.axis === 'x') {
			return {
				action: actionType,
				property: 'overflow_x',
				value: breakpoint
					? { value: overflowIntent.value, breakpoint }
					: overflowIntent.value,
				message: 'Overflow updated.',
				...actionTarget,
			};
		}
		if (overflowIntent.axis === 'y') {
			return {
				action: actionType,
				property: 'overflow_y',
				value: breakpoint
					? { value: overflowIntent.value, breakpoint }
					: overflowIntent.value,
				message: 'Overflow updated.',
				...actionTarget,
			};
		}
		return {
			action: actionType,
			property: 'overflow',
			value: breakpoint
				? { value: overflowIntent.value, breakpoint }
				: overflowIntent.value,
			message: 'Overflow updated.',
			...actionTarget,
		};
	}

	return null;
};

const buildContainerOGroupAttributeChanges = (property, value) => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');

	switch (normalized) {
		case 'opacity':
			return buildOpacityChanges(value, { isHover: false });
		case 'opacity_hover':
			return buildOpacityChanges(value, { isHover: true });
		case 'opacity_status_hover':
			return { 'opacity-status-hover': Boolean(value) };
		case 'order':
			return buildOrderChanges(value);
		case 'overflow':
			return {
				...(buildOverflowChanges('x', value) || {}),
				...(buildOverflowChanges('y', value) || {}),
			};
		case 'overflow_x':
			return buildOverflowChanges('x', value);
		case 'overflow_y':
			return buildOverflowChanges('y', value);
		default:
			return null;
	}
};

const getContainerOGroupSidebarTarget = property => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');

	if (
		[
			'opacity',
			'opacity_hover',
			'opacity_status_hover',
		].includes(normalized)
	) {
		return { tabIndex: 1, accordion: 'opacity' };
	}

	if (['order'].includes(normalized)) {
		return { tabIndex: 1, accordion: 'flexbox' };
	}

	if (['overflow', 'overflow_x', 'overflow_y'].includes(normalized)) {
		return { tabIndex: 1, accordion: 'overflow' };
	}

	return null;
};

return {
	buildContainerOGroupAction,
	buildContainerOGroupAttributeChanges,
	getContainerOGroupSidebarTarget,
};
})();

export const {
	buildContainerOGroupAction,
	buildContainerOGroupAttributeChanges,
	getContainerOGroupSidebarTarget,
} = containerOGroup;

// containerPGroup
const containerPGroup = (() => {
const RESPONSIVE_BREAKPOINTS = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const BREAKPOINT_ALIASES = [
	{
		key: 'xxl',
		regex: /\bxxl\b|extra\s*wide|ultra\s*wide|wide\s*screen|wide\s*desktop/i,
	},
	{ key: 'xl', regex: /\bxl\b|desktop|large\s*screen/i },
	{ key: 'l', regex: /\bl\b|laptop|notebook/i },
	{ key: 'm', regex: /\bm\b|tablet|medium/i },
	{ key: 's', regex: /\bs\b|small/i },
	{ key: 'xs', regex: /\bxs\b|mobile|phone|handset/i },
	{
		key: 'general',
		regex: /\bgeneral\b|base\s*breakpoint|default\s*breakpoint/i,
	},
];

const extractUnitValue = (message, patterns) => {
	if (!message) return null;
	for (const pattern of patterns) {
		const match = message.match(pattern);
		if (match && match[1]) {
			const value = Number.parseFloat(match[1]);
			if (!Number.isFinite(value)) continue;
			return { value, unit: match[2] || 'px' };
		}
	}
	return null;
};

const extractBreakpointToken = message => {
	const lower = String(message || '').toLowerCase();
	for (const entry of BREAKPOINT_ALIASES) {
		if (entry.regex.test(lower)) return entry.key;
	}
	return null;
};

const normalizeValueWithBreakpoint = rawValue => {
	if (
		rawValue &&
		typeof rawValue === 'object' &&
		!Array.isArray(rawValue) &&
		Object.prototype.hasOwnProperty.call(rawValue, 'value')
	) {
		return {
			value: rawValue.value,
			unit: rawValue.unit,
			breakpoint: rawValue.breakpoint || null,
		};
	}

	return { value: rawValue, unit: null, breakpoint: null };
};

const getResponsiveScaleFactor = breakpoint => {
	if (breakpoint === 'm' || breakpoint === 's') return 0.6;
	if (breakpoint === 'xs') return 0.4;
	return 1;
};

const shouldScaleResponsiveUnit = (unit, forceScale) => {
	if (forceScale) return true;
	const normalizedUnit = String(unit || '').toLowerCase();
	return !['', '-', '%', 'vw', 'vh', 'ch'].includes(normalizedUnit);
};

const roundResponsiveValue = (value, unit) => {
	const numeric = Number(value);
	if (!Number.isFinite(numeric)) return value;
	const normalizedUnit = String(unit || '').toLowerCase();
	if (normalizedUnit === 'px') {
		if (Math.abs(numeric) < 2) return Math.round(numeric * 100) / 100;
		return Math.round(numeric);
	}
	return Math.round(numeric * 100) / 100;
};

const buildResponsiveScaledValues = ({ value, unit, forceScale = false, min = null } = {}) => {
	const numericValue = Number(value);
	const safeValue = Number.isFinite(numericValue) ? numericValue : 0;
	const canScale = shouldScaleResponsiveUnit(unit, forceScale);
	const values = {};

	RESPONSIVE_BREAKPOINTS.forEach(bp => {
		const factor = canScale ? getResponsiveScaleFactor(bp) : 1;
		let nextValue = safeValue * factor;
		if (Number.isFinite(nextValue) && min !== null) {
			nextValue = Math.max(min, nextValue);
		}
		values[bp] = roundResponsiveValue(nextValue, unit);
	});

	return values;
};

const parseUnitValue = (rawValue, fallbackUnit = 'px') => {
	if (rawValue === null || rawValue === undefined) {
		return { value: 0, unit: fallbackUnit };
	}

	if (typeof rawValue === 'number') {
		return { value: rawValue, unit: fallbackUnit };
	}

	if (typeof rawValue === 'object') {
		const size =
			rawValue.value ??
			rawValue.size ??
			rawValue.amount ??
			rawValue.width ??
			rawValue.height;
		const unit = rawValue.unit || fallbackUnit;
		return { value: Number(size) || 0, unit };
	}

	const raw = String(rawValue).trim();
	const match = raw.match(/^(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?$/i);
	if (match) {
		return { value: Number(match[1]), unit: match[2] || fallbackUnit };
	}

	const parsed = Number.parseFloat(raw);
	return { value: Number.isNaN(parsed) ? 0 : parsed, unit: fallbackUnit };
};

const buildPaddingChanges = (value, { side = null, prefix = '' } = {}) => {
	const { value: rawValue, unit, breakpoint } = normalizeValueWithBreakpoint(value);
	const parsed = parseUnitValue({ value: rawValue, unit });
	const sides = side ? [side] : ['top', 'right', 'bottom', 'left'];
	const syncValue = side ? 'none' : 'all';
	const changes = {};

	if (breakpoint) {
		const suffix = `-${breakpoint}`;
		sides.forEach(sideKey => {
			changes[`${prefix}padding-${sideKey}${suffix}`] = parsed.value;
			changes[`${prefix}padding-${sideKey}-unit${suffix}`] = parsed.unit;
		});
		changes[`${prefix}padding-sync${suffix}`] = syncValue;
		return changes;
	}

	const values = buildResponsiveScaledValues({
		value: parsed.value,
		unit: parsed.unit,
	});

	RESPONSIVE_BREAKPOINTS.forEach(bp => {
		const suffix = `-${bp}`;
		sides.forEach(sideKey => {
			changes[`${prefix}padding-${sideKey}${suffix}`] = values[bp];
			changes[`${prefix}padding-${sideKey}-unit${suffix}`] = parsed.unit;
		});
		changes[`${prefix}padding-sync${suffix}`] = syncValue;
	});

	return changes;
};

const buildPositionAxisChanges = (axis, value) => {
	const { value: rawValue, unit, breakpoint } = normalizeValueWithBreakpoint(value);
	const parsed = parseUnitValue({ value: rawValue, unit });
	const suffix = breakpoint ? `-${breakpoint}` : '-general';
	return {
		[`position-${axis}${suffix}`]: parsed.value,
		[`position-${axis}-unit${suffix}`]: parsed.unit,
		[`position-sync${suffix}`]: 'none',
	};
};

const buildPositionModeChanges = value => {
	const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
	const mode = rawValue ? String(rawValue) : 'inherit';
	const suffix = breakpoint ? `-${breakpoint}` : '-general';
	return { [`position${suffix}`]: mode };
};

const extractPaddingIntent = message => {
	const lower = String(message || '').toLowerCase();
	if (!lower.includes('padding') && !lower.includes('pad')) return null;

	const sideMatch = lower.match(/\b(top|right|bottom|left)\b/);
	const side = sideMatch ? sideMatch[1] : null;

	const isRemove =
		/\b(remove|clear|reset|delete|unset|none|zero)\b/.test(lower) ||
		/\bno\s+padding\b/.test(lower) ||
		/\bwithout\s+padding\b/.test(lower);

	if (isRemove) {
		return { side, value: 0, unit: 'px' };
	}

	const unitValue = extractUnitValue(message, [
		/padding(?:[-\s_]*(?:top|right|bottom|left))?\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?/i,
		/(?:top|right|bottom|left)[-\s_]*padding\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?/i,
	]);
	if (!unitValue) return null;
	return { side, ...unitValue };
};

const extractPositionAxisIntent = message => {
	const lower = String(message || '').toLowerCase();
	if (!/position|offset/.test(lower)) return null;

	const axisPatterns = [
		{ axis: 'top', pattern: /position[-\s_]*top\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?/i },
		{ axis: 'bottom', pattern: /position[-\s_]*bottom\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?/i },
		{ axis: 'left', pattern: /position[-\s_]*left\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?/i },
		{ axis: 'right', pattern: /position[-\s_]*right\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?/i },
		{ axis: 'top', pattern: /top[-\s_]*(?:position|offset)\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?/i },
		{ axis: 'bottom', pattern: /bottom[-\s_]*(?:position|offset)\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?/i },
		{ axis: 'left', pattern: /left[-\s_]*(?:position|offset)\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?/i },
		{ axis: 'right', pattern: /right[-\s_]*(?:position|offset)\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?/i },
	];

	for (const { axis, pattern } of axisPatterns) {
		const match = message.match(pattern);
		if (match && match[1]) {
			return {
				axis,
				value: Number.parseFloat(match[1]),
				unit: match[2] || 'px',
			};
		}
	}

	return null;
};

const extractPositionMode = message => {
	const lower = String(message || '').toLowerCase();
	if (!/(position|absolute|relative|fixed|sticky|static|inherit|default)/.test(lower)) {
		return null;
	}
	if (/\bsticky\b/.test(lower)) return 'sticky';
	if (/\babsolute\b/.test(lower)) return 'absolute';
	if (/\brelative\b/.test(lower)) return 'relative';
	if (/\bfixed\b/.test(lower)) return 'fixed';
	if (/\bstatic\b/.test(lower)) return 'static';
	if (/\binherit\b|\bdefault\b/.test(lower)) return 'inherit';
	return null;
};

const buildContainerPGroupAction = (message, { scope = 'selection' } = {}) => {
	const actionType = scope === 'page' ? 'update_page' : 'update_selection';
	const actionTarget = actionType === 'update_page' ? { target_block: 'container' } : {};

	const paddingIntent = extractPaddingIntent(message);
	if (paddingIntent) {
		const breakpoint = extractBreakpointToken(message);
		const property = paddingIntent.side ? `padding_${paddingIntent.side}` : 'padding';
		const value = {
			value: paddingIntent.value,
			unit: paddingIntent.unit,
			...(breakpoint ? { breakpoint } : {}),
		};
		return {
			action: actionType,
			property,
			value,
			message: 'Padding updated.',
			...actionTarget,
		};
	}

	const positionAxisIntent = extractPositionAxisIntent(message);
	if (positionAxisIntent) {
		const breakpoint = extractBreakpointToken(message);
		return {
			action: actionType,
			property: `position_${positionAxisIntent.axis}`,
			value: {
				value: positionAxisIntent.value,
				unit: positionAxisIntent.unit,
				...(breakpoint ? { breakpoint } : {}),
			},
			message: 'Position updated.',
			...actionTarget,
		};
	}

	const positionMode = extractPositionMode(message);
	if (positionMode) {
		const breakpoint = extractBreakpointToken(message);
		return {
			action: actionType,
			property: 'position',
			value: breakpoint ? { value: positionMode, breakpoint } : positionMode,
			message: 'Position mode updated.',
			...actionTarget,
		};
	}

	return null;
};

const buildContainerPGroupAttributeChanges = (property, value, { prefix = '' } = {}) => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');

	switch (normalized) {
		case 'padding':
			return buildPaddingChanges(value, { prefix });
		case 'padding_top':
			return buildPaddingChanges(value, { side: 'top', prefix });
		case 'padding_bottom':
			return buildPaddingChanges(value, { side: 'bottom', prefix });
		case 'padding_left':
			return buildPaddingChanges(value, { side: 'left', prefix });
		case 'padding_right':
			return buildPaddingChanges(value, { side: 'right', prefix });
		case 'position':
			return buildPositionModeChanges(value);
		case 'position_top':
			return buildPositionAxisChanges('top', value);
		case 'position_right':
			return buildPositionAxisChanges('right', value);
		case 'position_bottom':
			return buildPositionAxisChanges('bottom', value);
		case 'position_left':
			return buildPositionAxisChanges('left', value);
		default:
			return null;
	}
};

const getContainerPGroupSidebarTarget = property => {
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

	return null;
};

return {
	buildContainerPGroupAction,
	buildContainerPGroupAttributeChanges,
	getContainerPGroupSidebarTarget,
};
})();

export const {
	buildContainerPGroupAction,
	buildContainerPGroupAttributeChanges,
	getContainerPGroupSidebarTarget,
} = containerPGroup;

// containerRGroup
const containerRGroup = (() => {
const RESPONSIVE_BREAKPOINTS = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const BREAKPOINT_ALIASES = [
	{
		key: 'xxl',
		regex: /\bxxl\b|extra\s*wide|ultra\s*wide|wide\s*screen|wide\s*desktop/i,
	},
	{ key: 'xl', regex: /\bxl\b|desktop|large\s*screen/i },
	{ key: 'l', regex: /\bl\b|laptop|notebook/i },
	{ key: 'm', regex: /\bm\b|tablet|medium/i },
	{ key: 's', regex: /\bs\b|small/i },
	{ key: 'xs', regex: /\bxs\b|mobile|phone|handset/i },
	{
		key: 'general',
		regex: /\bgeneral\b|base\s*breakpoint|default\s*breakpoint/i,
	},
];

const extractUnitValue = (message, patterns) => {
	if (!message) return null;
	for (const pattern of patterns) {
		const match = message.match(pattern);
		if (match && match[1]) {
			const value = Number.parseFloat(match[1]);
			if (!Number.isFinite(value)) continue;
			return { value, unit: match[2] || 'px' };
		}
	}
	return null;
};

const extractBreakpointToken = message => {
	const lower = String(message || '').toLowerCase();
	for (const entry of BREAKPOINT_ALIASES) {
		if (entry.regex.test(lower)) return entry.key;
	}
	return null;
};

const normalizeValueWithBreakpoint = rawValue => {
	if (
		rawValue &&
		typeof rawValue === 'object' &&
		!Array.isArray(rawValue) &&
		Object.prototype.hasOwnProperty.call(rawValue, 'value')
	) {
		return {
			value: rawValue.value,
			unit: rawValue.unit,
			breakpoint: rawValue.breakpoint || null,
		};
	}

	return { value: rawValue, unit: null, breakpoint: null };
};

const parseUnitValue = (rawValue, fallbackUnit = 'px') => {
	if (rawValue === null || rawValue === undefined) {
		return { value: 0, unit: fallbackUnit };
	}

	if (typeof rawValue === 'number') {
		return { value: rawValue, unit: fallbackUnit };
	}

	if (typeof rawValue === 'object') {
		const size = rawValue.value ?? rawValue.size ?? rawValue.amount ?? rawValue.width;
		const unit = rawValue.unit || fallbackUnit;
		return { value: Number(size) || 0, unit };
	}

	const raw = String(rawValue).trim();
	const match = raw.match(/^(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?$/i);
	if (match) {
		return { value: Number(match[1]), unit: match[2] || fallbackUnit };
	}

	const parsed = Number.parseFloat(raw);
	return { value: Number.isNaN(parsed) ? 0 : parsed, unit: fallbackUnit };
};

const buildRowGapChanges = value => {
	const { value: rawValue, unit, breakpoint } = normalizeValueWithBreakpoint(value);
	const parsed = parseUnitValue({ value: rawValue, unit });
	const breakpoints = breakpoint ? [breakpoint] : RESPONSIVE_BREAKPOINTS;
	const changes = {};

	breakpoints.forEach(bp => {
		changes[`row-gap-${bp}`] = parsed.value;
		changes[`row-gap-unit-${bp}`] = parsed.unit;
	});

	return changes;
};

const extractRowGapIntent = message => {
	const lower = String(message || '').toLowerCase();
	if (
		!/(row[-\s]*gap|row[-\s]*spacing|gap\s*between\s*rows|vertical\s*gap)/.test(
			lower
		)
	) {
		return null;
	}

	const isRemove =
		/\b(remove|clear|reset|delete|unset|none|zero)\b/.test(lower) ||
		/\bno\s+row\s*gap\b/.test(lower) ||
		/\bwithout\s+row\s*gap\b/.test(lower);

	if (isRemove) {
		return { value: 0, unit: 'px' };
	}

	return extractUnitValue(message, [
		/row[-\s]*gap\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?/i,
		/row[-\s]*spacing\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?/i,
		/(?:gap|spacing)\s*between\s*rows\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?/i,
		/vertical\s*gap\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?/i,
	]);
};

const buildContainerRGroupAction = (message, { scope = 'selection' } = {}) => {
	const actionType = scope === 'page' ? 'update_page' : 'update_selection';
	const actionTarget = actionType === 'update_page' ? { target_block: 'container' } : {};

	const rowGapIntent = extractRowGapIntent(message);
	if (rowGapIntent) {
		const breakpoint = extractBreakpointToken(message);
		return {
			action: actionType,
			property: 'row_gap',
			value: {
				value: rowGapIntent.value,
				unit: rowGapIntent.unit,
				...(breakpoint ? { breakpoint } : {}),
			},
			message: 'Row gap updated.',
		...actionTarget,
	};
	}

	return null;
};

const buildContainerRGroupAttributeChanges = (property, value) => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');

	switch (normalized) {
		case 'row_gap':
			return buildRowGapChanges(value);
		default:
			return null;
	}
};

const getContainerRGroupSidebarTarget = property => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');

	if (normalized === 'row_gap') {
		return { tabIndex: 1, accordion: 'flexbox' };
	}

	return null;
};

return {
	buildContainerRGroupAction,
	buildContainerRGroupAttributeChanges,
	getContainerRGroupSidebarTarget,
};
})();

export const {
	buildContainerRGroupAction,
	buildContainerRGroupAttributeChanges,
	getContainerRGroupSidebarTarget,
} = containerRGroup;

// containerSGroup
const containerSGroup = (() => {
const BREAKPOINT_ALIASES = [
	{
		key: 'xxl',
		regex: /\bxxl\b|extra\s*wide|ultra\s*wide|wide\s*screen|wide\s*desktop/i,
	},
	{ key: 'xl', regex: /\bxl\b|desktop|large\s*screen/i },
	{ key: 'l', regex: /\bl\b|laptop|notebook/i },
	{ key: 'm', regex: /\bm\b|tablet|medium/i },
	{ key: 's', regex: /\bs\b|small/i },
	{ key: 'xs', regex: /\bxs\b|mobile|phone|handset/i },
	{
		key: 'general',
		regex: /\bgeneral\b|base\s*breakpoint|default\s*breakpoint/i,
	},
];

const SCROLL_EFFECT_ALIASES = [
	{ key: 'rotate_x', value: 'rotateX' },
	{ key: 'rotatex', value: 'rotateX' },
	{ key: 'rotate_y', value: 'rotateY' },
	{ key: 'rotatey', value: 'rotateY' },
	{ key: 'scale_x', value: 'scaleX' },
	{ key: 'scalex', value: 'scaleX' },
	{ key: 'scale_y', value: 'scaleY' },
	{ key: 'scaley', value: 'scaleY' },
	{ key: 'horizontal', value: 'horizontal' },
	{ key: 'vertical', value: 'vertical' },
	{ key: 'rotate', value: 'rotate' },
	{ key: 'scale', value: 'scale' },
	{ key: 'fade', value: 'fade' },
	{ key: 'blur', value: 'blur' },
];

const SCROLL_ACTION_ATTRS = new Set([
	'status',
	'speed',
	'delay',
	'easing',
	'viewport_top',
	'zones',
	'preview_status',
	'is_block_zone',
	'status_reverse',
	'unit',
]);

const extractNumericValue = (message, patterns) => {
	if (!message) return null;
	for (const pattern of patterns) {
		const match = message.match(pattern);
		if (match && match[1]) {
			const num = Number.parseFloat(match[1]);
			if (Number.isFinite(num)) return num;
		}
	}
	return null;
};

const extractUnitValue = (message, patterns) => {
	if (!message) return null;
	for (const pattern of patterns) {
		const match = message.match(pattern);
		if (match && match[1]) {
			const value = Number.parseFloat(match[1]);
			if (!Number.isFinite(value)) continue;
			return { value, unit: match[2] || 'px' };
		}
	}
	return null;
};

const extractBreakpointToken = message => {
	const lower = String(message || '').toLowerCase();
	for (const entry of BREAKPOINT_ALIASES) {
		if (entry.regex.test(lower)) return entry.key;
	}
	return null;
};

const normalizeValueWithBreakpoint = rawValue => {
	if (
		rawValue &&
		typeof rawValue === 'object' &&
		!Array.isArray(rawValue) &&
		Object.prototype.hasOwnProperty.call(rawValue, 'value')
	) {
		return {
			value: rawValue.value,
			unit: rawValue.unit,
			breakpoint: rawValue.breakpoint || null,
		};
	}

	return { value: rawValue, unit: null, breakpoint: null };
};

const getActiveBreakpoint = () => {
	try {
		const store = select?.('maxiBlocks');
		const device = store?.receiveMaxiDeviceType?.() || 'general';
		const base = store?.receiveBaseBreakpoint?.();
		if (device === 'general') return 'general';
		if (base && base === device) return 'general';
		return device || 'general';
	} catch (err) {
		return 'general';
	}
};

const parseUnitValue = (rawValue, fallbackUnit = 'px') => {
	if (rawValue === null || rawValue === undefined) {
		return { value: 0, unit: fallbackUnit };
	}

	if (typeof rawValue === 'number') {
		return { value: rawValue, unit: fallbackUnit };
	}

	if (typeof rawValue === 'object') {
		const size = rawValue.value ?? rawValue.size ?? rawValue.amount ?? rawValue.height;
		const unit = rawValue.unit || fallbackUnit;
		return { value: Number(size) || 0, unit };
	}

	const raw = String(rawValue).trim();
	const match = raw.match(/^(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?$/i);
	if (match) {
		return { value: Number(match[1]), unit: match[2] || fallbackUnit };
	}

	const parsed = Number.parseFloat(raw);
	return { value: Number.isNaN(parsed) ? 0 : parsed, unit: fallbackUnit };
};

const extractScrollEffect = message => {
	const lower = String(message || '').toLowerCase();
	if (!lower.includes('scroll')) return null;

	const candidates = [
		{ key: 'rotateX', regex: /\brotate\s*x\b|\brotatex\b/i },
		{ key: 'rotateY', regex: /\brotate\s*y\b|\brotatey\b/i },
		{ key: 'scaleX', regex: /\bscale\s*x\b|\bscalex\b/i },
		{ key: 'scaleY', regex: /\bscale\s*y\b|\bscaley\b/i },
		{ key: 'horizontal', regex: /\bhorizontal\b|\bx[-\s]*axis\b/i },
		{ key: 'vertical', regex: /\bvertical\b|\by[-\s]*axis\b/i },
		{ key: 'rotate', regex: /\brotate\b/i },
		{ key: 'scale', regex: /\bscale\b|\bzoom\b/i },
		{ key: 'fade', regex: /\bfade\b/i },
		{ key: 'blur', regex: /\bblur\b/i },
	];

	for (const candidate of candidates) {
		if (candidate.regex.test(lower)) return candidate.key;
	}
	return null;
};

const extractEasingValue = message => {
	const lower = String(message || '').toLowerCase();
	const match = lower.match(/easing\s*(?:to|=|:|is)?\s*([a-z-]+)/i);
	if (match && match[1]) return match[1];
	if (/\bease-in-out\b/.test(lower)) return 'ease-in-out';
	if (/\bease-in\b/.test(lower)) return 'ease-in';
	if (/\bease-out\b/.test(lower)) return 'ease-out';
	if (/\bease\b/.test(lower)) return 'ease';
	if (/\blinear\b/.test(lower)) return 'linear';
	return null;
};

const extractViewportValue = message => {
	const lower = String(message || '').toLowerCase();
	if (!/(viewport|entry|trigger|start)/.test(lower)) return null;
	if (/\btop\b/.test(lower)) return 'top';
	if (/\bbottom\b/.test(lower)) return 'bottom';
	if (/\bmid\b|\bmiddle\b|\bcenter\b/.test(lower)) return 'mid';
	return null;
};

const extractScrollIntent = message => {
	const effect = extractScrollEffect(message);
	if (!effect) return null;

	const lower = String(message || '').toLowerCase();
	const breakpoint = extractBreakpointToken(message);

	if (/(preview|simulate)/.test(lower)) {
		if (/(disable|off|turn\s*off)/.test(lower)) {
			return { effect, attr: 'preview_status', value: false };
		}
		if (/(enable|on|turn\s*on|show)/.test(lower)) {
			return { effect, attr: 'preview_status', value: true };
		}
	}

	if (/block\s*height|block\s*zone/.test(lower)) {
		const isOn = !/(disable|off|turn\s*off)/.test(lower);
		return { effect, attr: 'is_block_zone', value: isOn };
	}

	if (/reverse/.test(lower)) {
		const isOn = !/(disable|off|turn\s*off)/.test(lower);
		return { effect, attr: 'status_reverse', value: isOn };
	}

	const viewportValue = extractViewportValue(message);
	if (viewportValue) {
		return { effect, attr: 'viewport_top', value: breakpoint ? { value: viewportValue, breakpoint } : viewportValue };
	}

	const easingValue = extractEasingValue(message);
	if (easingValue) {
		return { effect, attr: 'easing', value: breakpoint ? { value: easingValue, breakpoint } : easingValue };
	}

	if (/\bdelay\b/.test(lower)) {
		const delayValue = extractNumericValue(message, [
			/delay\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)/i,
		]);
		if (delayValue !== null) {
			return { effect, attr: 'delay', value: delayValue };
		}
	}

	if (/\bspeed\b/.test(lower)) {
		const speedValue = extractNumericValue(message, [
			/speed\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)/i,
		]);
		if (speedValue !== null) {
			return {
				effect,
				attr: 'speed',
				value: breakpoint ? { value: speedValue, breakpoint } : speedValue,
			};
		}
	}

	if (/(enable|on|turn\s*on|activate)/.test(lower)) {
		return {
			effect,
			attr: 'status',
			value: breakpoint ? { value: true, breakpoint } : true,
		};
	}
	if (/(disable|off|turn\s*off|deactivate|remove)/.test(lower)) {
		return {
			effect,
			attr: 'status',
			value: breakpoint ? { value: false, breakpoint } : false,
		};
	}

	return { effect, attr: 'status', value: breakpoint ? { value: true, breakpoint } : true };
};

const extractShapeDividerIntent = message => {
	const lower = String(message || '').toLowerCase();
	if (!/(shape\s*divider|divider\s*shape)/.test(lower)) return null;

	const position = /\bbottom\b/.test(lower) ? 'bottom' : /\btop\b/.test(lower) ? 'top' : null;
	if (!position) return null;

	const breakpoint = extractBreakpointToken(message);

	if (/effects/.test(lower)) {
		const isOn = !/(disable|off|turn\s*off)/.test(lower);
		return { position, attr: 'effects_status', value: isOn };
	}

	if (/shape\s*style|shape\s*type|divider\s*style/.test(lower)) {
		const styleMatch = lower.match(/\b(wave|curve|slant|triangle)\b/);
		if (styleMatch) {
			return { position, attr: 'shape_style', value: styleMatch[1] };
		}
	}

	if (/height/.test(lower)) {
		const heightValue = extractUnitValue(message, [
			/height\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?/i,
		]);
		if (heightValue) {
			return {
				position,
				attr: 'height',
				value: {
					value: heightValue.value,
					unit: heightValue.unit,
					...(breakpoint ? { breakpoint } : {}),
				},
			};
		}
	}

	if (/opacity/.test(lower)) {
		const opacityValue = extractNumericValue(message, [
			/opacity\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)(%)?/i,
		]);
		if (opacityValue !== null) {
			const normalized = opacityValue > 1 ? opacityValue / 100 : opacityValue;
			return {
				position,
				attr: 'opacity',
				value: breakpoint ? { value: normalized, breakpoint } : normalized,
			};
		}
	}

	if (/palette/.test(lower) && /opacity/.test(lower)) {
		const paletteOpacity = extractNumericValue(message, [
			/palette\s*opacity\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)/i,
		]);
		if (paletteOpacity !== null) {
			return {
				position,
				attr: 'palette_opacity',
				value: breakpoint ? { value: paletteOpacity, breakpoint } : paletteOpacity,
			};
		}
	}

	if (/palette/.test(lower) && /status/.test(lower)) {
		const isOn = !/(disable|off|turn\s*off)/.test(lower);
		return {
			position,
			attr: 'palette_status',
			value: breakpoint ? { value: isOn, breakpoint } : isOn,
		};
	}

	if (/palette/.test(lower) && /(single\s*color|sc)/.test(lower)) {
		const isOn = !/(disable|off|turn\s*off)/.test(lower);
		return {
			position,
			attr: 'palette_sc_status',
			value: breakpoint ? { value: isOn, breakpoint } : isOn,
		};
	}

	if (/palette/.test(lower) && /color/.test(lower)) {
		const paletteValue = extractNumericValue(message, [
			/palette\s*color\s*(?:to|=|:|is)?\s*(\d+)/i,
			/color\s*palette\s*(?:to|=|:|is)?\s*(\d+)/i,
		]);
		if (paletteValue !== null) {
			return {
				position,
				attr: 'palette_color',
				value: breakpoint ? { value: paletteValue, breakpoint } : paletteValue,
			};
		}
	}

	if (/color/.test(lower)) {
		const hexMatch = message.match(/(#[0-9a-f]{3,8})/i);
		const varMatch = message.match(/(var\(--[^)]+\))/i);
		const colorValue =
			(hexMatch && hexMatch[1]) ||
			(varMatch && varMatch[1]) ||
			null;
		if (colorValue) {
			return {
				position,
				attr: 'color',
				value: breakpoint ? { value: colorValue, breakpoint } : colorValue,
			};
		}
	}

	if (/(enable|on|turn\s*on|activate)/.test(lower)) {
		return {
			position,
			attr: 'status',
			value: true,
		};
	}
	if (/(disable|off|turn\s*off|deactivate|remove)/.test(lower)) {
		return {
			position,
			attr: 'status',
			value: false,
		};
	}

	return null;
};

const buildContainerSGroupAction = (message, { scope = 'selection' } = {}) => {
	const actionType = scope === 'page' ? 'update_page' : 'update_selection';
	const actionTarget = actionType === 'update_page' ? { target_block: 'container' } : {};

	const scrollIntent = extractScrollIntent(message);
	if (scrollIntent) {
		return {
			action: actionType,
			property: `scroll_${scrollIntent.effect}_${scrollIntent.attr}`,
			value: scrollIntent.value,
			message: 'Scroll effect updated.',
			...actionTarget,
		};
	}

	const shapeIntent = extractShapeDividerIntent(message);
	if (shapeIntent) {
		return {
			action: actionType,
			property: `shape_divider_${shapeIntent.position}_${shapeIntent.attr}`,
			value: shapeIntent.value,
			message: 'Shape divider updated.',
			...actionTarget,
		};
	}

	if (/advanced\s*size\s*options/.test(String(message || '').toLowerCase())) {
		return {
			action: actionType,
			property: 'size_advanced_options',
			value: true,
			message: 'Advanced size options enabled.',
			...actionTarget,
		};
	}

	return null;
};

const resolveScrollEffectFromProperty = property => {
	const raw = String(property || '').toLowerCase();
	const remainder = raw.replace(/^scroll_/, '');
	const ordered = [...SCROLL_EFFECT_ALIASES].sort((a, b) => b.key.length - a.key.length);

	for (const alias of ordered) {
		if (remainder === alias.key || remainder.startsWith(`${alias.key}_`)) {
			return { effect: alias.value, attr: remainder.slice(alias.key.length + 1) };
		}
	}
	return null;
};

const buildScrollChanges = (property, value) => {
	const resolved = resolveScrollEffectFromProperty(property);
	if (!resolved || !resolved.attr || !SCROLL_ACTION_ATTRS.has(resolved.attr)) return null;

	const { value: rawValue, unit, breakpoint } = normalizeValueWithBreakpoint(value);
	const bp = breakpoint || getActiveBreakpoint() || 'general';
	const statusKey = `scroll-${resolved.effect}-status-${bp}`;
	const shouldEnableStatus =
		resolved.attr !== 'status' && resolved.attr !== 'preview_status';

	switch (resolved.attr) {
		case 'status':
			return { [statusKey]: Boolean(rawValue) };
		case 'speed': {
			const changes = { [`scroll-${resolved.effect}-speed-${bp}`]: Number(rawValue) };
			if (shouldEnableStatus) changes[statusKey] = true;
			return changes;
		}
		case 'delay': {
			const changes = { [`scroll-${resolved.effect}-delay-general`]: Number(rawValue) };
			if (shouldEnableStatus) changes[statusKey] = true;
			return changes;
		}
		case 'easing': {
			const changes = { [`scroll-${resolved.effect}-easing-${bp}`]: String(rawValue) };
			if (shouldEnableStatus) changes[statusKey] = true;
			return changes;
		}
		case 'viewport_top': {
			const changes = { [`scroll-${resolved.effect}-viewport-top-${bp}`]: rawValue };
			if (shouldEnableStatus) changes[statusKey] = true;
			return changes;
		}
		case 'zones': {
			const zonesValue =
				rawValue && typeof rawValue === 'object' ? rawValue : value;
			const changes = { [`scroll-${resolved.effect}-zones-${bp}`]: zonesValue };
			if (shouldEnableStatus) changes[statusKey] = true;
			return changes;
		}
		case 'preview_status': {
			const changes = {
				[`scroll-${resolved.effect}-preview-status-general`]: Boolean(rawValue),
			};
			if (shouldEnableStatus) changes[statusKey] = true;
			return changes;
		}
		case 'is_block_zone': {
			const changes = {
				[`scroll-${resolved.effect}-is-block-zone-general`]: Boolean(rawValue),
			};
			if (shouldEnableStatus) changes[statusKey] = true;
			return changes;
		}
		case 'status_reverse': {
			const changes = {
				[`scroll-${resolved.effect}-status-reverse-general`]: Boolean(rawValue),
			};
			if (shouldEnableStatus) changes[statusKey] = true;
			return changes;
		}
		case 'unit': {
			const changes = { [`scroll-${resolved.effect}-unit-general`]: unit || rawValue };
			if (shouldEnableStatus) changes[statusKey] = true;
			return changes;
		}
		default:
			return null;
	}
};

const buildShapeDividerChanges = (position, attr, value) => {
	const { value: rawValue, unit, breakpoint } = normalizeValueWithBreakpoint(value);
	const bp = breakpoint || 'general';

	switch (attr) {
		case 'status':
			return { [`shape-divider-${position}-status`]: Boolean(rawValue) };
		case 'shape_style':
			return { [`shape-divider-${position}-shape-style`]: rawValue };
		case 'effects_status':
			return { [`shape-divider-${position}-effects-status`]: Boolean(rawValue) };
		case 'height': {
			const parsed = parseUnitValue({ value: rawValue, unit });
			return {
				[`shape-divider-${position}-height-${bp}`]: parsed.value,
				[`shape-divider-${position}-height-unit-${bp}`]: parsed.unit,
			};
		}
		case 'opacity':
			return { [`shape-divider-${position}-opacity-${bp}`]: Number(rawValue) };
		case 'color':
			return { [`shape-divider-${position}-color-${bp}`]: rawValue };
		case 'palette_color':
			return { [`shape-divider-${position}-palette-color-${bp}`]: rawValue };
		case 'palette_opacity':
			return { [`shape-divider-${position}-palette-opacity-${bp}`]: Number(rawValue) };
		case 'palette_status':
			return { [`shape-divider-${position}-palette-status-${bp}`]: Boolean(rawValue) };
		case 'palette_sc_status':
			return { [`shape-divider-${position}-palette-sc-status-${bp}`]: Boolean(rawValue) };
		default:
			return null;
	}
};

const buildContainerSGroupAttributeChanges = (property, value) => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');

	if (normalized.startsWith('scroll_')) {
		return buildScrollChanges(normalized, value);
	}

	if (normalized.startsWith('shape_divider_')) {
		const match = normalized.match(/^shape_divider_(top|bottom)_(.+)$/);
		if (!match) return null;
		const position = match[1];
		const attr = match[2];
		return buildShapeDividerChanges(position, attr, value);
	}

	switch (normalized) {
		case 'shortcut_effect':
			return { shortcutEffect: Number(value) };
		case 'shortcut_effect_type':
			return { shortcutEffectType: value };
		case 'show_warning_box':
			return { 'show-warning-box': Boolean(value) };
		case 'size_advanced_options':
			return { 'size-advanced-options': value };
		default:
			return null;
	}
};

const getContainerSGroupSidebarTarget = property => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');

	if (normalized.startsWith('scroll_') || normalized === 'shortcut_effect' || normalized === 'shortcut_effect_type') {
		return { tabIndex: 1, accordion: 'scroll effects' };
	}

	if (normalized.startsWith('shape_divider_')) {
		return { tabIndex: 0, accordion: 'shape divider' };
	}

	if (normalized === 'show_warning_box') {
		return { tabIndex: 0, accordion: 'callout arrow' };
	}

	if (normalized === 'size_advanced_options') {
		return { tabIndex: 0, accordion: 'height / width' };
	}

	return null;
};

return {
	buildContainerSGroupAction,
	buildContainerSGroupAttributeChanges,
	getContainerSGroupSidebarTarget,
};
})();

export const {
	buildContainerSGroupAction,
	buildContainerSGroupAttributeChanges,
	getContainerSGroupSidebarTarget,
} = containerSGroup;

// containerTGroup
const containerTGroup = (() => {
const BREAKPOINT_ALIASES = [
	{
		key: 'xxl',
		regex: /\bxxl\b|extra\s*wide|ultra\s*wide|wide\s*screen|wide\s*desktop/i,
	},
	{ key: 'xl', regex: /\bxl\b|desktop|large\s*screen/i },
	{ key: 'l', regex: /\bl\b|laptop|notebook/i },
	{ key: 'm', regex: /\bm\b|tablet|medium/i },
	{ key: 's', regex: /\bs\b|small/i },
	{ key: 'xs', regex: /\bxs\b|mobile|phone|handset/i },
	{
		key: 'general',
		regex: /\bgeneral\b|base\s*breakpoint|default\s*breakpoint/i,
	},
];

const TRANSFORM_TARGET_ALIASES = [
	{
		key: 'top shape divider',
		regex: /\btop\b.*shape\s*divider|\bshape\s*divider\b.*top/i,
	},
	{
		key: 'bottom shape divider',
		regex: /\bbottom\b.*shape\s*divider|\bshape\s*divider\b.*bottom/i,
	},
	{ key: 'background hover', regex: /\bbackground\b.*hover|\bhover\b.*background/i },
	{ key: 'background', regex: /\bbackground\b/i },
	{ key: 'before container', regex: /\bbefore\b.*container|\bcontainer\b.*before/i },
	{ key: 'after container', regex: /\bafter\b.*container|\bcontainer\b.*after/i },
	{ key: 'container', regex: /\bcontainer\b|\bsection\b|\bblock\b/i },
];

const TRANSITION_CANVAS_SETTINGS = [
	{ key: 'border', regex: /\bborder\b/i },
	{ key: 'box shadow', regex: /\bbox\s*shadow\b|\bshadow\b/i },
	{ key: 'background / layer', regex: /\bbackground\b|\blayer\b/i },
	{ key: 'opacity', regex: /\bopacity\b|\bfade\b/i },
];

const TRANSITION_TRANSFORM_SETTINGS = [
	{
		key: 'top shape divider',
		regex: /\btop\b.*shape\s*divider|\bshape\s*divider\b.*top/i,
	},
	{
		key: 'bottom shape divider',
		regex: /\bbottom\b.*shape\s*divider|\bshape\s*divider\b.*bottom/i,
	},
	{ key: 'background hover', regex: /\bbackground\b.*hover|\bhover\b.*background/i },
	{ key: 'background', regex: /\bbackground\b/i },
	{ key: 'before container', regex: /\bbefore\b.*container|\bcontainer\b.*before/i },
	{ key: 'after container', regex: /\bafter\b.*container|\bcontainer\b.*after/i },
	{ key: 'container', regex: /\bcontainer\b|\bsection\b|\bblock\b/i },
];

const extractNumericValue = (message, patterns) => {
	if (!message) return null;
	for (const pattern of patterns) {
		const match = message.match(pattern);
		if (match && match[1]) {
			const num = Number.parseFloat(match[1]);
			if (Number.isFinite(num)) return num;
		}
	}
	return null;
};

const extractUnitValue = (message, patterns) => {
	if (!message) return null;
	for (const pattern of patterns) {
		const match = message.match(pattern);
		if (match && match[1]) {
			const value = Number.parseFloat(match[1]);
			if (!Number.isFinite(value)) continue;
			return { value, unit: match[2] || 'px' };
		}
	}
	return null;
};

const extractBreakpointToken = message => {
	const lower = String(message || '').toLowerCase();
	for (const entry of BREAKPOINT_ALIASES) {
		if (entry.regex.test(lower)) return entry.key;
	}
	return null;
};

const getActiveBreakpoint = () => {
	try {
		const store = select?.('maxiBlocks');
		const device = store?.receiveMaxiDeviceType?.() || 'general';
		const base = store?.receiveBaseBreakpoint?.();
		if (device === 'general') return 'general';
		if (base && base === device) return 'general';
		return device || 'general';
	} catch (err) {
		return 'general';
	}
};

const normalizeValueWithBreakpoint = rawValue => {
	if (
		rawValue &&
		typeof rawValue === 'object' &&
		!Array.isArray(rawValue) &&
		Object.prototype.hasOwnProperty.call(rawValue, 'value')
	) {
		return {
			value: rawValue.value,
			unit: rawValue.unit,
			breakpoint: rawValue.breakpoint || null,
		};
	}

	return { value: rawValue, unit: null, breakpoint: null };
};

const resolveTransformTarget = message => {
	const lower = String(message || '').toLowerCase();
	for (const entry of TRANSFORM_TARGET_ALIASES) {
		if (entry.regex.test(lower)) return entry.key;
	}
	return null;
};

const normalizeScalePercent = (raw, isPercent = false) => {
	const value = Number(raw);
	if (!Number.isFinite(value)) return null;
	if (isPercent) return value;
	if (Math.abs(value) <= 10) return value * 100;
	return value;
};

const extractScaleValue = message => {
	const percentMatch = message.match(/(-?\d+(?:\.\d+)?)\s*%/i);
	if (percentMatch && percentMatch[1]) {
		return { value: normalizeScalePercent(percentMatch[1], true), isPercent: true };
	}
	const numeric = extractNumericValue(message, [
		/(?:scale|zoom|grow|shrink)\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)/i,
	]);
	if (numeric !== null) {
		return { value: normalizeScalePercent(numeric, false), isPercent: false };
	}
	return null;
};

const extractRotateValue = message =>
	extractNumericValue(message, [
		/rotate\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)/i,
		/(-?\d+(?:\.\d+)?)\s*deg/i,
		/tilt\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)/i,
	]);

const extractTranslateValues = message => {
	const xMatch = message.match(/\bx\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem)?/i);
	const yMatch = message.match(/\by\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem)?/i);

	if (xMatch || yMatch) {
		return {
			x: xMatch ? Number(xMatch[1]) : 0,
			y: yMatch ? Number(yMatch[1]) : 0,
			unit: (xMatch && xMatch[2]) || (yMatch && yMatch[2]) || 'px',
		};
	}

	const pairMatch = message.match(
		/translate\s*(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem)?\s*(?:,|\s)\s*(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem)?/i
	);
	if (pairMatch) {
		return {
			x: Number(pairMatch[1]),
			y: Number(pairMatch[3]),
			unit: pairMatch[2] || pairMatch[4] || 'px',
		};
	}

	const directionMatch = message.match(
		/(left|right|up|down)\s*(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem)?/i
	);
	if (directionMatch) {
		const direction = directionMatch[1].toLowerCase();
		const amount = Number(directionMatch[2]);
		const unit = directionMatch[3] || 'px';
		return {
			x: direction === 'left' ? -amount : direction === 'right' ? amount : 0,
			y: direction === 'up' ? -amount : direction === 'down' ? amount : 0,
			unit,
		};
	}

	return null;
};

const extractOriginValue = message => {
	const lower = String(message || '').toLowerCase();
	if (/\btop\s*left\b/.test(lower)) return { x: 'left', y: 'top' };
	if (/\btop\s*right\b/.test(lower)) return { x: 'right', y: 'top' };
	if (/\bbottom\s*left\b/.test(lower)) return { x: 'left', y: 'bottom' };
	if (/\bbottom\s*right\b/.test(lower)) return { x: 'right', y: 'bottom' };
	if (/\btop\b/.test(lower)) return { x: 'middle', y: 'top' };
	if (/\bbottom\b/.test(lower)) return { x: 'middle', y: 'bottom' };
	if (/\bleft\b/.test(lower)) return { x: 'left', y: 'center' };
	if (/\bright\b/.test(lower)) return { x: 'right', y: 'center' };
	if (/\bcenter\b|\bcentre\b|\bmiddle\b/.test(lower)) {
		return { x: 'middle', y: 'center' };
	}
	return null;
};

const extractTransitionDuration = message => {
	const match = message.match(
		/(duration|time)\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)(ms|s)?/i
	);
	if (!match) return null;
	let value = Number(match[2]);
	if (!Number.isFinite(value)) return null;
	const unit = match[3];
	if (unit === 'ms' || (!unit && value > 5)) {
		value = value / 1000;
	}
	return value;
};

const extractTransitionDelay = message => {
	const match = message.match(
		/delay\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)(ms|s)?/i
	);
	if (!match) return null;
	let value = Number(match[1]);
	if (!Number.isFinite(value)) return null;
	const unit = match[2];
	if (unit === 'ms' || (!unit && value > 5)) {
		value = value / 1000;
	}
	return value;
};

const extractEasingValue = message => {
	const lower = String(message || '').toLowerCase();
	const match = lower.match(/easing\s*(?:to|=|:|is)?\s*([a-z-]+)/i);
	if (match && match[1]) return match[1];
	if (/\bease-in-out\b/.test(lower)) return 'ease-in-out';
	if (/\bease-in\b/.test(lower)) return 'ease-in';
	if (/\bease-out\b/.test(lower)) return 'ease-out';
	if (/\bease\b/.test(lower)) return 'ease';
	if (/\blinear\b/.test(lower)) return 'linear';
	return null;
};

const resolveTransitionSetting = (message, type) => {
	const lower = String(message || '').toLowerCase();
	const pool = type === 'transform' ? TRANSITION_TRANSFORM_SETTINGS : TRANSITION_CANVAS_SETTINGS;
	for (const entry of pool) {
		if (entry.regex.test(lower)) return entry.key;
	}
	return null;
};

const extractTransformIntent = message => {
	const lower = String(message || '').toLowerCase();
	const breakpoint = extractBreakpointToken(message);
	const target = resolveTransformTarget(message) || 'container';
	const state = /\bhover\b/.test(lower) ? 'hover' : 'normal';
	// "zoom" is ambiguous (e.g. Map Maxi zoom level). Avoid treating map zoom
	// requests as container transform scaling.
	const isMapZoomRequest =
		/\bmap\b/.test(lower) &&
		/\bzoom\b/.test(lower) &&
		!/\bhover\b/.test(lower);
	const isZoomLimitRequest =
		/\b(min(?:imum)?|max(?:imum)?)\s*zoom\b/.test(lower) &&
		!/\bhover\b/.test(lower);

	if (/(transform\s*target|target\s*transform|transform\s*on)/.test(lower)) {
		return {
			property: 'transform_target',
			value: target,
		};
	}

	if (/origin/.test(lower)) {
		const origin = extractOriginValue(message);
		if (origin) {
			return {
				property: 'transform_origin',
				value: { ...origin, target, state, breakpoint },
			};
		}
	}

	if (/(translate|move|shift)/.test(lower)) {
		const translate = extractTranslateValues(message);
		if (translate) {
			return {
				property: 'transform_translate',
				value: { ...translate, target, state, breakpoint },
			};
		}
	}

	if (!isMapZoomRequest && !isZoomLimitRequest && /(scale|zoom|grow|shrink)/.test(lower)) {
		const scale = extractScaleValue(message);
		if (scale && scale.value !== null) {
			return {
				property: state === 'hover' ? 'transform_scale_hover' : 'transform_scale',
				value: {
					x: scale.value,
					y: scale.value,
					target,
					state,
					breakpoint,
				},
			};
		}
	}

	if (/(rotate|tilt|spin)/.test(lower)) {
		const rotate = extractRotateValue(message);
		if (rotate !== null) {
			return {
				property: 'transform_rotate',
				value: { z: rotate, target, state, breakpoint },
			};
		}
	}

	return null;
};

const extractTransitionIntent = message => {
	const lower = String(message || '').toLowerCase();
	if (!/transition/.test(lower)) return null;

	if (/(change|apply|set).*all\s*transitions|all\s*transitions/.test(lower)) {
		const isOn = !/(disable|off|turn\s*off|remove)/.test(lower);
		return {
			property: 'transition_change_all',
			value: isOn,
		};
	}

	const isTransform = /\btransform\b/.test(lower);
	const type = isTransform ? 'transform' : 'canvas';
	const setting = resolveTransitionSetting(message, type);

	if (/(select|choose|setting|target)/.test(lower) && setting) {
		return {
			property:
				type === 'transform'
					? 'transition_transform_selected'
					: 'transition_canvas_selected',
			value: setting,
		};
	}

	const duration = extractTransitionDuration(message);
	if (duration !== null) {
		return {
			property: 'transition',
			value: {
				type,
				setting,
				attr: 'duration',
				value: duration,
				breakpoint: extractBreakpointToken(message),
			},
		};
	}

	const delay = extractTransitionDelay(message);
	if (delay !== null) {
		return {
			property: 'transition',
			value: {
				type,
				setting,
				attr: 'delay',
				value: delay,
				breakpoint: extractBreakpointToken(message),
			},
		};
	}

	const easing = extractEasingValue(message);
	if (easing) {
		return {
			property: 'transition',
			value: {
				type,
				setting,
				attr: 'easing',
				value: easing,
				breakpoint: extractBreakpointToken(message),
			},
		};
	}

	if (/(disable|off|turn\s*off)\s*transition/.test(lower)) {
		return {
			property: 'transition',
			value: {
				type,
				setting,
				attr: 'status',
				value: false,
				breakpoint: extractBreakpointToken(message),
			},
		};
	}

	if (/(enable|on|turn\s*on)\s*transition/.test(lower)) {
		return {
			property: 'transition',
			value: {
				type,
				setting,
				attr: 'status',
				value: true,
				breakpoint: extractBreakpointToken(message),
			},
		};
	}

	return null;
};

const buildTransformChanges = (type, rawValue, { defaultTarget = 'container' } = {}) => {
	const { value: rawVal, unit, breakpoint } = normalizeValueWithBreakpoint(rawValue);
	const bp = rawValue?.breakpoint || breakpoint || getActiveBreakpoint() || 'general';
	const target = rawValue?.target || defaultTarget;
	const state = rawValue?.state === 'hover' || rawValue?.hover ? 'hover' : 'normal';
	const transformTarget = target || defaultTarget;

	const entry = {};

	if (type === 'scale') {
		const x = rawValue?.x ?? rawVal ?? 100;
		const y = rawValue?.y ?? rawVal ?? 100;
		entry.x = Number(x);
		entry.y = Number(y);
	}

	if (type === 'translate') {
		const x = rawValue?.x ?? 0;
		const y = rawValue?.y ?? 0;
		const unitValue = rawValue?.unit || unit || 'px';
		entry.x = Number(x);
		entry.y = Number(y);
		entry['x-unit'] = unitValue;
		entry['y-unit'] = unitValue;
	}

	if (type === 'rotate') {
		const x = rawValue?.x ?? null;
		const y = rawValue?.y ?? null;
		const z = rawValue?.z ?? rawVal ?? 0;
		if (x !== null) entry.x = Number(x);
		if (y !== null) entry.y = Number(y);
		entry.z = Number(z);
	}

	if (type === 'origin') {
		const x = rawValue?.x ?? rawVal ?? 'middle';
		const y = rawValue?.y ?? rawVal ?? 'center';
		const xUnit = rawValue?.['x-unit'];
		const yUnit = rawValue?.['y-unit'];
		entry.x = x;
		entry.y = y;
		if (xUnit) entry['x-unit'] = xUnit;
		if (yUnit) entry['y-unit'] = yUnit;
	}

	const targetEntry = { [state]: entry };
	if (state === 'hover') {
		targetEntry['hover-status'] = true;
	}

	return {
		[`transform-${type}-${bp}`]: {
			[transformTarget]: targetEntry,
		},
		'transform-target': transformTarget,
	};
};

const resolveTransitionSelection = (transitions, type, requested) => {
	const typeTransitions = transitions?.[type] || {};
	if (requested && typeTransitions[requested]) return requested;
	if (requested && typeTransitions && Object.keys(typeTransitions).length) {
		const normalizedRequested = String(requested).toLowerCase();
		const match = Object.keys(typeTransitions).find(
			key => String(key).toLowerCase() === normalizedRequested
		);
		if (match) return match;
	}
	if (Object.keys(typeTransitions || {}).length) {
		return Object.keys(typeTransitions)[0];
	}
	return requested || (type === 'transform' ? 'container' : 'border');
};

const buildTransitionChanges = (rawValue, attributes = {}) => {
	if (!rawValue || typeof rawValue !== 'object') return null;

	const transitions = attributes.transition || {};
	const type = rawValue.type === 'transform' ? 'transform' : 'canvas';
	const selected = resolveTransitionSelection(
		transitions,
		type,
		rawValue.setting
	);
	const breakpoint = rawValue.breakpoint || getActiveBreakpoint() || 'general';

	let attrKey = null;
	switch (rawValue.attr) {
		case 'duration':
			attrKey = `transition-duration-${breakpoint}`;
			break;
		case 'delay':
			attrKey = `transition-delay-${breakpoint}`;
			break;
		case 'easing':
			attrKey = `easing-${breakpoint}`;
			break;
		case 'status':
			attrKey = `transition-status-${breakpoint}`;
			break;
		default:
			return null;
	}

	const typeTransitions = transitions[type] || {};
	const selectedTransition = typeTransitions[selected] || {};
	const updatedSelected = { ...selectedTransition, [attrKey]: rawValue.value };

	return {
		transition: {
			...transitions,
			[type]: {
				...typeTransitions,
				[selected]: updatedSelected,
			},
		},
		[`transition-${type}-selected`]: selected,
	};
};

const buildContainerTGroupAction = (message, { scope = 'selection' } = {}) => {
	const actionType = scope === 'page' ? 'update_page' : 'update_selection';
	const actionTarget = actionType === 'update_page' ? { target_block: 'container' } : {};

	const transitionIntent = extractTransitionIntent(message);
	if (transitionIntent) {
		return {
			action: actionType,
			property: transitionIntent.property,
			value: transitionIntent.value,
			message: 'Transition updated.',
			...actionTarget,
		};
	}

	const transformIntent = extractTransformIntent(message);
	if (transformIntent) {
		return {
			action: actionType,
			property: transformIntent.property,
			value: transformIntent.value,
			message: 'Transform updated.',
			...actionTarget,
		};
	}

	return null;
};

const buildContainerTGroupAttributeChanges = (property, value, { attributes } = {}) => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');
	const defaultTarget = attributes?.['transform-target'] || 'container';

	switch (normalized) {
		case 'transform_scale':
			return buildTransformChanges('scale', value, { defaultTarget });
		case 'transform_scale_hover': {
			if (value && typeof value === 'object') {
				return buildTransformChanges('scale', {
					...value,
					state: value.state || 'hover',
				}, { defaultTarget });
			}
			return buildTransformChanges('scale', {
				x: value,
				y: value,
				state: 'hover',
			}, { defaultTarget });
		}
		case 'transform_rotate':
			return buildTransformChanges('rotate', value, { defaultTarget });
		case 'transform_translate':
			return buildTransformChanges('translate', value, { defaultTarget });
		case 'transform_origin':
			return buildTransformChanges('origin', value, { defaultTarget });
		case 'transform_target':
			return { 'transform-target': value || 'container' };
		case 'transition':
			return buildTransitionChanges(value, attributes);
		case 'transition_change_all':
			return { 'transition-change-all': Boolean(value) };
		case 'transition_canvas_selected':
			return { 'transition-canvas-selected': value };
		case 'transition_transform_selected':
			return { 'transition-transform-selected': value };
		default:
			return null;
	}
};

const getContainerTGroupSidebarTarget = property => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');

	if (normalized.startsWith('transform_')) {
		return { tabIndex: 1, accordion: 'transform' };
	}

	if (normalized.startsWith('transition_') || normalized === 'transition') {
		return { tabIndex: 1, accordion: 'hover transition' };
	}

	return null;
};

return {
	buildContainerTGroupAction,
	buildContainerTGroupAttributeChanges,
	getContainerTGroupSidebarTarget,
};
})();

export const {
	buildContainerTGroupAction,
	buildContainerTGroupAttributeChanges,
	getContainerTGroupSidebarTarget,
} = containerTGroup;

// containerWGroup
const containerWGroup = (() => {
const RESPONSIVE_BREAKPOINTS = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const BREAKPOINT_ALIASES = [
	{
		key: 'xxl',
		regex: /\bxxl\b|extra\s*wide|ultra\s*wide|wide\s*screen|wide\s*desktop/i,
	},
	{ key: 'xl', regex: /\bxl\b|desktop|large\s*screen/i },
	{ key: 'l', regex: /\bl\b|laptop|notebook/i },
	{ key: 'm', regex: /\bm\b|tablet|medium/i },
	{ key: 's', regex: /\bs\b|small/i },
	{ key: 'xs', regex: /\bxs\b|mobile|phone|handset/i },
	{
		key: 'general',
		regex: /\bgeneral\b|base\s*breakpoint|default\s*breakpoint/i,
	},
];

const extractUnitValue = (message, patterns) => {
	if (!message) return null;
	for (const pattern of patterns) {
		const match = message.match(pattern);
		if (match && match[1]) {
			const value = Number.parseFloat(match[1]);
			if (!Number.isFinite(value)) continue;
			return { value, unit: match[2] || 'px' };
		}
	}
	return null;
};

const extractBreakpointToken = message => {
	const lower = String(message || '').toLowerCase();
	for (const entry of BREAKPOINT_ALIASES) {
		if (entry.regex.test(lower)) return entry.key;
	}
	return null;
};

const normalizeValueWithBreakpoint = rawValue => {
	if (
		rawValue &&
		typeof rawValue === 'object' &&
		!Array.isArray(rawValue) &&
		Object.prototype.hasOwnProperty.call(rawValue, 'value')
	) {
		return {
			value: rawValue.value,
			unit: rawValue.unit,
			breakpoint: rawValue.breakpoint || null,
		};
	}

	return { value: rawValue, unit: null, breakpoint: null };
};

const getResponsiveScaleFactor = breakpoint => {
	if (breakpoint === 'm' || breakpoint === 's') return 0.6;
	if (breakpoint === 'xs') return 0.4;
	return 1;
};

const shouldScaleResponsiveUnit = unit => {
	const normalizedUnit = String(unit || '').toLowerCase();
	return !['', '-', '%', 'vw', 'vh', 'ch'].includes(normalizedUnit);
};

const roundResponsiveValue = (value, unit) => {
	const numeric = Number(value);
	if (!Number.isFinite(numeric)) return value;
	const normalizedUnit = String(unit || '').toLowerCase();
	if (normalizedUnit === 'px') {
		if (Math.abs(numeric) < 2) return Math.round(numeric * 100) / 100;
		return Math.round(numeric);
	}
	return Math.round(numeric * 100) / 100;
};

const buildResponsiveScaledValues = ({ value, unit } = {}) => {
	const numericValue = Number(value);
	const safeValue = Number.isFinite(numericValue) ? numericValue : 0;
	const canScale = shouldScaleResponsiveUnit(unit);
	const values = {};

	RESPONSIVE_BREAKPOINTS.forEach(bp => {
		const factor = canScale ? getResponsiveScaleFactor(bp) : 1;
		const nextValue = safeValue * factor;
		values[bp] = roundResponsiveValue(nextValue, unit);
	});

	return values;
};

const parseUnitValue = (rawValue, fallbackUnit = 'px') => {
	if (rawValue === null || rawValue === undefined) {
		return { value: 0, unit: fallbackUnit };
	}

	if (typeof rawValue === 'number') {
		return { value: rawValue, unit: fallbackUnit };
	}

	if (typeof rawValue === 'object') {
		const size =
			rawValue.value ??
			rawValue.size ??
			rawValue.amount ??
			rawValue.width;
		const unit = rawValue.unit || fallbackUnit;
		return { value: Number(size) || 0, unit };
	}

	const raw = String(rawValue).trim();
	const match = raw.match(/^(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?$/i);
	if (match) {
		return { value: Number(match[1]), unit: match[2] || fallbackUnit };
	}

	const parsed = Number.parseFloat(raw);
	return { value: Number.isNaN(parsed) ? 0 : parsed, unit: fallbackUnit };
};

const isFitContentValue = value => {
	if (!value) return false;
	const lower = String(value).toLowerCase();
	return (
		lower.includes('fit-content') ||
		lower.includes('fit content') ||
		lower === 'auto' ||
		lower === 'fit'
	);
};

const buildFitContentChanges = (breakpoint, prefix = '') => {
	if (breakpoint) {
		return { [`${prefix}width-fit-content-${breakpoint}`]: true };
	}

	const changes = {};
	RESPONSIVE_BREAKPOINTS.forEach(bp => {
		changes[`${prefix}width-fit-content-${bp}`] = true;
	});
	return changes;
};

const buildWidthChanges = (value, prefix = '') => {
	const { value: rawValue, unit, breakpoint } = normalizeValueWithBreakpoint(value);

	if (isFitContentValue(rawValue)) {
		return buildFitContentChanges(breakpoint, prefix);
	}

	const parsed = parseUnitValue({ value: rawValue, unit });
	const changes = {};

	if (breakpoint) {
		changes[`${prefix}width-${breakpoint}`] = parsed.value;
		changes[`${prefix}width-unit-${breakpoint}`] = parsed.unit;
		changes[`${prefix}width-fit-content-${breakpoint}`] = false;
		return changes;
	}

	const values = buildResponsiveScaledValues({
		value: parsed.value,
		unit: parsed.unit,
	});

	RESPONSIVE_BREAKPOINTS.forEach(bp => {
		changes[`${prefix}width-${bp}`] = values[bp];
		changes[`${prefix}width-unit-${bp}`] = parsed.unit;
		changes[`${prefix}width-fit-content-${bp}`] = false;
	});

	return changes;
};

const extractWidthIntent = message => {
	const lower = String(message || '').toLowerCase();
	if (!/(width|wide)/.test(lower)) return null;
	if (
		/max(?:imum)?\s*width/.test(lower) ||
		/min(?:imum)?\s*width/.test(lower) ||
		/full\s*width|edge\s*to\s*edge/.test(lower)
	) {
		return null;
	}

	// Avoid misclassifying stroke/line width as layout width.
	if (/\b(?:line|stroke|border|outline)[-\s]*width\b/.test(lower)) {
		return null;
	}

	if (
		/fit[-\s]*content/.test(lower) ||
		/\bwidth\s*auto\b/.test(lower) ||
		/\bauto\s*width\b/.test(lower) ||
		/hug\s*content/.test(lower) ||
		/shrink\s*to\s*content/.test(lower)
	) {
		return { type: 'fit-content' };
	}

	const unitValue = extractUnitValue(message, [
		/width\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?/i,
		/(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?\s*wide\b/i,
		/\bwide\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?/i,
	]);
	if (!unitValue) return null;
	return { type: 'width', value: unitValue.value, unit: unitValue.unit };
};

const buildContainerWGroupAction = (
	message,
	{ scope = 'selection', targetBlock = null, blockName = null } = {}
) => {
	const actionType = scope === 'page' ? 'update_page' : 'update_selection';
	const isColumnContext =
		targetBlock === 'column' ||
		String(blockName || '').includes('column') ||
		/\bcolumns?\b/i.test(String(message || ''));
	const actionTarget =
		actionType === 'update_page'
			? { target_block: isColumnContext ? 'column' : 'container' }
			: isColumnContext
				? { target_block: 'column' }
				: {};

	const lowerMessage = String(message || '').toLowerCase();
	if (isColumnContext) {
		const disableFitContent = /(disable|turn\s*off|remove|clear)\s*fit\s*content|fixed\s*width|fixed\s*size|use\s*percent(?:age)?\s*width/.test(
			lowerMessage
		);
		if (disableFitContent) {
			return {
				action: actionType,
				property: 'column_fit_content',
				value: false,
				message: 'Column fit content disabled.',
				...actionTarget,
			};
		}
	}

	const intent = extractWidthIntent(message);
	if (!intent) return null;

	const breakpoint = extractBreakpointToken(message);
	if (intent.type === 'fit-content') {
		const fitValue = breakpoint ? { value: true, breakpoint } : true;
		return {
			action: actionType,
			property: isColumnContext ? 'column_fit_content' : 'width',
			value: isColumnContext ? fitValue : (breakpoint ? { value: 'fit-content', breakpoint } : 'fit-content'),
			message: isColumnContext ? 'Column set to fit content.' : 'Width updated.',
			...actionTarget,
		};
	}

	if (isColumnContext) {
		return {
			action: actionType,
			property: 'column_size',
			value: breakpoint ? { value: intent.value, breakpoint } : intent.value,
			message: 'Column size updated.',
			...actionTarget,
		};
	}

	return {
		action: actionType,
		property: 'width',
		value: breakpoint
			? { value: intent.value, unit: intent.unit, breakpoint }
			: { value: intent.value, unit: intent.unit },
		message: 'Width updated.',
		...actionTarget,
	};
};

const buildContainerWGroupAttributeChanges = (property, value, { prefix = '' } = {}) => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');

	switch (normalized) {
		case 'width':
			return buildWidthChanges(value, prefix);
		case 'width_fit_content': {
			const { breakpoint } = normalizeValueWithBreakpoint(value);
			const isEnabled = value === undefined ? true : Boolean(value);
			if (!isEnabled) return null;
			return buildFitContentChanges(breakpoint, prefix);
		}
		default:
			return null;
	}
};

const getContainerWGroupSidebarTarget = property => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');

	if (['width', 'width_fit_content'].includes(normalized)) {
		return { tabIndex: 0, accordion: 'height / width' };
	}

	return null;
};

return {
	buildContainerWGroupAction,
	buildContainerWGroupAttributeChanges,
	getContainerWGroupSidebarTarget,
};
})();

export const {
	buildContainerWGroupAction,
	buildContainerWGroupAttributeChanges,
	getContainerWGroupSidebarTarget,
} = containerWGroup;

// containerZGroup
const containerZGroup = (() => {
const BREAKPOINT_ALIASES = [
	{
		key: 'xxl',
		regex: /\bxxl\b|extra\s*wide|ultra\s*wide|wide\s*screen|wide\s*desktop/i,
	},
	{ key: 'xl', regex: /\bxl\b|desktop|large\s*screen/i },
	{ key: 'l', regex: /\bl\b|laptop|notebook/i },
	{ key: 'm', regex: /\bm\b|tablet|medium/i },
	{ key: 's', regex: /\bs\b|small/i },
	{ key: 'xs', regex: /\bxs\b|mobile|phone|handset/i },
	{
		key: 'general',
		regex: /\bgeneral\b|base\s*breakpoint|default\s*breakpoint/i,
	},
];

const extractNumericValue = (message, patterns) => {
	if (!message) return null;
	for (const pattern of patterns) {
		const match = message.match(pattern);
		if (match && match[1]) {
			const num = Number.parseFloat(match[1]);
			if (Number.isFinite(num)) return num;
		}
	}
	return null;
};

const extractBreakpointToken = message => {
	const lower = String(message || '').toLowerCase();
	for (const entry of BREAKPOINT_ALIASES) {
		if (entry.regex.test(lower)) return entry.key;
	}
	return null;
};

const normalizeValueWithBreakpoint = rawValue => {
	if (
		rawValue &&
		typeof rawValue === 'object' &&
		!Array.isArray(rawValue) &&
		Object.prototype.hasOwnProperty.call(rawValue, 'value')
	) {
		return {
			value: rawValue.value,
			breakpoint: rawValue.breakpoint || null,
		};
	}

	return { value: rawValue, breakpoint: null };
};

const extractZIndexValue = message => {
	const lower = String(message || '').toLowerCase();
	if (!/z[-\s]*index/.test(lower)) return null;
	return extractNumericValue(message, [
		/z[-\s]*index\s*(?:to|=|:|is)?\s*(-?\d+)/i,
		/(-?\d+)\s*z[-\s]*index/i,
	]);
};

const buildZIndexChanges = value => {
	const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
	const numeric = Number(rawValue);
	if (!Number.isFinite(numeric)) return null;
	const key = breakpoint ? `z-index-${breakpoint}` : 'z-index-general';
	return { [key]: numeric };
};

const buildContainerZGroupAction = (message, { scope = 'selection' } = {}) => {
	const actionType = scope === 'page' ? 'update_page' : 'update_selection';
	const actionTarget = actionType === 'update_page' ? { target_block: 'container' } : {};

	const zIndexValue = extractZIndexValue(message);
	if (zIndexValue === null) return null;

	const breakpoint = extractBreakpointToken(message);
	return {
		action: actionType,
		property: 'z_index',
		value: breakpoint ? { value: zIndexValue, breakpoint } : zIndexValue,
		message: 'Z-index updated.',
		...actionTarget,
	};
};

const buildContainerZGroupAttributeChanges = (property, value) => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');

	switch (normalized) {
		case 'z_index':
			return buildZIndexChanges(value);
		default:
			return null;
	}
};

const getContainerZGroupSidebarTarget = property => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');

	if (normalized === 'z_index') {
		return { tabIndex: 1, accordion: 'z-index' };
	}

	return null;
};

return {
	buildContainerZGroupAction,
	buildContainerZGroupAttributeChanges,
	getContainerZGroupSidebarTarget,
};
})();

export const {
	buildContainerZGroupAction,
	buildContainerZGroupAttributeChanges,
	getContainerZGroupSidebarTarget,
} = containerZGroup;
