/**
 * External dependencies
 */
import { isNil, isEmpty } from 'lodash';

/**
 * Internal dependencies
 */
import {
	getGroupAttributes,
	styleProcessor,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
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
	getSVGStyles,
} from '../../extensions/styles/helpers';

import { selectorsSlider } from './custom-css';

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
	};

	return response;
};

const getIconObject = (props, prefix = 'navigation-arrow-both-icon-') => {
	let attrPrefix = 'arrow';
	if (prefix.includes('active')) attrPrefix = 'dotActive';
	else if (prefix.includes('dot')) attrPrefix = 'dot';

	const response = {
		background: props[`${prefix}background-active-media-general`] ===
			'color' && {
			...getColorBackgroundObject({
				...getGroupAttributes(props, [
					`${attrPrefix}Icon`,
					'background',
					'backgroundColor',
					`${attrPrefix}IconBackgroundColor`,
				]),
				prefix,
				blockStyle: props.blockStyle,
				isIconInherit: false,
				isIcon: true,
			}),
		},
		boxShadow: getBoxShadowStyles({
			obj: {
				...getGroupAttributes(props, `${attrPrefix}IconBoxShadow`),
			},
			prefix,
			blockStyle: props.blockStyle,
		}),
		gradient: props[`${prefix}background-active-media-general`] ===
			'gradient' && {
			...getGradientBackgroundObject({
				...getGroupAttributes(props, [
					`${attrPrefix}Icon`,
					`${attrPrefix}IconBackground`,
					`${attrPrefix}IconBackgroundGradient`,
				]),
				prefix,
				isIcon: true,
			}),
		},
		padding: getMarginPaddingStyles({
			obj: {
				...getGroupAttributes(props, `${attrPrefix}IconPadding`),
			},
			prefix,
		}),
		border: getBorderStyles({
			obj: {
				...getGroupAttributes(props, [
					`${attrPrefix}IconBorder`,
					`${attrPrefix}IconBorderWidth`,
					`${attrPrefix}IconBorderRadius`,
				]),
			},
			prefix,
			blockStyle: props.blockStyle,
		}),
	};

	return response;
};

const getIconHoverObject = (props, prefix) => {
	let attrPrefix = 'arrow';
	if (prefix.includes('active')) attrPrefix = 'dotActive';
	else if (prefix.includes('dot')) attrPrefix = 'dot';

	const iconHoverStatus = props[`${prefix}status-hover`];
	const iconHoverActiveMedia =
		props[`${prefix}background-active-media-general-hover`];

	const response = {
		background: iconHoverStatus &&
			iconHoverActiveMedia === 'color' && {
				...getColorBackgroundObject({
					...getGroupAttributes(
						props,
						[
							`${attrPrefix}Icon`,
							`${attrPrefix}IconBackgroundColor`,
							'background',
							'backgroundColor',
						],
						true
					),
					prefix,
					blockStyle: props.blockStyle,
					isHover: true,
					isIcon: true,
				}),
			},
		gradient: iconHoverStatus &&
			iconHoverActiveMedia === 'gradient' && {
				...getGradientBackgroundObject({
					...getGroupAttributes(
						props,
						(props,
						[
							`${attrPrefix}Icon`,
							`${attrPrefix}IconBackground`,
							`${attrPrefix}IconBackgroundGradient`,
						]),
						true
					),
					prefix,
					isHover: true,
					isIcon: true,
				}),
			},
		border:
			iconHoverStatus &&
			getBorderStyles({
				obj: {
					...getGroupAttributes(
						props,
						[
							`${attrPrefix}IconBorder`,
							`${attrPrefix}IconBorderWidth`,
							`${attrPrefix}IconBorderRadius`,
						],
						true
					),
				},
				prefix,
				blockStyle: props.blockStyle,
				isHover: true,
			}),
	};

	return response;
};

