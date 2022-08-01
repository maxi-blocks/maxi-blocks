import {
	getColorBackgroundObject,
	getGradientBackgroundObject,
	getBlockBackgroundStyles,
} from './getBackgroundStyles';
import getMarginPaddingStyles from './getMarginPaddingStyles';
import getBorderStyles from './getBorderStyles';
import { getSVGStyles } from './getSVGStyles';
import getIconStyles from './getIconStyles';
import getIconPathStyles from './getIconPathStyles';
import getGroupAttributes from '../getGroupAttributes';
import getLastBreakpointAttribute from '../getLastBreakpointAttribute';

import { isNil, isEmpty } from 'lodash';

const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const getIconSize = (obj, isHover = false, prefix = '') => {
	const response = {
		label: 'Icon size',
		general: {},
	};

	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {};

		const iconWidth =
			obj[`${prefix}icon-width-${breakpoint}${isHover ? '-hover' : ''}`];

		if (!isNil(iconWidth) && !isEmpty(iconWidth)) {
			const iconUnit = getLastBreakpointAttribute({
				target: `${prefix}icon-width-unit`,
				breakpoint,
				attributes: obj,
				isHover,
			});
			response[breakpoint].width = `${iconWidth}${iconUnit}`;
			response[breakpoint].height = `${iconWidth}${iconUnit}`;
		}

		if (isEmpty(response[breakpoint]) && breakpoint !== 'general')
			delete response[breakpoint];
	});

	return { iconSize: response };
};

const getIconObject = (props, target, prefix = '') => {
	const response = {
		background: props[`${prefix}icon-background-active-media-general`] ===
			'color' && {
			...getColorBackgroundObject({
				...getGroupAttributes(
					props,
					['icon', 'background', 'iconBackgroundColor'],
					false,
					prefix
				),
				...getGroupAttributes(
					props,
					'backgroundColor',
					false,
					'button-'
				),
				prefix: `${prefix}icon-`,
				blockStyle: props.blockStyle,
				isIconInherit: props[`${prefix}icon-inherit`],
				isIcon: true,
			}),
		},
		gradient: props[`${prefix}icon-background-active-media-general`] ===
			'gradient' && {
			...getGradientBackgroundObject({
				...getGroupAttributes(
					props,
					['icon', 'iconBackground', 'iconBackgroundGradient'],
					false,
					prefix
				),
				prefix: `${prefix}icon-`,
				isIcon: true,
			}),
		},
		padding:
			target === 'icon' &&
			getMarginPaddingStyles({
				obj: {
					...getGroupAttributes(props, 'iconPadding', false, prefix),
				},
				prefix: `${prefix}icon-`,
			}),
		border:
			target === 'icon' &&
			getBorderStyles({
				obj: {
					...getGroupAttributes(
						props,
						['iconBorder', 'iconBorderWidth', 'iconBorderRadius'],
						false,
						prefix
					),
				},
				prefix: `${prefix}icon-`,
				blockStyle: props.blockStyle,
			}),
	};

	const responsive = {
		label: 'Icon responsive',
		general: {},
	};

	breakpoints.forEach(breakpoint => {
		responsive[breakpoint] = {};

		if (
			!isNil(props[`${prefix}icon-spacing-${breakpoint}`]) &&
			!isNil(props[`${prefix}icon-position`])
		) {
			props[`${prefix}icon-position`] === 'left' ||
			props[`${prefix}icon-position`] === 'right'
				? (responsive[breakpoint][
						`margin-${
							props[`${prefix}icon-position`] === 'right'
								? 'left'
								: 'right'
						}`
				  ] = `${
						props[`${prefix}icon-only`]
							? '0'
							: getLastBreakpointAttribute({
									target: `${prefix}icon-spacing`,
									breakpoint,
									attributes: props,
							  })
				  }px`)
				: (responsive[breakpoint][
						`margin-${
							props[`${prefix}icon-position`] === 'top'
								? 'bottom'
								: 'top'
						}`
				  ] = `${
						props[`${prefix}icon-only`]
							? '0'
							: getLastBreakpointAttribute({
									target: `${prefix}icon-spacing`,
									breakpoint,
									attributes: props,
							  })
				  }px`);
		}
	});

	response.iconResponsive = responsive;

	return response;
};

