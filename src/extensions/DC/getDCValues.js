/**
 * Internal dependencies
 */
import { attributeDefaults } from './constants';

/**
 * External dependencies
 */
import { camelCase, isFunction, isNil } from 'lodash';

const getDCValues = (dynamicContent, contextLoop) => {
	const getDefaultDCValue = (target, obj) => {
		const defaultValue = attributeDefaults?.[target];
		return isFunction(defaultValue) ? defaultValue(obj) : defaultValue;
	};

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

	return Object.keys(dynamicContent).reduce((acc, key) => {
		const target = key.replace('dc-', '');
		const value = getDCValue(target, acc);
		acc[camelCase(target)] = value;
		return acc;
	}, {});
};

export default getDCValues;
