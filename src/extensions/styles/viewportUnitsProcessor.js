/**
 * Internal dependencies
 */
import getVwSize, { getVhSize } from '@extensions/dom/getViewPortUnitsSize';

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

const viewportUnitsProcessor = (obj, breakpoint) => {
	if (breakpoint === 'general') return obj;

	const response = cloneDeep(obj);

	const checkObjUnits = obj => {
		Object.entries(obj).forEach(([key, val]) => {
			if (isObject(val)) {
				checkObjUnits(val);
			} else if (
				typeof val === 'string' &&
				(val.includes('vw') || val.includes('vh'))
			) {
				obj[key] = replaceViewportUnits(val, breakpoint);
			}
		});

		return obj;
	};

	return checkObjUnits(response);
};

export default viewportUnitsProcessor;
