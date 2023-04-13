/**
 * External dependencies
 */
import { round, omitBy, isNil, compact } from 'lodash';
import getBreakpointFromAttribute from '../styles/getBreakpointFromAttribute';

export const getResizerSize = (elt, blockRef, unit, axis = 'width') => {
	const pxSize = elt.getBoundingClientRect()[axis];

	switch (unit) {
		case '%': {
			const wrapperSize = blockRef.current.getBoundingClientRect()[axis];

			return round((pxSize / wrapperSize) * 100, 2).toString();
		}
		case 'vw': {
			const winSize = window.innerWidth;

			return round((pxSize / winSize) * 100, 2).toString();
		}
		case 'px':
		default:
			return pxSize.toString();
	}
};

const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

export const addRelatedAttributes = ({
	props: propsObj,
	IBAttributes,
	relatedAttributes = [],
}) => {
	const attributes = {};

	const props = Object.fromEntries(
		Object.entries(omitBy(propsObj, isNil)).filter(
			([key]) => !key.includes('-hover')
		)
	);

	const propsArray = compact(
		Object.keys(IBAttributes).map(prop => {
			const key = relatedAttributes.find(key => prop.includes(key));
			if (key) {
				return [prop, key];
			}
			return null;
		})
	);

	propsArray.forEach(([prop, key]) => {
		relatedAttributes.forEach(value => {
			if (value !== key) {
				const replacedKey = prop.replace(key, value);
				attributes[replacedKey] = props[replacedKey];
			}
		});
	});

	// add unit attributes when needed
	Object.entries(IBAttributes ?? {}).forEach(([key, value]) => {
		if (!breakpoints.some(br => key.includes(`-${br}`))) return;

		// Ensure the value for unit attributes is saved if the modified value is related
		if (key.includes('-unit')) {
			const newKey = key.replace('-unit', '');

			if (props[newKey]) attributes[newKey] = props[newKey];
		}
		const breakpoint = getBreakpointFromAttribute(key);
		const unitKey = key.replace(`-${breakpoint}`, `-unit-${breakpoint}`);
		if (props[unitKey]) attributes[unitKey] = props[unitKey];
	});

	return { ...omitBy(attributes, isNil), ...IBAttributes };
};

export const getStylesWrapperId = uniqueID =>
	`maxi-blocks__styles--${uniqueID}`;
