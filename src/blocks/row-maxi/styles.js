/**
 * External dependencies
 */
import { isNil } from 'lodash';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	getGroupAttributes,
	styleProcessor,
	getLastBreakpointAttribute,
} from '@extensions/styles';
import {
	getSizeStyles,
	getBoxShadowStyles,
	getZIndexStyles,
	getPositionStyles,
	getDisplayStyles,
	getMarginPaddingStyles,
	getBlockBackgroundStyles,
	getColorBackgroundObject,
	getGradientBackgroundObject,
	getBorderStyles,
	getOpacityStyles,
	getOverflowStyles,
	getFlexStyles,
	getPaginationStyles,
	getPaginationLinksStyles,
	getPaginationColours,
	getSVGStyles,
	getIconSize,
	getIconPathStyles,
} from '@extensions/styles/helpers';
import data from './data';

const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const getNormalObject = props => {
	const response = {
		boxShadow: getBoxShadowStyles({
			obj: {
				...getGroupAttributes(props, 'boxShadow'),
			},
			blockStyle: props.blockStyle,
		}),
		border: getBorderStyles({
			obj: {
				...getGroupAttributes(props, [
					'border',
					'borderWidth',
					'borderRadius',
				]),
			},
			blockStyle: props.blockStyle,
		}),
		size: getSizeStyles({
			...getGroupAttributes(props, 'size'),
		}),
		margin: getMarginPaddingStyles({
			obj: { ...getGroupAttributes(props, 'margin') },
		}),
		padding: getMarginPaddingStyles({
			obj: { ...getGroupAttributes(props, 'padding') },
		}),
		opacity: getOpacityStyles({
			...getGroupAttributes(props, 'opacity'),
		}),
		zIndex: getZIndexStyles({
			...getGroupAttributes(props, 'zIndex'),
		}),
		position: getPositionStyles({
			...getGroupAttributes(props, 'position'),
		}),
		display: getDisplayStyles({
			...getGroupAttributes(props, 'display'),
		}),
		row: {
			general: {},
		},
		overflow: getOverflowStyles({
			...getGroupAttributes(props, 'overflow'),
		}),
		flex: getFlexStyles({
			...getGroupAttributes(props, 'flex'),
		}),
	};

	return response;
};

const getHoverObject = props => {
	const response = {
		border:
			props['border-status-hover'] &&
			getBorderStyles({
				obj: {
					...getGroupAttributes(
						props,
						['border', 'borderWidth', 'borderRadius'],
						true
					),
				},
				isHover: true,
				blockStyle: props.blockStyle,
			}),
		boxShadow:
			props['box-shadow-status-hover'] &&
			getBoxShadowStyles({
				obj: {
					...getGroupAttributes(props, 'boxShadow', true),
				},
				isHover: true,
				blockStyle: props.blockStyle,
			}),
		opacity:
			props['opacity-status-hover'] &&
			getOpacityStyles(
				{ ...getGroupAttributes(props, 'opacity', true) },
				true
			),
	};

	return response;
};

/**
 * Get icon styles for carousel navigation (arrows and dots)
 */
const getIconStyles = (props, prefix = 'navigation-arrow-both-') => {
	const iconPrefix = `${prefix}icon-`;
	const isDot = prefix.includes('dot');

	const response = {
		...(!isDot && {
			background: props[`${iconPrefix}status-background`] &&
				props[`${iconPrefix}background-active-media-general`] ===
					'color' && {
					...getColorBackgroundObject({
						...getGroupAttributes(
							props,
							['icon', 'iconBackgroundColor'],
							false,
							prefix
						),
						...getGroupAttributes(props, [
							'background',
							'backgroundColor',
						]),
						prefix: iconPrefix,
						blockStyle: props.blockStyle,
						isIcon: true,
					}),
				},
			gradient: props[`${iconPrefix}status-background`] &&
				props[`${iconPrefix}background-active-media-general`] ===
					'gradient' && {
					...getGradientBackgroundObject({
						...getGroupAttributes(
							props,
							['icon', 'iconBackground', 'iconBackgroundGradient'],
							false,
							prefix
						),
						prefix: iconPrefix,
						isIcon: true,
					}),
				},
			boxShadow:
				props[`${iconPrefix}status-shadow`] &&
				getBoxShadowStyles({
					obj: {
						...getGroupAttributes(
							props,
							'iconBoxShadow',
							false,
							prefix
						),
					},
					prefix: iconPrefix,
					blockStyle: props.blockStyle,
				}),
			border:
				props[`${iconPrefix}status-border`] &&
				getBorderStyles({
					obj: {
						...getGroupAttributes(
							props,
							['iconBorder', 'iconBorderWidth', 'iconBorderRadius'],
							false,
							prefix
						),
					},
					prefix: iconPrefix,
					blockStyle: props.blockStyle,
				}),
		}),
	};

	return response;
};

