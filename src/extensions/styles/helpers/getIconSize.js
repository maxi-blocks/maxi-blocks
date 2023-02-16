/**
 * Internal dependencies
 */
import getAttributeValue from '../getAttributeValue';
import getLastBreakpointAttribute from '../getLastBreakpointAttribute';

/**
 * External dependencies
 */
import { isEmpty, isNil, round } from 'lodash';

const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const getIconSize = (
	obj,
	isHover = false,
	prefix = '',
	iconWidthHeightRatio = 1
) => {
	const response = {
		label: 'Icon size',
		general: {},
	};

	const svgType = getAttributeValue({
		target: 'svgType',
		props: obj,
		isHover,
		prefix,
	});

	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {};

		const iconSize =
			getLastBreakpointAttribute({
				target: `${prefix}icon-width`,
				isHover,
				breakpoint,
				attributes: obj,
			}) ??
			getLastBreakpointAttribute({
				target: `${prefix}icon-height`,
				isHover,
				breakpoint,
				attributes: obj,
			});

		const iconUnit =
			getLastBreakpointAttribute({
				target: `${prefix}icon-width-unit`,
				isHover,
				breakpoint,
				attributes: obj,
			}) ??
			getLastBreakpointAttribute({
				target: `${prefix}icon-height-unit`,
				isHover,
				breakpoint,
				attributes: obj,
			}) ??
			'px';

		const iconWidthFitContent = getLastBreakpointAttribute({
			target: `${prefix}icon-width-fit-content`,
			isHover,
			breakpoint,
			attributes: obj,
		});

		const iconStrokeWidth =
			svgType !== 'Shape'
				? getLastBreakpointAttribute({
						target: `${prefix}icon-stroke`,
						isHover,
						breakpoint,
						attributes: obj,
				  })
				: 1;

		const perStrokeWidthCoefficient = 4;

		const heightToStrokeWidthCoefficient =
			1 +
			((iconStrokeWidth - 1) *
				perStrokeWidthCoefficient *
				iconWidthHeightRatio) /
				100;

		if (!isNil(iconSize) && !isEmpty(iconSize)) {
			response[breakpoint].height = `${
				iconWidthFitContent && iconWidthHeightRatio !== 1
					? round(
							iconWidthHeightRatio > 1
								? (iconSize * heightToStrokeWidthCoefficient) /
										iconWidthHeightRatio
								: iconSize /
										(iconWidthHeightRatio *
											heightToStrokeWidthCoefficient)
					  )
					: iconSize
			}${iconUnit}`;
			response[breakpoint].width = `${iconSize}${iconUnit}`;
		}

		if (isEmpty(response[breakpoint]) && breakpoint !== 'general')
			delete response[breakpoint];
	});

	return { iconSize: response };
};

export default getIconSize;
