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
	console.time(`getButtonIconStyles ${prefix}`);

	console.time(`getButtonIconStyles ${prefix}: Initial Setup`);
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
	console.timeEnd(`getButtonIconStyles ${prefix}: Initial Setup`);

	let response = {};

	if (hasIcon && !isHover) {
		console.time(`getButtonIconStyles ${prefix}: Normal Icon Styles`);

		console.time(`getButtonIconStyles ${prefix}: SVG Styles`);
		const svgStyles = getSVGStyles({
			obj,
			target: normalTarget,
			blockStyle,
			prefix: `${prefix}icon-`,
			useIconColor,
			iconType,
		});
		console.timeEnd(`getButtonIconStyles ${prefix}: SVG Styles`);

		console.time(`getButtonIconStyles ${prefix}: Icon Object`);
		const iconObj = getIconObject(obj, 'icon', prefix, isIB);
		console.timeEnd(`getButtonIconStyles ${prefix}: Icon Object`);

		console.time(`getButtonIconStyles ${prefix}: Icon Size`);
		const iconSize = getIconSize(obj, false, prefix, iconWidthHeightRatio);
		console.timeEnd(`getButtonIconStyles ${prefix}: Icon Size`);

		console.time(`getButtonIconStyles ${prefix}: SVG > * Styles`);
		const svgChildStyles = getIconObject(obj, 'svg', prefix);
		console.timeEnd(`getButtonIconStyles ${prefix}: SVG > * Styles`);

		response = {
			...svgStyles,
			[normalTarget]: iconObj,
			[`${normalTarget} svg`]: iconSize,
			[`${normalTarget} svg > *`]: svgChildStyles,
		};

		console.timeEnd(`getButtonIconStyles ${prefix}: Normal Icon Styles`);
	} else if (iconHoverStatus) {
		console.time(`getButtonIconStyles ${prefix}: Hover Icon Styles`);

		console.time(`getButtonIconStyles ${prefix}: Hover Icon Object`);
		const hoverIconObj = getIconHoverObject(
			obj,
			'iconHover',
			prefix,
			iconType
		);
		console.timeEnd(`getButtonIconStyles ${prefix}: Hover Icon Object`);

		console.time(`getButtonIconStyles ${prefix}: Hover Icon Size`);
		const hoverIconSize = getIconSize(
			obj,
			true,
			prefix,
			iconWidthHeightRatio
		);
		console.timeEnd(`getButtonIconStyles ${prefix}: Hover Icon Size`);

		console.time(`getButtonIconStyles ${prefix}: Hover Icon Path Styles`);
		const hoverIconPathStyles = getIconPathStyles(obj, true);
		console.timeEnd(
			`getButtonIconStyles ${prefix}: Hover Icon Path Styles`
		);

		console.time(`getButtonIconStyles ${prefix}: Hover SVG Styles`);
		const hoverSvgStyles = getSVGStyles({
			obj,
			target: hoverTarget,
			blockStyle,
			prefix: `${prefix}icon-`,
			useIconColor,
			isHover: true,
			iconType,
		});
		console.timeEnd(`getButtonIconStyles ${prefix}: Hover SVG Styles`);

		response = {
			[`${hoverTarget}`]: hoverIconObj,
			[`${hoverTarget} svg > *`]: hoverIconObj,
			[`${hoverTarget} svg`]: hoverIconSize,
			[`${hoverTarget} svg path`]: hoverIconPathStyles,
			...hoverSvgStyles,
		};

		console.timeEnd(`getButtonIconStyles ${prefix}: Hover Icon Styles`);
	}

	console.time(`getButtonIconStyles ${prefix}: Additional Styles`);
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
	console.timeEnd(`getButtonIconStyles ${prefix}: Additional Styles`);

	console.time(`getButtonIconStyles ${prefix}: Background Styles`);
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
	console.timeEnd(`getButtonIconStyles ${prefix}: Background Styles`);

	console.timeEnd(`getButtonIconStyles ${prefix}`);
	return { ...response, ...backgroundStyles };
};

export default getButtonIconStyles;
