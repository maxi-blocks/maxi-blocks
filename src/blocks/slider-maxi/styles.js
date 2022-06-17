/**
 * External dependencies
 */
import { isNil, isEmpty } from 'lodash';

/**
 * Internal dependencies
 */
import {
	getGroupAttributes,
	stylesCleaner,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
import {
	getSizeStyles,
	getBoxShadowStyles,
	getZIndexStyles,
	getPositionStyles,
	getDisplayStyles,
	getTransformStyles,
	getMarginPaddingStyles,
	getBlockBackgroundStyles,
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
		transform: getTransformStyles({
			...getGroupAttributes(props, 'transform'),
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
const getIconPathStyles = (obj, isHover = false) => {
	const response = {
		label: 'Icon path',
		general: {},
	};

	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {};

		if (
			!isNil(
				obj[
					`navigation-arrow-both-icon-stroke-${breakpoint}${
						isHover ? '-hover' : ''
					}`
				]
			)
		) {
			response[breakpoint]['stroke-width'] = `${
				obj[
					`navigation-arrow-both-icon-stroke-${breakpoint}${
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

const getIconSpacing = (props, icon, isHover = false) => {
	const response = {
		padding: getMarginPaddingStyles({
			obj: {
				...getGroupAttributes(
					props,
					'navigationArrowBothIconPadding',
					isHover
				),
			},
			prefix: 'navigation-arrow-both-icon-',
		}),
	};

	const responsive = {
		label: 'Icon responsive',
		general: {},
	};

	breakpoints.forEach(breakpoint => {
		responsive[breakpoint] = {};

		const size = `${getLastBreakpointAttribute({
			target: 'navigation-arrow-both-icon-width',
			breakpoint,
			attributes: props,
			isHover,
		})}${getLastBreakpointAttribute({
			target: 'navigation-arrow-both-icon-width-unit',
			breakpoint,
			attributes: props,
			isHover,
		})}`;

		const halfSize = `${
			getLastBreakpointAttribute({
				target: 'navigation-arrow-both-icon-width',
				breakpoint,
				attributes: props,
				isHover,
			}) / 2
		}${getLastBreakpointAttribute({
			target: 'navigation-arrow-both-icon-width-unit',
			breakpoint,
			attributes: props,
			isHover,
		})}`;

		if (
			!isNil(
				props[
					`navigation-arrow-both-icon-spacing-horizontal-${breakpoint}${
						isHover ? '-hover' : ''
					}`
				]
			)
		) {
			if (icon === 'prev')
				responsive[
					breakpoint
				].left = `calc(${-getLastBreakpointAttribute({
					target: 'navigation-arrow-both-icon-spacing-horizontal',
					breakpoint,
					attributes: props,
					isHover,
				})}px - ${halfSize})`;
			if (icon === 'next')
				responsive[
					breakpoint
				].right = `calc(${-getLastBreakpointAttribute({
					target: 'navigation-arrow-both-icon-spacing-horizontal',
					breakpoint,
					attributes: props,
					isHover,
				})}px - (${size} + ${halfSize}))`;
		}

		if (
			!isNil(
				props[
					`navigation-arrow-both-icon-spacing-vertical-${breakpoint}${
						isHover ? '-hover' : ''
					}`
				]
			)
		) {
			responsive[breakpoint].top = `${getLastBreakpointAttribute({
				target: 'navigation-arrow-both-icon-spacing-vertical',
				breakpoint,
				attributes: props,
				isHover,
			})}%`;
		}
	});

	response.iconResponsive = responsive;

	return response;
};

const getStyles = (props, breakpoint) => {
	const { uniqueID, blockStyle } = props;

	const iconHoverStatus = props['navigation-arrow-both-icon-status-hover'];

	const navigationType = props[`navigation-type-${breakpoint}`];

	const response = {
		[uniqueID]: stylesCleaner(
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
							' .maxi-slider-block__arrow--prev': getIconSpacing(
								props,
								'prev',
								false
							),
							' .maxi-slider-block__arrow--next': getIconSpacing(
								props,
								'next',
								false
							),
							' .maxi-slider-block__arrow svg': getIconSize(
								props,
								'navigation-arrow-both-icon',
								false
							),
							' .maxi-slider-block__arrow': getIconSize(
								props,
								'navigation-arrow-both-icon',
								false
							),
							' .maxi-slider-block__arrow svg path':
								getIconPathStyles(props, false),
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
								'prev',
								false
							),
							// ' .maxi-slider-block__dots': getIconSpacing(
							// 	props,
							// 	'next',
							// 	false
							// ),
							' .maxi-slider-block__dot svg': getIconSize(
								props,
								'navigation-dot-icon',
								false
							),
							' .maxi-slider-block__dot ': getIconSize(
								props,
								'navigation-dot-icon',
								false
							),
							' .maxi-slider-block__dot svg path':
								getIconPathStyles(props, false),
						};
					})()),
				...(navigationType.includes('arrow') &&
					iconHoverStatus &&
					(() => {
						// const iconHoverObj = getIconHoverObject(
						// 	props,
						// 	'arrowIconHover'
						// );

						return {
							// ' .maxi-slider-block__arrow--prev:hover':
							// 	iconHoverObj,
							// ' .maxi-slider-block__arrow--prev:hover svg > *':
							// 	iconHoverObj,
							' .maxi-slider-block__arrow--prev:hover':
								getIconSpacing(props, 'prev', true),
							' .maxi-slider-block__arrow--prev:hover svg':
								getIconSize(
									props,
									'navigation-arrow-both-icon',
									true
								),
							' .maxi-slider-block__arrow--prev:hover svg path':
								getIconPathStyles(props, true),
							...getSVGStyles({
								obj: {
									...getGroupAttributes(
										props,
										'arrowIconHover',
										true
									),
								},
								target: '.maxi-slider-block__arrow--prev:hover',
								blockStyle,
								prefix: 'navigation-arrow-both-icon-',
								isHover: true,
							}),
							' .maxi-slider-block__arrow--next:hover':
								getIconSpacing(props, 'next', true),
							' .maxi-slider-block__arrow--next:hover svg':
								getIconSize(
									props,
									'navigation-arrow-both-icon',
									true
								),
							' .maxi-slider-block__arrow--next:hover svg path':
								getIconPathStyles(props, true),
							...getSVGStyles({
								obj: {
									...getGroupAttributes(
										props,
										'arrowIconHover',
										true
									),
								},
								target: '.maxi-slider-block__arrow--next:hover',
								blockStyle,
								prefix: 'navigation-arrow-both-icon-',
								isHover: true,
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
