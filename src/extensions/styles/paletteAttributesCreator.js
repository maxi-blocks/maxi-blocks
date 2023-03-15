/**
 * Internal dependencies
 */
import attributesShorter from './dictionary/attributesShorter';

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
}) => {
	return {
		[`${prefix}palette-status`]: {
			type: 'boolean',
			default: status ?? true,
		},
		[`${prefix}palette-color`]: {
			type: 'number',
			...(isNumber(palette) && { default: palette }),
		},
		...attributesShorter(
			{
				[`${prefix}palette-opacity`]: {
					type: 'number',
					...(isNumber(opacity) && { default: opacity }),
				},
			},
			'opacity'
		),
		[`${prefix}color`]: {
			type: 'string',
			...(isString(customColor) && { default: customColor }),
		},
	};
};

export default paletteAttributesCreator;