// TO DO: abstract this (and the Button's one) later
const getIconSize = (
	obj,
	prefix = 'navigation-arrow-both-icon',
	isHover = false
) => {
	const response = {
		label: 'Icon size',
		general: {},
	};

	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {};

		if (
			!isNil(
				obj[`${prefix}-width-${breakpoint}${isHover ? '-hover' : ''}`]
			)
		) {
			response[breakpoint].width = `${
				obj[`${prefix}-width-${breakpoint}${isHover ? '-hover' : ''}`]
			}${getLastBreakpointAttribute({
				target: `${prefix}-width-unit`,
				breakpoint,
				attributes: obj,
				isHover,
			})}`;
			response[breakpoint].height = `${
				obj[`${prefix}-width-${breakpoint}${isHover ? '-hover' : ''}`]
			}${getLastBreakpointAttribute({
				target: `${prefix}-width-unit`,
				breakpoint,
				attributes: obj,
				isHover,
			})}`;
		}

		if (isEmpty(response[breakpoint]) && breakpoint !== 'general')
			delete response[breakpoint];
	});

	return { iconSize: response };
};

// TO DO: abstract this (and the Button's one) later
const getIconPathStyles = (
	obj,
	isHover = false,
	prefix = 'navigation-arrow-both'
) => {
	const response = {
		label: 'Icon path',
		general: {},
	};

	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {};

		if (
			!isNil(
				obj[
					`${prefix}-icon-stroke-${breakpoint}${
						isHover ? '-hover' : ''
					}`
				]
			)
		) {
			response[breakpoint]['stroke-width'] = `${
				obj[
					`${prefix}-icon-stroke-${breakpoint}${
						isHover ? '-hover' : ''
					}`
				]
			}`;
		}

		if (isEmpty(response[breakpoint]) && breakpoint !== 'general')
			delete response[breakpoint];
	});

	return { iconPath: response };
};

const getIconSpacing = (
	props,
	icon,
	isHover = false,
	prefix = 'navigation-arrow-both',
	clientId = ''
) => {
	const response = {
		padding: getMarginPaddingStyles({
			obj: {
				...getGroupAttributes(
					props,
					icon === ''
						? 'navigationDotIconPadding'
						: 'navigationArrowBothIconPadding',
					isHover
				),
			},
			prefix: `${prefix}-icon-`,
		}),
	};

	const responsive = {
		label: 'Icon responsive',
		general: {},
	};

	const innerBlockCount =
		wp.data.select('core/block-editor').getBlocksByClientId(clientId)?.[0]
			?.innerBlocks?.length ?? 0;

	breakpoints.forEach(breakpoint => {
		responsive[breakpoint] = {};

		const size = `${getLastBreakpointAttribute({
			target: `${prefix}-icon-width`,
			breakpoint,
			attributes: props,
			isHover,
		})}${getLastBreakpointAttribute({
			target: `${prefix}-icon-width-unit`,
			breakpoint,
			attributes: props,
			isHover,
		})}`;

		const halfSize = `${
			getLastBreakpointAttribute({
				target: `${prefix}-icon-width`,
				breakpoint,
				attributes: props,
				isHover,
			}) / 2
		}${getLastBreakpointAttribute({
			target: `${prefix}-icon-width-unit`,
			breakpoint,
			attributes: props,
			isHover,
		})}`;

		const halfSizeAll = `${
			(getLastBreakpointAttribute({
				target: `${prefix}-icon-width`,
				breakpoint,
				attributes: props,
				isHover,
			}) *
				innerBlockCount) /
			2
		}${getLastBreakpointAttribute({
			target: `${prefix}-icon-width-unit`,
			breakpoint,
			attributes: props,
			isHover,
		})}`;

		const halfSizeSpacingBetween = `${
			(getLastBreakpointAttribute({
				target: `${prefix}-icon-spacing-between`,
				breakpoint,
				attributes: props,
				isHover,
			}) *
				innerBlockCount) /
			2
		}px`;

		if (
			!isNil(
				props[
					`${prefix}-icon-spacing-horizontal-${breakpoint}${
						isHover ? '-hover' : ''
					}`
				]
			)
		) {
			if (icon === 'prev')
				responsive[
					breakpoint
				].left = `calc(${-getLastBreakpointAttribute({
					target: `${prefix}-icon-spacing-horizontal`,
					breakpoint,
					attributes: props,
					isHover,
				})}px - ${halfSize})`;
			if (icon === 'next')
				responsive[
					breakpoint
				].right = `calc(${-getLastBreakpointAttribute({
					target: `${prefix}-icon-spacing-horizontal`,
					breakpoint,
					attributes: props,
					isHover,
				})}px - (${size} + ${halfSize}))`;
			if (icon === 'dots')
				responsive[
					breakpoint
				].left = `calc(${getLastBreakpointAttribute({
					target: `${prefix}-icon-spacing-horizontal`,
					breakpoint,
					attributes: props,
					isHover,
				})}% - ${halfSizeAll} - ${halfSizeSpacingBetween})`;
		}

		if (
			!isNil(
				props[
					`${prefix}-icon-spacing-vertical-${breakpoint}${
						isHover ? '-hover' : ''
					}`
				]
			)
		) {
			responsive[breakpoint].top = `${getLastBreakpointAttribute({
				target: `${prefix}-icon-spacing-vertical`,
				breakpoint,
				attributes: props,
				isHover,
			})}%`;
		}
	});

	response.iconResponsive = responsive;

	return response;
};

