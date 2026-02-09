/**
 * Internal dependencies
 */
import { getVwSize, getVhSize } from '@extensions/dom/getViewPortUnitsSize';

/**
 * External dependencies
 */
import { cloneDeep, isObject } from 'lodash';

// Replaces vw and vh units with px values on responsive on editor
const replaceViewportUnits = (value, breakpoint) => {
	const vwSize = getVwSize(breakpoint);
	const vhSize = getVhSize();

	let result = value;

	if (result.includes('vw')) {
		result = result.replace(
			/(-?[\d.]+)vw/g,
			(_match, number) => `${parseFloat(number) * vwSize}px`
		);
	}

	if (result.includes('vh')) {
		result = result.replace(
			/(-?[\d.]+)vh/g,
			(_match, number) => `${parseFloat(number) * vhSize}px`
		);
	}

	return result;
};

const BREAKPOINT_KEYS = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const resolveBreakpoint = (key, currentBreakpoint, baseBreakpoint) => {
	if (key === 'general') return baseBreakpoint || currentBreakpoint;
	if (BREAKPOINT_KEYS.includes(key)) return key;
	return currentBreakpoint;
};

const walkAndReplace = (
	value,
	currentBreakpoint,
	baseBreakpoint,
	activeBreakpoint = currentBreakpoint
) => {
	if (Array.isArray(value)) {
		return value.map(item =>
			walkAndReplace(
				item,
				currentBreakpoint,
				baseBreakpoint,
				activeBreakpoint
			)
		);
	}

	if (isObject(value)) {
		return Object.entries(value).reduce((acc, [key, val]) => {
			const nextBreakpoint = resolveBreakpoint(
				key,
				currentBreakpoint,
				baseBreakpoint
			);
			acc[key] = walkAndReplace(
				val,
				currentBreakpoint,
				baseBreakpoint,
				nextBreakpoint
			);
			return acc;
		}, {});
	}

	if (
		typeof value === 'string' &&
		(value.includes('vw') || value.includes('vh'))
	) {
		return replaceViewportUnits(value, activeBreakpoint);
	}

	return value;
};

const viewportUnitsProcessor = (obj, currentBreakpoint, baseBreakpoint) => {
	if (currentBreakpoint === 'general') return obj;

	const response = cloneDeep(obj);

	return walkAndReplace(response, currentBreakpoint, baseBreakpoint);
};

export default viewportUnitsProcessor;
