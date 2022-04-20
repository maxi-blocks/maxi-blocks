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
	getAlignmentFlexStyles,
	getAlignmentTextStyles,
	getBackgroundStyles,
	getBlockBackgroundStyles,
	getBorderStyles,
	getBoxShadowStyles,
	getColorBackgroundObject,
	getDisplayStyles,
	getFlexStyles,
	getGradientBackgroundObject,
	getIconStyles,
	getSVGStyles,
	getMarginPaddingStyles,
	getOpacityStyles,
	getOverflowStyles,
	getPositionStyles,
	getSizeStyles,
	getTransformStyles,
	getTransitionStyles,
	getTypographyStyles,
	getZIndexStyles,
} from '../../extensions/styles/helpers';
import { selectorsButton } from './custom-css';

const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const getWrapperObject = props => {
	const response = {
		alignment: getAlignmentFlexStyles({
			...getGroupAttributes(props, 'alignment'),
		}),
		border: getBorderStyles({
			obj: {
				...getGroupAttributes(props, [
					'border',
					'borderWidth',
					'borderRadius',
				]),
			},
			parentBlockStyle: props.parentBlockStyle,
			isButton: true,
		}),
		boxShadow: getBoxShadowStyles({
			obj: {
				...getGroupAttributes(props, 'boxShadow'),
			},
			parentBlockStyle: props.parentBlockStyle,
		}),
		opacity: getOpacityStyles({
			...getGroupAttributes(props, 'opacity'),
		}),
		size: getSizeStyles({
			...getGroupAttributes(props, 'size'),
		}),
		flex: getFlexStyles({
			...getGroupAttributes(props, 'flex'),
		}),
		margin: getMarginPaddingStyles({
			obj: {
				...getGroupAttributes(props, 'margin'),
			},
		}),
		padding: getMarginPaddingStyles({
			obj: {
				...getGroupAttributes(props, 'padding'),
			},
		}),
		transform: getTransformStyles({
			...getGroupAttributes(props, 'transform'),
		}),
		display: getDisplayStyles({
			...getGroupAttributes(props, 'display'),
		}),
		position: getPositionStyles({
			...getGroupAttributes(props, 'position'),
		}),
		overflow: getOverflowStyles({
			...getGroupAttributes(props, 'overflow'),
		}),
		zIndex: getZIndexStyles({
			...getGroupAttributes(props, 'zIndex'),
		}),
	};

	return response;
};

const getHoverWrapperObject = props => {
	const response = {
		border: getBorderStyles({
			obj: {
				...getGroupAttributes(
					props,
					['border', 'borderWidth', 'borderRadius'],
					true
				),
			},
			parentBlockStyle: props.parentBlockStyle,
			isHover: true,
			isButton: false, // yes, is button, but in this case is the wrapper 👍
		}),
		boxShadow:
			props['box-shadow-status-hover'] &&
			getBoxShadowStyles({
				obj: {
					...getGroupAttributes(props, 'boxShadow', true),
				},
				parentBlockStyle: props.parentBlockStyle,
				isHover: true,
			}),
	};

	return response;
};

const getNormalObject = props => {
	const response = {
		size: getSizeStyles(
			{
				...getGroupAttributes(props, 'size', false, 'button-'),
			},
			'button-'
		),
		border: getBorderStyles({
			obj: {
				...getGroupAttributes(
					props,
					['border', 'borderWidth', 'borderRadius'],
					false,
					'button-'
				),
			},
			parentBlockStyle: props.parentBlockStyle,
			isButton: true,
			prefix: 'button-',
			scValues: props.scValues,
		}),
		boxShadow: getBoxShadowStyles({
			obj: {
				...getGroupAttributes(props, 'boxShadow', false, 'button-'),
			},
			parentBlockStyle: props.parentBlockStyle,
			prefix: 'button-',
		}),
		textAlignment: getAlignmentTextStyles({
			...getGroupAttributes(props, 'textAlignment'),
		}),
		transitionDuration: getTransitionStyles({
			...getGroupAttributes(props, 'transitionDuration'),
		}),
		...getBackgroundStyles({
			...getGroupAttributes(
				props,
				['background', 'backgroundColor', 'backgroundGradient'],
				false,
				'button-'
			),
			isButton: true,
			blockStyle: props.parentBlockStyle,
			prefix: 'button-',
		}),
		margin: getMarginPaddingStyles({
			obj: {
				...getGroupAttributes(props, 'margin', false, 'button-'),
			},
			prefix: 'button-',
		}),
		padding: getMarginPaddingStyles({
			obj: {
				...getGroupAttributes(props, 'padding', false, 'button-'),
			},
			prefix: 'button-',
		}),
	};

	return response;
};

const getHoverObject = (props, scValues) => {
	const response = {
		border: getBorderStyles({
			obj: {
				...getGroupAttributes(
					props,
					['border', 'borderWidth', 'borderRadius'],
					true,
					'button-'
				),
			},
			isHover: true,
			parentBlockStyle: props.parentBlockStyle,
			isButton: true,
			prefix: 'button-',
			scValues,
		}),
		boxShadow:
			props['button-box-shadow-status-hover'] &&
			getBoxShadowStyles({
				obj: {
					...getGroupAttributes(props, 'boxShadow', true, 'button-'),
				},
				isHover: true,
				prefix: 'button-',
				parentBlockStyle: props.parentBlockStyle,
			}),
		...getBackgroundStyles({
			...getGroupAttributes(
				props,
				['background', 'backgroundColor', 'backgroundGradient'],
				true,
				'button-'
			),
			isButton: true,
			blockStyle: props.parentBlockStyle,
			isHover: true,
			prefix: 'button-',
			scValues,
		}),
	};

	return response;
};

