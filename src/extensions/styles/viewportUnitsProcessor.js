/**
 * Internal dependencies
 */
import getVwSize from '@extensions/dom/getViewPortUnitsSize';

/**
 * External dependencies
 */
import { cloneDeep, isObject } from 'lodash';

const getVhSize = () => {
	if (typeof window === 'undefined') return null;

	if (window.innerHeight) return window.innerHeight * 0.01;

	const documentElement = window.document?.documentElement;

	if (documentElement?.clientHeight)
		return documentElement.clientHeight * 0.01;

	return null;
};

const convertViewportValue = (value, unit, breakpoint) => {
	const size = unit === 'vw' ? getVwSize(breakpoint) : getVhSize();

	if (!size) return value;

	const numericValue = parseFloat(value);

	if (Number.isNaN(numericValue)) return value;

	return `${numericValue * size}px`;
};

// Replaces vw and vh units with px values on responsive on editor
const viewportUnitsProcessor = (obj, breakpoint) => {
	if (breakpoint === 'general') return obj;

	const response = cloneDeep(obj);

	const checkObjUnits = obj => {
		Object.entries(obj).forEach(([key, val]) => {
			if (isObject(val)) {
				checkObjUnits(val);
			} else if (typeof val === 'string') {
				if (val.includes('vw'))
					obj[key] = convertViewportValue(val, 'vw', breakpoint);
				else if (val.includes('vh'))
					obj[key] = convertViewportValue(val, 'vh', breakpoint);
			}
		});

		return obj;
	};

	return checkObjUnits(response);
};

export default viewportUnitsProcessor;
