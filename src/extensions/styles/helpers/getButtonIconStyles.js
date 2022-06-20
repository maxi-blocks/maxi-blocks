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

const getIconSize = (obj, isHover = false) => {
	const response = {
		label: 'Icon size',
		general: {},
	};

	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {};

		const iconWidth =
			obj[`icon-width-${breakpoint}${isHover ? '-hover' : ''}`];

		if (!isNil(iconWidth) && !isEmpty(iconWidth)) {
			const iconUnit = getLastBreakpointAttribute({
				target: 'icon-width-unit',
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

const getIconObject = (props, target) => {
	const response = {
		background: props['icon-background-active-media-general'] ===
			'color' && {
			...getColorBackgroundObject({
				...getGroupAttributes(props, [
					'icon',
					'background',
					'iconBackgroundColor',
				]),
				...getGroupAttributes(
					props,
					'backgroundColor',
					false,
					'button-'
				),
				prefix: 'icon-',
				blockStyle: props.blockStyle,
				isIconInherit: props['icon-inherit'],
				isIcon: true,
			}),
		},
		gradient: props['icon-background-active-media-general'] ===
			'gradient' && {
			...getGradientBackgroundObject({
				...getGroupAttributes(props, [
					'icon',
					'iconBackground',
					'iconBackgroundGradient',
				]),
				prefix: 'icon-',
				isIcon: true,
			}),
		},
		padding:
			target === 'icon' &&
			getMarginPaddingStyles({
				obj: {
					...getGroupAttributes(props, 'iconPadding'),
				},
				prefix: 'icon-',
			}),
		border:
			target === 'icon' &&
			getBorderStyles({
				obj: {
					...getGroupAttributes(props, [
						'iconBorder',
						'iconBorderWidth',
						'iconBorderRadius',
					]),
				},
				prefix: 'icon-',
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
			!isNil(props[`icon-spacing-${breakpoint}`]) &&
			!isNil(props['icon-position'])
		) {
			props['icon-position'] === 'left' ||
			props['icon-position'] === 'right'
				? (responsive[breakpoint][
						`margin-${
							props['icon-position'] === 'right'
								? 'left'
								: 'right'
						}`
				  ] = `${
						props['icon-only']
							? '0'
							: getLastBreakpointAttribute({
									target: 'icon-spacing',
									breakpoint,
									attributes: props,
							  })
				  }px`)
				: (responsive[breakpoint][
						`margin-${
							props['icon-position'] === 'top' ? 'bottom' : 'top'
						}`
				  ] = `${
						props['icon-only']
							? '0'
							: getLastBreakpointAttribute({
									target: 'icon-spacing',
									breakpoint,
									attributes: props,
							  })
				  }px`);
		}
	});

	response.iconResponsive = responsive;

	return response;
};

const getIconHoverObject = (props, target) => {
	const iconHoverStatus = props['icon-status-hover'];
	const iconHoverActiveMedia =
		props['icon-background-active-media-general-hover'];

	const response = {
		icon:
			iconHoverStatus &&
			getIconStyles(
				{
					...getGroupAttributes(
						props,
						['iconHover', 'typography'],
						true
					),
				},
				props.blockStyle,
				props['icon-inherit'],
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
						true
					),
					prefix: 'icon-',
					blockStyle: props.blockStyle,
					isIconInherit: props['icon-inherit'],
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
						true
					),
					prefix: 'icon-',
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
						true
					),
				},
				prefix: 'icon-',
				blockStyle: props.blockStyle,
				isHover: true,
			}),
	};

	return response;
};

const getButtonIconStyles = ({ obj, blockStyle, isHover = false }) => {
	const hasIcon = !!obj['icon-content'];
	const {
		'icon-inherit': iconInherit,
		'icon-status-hover': iconHoverStatus,
	} = obj;

	const useIconColor = !iconInherit;

	const response = {
		...(hasIcon && !isHover
			? {
					...getSVGStyles({
						obj,
						target: '.maxi-button-block__icon',
						blockStyle,
						prefix: 'icon-',
						useIconColor,
					}),
					' .maxi-button-block__icon': getIconObject(obj, 'icon'),
					' .maxi-button-block__icon svg': getIconSize(obj, false),
					' .maxi-button-block__icon svg > *': getIconObject(
						obj,
						'svg'
					),
					' .maxi-button-block__icon svg path': getIconPathStyles(
						obj,
						false
					),
			  }
			: iconHoverStatus &&
			  (() => {
					const iconHoverObj = getIconHoverObject(obj, 'iconHover');

					return {
						' .maxi-button-block__button:hover .maxi-button-block__icon':
							iconHoverObj,
						' .maxi-button-block__button:hover .maxi-button-block__icon svg > *':
							iconHoverObj,
						' .maxi-button-block__button:hover .maxi-button-block__icon svg':
							getIconSize(obj, true),
						' .maxi-button-block__button:hover .maxi-button-block__icon svg path':
							getIconPathStyles(obj, true),
						...getSVGStyles({
							obj,
							target: ':hover .maxi-button-block__icon',
							blockStyle,
							prefix: 'icon-',
							isHover: true,
						}),
					};
			  })()),
		// Background
		...getBlockBackgroundStyles({
			...getGroupAttributes(obj, 'svg'),
			' .maxi-button-block__icon svg path': getIconPathStyles(obj, false),
			' .maxi-button-block__button:hover .maxi-button-block__icon':
				obj['icon-status-hover'] &&
				getIconHoverObject(obj, 'iconHover'),
			' .maxi-button-block__button:hover .maxi-button-block__icon svg > *':
				obj['icon-status-hover'] &&
				getIconHoverObject(obj, 'iconHover'),
			' .maxi-button-block__button:hover .maxi-button-block__icon svg':
				obj['icon-status-hover'] && getIconSize(obj, true),
			' .maxi-button-block__button:hover .maxi-button-block__icon svg path':
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