const getContentObject = props => {
	const response = {
		typography: getTypographyStyles({
			obj: {
				...getGroupAttributes(props, 'typography'),
			},
			parentBlockStyle: props.parentBlockStyle,
			textLevel: 'button',
		}),
	};

	return response;
};

const getHoverContentObject = (props, scValues) => {
	const response = {
		typography: getTypographyStyles({
			obj: {
				...getGroupAttributes(props, 'typography', true),
			},
			isHover: true,
			parentBlockStyle: props.parentBlockStyle,
			textLevel: 'button',
			normalTypography: {
				...getGroupAttributes(props, 'typography'),
			},
			scValues,
		}),
		transitionDuration: getTransitionStyles({
			...getGroupAttributes(props, 'transitionDuration'),
		}),
	};

	return response;
};

const getIconSize = (obj, isHover = false) => {
	const response = {
		label: 'Icon size',
		general: {},
	};

	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {};

		if (!isNil(obj[`icon-width-${breakpoint}${isHover ? '-hover' : ''}`])) {
			response[breakpoint].width = `${
				obj[`icon-width-${breakpoint}${isHover ? '-hover' : ''}`]
			}${getLastBreakpointAttribute({
				target: 'icon-width-unit',
				breakpoint,
				attributes: obj,
				isHover,
			})}`;
			response[breakpoint].height = `${
				obj[`icon-width-${breakpoint}${isHover ? '-hover' : ''}`]
			}${getLastBreakpointAttribute({
				target: 'icon-width-unit',
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

const getIconPathStyles = (obj, isHover = false) => {
	const response = {
		label: 'Icon path',
		general: {},
	};

	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {};

		if (
			!isNil(obj[`icon-stroke-${breakpoint}${isHover ? '-hover' : ''}`])
		) {
			response[breakpoint]['stroke-width'] = `${
				obj[`icon-stroke-${breakpoint}${isHover ? '-hover' : ''}`]
			}`;
		}

		if (isEmpty(response[breakpoint]) && breakpoint !== 'general')
			delete response[breakpoint];
	});

	return { iconPath: response };
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
				blockStyle: props.parentBlockStyle,
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
				parentBlockStyle: props.parentBlockStyle,
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
			props['icon-position'] === 'left'
				? (responsive[breakpoint][
						'margin-right'
				  ] = `${getLastBreakpointAttribute({
						target: 'icon-spacing',
						breakpoint,
						attributes: props,
				  })}px`)
				: (responsive[breakpoint][
						'margin-left'
				  ] = `${getLastBreakpointAttribute({
						target: 'icon-spacing',
						breakpoint,
						attributes: props,
				  })}px`);
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
				props.parentBlockStyle,
				props['icon-inherit'],
				true
			),
		background: iconHoverStatus &&
			iconHoverActiveMedia === 'color' &&
			target === 'iconHover' && {
				...getColorBackgroundObject({
					...getGroupAttributes(
						props,
						['icon', 'iconBackgroundColor'],
						true
					),
					prefix: 'icon-',
					blockStyle: props.parentBlockStyle,
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
				parentBlockStyle: props.parentBlockStyle,
				isHover: true,
			}),
	};

	return response;
};

const getStyles = (props, scValues) => {
	const { uniqueID, parentBlockStyle } = props;

	const response = {
		[uniqueID]: stylesCleaner(
			{
				'': getWrapperObject(props),
				':hover': getHoverWrapperObject(props),
				' .maxi-button-block__button': getNormalObject(props),
				' .maxi-button-block__button:hover': getHoverObject(
					props,
					scValues
				),
				...getSVGStyles({
					obj: props,
					target: '.maxi-button-block__icon',
					blockStyle: parentBlockStyle,
					prefix: 'icon-',
				}),
				...getSVGStyles({
					obj: props,
					target: ':hover .maxi-button-block__icon',
					blockStyle: parentBlockStyle,
					prefix: 'icon-',
					isHover: true,
				}),
				' .maxi-button-block__content': getContentObject(props),
				' .maxi-button-block__button:hover .maxi-button-block__content':
					getHoverContentObject(props, scValues),
				' .maxi-button-block__icon': getIconObject(props, 'icon'),
				' .maxi-button-block__icon svg': getIconSize(props, false),
				' .maxi-button-block__icon svg > *': getIconObject(
					props,
					'svg'
				),
				' .maxi-button-block__icon svg path': getIconPathStyles(
					props,
					false
				),
				' .maxi-button-block__button:hover .maxi-button-block__icon':
					props['icon-status-hover'] &&
					getIconHoverObject(props, 'iconHover'),
				' .maxi-button-block__button:hover .maxi-button-block__icon svg > *':
					props['icon-status-hover'] &&
					getIconHoverObject(props, 'iconHover'),
				' .maxi-button-block__button:hover .maxi-button-block__icon svg':
					props['icon-status-hover'] && getIconSize(props, true),
				' .maxi-button-block__button:hover .maxi-button-block__icon svg path':
					props['icon-status-hover'] &&
					getIconPathStyles(props, true),
				...getBlockBackgroundStyles({
					...getGroupAttributes(props, [
						'blockBackground',
						'border',
						'borderWidth',
						'borderRadius',
					]),
					blockStyle: props.parentBlockStyle,
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
					blockStyle: props.parentBlockStyle,
				}),
			},
			selectorsButton,
			props
		),
	};

	return response;
};

export default getStyles;
