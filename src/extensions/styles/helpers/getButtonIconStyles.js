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

const breakpoints = ['g', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const getIconObject = (props, target, prefix = '', isIB) => {
	const iconBackgroundActiveMediaGeneral = getAttributesValue({
		target: 'i-b_am',
		props,
		prefix,
		breakpoint: 'g',
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
				...getGroupAttributes(props, 'backgroundColor', false, 'bt-'),
				prefix: `${prefix}i-`,
				blockStyle: props._bs,
				isIconInherit: getAttributesValue({
					target: 'i_i',
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
				prefix: `${prefix}i-`,
				blockStyle: props._bs,
				isIcon: true,
			}),
		},
		padding:
			target === 'icon' &&
			getMarginPaddingStyles({
				obj: {
					...getGroupAttributes(props, 'iconPadding', false, prefix),
				},
				prefix: `${prefix}i-`,
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
				prefix: `${prefix}i-`,
				blockStyle: props._bs,
				isIB,
			}),
	};

	const responsive = {
		label: 'Icon responsive',
		g: {},
	};

	breakpoints.forEach(breakpoint => {
		responsive[breakpoint] = {};

		const iconSpacing = getAttributesValue({
			target: 'i_spa',
			props,
			prefix,
			breakpoint,
		});
		const [iconPosition, iconOnly] = getAttributesValue({
			target: ['i_pos', 'i_on'],
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
									target: 'i_spa',
									prefix,
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
									target: 'i_spa',
									prefix,
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
	const [iconHoverStatus, iconInherit] = getAttributesValue({
		target: ['i.sh', 'i_i'],
		props,
		prefix,
	});

	const iconHoverActiveMedia = getAttributesValue({
		target: 'i-b_am',
		prefix,
		isHover: true,
		breakpoint: 'g',
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
				props._bs,
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
					prefix: `${prefix}i-`,
					blockStyle: props._bs,
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
					prefix: `${prefix}i-`,
					isHover: true,
					blockStyle: props._bs,
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
				prefix: `${prefix}i-`,
				blockStyle: props._bs,
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
	const [iconInherit, iconHoverStatus, iconContent] = getAttributesValue({
		target: ['i_i', 'i.sh', 'i_c'],
		props: obj,
		prefix,
	});
	const hasIcon = !!iconContent;
	const useIconColor = !iconInherit;
	const normalTarget = `${wrapperTarget} ${target}`;
	const hoverTarget = `${wrapperTarget}:hover ${target}`;

	const iconType = getAttributesValue({
		props: obj,
		target: '_st',
		prefix,
	})?.toLowerCase();

	const response = {
		...(hasIcon && !isHover
			? {
					...getSVGStyles({
						obj,
						target: normalTarget,
						blockStyle,
						prefix: `${prefix}i-`,
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
							prefix: `${prefix}i-`,
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
