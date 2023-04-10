/**
 * External dependencies
 */
import { round, isNil, isEqual } from 'lodash';

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

export const getStylesWrapperId = uniqueID =>
	`maxi-blocks__styles--${uniqueID}`;

const defaultWithUnit = ['top', 'right', 'bottom', 'left', 'width', 'height'];
const defaultRelatedAttributes = {
	props: ['palette-color', 'palette-status', 'palette-opacity', 'color'],
};

export const addRelatedAttributes = ({
	props,
	IBAttributes,
	attributesMap = {},
}) => {
	const attributes = {};

	const {
		mandatory = [],
		withUnit = [],
		relatedAttributes = [],
	} = attributesMap;

	mandatory.forEach(prop => {
		attributes[prop] = props[prop];
	});

	const relatedAttributesAll = [
		...relatedAttributes,
		...defaultRelatedAttributes,
	];

	relatedAttributesAll.forEach(relation => {
		const relatedProps = relation.props;

		const includesProp = relatedProps.some(prop => {
			if (Object.keys(IBAttributes).some(key => key.includes(prop))) {
				return true;
			}
			return false;
		});

		if (includesProp) {
			const keys = Object.keys(props).filter(key =>
				relatedProps.some(prop => key.includes(prop))
			);
			keys.forEach(key => {
				attributes[key] = props[key];
			});
		}
	});
	const withUnitAttributes = [...withUnit, ...defaultWithUnit];

	Object.keys(IBAttributes).forEach(key => {
		const keyWithUnit = withUnitAttributes.find(k => key.includes(k));

		if (keyWithUnit) {
			const isUnit = key.includes('unit');

			const otherKey = isUnit
				? key.replace('-unit', '')
				: key.replace(keyWithUnit, `${keyWithUnit}-unit`);
			attributes[otherKey] = props[otherKey];
		}
	});

	return { ...attributes, ...IBAttributes };
};

export const deepOmit = obj => {
	const newObj = {};

	Object.keys(obj).forEach(key => {
		if (typeof obj[key] === 'object') {
			newObj[key] = deepOmit(obj[key]);
		} else if (!isNil(obj[key])) {
			newObj[key] = obj[key];
		}
	});

	return newObj;
};

export const getOnlyDifferentValues = (currObj, prevObj) =>
	Object.fromEntries(
		Object.entries(currObj).filter(
			([key, attr]) => !isEqual(attr, prevObj[key])
		)
	);