const getIconSpacingBetween = (
	props,
	prefix = 'navigation-dot',
	isHover = false
) => {
	const response = {};

	const responsive = {
		label: 'Icon responsive',
		general: {},
	};

	breakpoints.forEach(breakpoint => {
		responsive[breakpoint] = {};

		if (
			!isNil(
				props[
					`${prefix}-icon-spacing-between-${breakpoint}${
						isHover ? '-hover' : ''
					}`
				]
			)
		) {
			responsive[breakpoint][
				'margin-right'
			] = `${getLastBreakpointAttribute({
				target: `${prefix}-icon-spacing-between`,
				breakpoint,
				attributes: props,
				isHover,
			})}px`;
		}
	});

	response.iconResponsive = responsive;

	return response;
};

const getStyles = (props, breakpoint, clientId) => {
	const { uniqueID, blockStyle } = props;

	const arrowIconHoverStatus =
		props['navigation-arrow-both-icon-status-hover'];
	const dotIconHoverStatus = props['navigation-dot-icon-status-hover'];
	const dotIconActiveStatus = props['navigation-active-dot-icon-status'];
	const navigationType = getLastBreakpointAttribute({
		target: 'navigation-type',
		breakpoint,
		attributes: props,
		forceSingle: true,
	});

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
				...(navigationType.includes('arrow') &&
					(() => {
						return {
							...getSVGStyles({
								obj: props,
								target: ' .maxi-slider-block__arrow',
								blockStyle,
								prefix: 'navigation-arrow-both-icon-',
							}),
							' .maxi-slider-block__arrow': getIconObject(
								props,
								'navigation-arrow-both-icon-'
							),
							' .maxi-slider-block__arrow > div > div':
								getIconSize(
									props,
									'navigation-arrow-both-icon',
									false
								),
							' .maxi-slider-block__arrow--prev': getIconSpacing(
								props,
								'prev',
								false,
								'navigation-arrow-both'
							),
							' .maxi-slider-block__arrow--next': getIconSpacing(
								props,
								'next',
								false,
								'navigation-arrow-both'
							),
							' .maxi-slider-block__arrow svg': getIconSize(
								props,
								'navigation-arrow-both-icon',
								false
							),
							' .maxi-slider-block__arrow svg path':
								getIconPathStyles(
									props,
									false,
									'navigation-arrow-both'
								),
						};
					})()),
				...(navigationType.includes('arrow') &&
					arrowIconHoverStatus &&
					(() => {
						return {
							...getSVGStyles({
								obj: props,
								target: ' .maxi-slider-block__arrow--prev:hover',
								blockStyle,
								prefix: 'navigation-arrow-both-icon-',
								isHover: true,
							}),
							...getSVGStyles({
								obj: props,
								target: ' .maxi-slider-block__arrow--next:hover',
								blockStyle,
								prefix: 'navigation-arrow-both-icon-',
								isHover: true,
							}),
							' .maxi-slider-block__arrow:hover':
								getIconHoverObject(
									props,
									'navigation-arrow-both-icon-'
								),
							' .maxi-slider-block__arrow--prev:hover':
								getIconSpacing(props, 'prev', true),
							' .maxi-slider-block__arrow--prev:hover svg':
								getIconSize(
									props,
									'navigation-arrow-both-icon',
									true
								),
							' .maxi-slider-block__arrow--prev:hover svg path':
								getIconPathStyles(
									props,
									true,
									'navigation-arrow-both'
								),

							' .maxi-slider-block__arrow--next:hover':
								getIconSpacing(props, 'next', true),
							' .maxi-slider-block__arrow--next:hover svg':
								getIconSize(
									props,
									'navigation-arrow-both-icon',
									true
								),
							' .maxi-slider-block__arrow--next:hover svg path':
								getIconPathStyles(
									props,
									true,
									'navigation-arrow-both'
								),
						};
					})()),
				...(navigationType.includes('dot') &&
					(() => {
						return {
							...getSVGStyles({
								obj: props,
								target: ' .maxi-slider-block__dot',
								blockStyle,
								prefix: 'navigation-dot-icon-',
							}),
							' .maxi-slider-block__dots': getIconSpacing(
								props,
								'dots',
								false,
								'navigation-dot',
								clientId
							),
							' .maxi-navigation-dot-icon-block__icon':
								getIconSize(
									props,
									'navigation-dot-icon',
									false
								),
							' .maxi-navigation-dot-icon-block__icon > div':
								getIconSize(
									props,
									'navigation-dot-icon',
									false
								),
							' .maxi-slider-block__dot svg': getIconSize(
								props,
								'navigation-dot-icon',
								false
							),
							' .maxi-slider-block__dot': getIconObject(
								props,
								'navigation-dot-icon-'
							),

							' .maxi-slider-block__dot:not(:last-child)':
								getIconSpacingBetween(
									props,
									'navigation-dot',
									false
								),
							' .maxi-slider-block__dot svg path':
								getIconPathStyles(
									props,
									false,
									'navigation-dot'
								),
						};
					})()),
				...(navigationType.includes('dot') &&
					dotIconHoverStatus &&
					(() => {
						return {
							...getSVGStyles({
								obj: props,
								target: ' .maxi-slider-block__dot:not(.maxi-slider-block__dot--active):hover',
								blockStyle,
								prefix: 'navigation-dot-icon-',
								isHover: true,
							}),
							' .maxi-slider-block__dot:hover':
								getIconHoverObject(
									props,
									'navigation-dot-icon-'
								),
							' .maxi-slider-block__dot:not(.maxi-slider-block__dot--active):hover':
								getIconSpacing(props, 'prev', true),
							' .maxi-slider-block__dot:not(.maxi-slider-block__dot--active):hover svg':
								getIconSize(props, 'navigation-dot-icon', true),
							' .maxi-slider-block__dot:(.maxi-slider-block__dot--active):hover svg path':
								getIconPathStyles(
									props,
									true,
									'navigation-dot'
								),
						};
					})()),
				...(navigationType.includes('dot') &&
					dotIconActiveStatus &&
					(() => {
						return {
							...getSVGStyles({
								obj: props,
								target: ' .maxi-slider-block__dot--active',
								blockStyle,
								prefix: 'navigation-active-dot-icon-',
								isHover: false,
							}),
						};
					})()),
			},
			selectorsSlider,
			props
		),
	};

	return response;
};

export default getStyles;
