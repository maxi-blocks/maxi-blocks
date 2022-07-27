/**
 * External dependencies
 */
import { isEmpty } from 'lodash';
import { splitValueAndUnit } from '../utils';

const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

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

const getAttributesFromStyle = styles => {
	const result = {};

	breakpoints.forEach(breakpoint => {
		if (!styles[breakpoint]) return;

		const { transform } = styles[breakpoint].styles;

		if (!transform) return;

		const transformAttrs = transform.split(' ');

		transformAttrs.forEach(attr => {
			const [key, value] = attr.replace(')', '').split('(');

			if (!key || !value) return;

			const axis = key.replace(key, '').toLowerCase();

			const isOriginWithUnit =
				key.includes('origin') &&
				!['top', 'right', 'bottom', 'left', 'center'].includes(value);

			const type = key.slice(0, -1);

			if (['scale', 'rotate'].includes(type) || !isOriginWithUnit) {
				result[`transform-${type}-${breakpoint}`] = {
					...result[`transform-${type}-${breakpoint}`],
					canvas: {
						...result[`transform-${type}-${breakpoint}`]?.canvas,
						normal: {
							...result[`transform-${type}-${breakpoint}`]?.canvas
								.normal,
							[axis]: value,
						},
					},
				};
			}
			if (['translate', 'origin'].includes(type) || isOriginWithUnit) {
				const { value: num, unit } = splitValueAndUnit(value);

				result[`transform-${type}-${breakpoint}`] = {
					...result[`transform-${type}-${breakpoint}`],
					canvas: {
						...result[`transform-${type}-${breakpoint}`]?.canvas,
						normal: {
							...result[`transform-${type}-${breakpoint}`]?.canvas
								.normal,
							[axis]: num,
							[`${axis}-unit`]: unit,
						},
					},
				};
			}
		});
	});

	return result;
};

const migrate = ({ newAttributes }) => {
	const { relations } = newAttributes;

	const newRelations = [...relations];

	newRelations.forEach((relation, i) => {
		if (relation.settings !== 'Transform') return;

		const { attributes, css } = relation;

		newRelations[i].attributes = {
			...attributes,
			...getAttributesFromStyle(css),
			'transform-target': 'canvas',
		};
		newRelations[i].css = { '': { ...css } };
	});

	return { ...newAttributes, relations: newRelations };
};

export default { isEligible, migrate };
