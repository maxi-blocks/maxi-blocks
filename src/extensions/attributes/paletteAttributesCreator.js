/**
 * External dependencies
 */
import { isNumber, isString } from 'lodash';

const paletteAttributesCreator = ({
	prefix = '',
	status,
	palette,
	opacity,
	customColor,
}) => ({
	[`${prefix}ps`]: {
		type: 'boolean',
		default: status ?? true,
		longLabel: `${prefix}palette-status`,
	},
	[`${prefix}pc`]: {
		type: 'number',
		...(isNumber(palette) && { default: palette }),
		longLabel: `${prefix}palette-color`,
	},
	[`${prefix}po`]: {
		type: 'number',
		...(isNumber(opacity) && { default: opacity }),
		longLabel: `${prefix}palette-opacity`,
	},
	[`${prefix}cc`]: {
		type: 'string',
		...(isString(customColor) && { default: customColor }),
		longLabel: `${prefix}custom-color`,
	},
});

export default paletteAttributesCreator;
