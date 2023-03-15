import boxShadow from '../../extensions/styles/defaults/boxShadow';
import { getAttributeKey, getAttributeValue } from '../../extensions/styles';

export const boxShadowNone = prefix => {
	let response = {};

	const getDefaultAttributeValue = target =>
		getAttributeValue({
			target,
			prefix,
			props: boxShadow,
			breakpoint: 'general',
		})?.default;

	response = {
		[getAttributeKey('box-shadow-palette-opacity', false, prefix)]:
			getDefaultAttributeValue('box-shadow-palette-opacity'),
		[getAttributeKey('box-shadow-horizontal', false, prefix)]:
			getDefaultAttributeValue('box-shadow-horizontal'),
		[getAttributeKey('box-shadow-horizontal-unit', false, prefix)]:
			getDefaultAttributeValue('box-shadow-horizontal-unit'),
		[getAttributeKey('box-shadow-vertical', false, prefix)]:
			getDefaultAttributeValue('box-shadow-vertical'),
		[getAttributeKey('box-shadow-vertical-unit', false, prefix)]:
			getDefaultAttributeValue('box-shadow-vertical-unit'),
		[getAttributeKey('box-shadow-blur', false, prefix)]:
			getDefaultAttributeValue('box-shadow-blur'),
		[getAttributeKey('box-shadow-blur-unit', false, prefix)]:
			getDefaultAttributeValue('box-shadow-blur-unit'),
		[getAttributeKey('box-shadow-spread', false, prefix)]:
			getDefaultAttributeValue('box-shadow-spread'),
		[getAttributeKey('box-shadow-spread-unit', false, prefix)]:
			getDefaultAttributeValue('box-shadow-spread-unit'),
		[getAttributeKey('box-shadow-inset', false, prefix)]:
			getDefaultAttributeValue('box-shadow-inset'),
	};

	return response;
};

const boxShadowUnits = prefix => {
	let response = {};

	response = {
		[`${[prefix]}box-shadow-horizontal-unit`]: 'px',
		[`${[prefix]}box-shadow-vertical-unit`]: 'px',
		[`${[prefix]}box-shadow-blur-unit`]: 'px',
		[`${[prefix]}box-shadow-spread-unit`]: 'px',
	};

	return response;
};

export const boxShadowTotal = prefix => {
	let response = {};

	response = {
		[`${prefix}box-shadow-pao`]: 0.23,
		[`${prefix}box-shadow-horizontal`]: 0,
		[`${prefix}box-shadow-vertical`]: 30,
		[`${prefix}box-shadow-blur`]: 50,
		[`${prefix}box-shadow-spread`]: 0,
		[`${prefix}box-shadow-inset`]: false,
		...boxShadowUnits(prefix),
	};

	return response;
};

export const boxShadowBottom = prefix => {
	let response = {};

	response = {
		[`${prefix}box-shadow-pao`]: 0.5,
		[`${prefix}box-shadow-horizontal`]: 0,
		[`${prefix}box-shadow-vertical`]: 30,
		[`${prefix}box-shadow-blur`]: 50,
		[`${prefix}box-shadow-spread`]: 0,
		[`${prefix}box-shadow-inset`]: false,
		...boxShadowUnits(prefix),
	};

	return response;
};

export const boxShadowSolid = prefix => {
	let response = {};

	response = {
		[`${prefix}box-shadow-pao`]: 0.5,
		[`${prefix}box-shadow-horizontal`]: 5,
		[`${prefix}box-shadow-vertical`]: 6,
		[`${prefix}box-shadow-blur`]: 0,
		[`${prefix}box-shadow-spread`]: 0,
		[`${prefix}box-shadow-inset`]: false,
		...boxShadowUnits(prefix),
	};

	return response;
};
