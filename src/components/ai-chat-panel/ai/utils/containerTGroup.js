import { select } from '@wordpress/data';

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

	if (/(scale|zoom|grow|shrink)/.test(lower)) {
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
	const bp = breakpoint || getActiveBreakpoint() || 'general';
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

export const buildContainerTGroupAction = (message, { scope = 'selection' } = {}) => {
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

export const buildContainerTGroupAttributeChanges = (property, value, { attributes } = {}) => {
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

export const getContainerTGroupSidebarTarget = property => {
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

export default {
	buildContainerTGroupAction,
	buildContainerTGroupAttributeChanges,
	getContainerTGroupSidebarTarget,
};
