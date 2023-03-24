/**
 * External dependencies
 */
import { isNil } from 'lodash';

/**
 * Internal dependencies
 */
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
import getGroupAttributes from '../../attributes/getGroupAttributes';
import getLastBreakpointAttribute from '../../attributes/getLastBreakpointAttribute';
import getIconSize from './getIconSize';
import getAttributesValue from '../../attributes/getAttributesValue';

const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const getIconObject = (props, target, prefix = '', isIB) => {
	const iconBackgroundActiveMediaGeneral = getAttributesValue({
		target: 'icon-background-active-media',
		props,
		prefix,
		breakpoint: 'general',
	});

	const response = {
		background: iconBackgroundActiveMediaGeneral === 'color' && {
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
				isIconInherit: getAttributesValue({
					target: 'icon-inherit',
					props,
					prefix,
				}),
				isIcon: true,
			}),
		},
		gradient: iconBackgroundActiveMediaGeneral === 'gradient' && {
			...getGradientBackgroundObject({
				...getGroupAttributes(
					props,
					['icon', 'iconBackground', 'iconBackgroundGradient'],
					false,
					prefix
				),
				prefix: `${prefix}icon-`,
				blockStyle: props.blockStyle,
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
				isIB,
			}),
	};

	const responsive = {
		label: 'Icon responsive',
		general: {},
	};

	breakpoints.forEach(breakpoint => {
		responsive[breakpoint] = {};

		const iconSpacing = getAttributesValue({
			target: 'icon-spacing',
			props,
			prefix,
			breakpoint,
		});
		const { 'icon-position': iconPosition, 'icon-only': iconOnly } =
			getAttributesValue({
				target: ['icon-position', 'icon-only'],
				props,
				prefix,
			});

		if (!isNil(iconSpacing) && !isNil(iconPosition)) {
			iconPosition === 'left' || iconPosition === 'right'
				? (responsive[breakpoint][
						`margin-${iconPosition === 'right' ? 'left' : 'right'}`
				  ] = `${
						iconOnly
							? '0'
							: getLastBreakpointAttribute({
									target: `${prefix}icon-spacing`,
									breakpoint,
									attributes: props,
							  })
				  }px`)
				: (responsive[breakpoint][
						`margin-${iconPosition === 'top' ? 'bottom' : 'top'}`
				  ] = `${
						iconOnly
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

const getIconHoverObject = (props, target, prefix = '', iconType = '') => {
	const {
		'icon-status-hover': iconHoverStatus,
		'icon-inherit': iconInherit,
	} = getAttributesValue({
		target: ['icon-status-hover', 'icon-inherit'],
		props,
		prefix,
	});

	const iconHoverActiveMedia = getAttributesValue({
		target: 'icon-background-active-media',
		prefix,
		isHover: true,
		breakpoint: 'general',
		props,
	});

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
				iconInherit,
				true,
				iconType
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
					isIconInherit: iconInherit,
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
						['icon', 'iconBackground', 'iconBackgroundGradient'],
						true,
						prefix
					),
					prefix: `${prefix}icon-`,
					isHover: true,
					blockStyle: props.blockStyle,
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
						['iconBorder', 'iconBorderWidth', 'iconBorderRadius'],
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
	isIB = false,
	target = '',
	wrapperTarget = '',
	prefix = '',
	iconWidthHeightRatio,
}) => {
	const {
		[`${prefix}icon-inherit`]: iconInherit,
		[`${prefix}icon-status-hover`]: iconHoverStatus,
		[`${prefix}icon-content`]: iconContent,
	} = getAttributesValue({
		target: ['icon-inherit', 'icon-status-hover', 'icon-content'],
		props: obj,
		prefix,
	});
	const hasIcon = !!iconContent;
	const useIconColor = !iconInherit;
	const normalTarget = `${wrapperTarget} ${target}`;
	const hoverTarget = `${wrapperTarget}:hover ${target}`;

	const iconType = obj?.svgType?.toLowerCase();

	const response = {
		...(hasIcon && !isHover
			? {
					...getSVGStyles({
						obj,
						target: normalTarget,
						blockStyle,
						prefix: `${prefix}icon-`,
						useIconColor,
						iconType,
					}),
					[` ${wrapperTarget} ${target}`]: getIconObject(
						obj,
						'icon',
						prefix,
						isIB
					),
					[` ${wrapperTarget} ${target} svg`]: getIconSize(
						obj,
						false,
						prefix,
						iconWidthHeightRatio
					),
					[` ${wrapperTarget} ${target} svg > *`]: getIconObject(
						obj,
						'svg',
						prefix
					),
					[` ${wrapperTarget} ${target} svg path`]: getIconPathStyles(
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
						prefix,
						iconType
					);

					return {
						[` ${hoverTarget}`]: iconHoverObj,
						[` ${hoverTarget} svg > *`]: iconHoverObj,
						[` ${hoverTarget} svg`]: getIconSize(
							obj,
							true,
							prefix,
							iconWidthHeightRatio
						),
						[` ${hoverTarget} svg path`]: getIconPathStyles(
							obj,
							true
						),
						...getSVGStyles({
							obj,
							target: hoverTarget,
							blockStyle,
							prefix: `${prefix}icon-`,
							useIconColor,
							isHover: true,
							iconType,
						}),
					};
			  })()),
		// Background
		...getBlockBackgroundStyles({
			...getGroupAttributes(obj, 'svg'),
			[` ${normalTarget} svg path`]: getIconPathStyles(obj, false),
			[` ${hoverTarget}`]:
				obj['icon-status-hover'] &&
				getIconHoverObject(obj, 'iconHover'),
			[` ${hoverTarget} svg > *`]:
				obj['icon-status-hover'] &&
				getIconHoverObject(obj, 'iconHover'),
			[` ${hoverTarget} svg`]:
				obj['icon-status-hover'] &&
				getIconSize(obj, true, prefix, iconWidthHeightRatio),
			[` ${hoverTarget} svg path`]:
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
