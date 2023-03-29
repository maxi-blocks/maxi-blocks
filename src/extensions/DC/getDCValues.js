/**
 * External dependencies
 */
import { camelCase, isNil } from 'lodash';

const DEFAULTS = {
	status: false,
	type: 'posts',
	relation: 'by-id',
};

const getDCValues = (dynamicContent, contextLoop) => {
	const getDCValue = target => {
		const contextLoopStatus = !!contextLoop?.['cl-status'];

		const dcValue = dynamicContent[`dc-${target}`];
		const contextLoopValue = contextLoop?.[`cl-${target}`];

		if (target === 'status') return dcValue ?? DEFAULTS?.[target];

		if (!isNil(dcValue)) return dcValue;

		if (contextLoopStatus && contextLoopValue) return contextLoopValue;

		return DEFAULTS?.[target];
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
