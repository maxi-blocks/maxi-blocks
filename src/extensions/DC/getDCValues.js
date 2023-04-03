/**
 * Internal dependencies
 */
import { dcAttributeDefaults } from './constants';

/**
 * External dependencies
 */
import { camelCase, isFunction, isNil } from 'lodash';

const getDCValues = (dynamicContent, contextLoop) => {
	const getDefaultDCValue = (target, obj) => {
		if (isFunction(dcAttributeDefaults?.[target])) {
			return dcAttributeDefaults?.[target](obj);
		}

		return dcAttributeDefaults?.[target];
	};

	const getDCValue = (target, obj) => {
		const contextLoopStatus = !!contextLoop?.['cl-status'];

		const dcValue = dynamicContent[`dc-${target}`];
		const contextLoopValue = contextLoop?.[`cl-${target}`];

		if (target === 'status')
			return dcValue ?? getDefaultDCValue(target, obj);

		if (!isNil(dcValue)) return dcValue;

		if (contextLoopStatus && contextLoopValue) return contextLoopValue;

		return getDefaultDCValue(target, obj);
	};

	return Object.keys(dynamicContent).reduce((acc, key) => {
		const target = key.replace('dc-', '');
		const value = getDCValue(target, acc);
		const newKey = camelCase(target);

		acc[newKey] = value;
		return acc;
	}, {});
};

export default getDCValues;
