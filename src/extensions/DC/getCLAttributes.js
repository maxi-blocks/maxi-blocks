/**
 * Internal dependencies
 */
import { clAttributeDefaults } from './constants';

/**
 * External dependencies
 */
import { isFunction, isNil } from 'lodash';

const getCLAttributes = contextLoop =>
	Object.entries(contextLoop).reduce((acc, [key, value]) => {
		if (!isNil(value)) acc[key] = value;
		else {
			const target = key.replace('cl-', '');
			if (isFunction(clAttributeDefaults?.[target])) {
				acc[key] = clAttributeDefaults?.[target](contextLoop);
			} else {
				acc[key] = clAttributeDefaults?.[target];
			}
		}

		return acc;
	}, {});

export default getCLAttributes;
