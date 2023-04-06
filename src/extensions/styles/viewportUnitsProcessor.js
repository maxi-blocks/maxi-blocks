/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { getVhSize, getVwSize } from '../dom/getViewPortUnitsSize';

/**
 * External dependencies
 */
import { cloneDeep, isObject } from 'lodash';

// Replaces vw and vh units with px values on responsive on editor
const viewportUnitsProcessor = obj => {
	const breakpoint = select('maxiBlocks').receiveMaxiDeviceType();

	if (breakpoint === 'general') return obj;

	const response = cloneDeep(obj);
	const sizeMap = {
		vw: getVwSize(),
		vh: getVhSize(),
	};

	const checkObjUnits = obj => {
		Object.entries(obj).forEach(([key, val]) => {
			if (isObject(val)) {
				checkObjUnits(val);
			} else if (
				typeof val === 'string' &&
				(val.includes('vw') || val.includes('vh'))
			) {
				const value = parseFloat(val);

				obj[key] = `${value * sizeMap[val.replace(value, '')]}px`;
			}
		});

		return obj;
	};

	return checkObjUnits(response);
};

export default viewportUnitsProcessor;
