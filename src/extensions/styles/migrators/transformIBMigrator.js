/**
 * Internal dependencies
 */
import * as blocksData from '../../../blocks/data';

/**
 * External dependencies
 */
import { isEmpty, findKey, isEqual } from 'lodash';
import { splitValueAndUnit } from '../utils';

const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const selectorsDictionary = blockName =>
	Object.values(blocksData).find(data => data.name === blockName).customCss
		.selectors;

const isEligible = blockAttributes => {
	const { relations } = blockAttributes;

	if (!relations || isEmpty(relations)) return false;

	const isOldStructure = relations.some(relation => {
		if (relation.settings !== 'Transform') return false;

		if (breakpoints.some(breakpoint => relation.css[breakpoint]))
			return true;

		return false;
	});

	return isOldStructure;
};

const transformIBCleaner = relations =>
	relations.map(relation => {
		const { attributes, css } = relation;

		const reversedBreakpoints = breakpoints.slice().reverse();

		['scale', 'rotate', 'translate', 'origin'].forEach(type => {
			reversedBreakpoints.forEach((breakpoint, i) => {
				if (
					attributes[`transform-${type}-${breakpoint}`] &&
					isEqual(
						attributes[`transform-${type}-${breakpoint}`],
						attributes[
							`transform-${type}-${reversedBreakpoints[i + 1]}`
						]
					)
				) {
					delete attributes[`transform-${type}-${breakpoint}`];
				}
			});
		});

		const cssUsesTarget = Object.keys(css).some(target =>
			breakpoints.includes(target)
		);

		if (cssUsesTarget)
			reversedBreakpoints.forEach((breakpoint, i) => {
				if (
					css[breakpoint] &&
					isEqual(
						css[breakpoint]?.styles,
						css[reversedBreakpoints[i + 1]]?.styles
					)
				) {
					delete css[breakpoint];
				}
			});

		if (!cssUsesTarget)
			Object.entries(css).forEach(([target, styles]) => {
				reversedBreakpoints.forEach((breakpoint, i) => {
					if (
						styles[breakpoint] &&
						isEqual(
							styles[breakpoint]?.styles,
							styles[reversedBreakpoints[i + 1]]?.styles
						)
					) {
						delete css[target][breakpoint];
					}
				});
			});

		return { ...relation, attributes, css };
	});

const getAttributesFromStyle = (styles, selector) => {
	const result = {};

	breakpoints.forEach(breakpoint => {
		if (!styles[breakpoint]) return;

		const { transform, 'transform-origin': transformOrigin } =
			styles[breakpoint].styles;

		if (!transform && !transformOrigin) return;

		if (transform) {
			const transformAttrs = transform.split(' ');

			transformAttrs.forEach(attr => {
				const [key, value] = attr.replace(')', '').split('(');

				if (!key || !value) return;

				const type = key.slice(0, -1);
				const axis = key.slice(-1).toLowerCase();

				if (['scale', 'rotate'].includes(type)) {
					let finalValue;
					if (type === 'scale') {
						finalValue = parseFloat(value) * 100;
					}
					if (type === 'rotate') {
						finalValue = parseFloat(value.replace('deg', ''));
					}

					result[`transform-${type}-${breakpoint}`] = {
						...result[`transform-${type}-${breakpoint}`],
						[selector]: {
							...result[`transform-${type}-${breakpoint}`]?.[
								selector
							],
							normal: {
								...result[`transform-${type}-${breakpoint}`]?.[
									selector
								].normal,
								[axis]: finalValue,
							},
						},
					};
				}
				if (type === 'translate') {
					const { value: num, unit } = splitValueAndUnit(value);

					result[`transform-${type}-${breakpoint}`] = {
						...result[`transform-${type}-${breakpoint}`],
						[selector]: {
							...result[`transform-${type}-${breakpoint}`]?.[
								selector
							],
							normal: {
								...result[`transform-${type}-${breakpoint}`]?.[
									selector
								].normal,
								[axis]: num,
								[`${axis}-unit`]: unit,
							},
						},
					};
				}
			});
		}
		if (transformOrigin) {
			const [x, y] = transformOrigin.split(' ');
			const originAxis = { x, y };

			Object.entries(originAxis).forEach(([axis, value]) => {
				const isOriginWithUnit = ![
					'top',
					'right',
					'bottom',
					'left',
					'center',
				].includes(value);

				const response = {
					...(isOriginWithUnit
						? (() => {
								const { value: num, unit } =
									splitValueAndUnit(value);

								return {
									[axis]: `${num}`,
									[`${axis}-unit`]: unit,
								};
						  })()
						: (() => {
								return {
									[axis]: value,
								};
						  })()),
				};

				result[`transform-origin-${breakpoint}`] = {
					...result[`transform-origin-${breakpoint}`],
					[selector]: {
						...result[`transform-origin-${breakpoint}`]?.[selector],
						normal: {
							...result[`transform-origin-${breakpoint}`]?.[
								selector
							].normal,
							...response,
						},
					},
				};
			});
		}
	});

	return result;
};

const migrate = ({ newAttributes }) => {
	const { relations } = newAttributes;

	const newRelations = [...relations];

	newRelations.forEach((relation, i) => {
		if (relation.settings !== 'Transform') return;

		const { attributes, css, uniqueID } = relation;

		// Gets the type of block to look for its selectors on the dictionary
		const typeOfTarget = uniqueID.slice(0, uniqueID.lastIndexOf('-'));

		// Returns the empty target selector, so the main one
		const selector = findKey(
			selectorsDictionary(typeOfTarget),
			selector => selector.normal.target === ''
		);

		newRelations[i].attributes = {
			...attributes,
			...getAttributesFromStyle(css, selector),
			'transform-target': selector,
		};
		newRelations[i].css = { '': { ...css } };
	});

	return { ...newAttributes, relations: transformIBCleaner(newRelations) };
};

export default { isEligible, migrate };