const getIconHoverObject = (props, target, prefix = '') => {
	const iconHoverStatus = props[`${prefix}icon-status-hover`];
	const iconHoverActiveMedia =
		props[`${prefix}icon-background-active-media-general-hover`];

	const response = {
		icon:
			iconHoverStatus &&
			getIconStyles(
				{
					...getGroupAttributes(
						props,
						['iconHover', 'typography'],
						true,
						prefix
					),
				},
				props.blockStyle,
				props[`${prefix}icon-inherit`],
				true
			),
		background: iconHoverStatus &&
			iconHoverActiveMedia === 'color' &&
			target === 'iconHover' && {
				...getColorBackgroundObject({
					...getGroupAttributes(
						props,
						[
							'icon',
							'iconBackgroundColor',
							'background',
							'backgroundColor',
						],
						true,
						prefix
					),
					prefix: `${prefix}icon-`,
					blockStyle: props.blockStyle,
					isIconInherit: props[`${prefix}icon-inherit`],
					isHover: true,
					isIcon: true,
				}),
			},
		gradient: iconHoverStatus &&
			iconHoverActiveMedia === 'gradient' &&
			target === 'iconHover' && {
				...getGradientBackgroundObject({
					...getGroupAttributes(
						props,
						['icon', 'iconBackgroundGradient'],
						true,
						prefix
					),
					prefix: `${prefix}icon-`,
					isHover: true,
					isIcon: true,
				}),
			},
		border:
			iconHoverStatus &&
			target === 'iconHover' &&
			getBorderStyles({
				obj: {
					...getGroupAttributes(
						props,
						[
							'iconBorderHover',
							'iconBorderWidthHover',
							'iconBorderRadiusHover',
						],
						true,
						prefix
					),
				},
				prefix: `${prefix}icon-`,
				blockStyle: props.blockStyle,
				isHover: true,
			}),
	};

	return response;
};

const getButtonIconStyles = ({
	obj,
	blockStyle,
	isHover = false,
	target = '',
	wrapperTarget = '',
	prefix = '',
}) => {
	const hasIcon = !!obj[`${prefix}icon-content`];
	const {
		[`${prefix}icon-inherit`]: iconInherit,
		[`${prefix}icon-status-hover`]: iconHoverStatus,
	} = obj;

	const useIconColor = !iconInherit;

	const response = {
		...(hasIcon && !isHover
			? {
					...getSVGStyles({
						obj,
						target,
						blockStyle,
						prefix: `${prefix}icon-`,
						useIconColor,
					}),
					[` ${target}`]: getIconObject(obj, 'icon', prefix),
					[` ${target} svg`]: getIconSize(obj, false, prefix),
					[` ${target} svg > *`]: getIconObject(obj, 'svg', prefix),
					[` ${target} svg path`]: getIconPathStyles(
						obj,
						false,
						prefix
					),
			  }
			: iconHoverStatus &&
			  (() => {
					const iconHoverObj = getIconHoverObject(
						obj,
						'iconHover',
						prefix
					);

					return {
						[` ${wrapperTarget}:hover ${target}`]: iconHoverObj,
						[` ${wrapperTarget}:hover ${target} svg > *`]:
							iconHoverObj,
						[` ${wrapperTarget}:hover ${target} svg`]: getIconSize(
							obj,
							true,
							prefix
						),
						[` ${wrapperTarget}:hover ${target} svg path`]:
							getIconPathStyles(obj, true),
						...getSVGStyles({
							obj,
							target: `:hover ${target}`,
							blockStyle,
							prefix: `${prefix}icon-`,
							useIconColor,
							isHover: true,
						}),
					};
			  })()),
		// Background
		...getBlockBackgroundStyles({
			...getGroupAttributes(obj, 'svg'),
			[`${target} svg path`]: getIconPathStyles(obj, false),
			[` ${wrapperTarget}:hover ${target}`]:
				obj['icon-status-hover'] &&
				getIconHoverObject(obj, 'iconHover'),
			[` ${wrapperTarget}:hover ${target} svg > *`]:
				obj['icon-status-hover'] &&
				getIconHoverObject(obj, 'iconHover'),
			[` ${wrapperTarget}:hover ${target} svg`]:
				obj['icon-status-hover'] && getIconSize(obj, true),
			[` ${wrapperTarget}:hover ${target} svg path`]:
				obj['icon-status-hover'] && getIconPathStyles(obj, true),
			...getBlockBackgroundStyles({
				...getGroupAttributes(obj, [
					'blockBackground',
					'border',
					'borderWidth',
					'borderRadius',
				]),
				blockStyle,
			}),
			...getBlockBackgroundStyles({
				...getGroupAttributes(
					obj,
					[
						'blockBackground',
						'border',
						'borderWidth',
						'borderRadius',
					],
					true
				),
				isHover: true,
				blockStyle,
			}),
		}),
	};

	return response;
};

export default getButtonIconStyles;
