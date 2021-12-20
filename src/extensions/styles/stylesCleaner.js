/**
 * Internal dependencies
 */
import { getCustomCssObject } from './helpers';

/**
 * External dependencies
 */
import { isObject, isEmpty, merge, cloneDeep } from 'lodash';

const BREAKPOINTS = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'].reverse();

const objectsCleaner = obj => {
	const response = cloneDeep(obj);

	Object.entries(response).forEach(([key, val]) => {
		if (!isObject(val) || isEmpty(val)) delete response[key];
	});

	return response;
};

const repeatedBreakpointCleaner = obj => {
	const response = cloneDeep(obj);

	BREAKPOINTS.forEach(breakpoint => {
		obj[breakpoint] &&
			Object.entries(obj[breakpoint]).forEach(([key, val]) => {
				const prevBreakpoint =
					BREAKPOINTS[BREAKPOINTS.indexOf(breakpoint) + 1];

				if (
					obj?.[prevBreakpoint]?.[key] &&
					obj[prevBreakpoint][key] === val
				)
					delete response[breakpoint][key];
			});
	});

	return response;
};

const hoverStylesCleaner = (normalObj, hoverObj) => {
	if (normalObj)
		Object.entries(normalObj).forEach(([key, val]) => {
			if (hoverObj && key in hoverObj)
				Object.entries(val).forEach(([breakpoint, breakpointVal]) => {
					if (breakpoint in hoverObj[key])
						Object.entries(breakpointVal).forEach(
							([attrKey, attrVal]) => {
								if (
									attrKey in hoverObj[key][breakpoint] &&
									hoverObj[key][breakpoint][attrKey] ===
										attrVal
								)
									delete hoverObj[key][breakpoint][attrKey];
							}
						);
				});
		});

	return hoverObj;
};

const stylesCleaner = (obj, selectors, props) => {
	const response = cloneDeep(obj);

	// Process custom styles if they exist
	if (!isEmpty(selectors)) {
		const customCssObject = getCustomCssObject(selectors, props);
		!isEmpty(customCssObject) && merge(response, customCssObject);
	}

	Object.entries(response).forEach(item => {
		const [target, rawVal] = item;

		// Clean non-object and empty targets
		// First clean, avoids unnecessary work on next loops
		const val = objectsCleaner(rawVal);

		if (isEmpty(val)) {
			delete response[target];

			return;
		}

		response[target] = val;

		// Clean breakpoint repeated values
		Object.entries(val).forEach(([typeKey, typeVal]) => {
			if (Object.keys(typeVal).length > 1)
				response[target][typeKey] = repeatedBreakpointCleaner(typeVal);
		});

		// Clean hover values
		if (target.includes(':hover')) {
			const normalKey = target.replace(':hover', '');

			response[target] = hoverStylesCleaner(response[normalKey], val);
		}

		// Clean empty breakpoints
		Object.entries(val).forEach(([typeKey, typeVal]) => {
			Object.entries(typeVal).forEach(([breakpoint, breakpointVal]) => {
				if (!isObject(breakpointVal) || isEmpty(breakpointVal))
					delete response[target][typeKey][breakpoint];
			});
		});

		// Clean non-object and empty targets
		// Second clean before returning
		const cleanedVal = objectsCleaner(response[target]);

		if (isEmpty(cleanedVal)) {
			delete response[target];

			return;
		}

		response[target] = cleanedVal;
	});

	return response;
};

export default stylesCleaner;
