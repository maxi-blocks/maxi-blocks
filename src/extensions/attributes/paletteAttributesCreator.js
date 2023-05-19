/**
 * Internal dependencies
 */
import getCleanKey from './getCleanKey';

/**
 * External dependencies
 */
import { isNumber, isString } from 'lodash';

const getLabel = (prefix, suffix) => getCleanKey(`${prefix}${suffix}`);

const paletteAttributesCreator = ({
	prefix = '',
	longPrefix = '',
	status,
	palette,
	opacity,
	customColor,
}) => ({
	[getLabel(prefix, '_ps')]: {
		type: 'boolean',
		default: status ?? true,
		longLabel: `${longPrefix}palette-status`,
	},
	[getLabel(prefix, '_pc')]: {
		type: 'number',
		...(isNumber(palette) && { default: palette }),
		longLabel: `${longPrefix}palette-color`,
	},
	[getLabel(prefix, '_po')]: {
		type: 'number',
		...(isNumber(opacity) && { default: opacity }),
		longLabel: `${longPrefix}palette-opacity`,
	},
	[getLabel(prefix, '_cc')]: {
		type: 'string',
		...(isString(customColor) && { default: customColor }),
		longLabel: `${longPrefix}custom-color`,
	},
});

export default paletteAttributesCreator;
