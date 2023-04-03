/**
 * Internal dependencies
 */
import { attributeDefaults } from './constants';

/**
 * External dependencies
 */
import { isFunction, isNil } from 'lodash';

const getCLAttributes = contextLoop =>
	Object.entries(contextLoop).reduce((acc, [key, value]) => {
		if (!isNil(value)) acc[key] = value;
		else {
			const target = key.replace('cl-', '');
			if (isFunction(attributeDefaults?.[target])) {
				acc[key] = attributeDefaults?.[target](contextLoop);
			} else {
				acc[key] = attributeDefaults?.[target];
			}
		}

		return acc;
	}, {});

export default getCLAttributes;
