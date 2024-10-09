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
import getGroupAttributes from '../getGroupAttributes';
import getLastBreakpointAttribute from '../getLastBreakpointAttribute';
import getIconSize from './getIconSize';
import getAttributeValue from '../getAttributeValue';

const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const getIconObject = (props, target, prefix = '', isIB) => {
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

const getIconHoverObject = (props, target, prefix = '', iconType = '') => {
	const iconHoverStatus = props[`${prefix}icon-status-hover`];
	const iconHoverActiveMedia = getAttributeValue({
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
				props[`${prefix}icon-inherit`],
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
	hoverOnIcon = false,
}) => {
	const hasIcon = !!obj[`${prefix}icon-content`];
	const {
		[`${prefix}icon-inherit`]: iconInherit,
		[`${prefix}icon-status-hover`]: iconHoverStatus,
		[`${prefix}icon-status-hover-target`]: iconHoverStatusTarget,
	} = obj;
	const useIconColor = !iconInherit;
	const normalTarget = ` ${wrapperTarget} ${target}`;

	const getHoverTarget = () => {
		if (!iconHoverStatusTarget) {
			return `:hover ${wrapperTarget} ${target}`;
		}

		if (hoverOnIcon) {
			return ` ${wrapperTarget} ${target}:hover`;
		}

		return ` ${wrapperTarget}:hover ${target}`;
	};
	const hoverTarget = getHoverTarget();

	const iconType = obj?.[`${prefix}svgType`]?.toLowerCase();

	let response = {};

	if (hasIcon && !isHover) {
		const svgStyles = getSVGStyles({
			obj,
			target: normalTarget,
			blockStyle,
			prefix: `${prefix}icon-`,
			useIconColor,
			iconType,
		});

		const iconObj = getIconObject(obj, 'icon', prefix, isIB);
		const iconSize = getIconSize(obj, false, prefix, iconWidthHeightRatio);
		const svgChildStyles = getIconObject(obj, 'svg', prefix);

		response = {
			...svgStyles,
			[normalTarget]: iconObj,
			[`${normalTarget} svg`]: iconSize,
			[`${normalTarget} svg > *`]: svgChildStyles,
		};
	} else if (iconHoverStatus) {
		const hoverIconObj = getIconHoverObject(
			obj,
			'iconHover',
			prefix,
			iconType
		);
		const hoverIconSize = getIconSize(
			obj,
			true,
			prefix,
			iconWidthHeightRatio
		);

		const hoverIconPathStyles = getIconPathStyles(obj, true);
		const hoverSvgStyles = getSVGStyles({
			obj,
			target: hoverTarget,
			blockStyle,
			prefix: `${prefix}icon-`,
			useIconColor,
			isHover: true,
			iconType,
		});

		response = {
			[`${hoverTarget}`]: hoverIconObj,
			[`${hoverTarget} svg > *`]: hoverIconObj,
			[`${hoverTarget} svg`]: hoverIconSize,
			[`${hoverTarget} svg path`]: hoverIconPathStyles,
			...hoverSvgStyles,
		};
	}

	response = {
		...response,
		[`${normalTarget} svg path`]: getIconPathStyles(obj, false),
		[hoverTarget]:
			obj['icon-status-hover'] && getIconHoverObject(obj, 'iconHover'),
		[`${hoverTarget} svg > *`]:
			obj['icon-status-hover'] && getIconHoverObject(obj, 'iconHover'),
		[`${hoverTarget} svg`]:
			obj['icon-status-hover'] &&
			getIconSize(obj, true, prefix, iconWidthHeightRatio),
		[`${hoverTarget} svg path`]:
			obj['icon-status-hover'] && getIconPathStyles(obj, true),
	};

	const backgroundStyles = {
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
				['blockBackground', 'border', 'borderWidth', 'borderRadius'],
				true
			),
			isHover: true,
			blockStyle,
		}),
	};

	return { ...response, ...backgroundStyles };
};

export default getButtonIconStyles;
