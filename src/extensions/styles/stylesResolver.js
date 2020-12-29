/**
 * WordPress dependencies
 */
const { dispatch } = wp.data;

/**
 * Internal dependencies
 */
import { getLastBreakpointValue } from './utils';

/**
 * External dependencies
 */
import { isNil, isNumber, isEmpty } from 'lodash';

/**
 * Styles resolver
 */
const propsObjectManipulator = (value, newObject, breakpoint) => {
	if (isNil(value[breakpoint])) return newObject;

	const object = value[breakpoint];
	newObject[breakpoint] = {};
	let unitChecker = '';
	let unit = getLastBreakpointValue(value, 'unit', breakpoint) || '';

	const nonAllowedProps = ['font-options', 'unit'];

	Object.entries(object).forEach(([target, prop]) => {
		if (isNil(prop)) {
			console.error(`Undefined property. Property: ${target}`);
			return;
		}
		if (nonAllowedProps.includes(target)) return;
		// values with dimensions
		if (
			isNumber(prop) ||
			(unitChecker.indexOf(target) === 0 && !isEmpty(prop))
		)
			newObject[breakpoint][target] = prop + unit;
		// avoid numbers with no related metric
		if (unitChecker.indexOf(target) === 0) unit = '';
		// values with metrics
		if (prop.length <= 3 && !isEmpty(prop)) {
			unitChecker = target;
			unit = prop;
		}
		// values with strings && font-options object
		if (prop.length > 3 || target === 'font-options')
			newObject[breakpoint][target] = prop;
	});

	return newObject;
};

const objectManipulator = (props, breakpoints) => {
	const response = {
		breakpoints,
		content: {},
	};

	for (const [key, value] of Object.entries(props)) {
		let newObject = {};

		newObject = propsObjectManipulator(value, newObject, 'general');
		newObject = propsObjectManipulator(value, newObject, 'xxl');
		newObject = propsObjectManipulator(value, newObject, 'xl');
		newObject = propsObjectManipulator(value, newObject, 'l');
		newObject = propsObjectManipulator(value, newObject, 'm');
		newObject = propsObjectManipulator(value, newObject, 's');
		newObject = propsObjectManipulator(value, newObject, 'xs');

		if (!isNil(newObject))
			Object.assign(response.content, {
				[props[key].label]: newObject,
			});
	}

	return response;
};

const styleResolver = (styles, breakpoints, remover = false) => {
	const response = (remover && []) || {};

	for (const [target, props] of Object.entries(styles)) {
		if (!remover) response[target] = objectManipulator(props, breakpoints);
		if (remover) response.push(target);
	}

	if (!remover) dispatch('maxiBlocks/styles').updateStyles(response);
	else dispatch('maxiBlocks/styles').removeStyles(response);

	return response;
};

export default styleResolver;
