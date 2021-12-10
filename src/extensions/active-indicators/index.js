/**
 * External dependencies
 */
import { upperCase, uniq } from 'lodash';

const getActiveAttributes = (attributes, type) => {
	const response = [];
	Object.keys(attributes).forEach(
		key => attributes[key] === undefined && delete attributes[key]
	);

	if (type === 'typography') {
		Object.keys(attributes).forEach(key => {
			const breakpoint = key?.split('-')?.pop();
			breakpoint !== 'general' && response?.push(upperCase(breakpoint));
		});
	}

	return uniq(response);
};

export default getActiveAttributes;
