/**
 * Internal dependencies
 */
import getVwSize from '@extensions/dom/getViewPortUnitsSize';

/**
 * External dependencies
 */
import { cloneDeep, isObject } from 'lodash';

// Replaces vw and vh units with px values on responsive on editor
const viewportUnitsProcessor = (obj, breakpoint) => {
	if (breakpoint === 'general') return obj;

	const response = cloneDeep(obj);

	const checkObjUnits = obj => {
		Object.entries(obj).forEach(([key, val]) => {
			if (isObject(val)) {
				checkObjUnits(val);
			} else if (typeof val === 'string' && val.includes('vw')) {
				obj[key] = `${parseFloat(val) * getVwSize(breakpoint)}px`;
			}
		});

		return obj;
	};

	return checkObjUnits(response);
};

export default viewportUnitsProcessor;
