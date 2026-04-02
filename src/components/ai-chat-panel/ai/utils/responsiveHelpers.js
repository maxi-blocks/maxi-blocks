/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Responsive Helpers
 *
 * Pure utility functions for building responsive attribute objects across
 * MaxiBlocks breakpoints. No React state dependencies — safe to import
 * anywhere.
 */

export const parseUnitValue = (rawValue, fallbackUnit = 'px') => {
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
			rawValue.height ??
			rawValue.width ??
			rawValue.amount;
		const unit = rawValue.unit || fallbackUnit;
		return { value: Number(size) || 0, unit };
	}

	const raw = String(rawValue).trim();
	const match = raw.match(/^(-?\d+(?:\.\d+)?)(?:\s*(px|%|vh|vw|em|rem|ch))?$/i);
	if (match) {
		return { value: Number(match[1]), unit: match[2] || fallbackUnit };
	}

	const parsed = Number.parseFloat(raw);
	return { value: Number.isNaN(parsed) ? 0 : parsed, unit: fallbackUnit };
};

export const RESPONSIVE_BREAKPOINTS = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

export const getResponsiveScaleFactor = breakpoint => {
	if (breakpoint === 'm' || breakpoint === 's') return 0.6;
	if (breakpoint === 'xs') return 0.4;
	return 1;
};

export const roundResponsiveValue = (value, unit) => {
	const numeric = Number(value);
	if (!Number.isFinite(numeric)) return value;
	const normalizedUnit = String(unit || '').toLowerCase();
	if (normalizedUnit === 'px') {
		if (Math.abs(numeric) < 2) return Math.round(numeric * 100) / 100;
		return Math.round(numeric);
	}
	return Math.round(numeric * 100) / 100;
};

export const shouldScaleResponsiveUnit = (unit, forceScale) => {
	if (forceScale) return true;
	const normalizedUnit = String(unit || '').toLowerCase();
	return !['', '-', '%', 'vw', 'vh', 'ch'].includes(normalizedUnit);
};

export const buildResponsiveScaledValues = ({ value, unit, forceScale = false, min = null } = {}) => {
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

export const buildResponsiveBooleanChanges = (prefix, key, value) => {
	const changes = {};
	RESPONSIVE_BREAKPOINTS.forEach(bp => {
		changes[`${prefix}${key}-${bp}`] = value;
	});
	return changes;
};

export const buildResponsiveValueChanges = (key, value) => {
	const changes = {};
	RESPONSIVE_BREAKPOINTS.forEach(bp => {
		changes[`${key}-${bp}`] = value;
	});
	return changes;
};

export const normalizeValueWithBreakpoint = rawValue => {
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

export const buildResponsiveSizeChanges = (
	prefix,
	key,
	value,
	unit,
	includeAdvancedOptions = false,
	options = {}
) => {
	const values = buildResponsiveScaledValues({
		value,
		unit,
		forceScale: options.forceScale,
		min: options.min,
	});
	const changes = {};

	RESPONSIVE_BREAKPOINTS.forEach(bp => {
		changes[`${prefix}${key}-${bp}`] = values[bp];
		changes[`${prefix}${key}-unit-${bp}`] = unit;
	});

	if (includeAdvancedOptions) {
		changes[`${prefix}size-advanced-options`] = true;
	}

	return changes;
};

export const getActiveBreakpoint = () => {
	const maxiStore = select('maxiBlocks');
	return maxiStore?.receiveMaxiDeviceType?.() || 'general';
};

export const getBaseBreakpoint = () => {
	const maxiStore = select('maxiBlocks');
	return maxiStore?.receiveBaseBreakpoint?.() || null;
};

export const buildBreakpointChanges = (prefix, key, value) => {
	const bp = getActiveBreakpoint();
	const base = getBaseBreakpoint();
	const changes = {
		[`${prefix}${key}-${bp}`]: value,
	};

	if (bp === 'general' && base) {
		changes[`${prefix}${key}-${base}`] = value;
	}

	return changes;
};

export const buildSizeChanges = (prefix, key, value, unit, includeAdvancedOptions = false) => {
	const bp = getActiveBreakpoint();
	const base = getBaseBreakpoint();
	const strValue = String(value);
	const changes = {
		[`${prefix}${key}-${bp}`]: strValue,
		[`${prefix}${key}-unit-${bp}`]: unit,
	};

	if (includeAdvancedOptions) {
		changes[`${prefix}size-advanced-options`] = true;
	}

	if (bp === 'general' && base) {
		changes[`${prefix}${key}-${base}`] = strValue;
		changes[`${prefix}${key}-unit-${base}`] = unit;
	}

	return changes;
};

/**
 * @param {number|string|{value,unit?,breakpoint?}} rawValue
 * @param {string} prefix
 */
export const buildWidthChanges = ( rawValue, prefix = '' ) => {
	if ( typeof rawValue === 'string' ) {
		const normalized = rawValue.trim().toLowerCase();
		if ( normalized === 'auto' || normalized === 'fit-content' || normalized === 'fit content' ) {
			return buildResponsiveBooleanChanges( prefix, 'width-fit-content', true );
		}
	}

	const { value: inner, breakpoint: bpOverride } = normalizeValueWithBreakpoint( rawValue );
	const parsed = parseUnitValue( inner );
	const unit   = ( rawValue && typeof rawValue === 'object' && rawValue.unit ) ? rawValue.unit : parsed.unit;

	if ( bpOverride ) {
		return {
			[ `${ prefix }width-${ bpOverride }` ]:           parsed.value,
			[ `${ prefix }width-unit-${ bpOverride }` ]:       unit,
			[ `${ prefix }width-fit-content-${ bpOverride }` ]: false,
		};
	}

	return {
		...buildResponsiveSizeChanges( prefix, 'width', parsed.value, unit, false ),
		...buildResponsiveBooleanChanges( prefix, 'width-fit-content', false ),
	};
};

/**
 * @param {number|string|{value,unit?,breakpoint?}} rawValue
 * @param {string} prefix
 */
export const buildHeightChanges = ( rawValue, prefix = '' ) => {
	const { value: inner, breakpoint: bpOverride } = normalizeValueWithBreakpoint( rawValue );
	const parsed = parseUnitValue( inner );
	const unit   = ( rawValue && typeof rawValue === 'object' && rawValue.unit ) ? rawValue.unit : parsed.unit;

	if ( bpOverride ) {
		return {
			[ `${ prefix }height-${ bpOverride }` ]:      parsed.value,
			[ `${ prefix }height-unit-${ bpOverride }` ]: unit,
		};
	}

	return buildResponsiveSizeChanges( prefix, 'height', parsed.value, unit, false );
};

export const buildContextLoopChanges = (value = {}) => {
	if (!value || typeof value !== 'object') return null;

	const changes = {
		'cl-status': value.status === undefined ? true : Boolean(value.status),
		'cl-source': value.source,
		'cl-type': value.type,
		'cl-relation': value.relation,
		'cl-id': value.id,
		'cl-author': value.author,
		'cl-order-by': value.orderBy,
		'cl-order': value.order,
		'cl-pagination': value.pagination,
	};

	if (value.perPage !== undefined) {
		changes['cl-pagination-per-page'] = Number(value.perPage);
	}

	return Object.fromEntries(
		Object.entries(changes).filter(([, val]) => val !== undefined)
	);
};
