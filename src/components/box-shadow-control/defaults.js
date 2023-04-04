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
		[getAttributeKey('bs_po', false, prefix)]: getDefaultAttributeValue(
			getAttributeKey('bs_po', false, prefix)
		),
		[getAttributeKey('bs_ho', false, prefix)]: getDefaultAttributeValue(
			getAttributeKey('bs_ho', false, prefix)
		),
		[getAttributeKey('bs_ho.u', false, prefix)]: getDefaultAttributeValue(
			getAttributeKey('bs_ho.u', false, prefix)
		),
		[getAttributeKey('bs_v', false, prefix)]: getDefaultAttributeValue(
			getAttributeKey('bs_v', false, prefix)
		),
		[getAttributeKey('bs_v.u', false, prefix)]: getDefaultAttributeValue(
			getAttributeKey('bs_v.u', false, prefix)
		),
		[getAttributeKey('bs_blu', false, prefix)]: getDefaultAttributeValue(
			getAttributeKey('bs_blu', false, prefix)
		),
		[getAttributeKey('bs_blu.u', false, prefix)]: getDefaultAttributeValue(
			getAttributeKey('bs_blu.u', false, prefix)
		),
		[getAttributeKey('bs_sp', false, prefix)]: getDefaultAttributeValue(
			getAttributeKey('bs_sp', false, prefix)
		),
		[getAttributeKey('bs_sp.u', false, prefix)]: getDefaultAttributeValue(
			getAttributeKey('bs_sp.u', false, prefix)
		),
		[getAttributeKey('bs_in', false, prefix)]: getDefaultAttributeValue(
			getAttributeKey('bs_in', false, prefix)
		),
	};

	return response;
};

const boxShadowUnits = prefix => {
	let response = {};

	response = {
		[getAttributeKey('bs_ho.u', false, prefix)]: 'px',
		[getAttributeKey('bs_v.u', false, prefix)]: 'px',
		[getAttributeKey('bs_blu.u', false, prefix)]: 'px',
		[getAttributeKey('bs_sp.u', false, prefix)]: 'px',
	};

	return response;
};

export const boxShadowTotal = prefix => {
	let response = {};

	response = {
		[getAttributeKey('bs_po', false, prefix)]: 0.23,
		[getAttributeKey('bs_ho', false, prefix)]: 0,
		[getAttributeKey('bs_v', false, prefix)]: 30,
		[getAttributeKey('bs_blu', false, prefix)]: 50,
		[getAttributeKey('bs_sp', false, prefix)]: 0,
		[getAttributeKey('bs_in', false, prefix)]: false,
		...boxShadowUnits(prefix),
	};

	return response;
};

export const boxShadowBottom = prefix => {
	let response = {};

	response = {
		[getAttributeKey('bs_po', false, prefix)]: 0.5,
		[getAttributeKey('bs_ho', false, prefix)]: 0,
		[getAttributeKey('bs_v', false, prefix)]: 30,
		[getAttributeKey('bs_blu', false, prefix)]: 50,
		[getAttributeKey('bs_sp', false, prefix)]: 0,
		[getAttributeKey('bs_in', false, prefix)]: false,
		...boxShadowUnits(prefix),
	};

	return response;
};

export const boxShadowSolid = prefix => {
	let response = {};

	response = {
		[getAttributeKey('bs_po', false, prefix)]: 0.5,
		[getAttributeKey('bs_ho', false, prefix)]: 5,
		[getAttributeKey('bs_v', false, prefix)]: 6,
		[getAttributeKey('bs_blu', false, prefix)]: 0,
		[getAttributeKey('bs_sp', false, prefix)]: 0,
		[getAttributeKey('bs_in', false, prefix)]: false,
		...boxShadowUnits(prefix),
	};

	return response;
};
