/**
 * Internal dependencies
 */
import { getCustomCssObject } from './helpers';
import { getBgLayersSelectorsCss } from '../../components/background-displayer/utils';

/**
 * External dependencies
 */
import { isObject, isEmpty, merge, cloneDeep, isEqual, isNil } from 'lodash';

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
		if (key === 'general') return;

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

	// Add to selectors generated bgLayers
	const bgLayers = !isEmpty(props['background-layers'])
		? props['background-layers']
		: [];
	const bgLayersHover = !isEmpty(props['background-layers-hover'])
		? props['background-layers-hover']
		: [];

	const newSelectors = {
		...selectors,
		...getBgLayersSelectorsCss([...bgLayers, ...bgLayersHover]),
	};

	// Delete CustomCss if bg hover off
	if (!props['block-background-hover-status']) {
		delete newSelectors['background hover'];
	}

	// Process custom styles if they exist
	if (!isEmpty(newSelectors)) {
		const customCssObject = getCustomCssObject(newSelectors, props);
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

		// Clean non-necessary breakpoint values when is same than general
		Object.entries(val).forEach(([typeKey, typeVal]) => {
			if (Object.keys(typeVal).length > 1)
				response[target][typeKey] = generalBreakpointCleaner(typeVal);
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
