/**
 * Internal dependencies
 */
import getVwSize from '@extensions/dom/getViewPortUnitsSize';

/**
 * External dependencies
 */
import { cloneDeep, isObject } from 'lodash';

const viewportValueMatch = value => {
	if (typeof value !== 'string') return null;

	return value.trim().match(/^(-?\d*\.?\d+)(vw|vh)$/);
};

const getVhSize = () => {
	if (typeof window === 'undefined') return null;

	if (window.innerHeight) return window.innerHeight * 0.01;

	const documentElement = window.document?.documentElement;

	if (documentElement?.clientHeight)
		return documentElement.clientHeight * 0.01;

	return null;
};

const convertViewportValue = (value, breakpoint) => {
	// Skip conversion for 'general' breakpoint
	if (breakpoint === 'general') return value;

	const match = viewportValueMatch(value);

	if (!match) return value;

	const numericValue = parseFloat(match[1]);
	const unit = match[2];
	const size = unit === 'vw' ? getVwSize(breakpoint) : getVhSize();

	if (!size || Number.isNaN(size)) return value;

	if (Number.isNaN(numericValue)) return value;

	return `${numericValue * size}px`;
};

// Replaces vw and vh units with px values on responsive on editor
// The breakpoint parameter is the CURRENT VIEW breakpoint (e.g., 'm' when previewing tablet).
// ALL values should be converted using the CURRENT VIEW breakpoint's size, not the definition breakpoint,
// because the preview is displaying at that breakpoint's width.
const viewportUnitsProcessor = (obj, breakpoint) => {
	// If viewing at 'general', no conversion needed anywhere
	if (breakpoint === 'general') return obj;

	const response = cloneDeep(obj);

	// Always use the top-level (current view) breakpoint for ALL conversions
	// This is correct because the preview is showing that breakpoint's width
	const checkObjUnits = obj => {
		Object.entries(obj).forEach(([key, val]) => {
			if (isObject(val)) {
				checkObjUnits(val);
			} else if (typeof val === 'string') {
				obj[key] = convertViewportValue(val, breakpoint);
			}
		});

		return obj;
	};

	return checkObjUnits(response);
};

export default viewportUnitsProcessor;
