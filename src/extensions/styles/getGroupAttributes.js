/**
 * Internal dependencies
 */
import * as defaults from './defaults/index';

/**
 * External dependencies
 */
import { isNumber, isBoolean, isEmpty } from 'lodash';

const getPaletteObj = () => {
	let palette = {};

	Object.values(defaults.palette).forEach(val => {
		palette = { ...palette, ...val };
	});

	return palette;
};

const getIsValid = (cleaned, val) =>
	(cleaned && (val || isNumber(val) || isBoolean(val) || isEmpty(val))) ||
	!cleaned;

const getGroupAttributes = (
	attributes,
	target,
	isHover = false,
	prefix = '',
	cleaned = false
) => {
	const response = {};

	if (typeof target === 'string') {
		const defaultAttributes =
			target !== 'palette'
				? defaults[`${target}${isHover ? 'Hover' : ''}`]
				: getPaletteObj();

		Object.keys(defaultAttributes).forEach(key => {
			if (getIsValid(cleaned, attributes[`${prefix}${key}`]))
				response[`${prefix}${key}`] = attributes[`${prefix}${key}`];
		});
	} else
		target.forEach(el => {
			const defaultAttributes =
				el !== 'palette'
					? defaults[`${el}${isHover ? 'Hover' : ''}`]
					: getPaletteObj();

			Object.keys(defaultAttributes).forEach(key => {
				if (getIsValid(cleaned, attributes[`${prefix}${key}`]))
					response[`${prefix}${key}`] = attributes[`${prefix}${key}`];
			});
		});

	return response;
};

export default getGroupAttributes;
