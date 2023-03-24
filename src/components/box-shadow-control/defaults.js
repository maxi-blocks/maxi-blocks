import boxShadow from '../../extensions/attributes/defaults/boxShadow';
import {
	getAttributeKey,
	getAttributesValue,
} from '../../extensions/attributes';

export const boxShadowNone = prefix => {
	let response = {};

	const getDefaultAttributeValue = target =>
		getAttributesValue({
			target,
			prefix,
			props: boxShadow,
			breakpoint: 'general',
		})?.default;

	response = {
		[getAttributeKey('box-shadow-palette-opacity', false, prefix)]:
			getDefaultAttributeValue(
				getAttributeKey('box-shadow-palette-opacity', false, prefix)
			),
		[getAttributeKey('box-shadow-horizontal', false, prefix)]:
			getDefaultAttributeValue(
				getAttributeKey('box-shadow-horizontal', false, prefix)
			),
		[getAttributeKey('box-shadow-horizontal-unit', false, prefix)]:
			getDefaultAttributeValue(
				getAttributeKey('box-shadow-horizontal-unit', false, prefix)
			),
		[getAttributeKey('box-shadow-vertical', false, prefix)]:
			getDefaultAttributeValue(
				getAttributeKey('box-shadow-vertical', false, prefix)
			),
		[getAttributeKey('box-shadow-vertical-unit', false, prefix)]:
			getDefaultAttributeValue(
				getAttributeKey('box-shadow-vertical-unit', false, prefix)
			),
		[getAttributeKey('box-shadow-blur', false, prefix)]:
			getDefaultAttributeValue(
				getAttributeKey('box-shadow-blur', false, prefix)
			),
		[getAttributeKey('box-shadow-blur-unit', false, prefix)]:
			getDefaultAttributeValue(
				getAttributeKey('box-shadow-blur-unit', false, prefix)
			),
		[getAttributeKey('box-shadow-spread', false, prefix)]:
			getDefaultAttributeValue(
				getAttributeKey('box-shadow-spread', false, prefix)
			),
		[getAttributeKey('box-shadow-spread-unit', false, prefix)]:
			getDefaultAttributeValue(
				getAttributeKey('box-shadow-spread-unit', false, prefix)
			),
		[getAttributeKey('box-shadow-inset', false, prefix)]:
			getDefaultAttributeValue(
				getAttributeKey('box-shadow-inset', false, prefix)
			),
	};

	return response;
};

const boxShadowUnits = prefix => {
	let response = {};

	response = {
		[getAttributeKey('box-shadow-horizontal-unit', false, prefix)]: 'px',
		[getAttributeKey('box-shadow-vertical-unit', false, prefix)]: 'px',
		[getAttributeKey('box-shadow-blur-unit', false, prefix)]: 'px',
		[getAttributeKey('box-shadow-spread-unit', false, prefix)]: 'px',
	};

	return response;
};

export const boxShadowTotal = prefix => {
	let response = {};

	response = {
		[getAttributeKey('box-shadow-palette-opacity', false, prefix)]: 0.23,
		[getAttributeKey('box-shadow-horizontal', false, prefix)]: 0,
		[getAttributeKey('box-shadow-vertical', false, prefix)]: 30,
		[getAttributeKey('box-shadow-blur', false, prefix)]: 50,
		[getAttributeKey('box-shadow-spread', false, prefix)]: 0,
		[getAttributeKey('box-shadow-inset', false, prefix)]: false,
		...boxShadowUnits(prefix),
	};

	return response;
};

export const boxShadowBottom = prefix => {
	let response = {};

	response = {
		[getAttributeKey('box-shadow-palette-opacity', false, prefix)]: 0.5,
		[getAttributeKey('box-shadow-horizontal', false, prefix)]: 0,
		[getAttributeKey('box-shadow-vertical', false, prefix)]: 30,
		[getAttributeKey('box-shadow-blur', false, prefix)]: 50,
		[getAttributeKey('box-shadow-spread', false, prefix)]: 0,
		[getAttributeKey('box-shadow-inset', false, prefix)]: false,
		...boxShadowUnits(prefix),
	};

	return response;
};

export const boxShadowSolid = prefix => {
	let response = {};

	response = {
		[getAttributeKey('box-shadow-palette-opacity', false, prefix)]: 0.5,
		[getAttributeKey('box-shadow-horizontal', false, prefix)]: 5,
		[getAttributeKey('box-shadow-vertical', false, prefix)]: 6,
		[getAttributeKey('box-shadow-blur', false, prefix)]: 0,
		[getAttributeKey('box-shadow-spread', false, prefix)]: 0,
		[getAttributeKey('box-shadow-inset', false, prefix)]: false,
		...boxShadowUnits(prefix),
	};

	return response;
};