const getIconHoverStyles = (props, prefix) => {
	const iconPrefix = `${prefix}icon-`;
	const iconHoverStatus = props[`${iconPrefix}status-hover`];
	const iconHoverActiveMedia =
		props[`${iconPrefix}background-active-media-general-hover`];
	const isDot = prefix.includes('dot');

	const response = iconHoverStatus && !isDot
		? {
				background: iconHoverActiveMedia === 'color' && {
					...getColorBackgroundObject({
						...getGroupAttributes(
							props,
							['icon', 'iconBackgroundColor'],
							true,
							prefix
						),
						...getGroupAttributes(
							props,
							['background', 'backgroundColor'],
							true
						),
						prefix: iconPrefix,
						blockStyle: props.blockStyle,
						isHover: true,
						isIcon: true,
					}),
				},
				gradient: iconHoverActiveMedia === 'gradient' && {
					...getGradientBackgroundObject({
						...getGroupAttributes(
							props,
							[
								'icon',
								'iconBackground',
								'iconBackgroundGradient',
							],
							true,
							prefix
						),
						prefix: iconPrefix,
						isHover: true,
						isIcon: true,
					}),
				},
				border: getBorderStyles({
					obj: {
						...getGroupAttributes(
							props,
							[
								'iconBorder',
								'iconBorderWidth',
								'iconBorderRadius',
							],
							true,
							prefix
						),
					},
					prefix: iconPrefix,
					blockStyle: props.blockStyle,
					isHover: true,
				}),
				boxShadow: getBoxShadowStyles({
					obj: {
						...getGroupAttributes(
							props,
							'iconBoxShadow',
							true,
							prefix
						),
					},
					prefix: iconPrefix,
					blockStyle: props.blockStyle,
					isHover: true,
				}),
		  }
		: {};

	return response;
};

const getIconSpacing = (
	props,
	icon,
	isHover = false,
	prefix = 'navigation-arrow-both-'
) => {
	const response = {
		...(!prefix.includes('dot') && {
			padding: getMarginPaddingStyles({
				obj: {
					...getGroupAttributes(props, 'padding', isHover, prefix),
				},
				prefix: `${prefix}icon-`,
			}),
		}),
	};

	const responsive = {
		label: __('Icon responsive', 'maxi-blocks'),
		general: {},
	};

	breakpoints.forEach(breakpoint => {
		responsive[breakpoint] = {};

		const horizontalSpacing = getLastBreakpointAttribute({
			target: `${prefix}icon-spacing-horizontal`,
			breakpoint,
			attributes: props,
			isHover,
		});
		const verticalSpacing = getLastBreakpointAttribute({
			target: `${prefix}icon-spacing-vertical`,
			breakpoint,
			attributes: props,
			isHover,
		});

		if (!isNil(horizontalSpacing)) {
			if (icon === 'prev')
				responsive[breakpoint].left = `${-horizontalSpacing}px`;
			if (icon === 'next')
				responsive[breakpoint].right = `${-horizontalSpacing}px`;
			if (icon === 'dots')
				responsive[breakpoint].left = `${horizontalSpacing}%`;
		}

		if (!isNil(verticalSpacing)) {
			responsive[breakpoint].top = `${verticalSpacing}%`;
		}
	});

	response.iconResponsive = responsive;

	return response;
};

const getIconSpacingBetween = (
	props,
	prefix = 'navigation-dot-',
	isHover = false
) => {
	const response = {};

	const responsive = {
		label: __('Icon responsive', 'maxi-blocks'),
		general: {},
	};

	breakpoints.forEach(breakpoint => {
		responsive[breakpoint] = {};

		if (
			!isNil(
				props[
					`${prefix}icon-spacing-between-${breakpoint}${
						isHover ? '-hover' : ''
					}`
				]
			)
		) {
			responsive[breakpoint][
				'margin-right'
			] = `${getLastBreakpointAttribute({
				target: `${prefix}icon-spacing-between`,
				breakpoint,
				attributes: props,
				isHover,
			})}px`;
		}
	});

	response.iconResponsive = responsive;

	return response;
};

const getDisabledStyles = (props, prefix) => {
	const response = {
		iconDisplay: {},
	};

	breakpoints.forEach(breakpoint => {
		response.iconDisplay[breakpoint] = {};

		const isEnabled = getLastBreakpointAttribute({
			target: `${prefix}status`,
			breakpoint,
			attributes: props,
			forceSingle: true,
		});
		if (!isNil(isEnabled) && !isEnabled)
			response.iconDisplay[breakpoint] = { display: 'none' };
	});

	return response;
};

