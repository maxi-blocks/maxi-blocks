/**
 * This is a temporary file to migrate attributes with type `number` to `string`
 *
 * Can be used as example for future migrations
 */

import getGroupAttributes from '../getGroupAttributes';
import { isFinite } from 'lodash';

const fromNumberToStringMigrator = ({ attributes, save }) => {
	return {
		isEligible(blockAttributes) {
			const attrsToChange = getGroupAttributes(blockAttributes, [
				'padding',
				'size',
				'icon',
				'svg',
			]);

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
			'padding-top-general': {
				type: 'number',
			},
			'padding-top-xxl': {
				type: 'number',
			},
			'padding-top-xl': {
				type: 'number',
			},
			'padding-top-l': {
				type: 'number',
			},
			'padding-top-m': {
				type: 'number',
			},
			'padding-top-s': {
				type: 'number',
			},
			'padding-top-xs': {
				type: 'number',
			},
			'padding-right-general': {
				type: 'number',
			},
			'padding-right-xxl': {
				type: 'number',
			},
			'padding-right-xl': {
				type: 'number',
			},
			'padding-right-l': {
				type: 'number',
			},
			'padding-right-m': {
				type: 'number',
			},
			'padding-right-s': {
				type: 'number',
			},
			'padding-right-xs': {
				type: 'number',
			},
			'padding-bottom-general': {
				type: 'number',
			},
			'padding-bottom-xxl': {
				type: 'number',
			},
			'padding-bottom-xl': {
				type: 'number',
			},
			'padding-bottom-l': {
				type: 'number',
			},
			'padding-bottom-m': {
				type: 'number',
			},
			'padding-bottom-s': {
				type: 'number',
			},
			'padding-bottom-xs': {
				type: 'number',
			},
			'padding-left-general': {
				type: 'number',
			},
			'padding-left-xxl': {
				type: 'number',
			},
			'padding-left-xl': {
				type: 'number',
			},
			'padding-left-l': {
				type: 'number',
			},
			'padding-left-m': {
				type: 'number',
			},
			'padding-left-s': {
				type: 'number',
			},
			'padding-left-xs': {
				type: 'number',
			},
			'max-width-general': {
				type: 'number',
			},
			'max-width-xxl': {
				type: 'number',
			},
			'max-width-xl': {
				type: 'number',
			},
			'max-width-l': {
				type: 'number',
			},
			'max-width-m': {
				type: 'number',
			},
			'max-width-s': {
				type: 'number',
			},
			'max-width-xs': {
				type: 'number',
			},
			'width-general': {
				type: 'number',
			},
			'width-xxl': {
				type: 'number',
			},
			'width-xl': {
				type: 'number',
			},
			'width-l': {
				type: 'number',
			},
			'width-m': {
				type: 'number',
			},
			'width-s': {
				type: 'number',
			},
			'width-xs': {
				type: 'number',
			},
			'min-width-general': {
				type: 'number',
			},
			'min-width-xxl': {
				type: 'number',
			},
			'min-width-xl': {
				type: 'number',
			},
			'min-width-l': {
				type: 'number',
			},
			'min-width-m': {
				type: 'number',
			},
			'min-width-s': {
				type: 'number',
			},
			'min-width-xs': {
				type: 'number',
			},
			'max-height-general': {
				type: 'number',
			},
			'max-height-xxl': {
				type: 'number',
			},
			'max-height-xl': {
				type: 'number',
			},
			'max-height-l': {
				type: 'number',
			},
			'max-height-m': {
				type: 'number',
			},
			'max-height-s': {
				type: 'number',
			},
			'max-height-xs': {
				type: 'number',
			},
			'height-general': {
				type: 'number',
			},
			'height-xxl': {
				type: 'number',
			},
			'height-xl': {
				type: 'number',
			},
			'height-l': {
				type: 'number',
			},
			'height-m': {
				type: 'number',
			},
			'height-s': {
				type: 'number',
			},
			'height-xs': {
				type: 'number',
			},
			'min-height-general': {
				type: 'number',
			},
			'min-height-xxl': {
				type: 'number',
			},
			'min-height-xl': {
				type: 'number',
			},
			'min-height-l': {
				type: 'number',
			},
			'min-height-m': {
				type: 'number',
			},
			'min-height-s': {
				type: 'number',
			},
			'min-height-xs': {
				type: 'number',
			},
			'icon-width-general': {
				type: 'number',
				default: 32,
			},
			'icon-width-xxl': {
				type: 'number',
			},
			'icon-width-xl': {
				type: 'number',
			},
			'icon-width-l': {
				type: 'number',
			},
			'icon-width-m': {
				type: 'number',
			},
			'icon-width-s': {
				type: 'number',
			},
			'icon-width-xs': {
				type: 'number',
			},
			'svg-width-general': {
				type: 'string',
				default: '64',
			},
			'svg-width-xxl': {
				type: 'string',
			},
			'svg-width-xl': {
				type: 'string',
			},
			'svg-width-l': {
				type: 'string',
			},
			'svg-width-m': {
				type: 'string',
			},
			'svg-width-s': {
				type: 'string',
			},
			'svg-width-xs': {
				type: 'string',
			},
		},

		migrate(oldAttributes) {
			const attrsToChange = getGroupAttributes(oldAttributes, [
				'padding',
				'size',
				'icon',
				'svg',
			]);

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
