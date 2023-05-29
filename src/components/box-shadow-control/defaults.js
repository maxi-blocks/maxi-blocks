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
			breakpoint: 'g',
		})?.default;

	response = {
		[getAttributeKey({ key: 'bs_po', prefix })]: getDefaultAttributeValue(
			getAttributeKey({ key: 'bs_po', prefix })
		),
		[getAttributeKey({ key: 'bs_ho', prefix })]: getDefaultAttributeValue(
			getAttributeKey({ key: 'bs_ho', prefix })
		),
		[getAttributeKey({ key: 'bs_ho.u', prefix })]: getDefaultAttributeValue(
			getAttributeKey({ key: 'bs_ho.u', prefix })
		),
		[getAttributeKey({ key: 'bs_v', prefix })]: getDefaultAttributeValue(
			getAttributeKey({ key: 'bs_v', prefix })
		),
		[getAttributeKey({ key: 'bs_v.u', prefix })]: getDefaultAttributeValue(
			getAttributeKey({ key: 'bs_v.u', prefix })
		),
		[getAttributeKey({ key: 'bs_blu', prefix })]: getDefaultAttributeValue(
			getAttributeKey({ key: 'bs_blu', prefix })
		),
		[getAttributeKey({ key: 'bs_blu.u', prefix })]:
			getDefaultAttributeValue(
				getAttributeKey({ key: 'bs_blu.u', prefix })
			),
		[getAttributeKey({ key: 'bs_sp', prefix })]: getDefaultAttributeValue(
			getAttributeKey({ key: 'bs_sp', prefix })
		),
		[getAttributeKey({ key: 'bs_sp.u', prefix })]: getDefaultAttributeValue(
			getAttributeKey({ key: 'bs_sp.u', prefix })
		),
		[getAttributeKey({ key: 'bs_in', prefix })]: getDefaultAttributeValue(
			getAttributeKey({ key: 'bs_in', prefix })
		),
	};

	return response;
};

const boxShadowUnits = prefix => {
	let response = {};

	response = {
		[getAttributeKey({ key: 'bs_ho.u', prefix })]: 'px',
		[getAttributeKey({ key: 'bs_v.u', prefix })]: 'px',
		[getAttributeKey({ key: 'bs_blu.u', prefix })]: 'px',
		[getAttributeKey({ key: 'bs_sp.u', prefix })]: 'px',
	};

	return response;
};

export const boxShadowTotal = prefix => {
	let response = {};

	response = {
		[getAttributeKey({ key: 'bs_po', prefix })]: 0.23,
		[getAttributeKey({ key: 'bs_ho', prefix })]: 0,
		[getAttributeKey({ key: 'bs_v', prefix })]: 30,
		[getAttributeKey({ key: 'bs_blu', prefix })]: 50,
		[getAttributeKey({ key: 'bs_sp', prefix })]: 0,
		[getAttributeKey({ key: 'bs_in', prefix })]: false,
		...boxShadowUnits(prefix),
	};

	return response;
};

export const boxShadowBottom = prefix => {
	let response = {};

	response = {
		[getAttributeKey({ key: 'bs_po', prefix })]: 0.5,
		[getAttributeKey({ key: 'bs_ho', prefix })]: 0,
		[getAttributeKey({ key: 'bs_v', prefix })]: 30,
		[getAttributeKey({ key: 'bs_blu', prefix })]: 50,
		[getAttributeKey({ key: 'bs_sp', prefix })]: 0,
		[getAttributeKey({ key: 'bs_in', prefix })]: false,
		...boxShadowUnits(prefix),
	};

	return response;
};

export const boxShadowSolid = prefix => {
	let response = {};

	response = {
		[getAttributeKey({ key: 'bs_po', prefix })]: 0.5,
		[getAttributeKey({ key: 'bs_ho', prefix })]: 5,
		[getAttributeKey({ key: 'bs_v', prefix })]: 6,
		[getAttributeKey({ key: 'bs_blu', prefix })]: 0,
		[getAttributeKey({ key: 'bs_sp', prefix })]: 0,
		[getAttributeKey({ key: 'bs_in', prefix })]: false,
		...boxShadowUnits(prefix),
	};

	return response;
};
