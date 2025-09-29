/**
 * Internal dependencies
 */
import { attributeDefaults } from './constants';

/**
 * External dependencies
 */
import { camelCase, isFunction, isNil } from 'lodash';

const getDefaultDCValue = (target, obj) => {
	const defaultValue = attributeDefaults?.[target];
	return isFunction(defaultValue) ? defaultValue(obj) : defaultValue;
};

/**
 * Combines dynamic content values with context loop values
 *
 * Note that this function should be called with group attributes of DC
 * meaning that the missing attributes in DC object should be provided as undefined
 *
 * @param {Object} dynamicContent - Dynamic content object
 * @param {Object} contextLoop    - Context loop object
 * @returns {Object} DC values
 */
const getDCValues = (dynamicContent, contextLoop) => {
	const getDCValue = (target, obj) => {
		const contextLoopStatus = !!contextLoop?.['cl-status'];

		const dcValue = dynamicContent[`dc-${target}`];
		const contextLoopValue = contextLoop?.[`cl-${target}`];

		if (target === 'status') {
			return dcValue ?? getDefaultDCValue(target, obj);
		}

		return !isNil(dcValue)
			? dcValue
			: contextLoopStatus && contextLoopValue
			? contextLoopValue
			: getDefaultDCValue(target, obj);
	};

	const result = Object.keys(dynamicContent).reduce((acc, key) => {
		const target = key.replace('dc-', '');
		const value = getDCValue(target, acc);
		acc[camelCase(target)] = value;
		return acc;
	}, {});

	return result;
};

export default getDCValues;
