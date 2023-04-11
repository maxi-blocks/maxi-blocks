/**
 * External dependencies
 */
import { round, isNil, isEqual, omitBy, compact } from 'lodash';

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
const defaultRelatedAttributes = [
	{
		props: ['palette-color', 'palette-status', 'palette-opacity', 'color'],
	},
	{
		props: [
			'box-shadow-inset',
			'box-shadow-palette-color',
			'box-shadow-palette-status',
			'box-shadow-palette-opacity',
			'box-shadow-color',
			'box-shadow-horizontal',
			'box-shadow-vertical',
			'box-shadow-blur',
			'box-shadow-spread',
			'box-shadow-horizontal-unit',
			'box-shadow-vertical-unit',
			'box-shadow-blur-unit',
			'box-shadow-spread-unit',
		],
	},
	{ props: ['background-gradient', 'background-gradient-opacity'] },
];

export const addRelatedAttributes = ({
	props: propsObj,
	IBAttributes,
	attributesMap = {},
}) => {
	const attributes = {};

	const props = Object.fromEntries(
		Object.entries(omitBy(propsObj, isNil)).filter(
			([key]) => !key.includes('-hover')
		)
	);

	const {
		mandatory = [],
		withUnit = [],
		relatedAttributes = [],
	} = attributesMap;

	mandatory.forEach(prop => {
		const key = Object.keys(props).find(key => key.includes(prop));

		if (key) attributes[key] = props[key];
	});

	const relatedAttributesAll = [
		...relatedAttributes,
		...defaultRelatedAttributes,
	];

	relatedAttributesAll.forEach(relation => {
		const relatedProps = relation.props;

		const propsArray = compact(
			Object.keys(IBAttributes).map(prop => {
				const key = relatedProps.find(key => prop.includes(key));
				if (key) {
					return [prop, key];
				}
				return null;
			})
		);

		propsArray.forEach(([prop, key]) => {
			relatedProps.forEach(value => {
				if (value !== key) {
					const replacedKey = prop.replace(key, value);
					attributes[replacedKey] = props[replacedKey];
				}
			});
		});
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

	return { ...omitBy(attributes, isNil), ...IBAttributes };
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
