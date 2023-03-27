/**
 * External dependencies
 */
import { isNil } from 'lodash';

const getDCValues = (dynamicContent, contextLoop) => {
	const getDCValue = target => {
		const clValue = contextLoop[`cl-${target}`];

		if (!isNil(clValue)) return clValue;

		return dynamicContent[`dc-${target}`];
	};

	const contextLoopStatus = contextLoop['cl-status'];

	if (!contextLoopStatus)
		return Object.keys(dynamicContent).reduce((acc, key) => {
			const newKey = key.replace('dc-', '');
			const value = dynamicContent[key];

			return {
				...acc,
				[newKey]: value,
			};
		}, {});

	return {
		status: getDCValue('status'),
		type: getDCValue('type'),
		relation: getDCValue('relation'),
		id: getDCValue('id'),
		field: getDCValue('field'),
		author: getDCValue('author'),
		limit: getDCValue('limit'),
		error: getDCValue('error'),
		isCustomDate: getDCValue('custom-date'),
		linkStatus: getDCValue('link-status'),
	};
};

export default getDCValues;
