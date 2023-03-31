/**
 * Internal dependencies
 */
import { attributeDefaults } from './constants';

/**
 * External dependencies
 */
import { camelCase, isNil } from 'lodash';

const getDCValues = (dynamicContent, contextLoop) => {
	const getDCValue = target => {
		const contextLoopStatus = !!contextLoop?.['cl-status'];

		const dcValue = dynamicContent[`dc-${target}`];
		const contextLoopValue = contextLoop?.[`cl-${target}`];

		if (target === 'status') return dcValue ?? attributeDefaults?.[target];

		if (!isNil(dcValue)) return dcValue;

		if (contextLoopStatus && contextLoopValue) return contextLoopValue;

		return attributeDefaults?.[target];
	};

	return Object.keys(dynamicContent).reduce((acc, key) => {
		const target = key.replace('dc-', '');
		const value = getDCValue(target);
		const newKey = camelCase(target);

		acc[newKey] = value;
		return acc;
	}, {});
};

export default getDCValues;
