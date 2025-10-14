/**
 * External dependencies
 */
import { cloneDeep, isEmpty, isEqual, isNil, isObject } from 'lodash';

const BREAKPOINTS = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'].reverse();

const objectsCleaner = obj => {
	// Handle null/undefined input
	if (isNil(obj)) return {};

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
					breakpoint !== 'xl' // Ensures we jump XXL on XL breakpoint
						? BREAKPOINTS[BREAKPOINTS.indexOf(breakpoint) + 1]
						: 'general';

				if (
					obj?.[prevBreakpoint]?.[key] &&
					obj[prevBreakpoint][key] === val
				)
					delete response[breakpoint][key];
			});
	});

	return response;
};

const generalBreakpointCleaner = obj => {
	const response = cloneDeep(obj);

	Object.entries(response).forEach(([key, val]) => {
		if (key === 'general' || val == null) return; // Check if val is null or undefined

		const breakpointIndex = BREAKPOINTS.indexOf(key);
		// Is last breakpoint before general
		const isLast = cloneDeep(BREAKPOINTS)
			.splice(breakpointIndex)
			.every(breakpoint => {
				if (breakpoint === 'general' || breakpoint === key) return true;
				if (!(breakpoint in response) || isEmpty(response[breakpoint]))
					return true;

				return false;
			});

		if (isLast) {
			Object.entries(val).forEach(([prop, value]) => {
				if (
					prop !== 'label' &&
					'general' in response &&
					!isNil(response.general[prop]) &&
					isEqual(value, response.general[prop])
				)
					delete response[key][prop];
			});
		}
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
								// First higher breakpoint that has this property defined
								const prevBreakpoint = BREAKPOINTS.slice(
									BREAKPOINTS.indexOf(breakpoint) + 1
								).filter(
									prevBreakpoint =>
										!isNil(
											hoverObj[key]?.[prevBreakpoint]?.[
												attrKey
											]
										)
								)?.[0];

								// If higher breakpoint has hover value that is
								// different from this breakpoint hover value then keep it
								if (
									prevBreakpoint &&
									hoverObj[key]?.[prevBreakpoint]?.[
										attrKey
									] !== hoverObj[key][breakpoint][attrKey]
								) {
									return;
								}

								if (
									attrKey in
										(typeof hoverObj[key][breakpoint] ===
										'object'
											? hoverObj[key][breakpoint]
											: {}) &&
									hoverObj[key][breakpoint][attrKey] ===
										attrVal &&
									attrKey !== 'transition'
								)
									delete hoverObj[key][breakpoint][attrKey];
							}
						);
				});
		});

	return hoverObj;
};

const styleCleaner = styles => {
	Object.entries(styles).forEach(item => {
		const [target, rawVal] = item;

		// Clean non-object and empty targets
		// First clean, avoids unnecessary work on next loops
		const val = objectsCleaner(rawVal);

		if (isEmpty(val)) {
			delete styles[target];

			return;
		}

		styles[target] = val;

		// Clean breakpoint repeated values
		Object.entries(val).forEach(([typeKey, typeVal]) => {
			if (Object.keys(typeVal).length > 1)
				styles[target][typeKey] = repeatedBreakpointCleaner(typeVal);
		});

		// Clean non-necessary breakpoint values when is same than general
		Object.entries(val).forEach(([typeKey, typeVal]) => {
			if (Object.keys(typeVal).length > 1)
				styles[target][typeKey] = generalBreakpointCleaner(typeVal);
		});

		// Clean hover values
		if (target.includes(':hover')) {
			const normalKey = target.replace(':hover', '');

			styles[target] = hoverStylesCleaner(styles[normalKey], val);
		}

		// Clean empty breakpoints
		Object.entries(val).forEach(([typeKey, typeVal]) => {
			Object.entries(typeVal).forEach(([breakpoint, breakpointVal]) => {
				if (!isObject(breakpointVal) || isEmpty(breakpointVal))
					delete styles[target][typeKey][breakpoint];
			});
		});

		// Clean non-object and empty targets
		// Second clean before returning
		const cleanedVal = objectsCleaner(styles[target]);

		if (isEmpty(cleanedVal)) {
			delete styles[target];

			return;
		}

		styles[target] = cleanedVal;
	});

	return styles;
};

export default styleCleaner;
