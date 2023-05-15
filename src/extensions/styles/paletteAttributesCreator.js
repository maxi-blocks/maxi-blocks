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
		[`${prefix}palette-sc-status`]: {
			type: 'boolean',
			default: false,
		},
		[`${prefix}palette-color`]: {
			type: 'number',
			...(isNumber(palette) && { default: palette }),
		},
		[`${prefix}palette-opacity`]: {
			type: 'number',
			...(isNumber(opacity) && { default: opacity }),
		},
		[`${prefix}color`]: {
			type: 'string',
			...(isString(customColor) && { default: customColor }),
		},
	};
};

export default paletteAttributesCreator;