const getIconObject = (props, prefix, target, isHover = false) => {
	const hoverFlag = isHover ? ':hover' : '';
	const fullTarget = ` ${target}${hoverFlag}`;
	const isActive = prefix.includes('active');

	const response = {
		...getSVGStyles({
			obj: props,
			target: fullTarget,
			blockStyle: props.blockStyle,
			prefix: `${prefix}icon-`,
			isHover,
		}),
		[` ${fullTarget} svg path`]: getIconPathStyles(props, isHover, prefix),
		...(!isHover && {
			[` ${fullTarget}`]: {
				...getIconStyles(props, prefix),
				...getDisabledStyles(
					getGroupAttributes(props, 'navigation'),
					prefix
				),
			},
		}),
		...(isHover && {
			[` ${fullTarget}`]: getIconHoverStyles(props, prefix),
		}),
		...(!isActive && {
			[` ${fullTarget} svg`]: getIconSize(props, isHover, prefix),
		}),
	};

	return response;
};

const getArrowIconObject = (props, isHover = false) => {
	const hoverFlag = isHover ? ':hover' : '';
	const prefix = 'navigation-arrow-both-';
	const target = '.maxi-row-carousel__arrow';

	return {
		...['prev', 'next'].reduce(
			(acc, curr) => ({
				...acc,
				[` ${target}--${curr}${hoverFlag}`]: getIconSpacing(
					props,
					curr,
					isHover,
					prefix
				),
			}),
			{}
		),
		[` ${target}${hoverFlag} > div > div`]: getIconSize(
			props,
			isHover,
			prefix
		),
		...getIconObject(props, prefix, target, isHover),
	};
};

const getDotsIconObject = props => {
	const prefix = 'navigation-dot-';
	const dotIconHoverStatus = props['navigation-dot-icon-status-hover'];
	const dotIconActiveStatus = props['active-navigation-dot-icon-status'];

	return {
		' .maxi-navigation-dot-icon-block__icon': getIconSize(
			props,
			false,
			prefix
		),
		' .maxi-navigation-dot-icon-block__icon > div': getIconSize(
			props,
			false,
			prefix
		),
		' .maxi-row-carousel__dot:not(:last-child)': getIconSpacingBetween(
			props,
			'navigation-dot-',
			false
		),
		' .maxi-row-carousel__dots': getIconSpacing(
			props,
			'dots',
			false,
			prefix
		),
		...getIconObject(props, prefix, '.maxi-row-carousel__dot'),
		...(dotIconHoverStatus && {
			...getIconObject(
				props,
				prefix,
				'.maxi-row-carousel__dot:not(.maxi-row-carousel__dot--active)',
				true
			),
		}),
		...(dotIconActiveStatus && {
			...getIconObject(
				props,
				`active-${prefix}`,
				'.maxi-row-carousel__dot--active'
			),
		}),
	};
};

const getStyles = props => {
	const { uniqueID } = props;

	// Check if carousel is enabled (single global attribute now)
	const isCarouselEnabled = props['row-carousel-status'];

	const arrowIconHoverStatus =
		props['navigation-arrow-both-icon-status-hover'];

	const response = {
		[uniqueID]: styleProcessor(
			{
				'': getNormalObject(props),
				':hover': getHoverObject(props),
				...getBlockBackgroundStyles({
					...getGroupAttributes(props, [
						'blockBackground',
						'border',
						'borderWidth',
						'borderRadius',
					]),
					blockStyle: props.blockStyle,
				}),
				...getBlockBackgroundStyles({
					...getGroupAttributes(
						props,
						[
							'blockBackground',
							'border',
							'borderWidth',
							'borderRadius',
						],
						true
					),
					isHover: true,
					blockStyle: props.blockStyle,
				}),
				...(props['cl-pagination'] && {
					' .maxi-pagination': getPaginationStyles(props),
					' .maxi-pagination a': getPaginationLinksStyles(props),
					' .maxi-pagination .maxi-pagination__pages > span':
						getPaginationLinksStyles(props),
					' .maxi-pagination a:hover': getPaginationColours(
						props,
						'hover'
					),
					' .maxi-pagination .maxi-pagination__pages > span.maxi-pagination__link--current':
						getPaginationColours(props, 'current'),
				}),
				// Add carousel navigation styles when carousel is enabled
				...(isCarouselEnabled && {
					...getArrowIconObject(props),
					...(arrowIconHoverStatus && {
						...getArrowIconObject(props, true),
					}),
					...getDotsIconObject(props),
				}),
			},
			data,
			props
		),
	};

	return response;
};

export default getStyles;
