/**
 * Internal dependencies
 */
import { getBlockSelectorsByUniqueID } from './utils';
import { splitValueAndUnit } from '@extensions/styles/utils';

/**
 * External dependencies
 */
import { isEmpty, findKey, isEqual } from 'lodash';

// Constants
const NAME = 'IB Transform';
const BREAKPOINTS = Object.freeze(['general', 'xxl', 'xl', 'l', 'm', 's', 'xs']);
const TRANSFORM_TYPES = Object.freeze(['scale', 'rotate', 'translate', 'origin']);

const isEligible = blockAttributes => {
	const { relations } = blockAttributes;

	// Early return for quick fails
	if (!relations || isEmpty(relations)) return false;

	// Use for...of for better performance with break capability
	for (const relation of relations) {
		if (relation.settings !== 'Transform') continue;
		if (BREAKPOINTS.some(breakpoint => relation.css[breakpoint])) {
			return true;
		}
	}
	return false;
};

const transformIBCleaner = relations => {
	const reversedBreakpoints = BREAKPOINTS.slice().reverse();

	return relations.map(relation => {
		const { attributes, css } = relation;

		// Clean transform attributes
		for (const type of TRANSFORM_TYPES) {
			for (let i = 0; i < reversedBreakpoints.length - 1; i++) {
				const breakpoint = reversedBreakpoints[i];
				const nextBreakpoint = reversedBreakpoints[i + 1];
				const currentKey = `transform-${type}-${breakpoint}`;
				const nextKey = `transform-${type}-${nextBreakpoint}`;

				if (attributes[currentKey] &&
					isEqual(attributes[currentKey], attributes[nextKey])) {
					delete attributes[currentKey];
				}
			}
		}

		// Clean CSS
		const cssUsesTarget = Object.keys(css).some(target =>
			BREAKPOINTS.includes(target)
		);

		if (cssUsesTarget) {
			for (let i = 0; i < reversedBreakpoints.length - 1; i++) {
				const breakpoint = reversedBreakpoints[i];
				const nextBreakpoint = reversedBreakpoints[i + 1];

				if (css[breakpoint] &&
					isEqual(css[breakpoint]?.styles, css[nextBreakpoint]?.styles)) {
					delete css[breakpoint];
				}
			}
		} else {
			for (const [target, styles] of Object.entries(css)) {
				for (let i = 0; i < reversedBreakpoints.length - 1; i++) {
					const breakpoint = reversedBreakpoints[i];
					const nextBreakpoint = reversedBreakpoints[i + 1];

					if (styles[breakpoint] &&
						isEqual(styles[breakpoint]?.styles, styles[nextBreakpoint]?.styles)) {
						delete css[target][breakpoint];
					}
				}
			}
		}

		return { ...relation, attributes, css };
	});
};

const getAttributesFromStyle = (styles, selector) => {
	const result = {};

	for (const breakpoint of BREAKPOINTS) {
		if (!styles[breakpoint]) continue;

		const { transform, 'transform-origin': transformOrigin } = styles[breakpoint].styles;
		if (!transform && !transformOrigin) continue;

		if (transform) {
			const transformAttrs = transform.split(' ');
			for (const attr of transformAttrs) {
				const [key, value] = attr.replace(')', '').split('(');
				if (!key || !value) continue;

				const type = key.slice(0, -1);
				const axis = key.slice(-1).toLowerCase();

				if (['scale', 'rotate'].includes(type)) {
					const finalValue = type === 'scale'
						? parseFloat(value) * 100
						: parseFloat(value.replace('deg', ''));

					result[`transform-${type}-${breakpoint}`] = {
						[selector]: {
							normal: { [axis]: finalValue }
						}
					};
				}
				if (type === 'translate') {
					const { value: num, unit } = splitValueAndUnit(value);
					result[`transform-${type}-${breakpoint}`] = {
						[selector]: {
							normal: {
								[axis]: num,
								[`${axis}-unit`]: unit
							}
						}
					};
				}
			}
		}

		if (transformOrigin) {
			const [x, y] = transformOrigin.split(' ');
			for (const [axis, value] of Object.entries({ x, y })) {
				const isOriginWithUnit = !['top', 'right', 'bottom', 'left', 'center'].includes(value);
				const response = isOriginWithUnit
					? (() => {
						const { value: num, unit } = splitValueAndUnit(value);
						return { [axis]: `${num}`, [`${axis}-unit`]: unit };
					})()
					: { [axis]: value };

				result[`transform-origin-${breakpoint}`] = {
					[selector]: {
						normal: response
					}
				};
			}
		}
	}

	return result;
};

const migrate = newAttributes => {
	const { relations } = newAttributes;
	const newRelations = [...relations];

	for (let i = 0; i < newRelations.length; i++) {
		const relation = newRelations[i];
		if (relation.settings !== 'Transform') continue;

		const { attributes, css, uniqueID } = relation;
		const selector = findKey(
			getBlockSelectorsByUniqueID(uniqueID),
			selector => selector.normal.target === ''
		);

		newRelations[i] = {
			...relation,
			attributes: {
				...attributes,
				...getAttributesFromStyle(css, selector),
				'transform-target': selector
			},
			css: { '': { ...css } }
		};
	}

	return {
		...newAttributes,
		relations: transformIBCleaner(newRelations)
	};
};

export default { name: NAME, isEligible, migrate };
