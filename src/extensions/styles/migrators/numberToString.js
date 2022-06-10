/**
 * This is a temporary file to migrate attributes with type `number` to `string`
 *
 * Can be used as example for future migrations
 */

import getGroupAttributes from '../getGroupAttributes';
import { isFinite } from 'lodash';

const fromNumberToStringMigrator = ({ attributes, save }) => {
	const targets = 'position';

	return {
		isEligible(blockAttributes) {
			const attrsToChange = getGroupAttributes(blockAttributes, targets);

			return Object.entries(attrsToChange).some(([attrKey, attrVal]) => {
				if (isFinite(attrVal)) {
					const defaultType = attributes[attrKey].type;

					return defaultType === 'string';
				}

				return false;
			});
		},

		attributes: {
			...attributes,
			'position-general': {
				type: 'string',
			},
			'position-xxl': {
				type: 'string',
			},
			'position-xl': {
				type: 'string',
			},
			'position-l': {
				type: 'string',
			},
			'position-m': {
				type: 'string',
			},
			'position-s': {
				type: 'string',
			},
			'position-xs': {
				type: 'string',
			},
			'position-top-general': {
				type: 'number',
			},
			'position-top-xxl': {
				type: 'number',
			},
			'position-top-xl': {
				type: 'number',
			},
			'position-top-l': {
				type: 'number',
			},
			'position-top-m': {
				type: 'number',
			},
			'position-top-s': {
				type: 'number',
			},
			'position-top-xs': {
				type: 'number',
			},
			'position-right-general': {
				type: 'number',
			},
			'position-right-xxl': {
				type: 'number',
			},
			'position-right-xl': {
				type: 'number',
			},
			'position-right-l': {
				type: 'number',
			},
			'position-right-m': {
				type: 'number',
			},
			'position-right-s': {
				type: 'number',
			},
			'position-right-xs': {
				type: 'number',
			},
			'position-bottom-general': {
				type: 'number',
			},
			'position-bottom-xxl': {
				type: 'number',
			},
			'position-bottom-xl': {
				type: 'number',
			},
			'position-bottom-l': {
				type: 'number',
			},
			'position-bottom-m': {
				type: 'number',
			},
			'position-bottom-s': {
				type: 'number',
			},
			'position-bottom-xs': {
				type: 'number',
			},
			'position-left-general': {
				type: 'number',
			},
			'position-left-xxl': {
				type: 'number',
			},
			'position-left-xl': {
				type: 'number',
			},
			'position-left-l': {
				type: 'number',
			},
			'position-left-m': {
				type: 'number',
			},
			'position-left-s': {
				type: 'number',
			},
			'position-left-xs': {
				type: 'number',
			},
			'position-sync-general': {
				type: 'string',
				default: 'all',
			},
			'position-sync-xxl': {
				type: 'string',
			},
			'position-sync-xl': {
				type: 'string',
			},
			'position-sync-l': {
				type: 'string',
			},
			'position-sync-m': {
				type: 'string',
			},
			'position-sync-s': {
				type: 'string',
			},
			'position-sync-xs': {
				type: 'string',
			},
			'position-unit-general': {
				type: 'string',
				default: 'px',
			},
			'position-unit-xxl': {
				type: 'string',
			},
			'position-unit-xl': {
				type: 'string',
			},
			'position-unit-l': {
				type: 'string',
			},
			'position-unit-m': {
				type: 'string',
			},
			'position-unit-s': {
				type: 'string',
			},
			'position-unit-xs': {
				type: 'string',
			},
		},

		migrate(oldAttributes) {
			const attrsToChange = getGroupAttributes(oldAttributes, targets);

			Object.entries(attrsToChange).forEach(([key, val]) => {
				if (isFinite(val) && attributes?.[key]?.type === 'string')
					oldAttributes[key] = val.toString();
			});

			return oldAttributes;
		},

		save(props) {
			return save(props);
		},
	};
};

export default fromNumberToStringMigrator;
