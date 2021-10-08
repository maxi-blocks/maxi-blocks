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
	getBorderStyles,
	getBoxShadowStyles,
	getColorBackgroundObject,
	getDisplayStyles,
	getGradientBackgroundObject,
	getIconStyles,
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

const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const getWrapperObject = props => {
	const response = {
		zIndex: getZIndexStyles({
			...getGroupAttributes(props, 'zIndex'),
		}),
		margin: getMarginPaddingStyles({
			...getGroupAttributes(props, 'margin'),
		}),
		transform: getTransformStyles({
			...getGroupAttributes(props, 'transform'),
		}),
		display: getDisplayStyles({
			...getGroupAttributes(props, 'display'),
		}),
		alignment: getAlignmentFlexStyles({
			...getGroupAttributes(props, 'alignment'),
		}),
		overflow: getOverflowStyles({
			...getGroupAttributes(props, 'overflow'),
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
	};

	return response;
};

const getHoverWrapperObject = props => {
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
				parentBlockStyle: props.parentBlockStyle,
				isHover: true,
				isButton: true,
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

const getNormalObject = props => {
	const response = {
		size: getSizeStyles(
			{
				...getGroupAttributes(props, 'size', false, 'button-'),
			},
			'button-'
		),
		padding: getMarginPaddingStyles({
			...getGroupAttributes(props, 'padding'),
		}),
		zIndex: getZIndexStyles({
			...getGroupAttributes(props, 'zIndex'),
		}),
		transitionDuration: getTransitionStyles({
			...getGroupAttributes(props, 'transitionDuration'),
		}),
		position: getPositionStyles({
			...getGroupAttributes(props, 'position'),
		}),
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
		...(props['background-active-media'] === 'color' && {
			background: getColorBackgroundObject({
				...getGroupAttributes(props, 'backgroundColor'),
				blockStyle: props.parentBlockStyle,
				isButton: true,
			}),
		}),
		...(props['background-active-media'] === 'gradient' && {
			background: getGradientBackgroundObject({
				...getGroupAttributes(props, 'backgroundGradient'),
			}),
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
				parentBlockStyle: props.parentBlockStyle,
				isButton: true,
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
		...(props['background-status-hover'] && {
			...(props['background-active-media-hover'] === 'color' && {
				background: getColorBackgroundObject({
					...getGroupAttributes(props, 'backgroundColor', true),
					blockStyle: props.parentBlockStyle,
					isHover: true,
					isButton: true,
				}),
			}),
			...(props['background-active-media-hover'] === 'gradient' && {
				background: getGradientBackgroundObject({
					...getGroupAttributes(props, 'backgroundGradient', true),
					isHover: true,
				}),
			}),
		}),
	};

	return response;
};

const getHoverContentObject = props => {
	const response = {
		typography: getTypographyStyles({
			obj: {
				...getGroupAttributes(props, 'typographyHover'),
			},
			isHover: true,
			parentBlockStyle: props.parentBlockStyle,
			textLevel: 'button',
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
			response[breakpoint]['max-width'] = `${
				obj[`icon-width-${breakpoint}${isHover ? '-hover' : ''}`]
			}${getLastBreakpointAttribute(
				'icon-width-unit',
				breakpoint,
				obj,
				isHover
			)}`;
			response[breakpoint]['max-height'] = `${
				obj[`icon-width-${breakpoint}${isHover ? '-hover' : ''}`]
			}${getLastBreakpointAttribute(
				'icon-width-unit',
				breakpoint,
				obj,
				isHover
			)}`;
		}

		if (isEmpty(response[breakpoint]) && breakpoint !== 'general')
			delete response[breakpoint];
	});

	return { IconSize: response };
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

	return { IconPath: response };
};

const getIconObject = (props, target) => {
	const response = {
		icon: getIconStyles(
			{
				...getGroupAttributes(props, ['icon', 'typography']),
			},
			props.parentBlockStyle,
			props['icon-inherit'],
			false
		),
		background: target === 'icon' && {
			...getColorBackgroundObject({
				...getGroupAttributes(props, [
					'iconBackgroundColor',
					'background',
					'backgroundColor',
				]),
				prefix: 'icon-',
				blockStyle: props.parentBlockStyle,
				isIconInherit: props['icon-inherit'],
			}),
		},
		gradient: target === 'icon' && {
			...getGradientBackgroundObject({
				...getGroupAttributes(props, 'iconGradient'),
				prefix: 'icon-',
			}),
		},
		padding:
			target === 'icon' &&
			getMarginPaddingStyles(
				{
					...getGroupAttributes(props, 'iconPadding'),
				},
				'icon-'
			),
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
	return response;
};

const getIconHoverObject = (props, target) => {
	const response = {
		icon:
			props['icon-status-hover'] &&
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
		background: props['icon-status-hover'] &&
			target === 'iconHover' && {
				...getColorBackgroundObject({
					...getGroupAttributes(
						props,
						[
							'iconBackgroundColorHover',
							'backgroundHover',
							'backgroundColorHover',
						],
						true
					),
					prefix: 'icon-',
					blockStyle: props.parentBlockStyle,
					isIconInherit: props['icon-inherit'],
					isHover: true,
				}),
			},
		gradient: props['icon-status-hover'] &&
			target === 'iconHover' && {
				...getGradientBackgroundObject({
					...getGroupAttributes(props, 'iconGradientHover', true),
					prefix: 'icon-',
					isHover: true,
				}),
			},
		border:
			props['icon-status-hover'] &&
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

const getIconResponsive = obj => {
	const response = {
		label: 'Icon responsive',
		general: {},
	};

	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {};

		if (
			!isNil(obj[`icon-spacing-${breakpoint}`]) &&
			!isNil(obj['icon-position'])
		) {
			obj['icon-position'] === 'left'
				? (response[breakpoint][
						'margin-right'
				  ] = `${getLastBreakpointAttribute(
						'icon-spacing',
						breakpoint,
						obj
				  )}px`)
				: (response[breakpoint][
						'margin-left'
				  ] = `${getLastBreakpointAttribute(
						'icon-spacing',
						breakpoint,
						obj
				  )}px`);
		}
	});

	return { IconResponsive: response };
};

const getStyles = props => {
	const { uniqueID } = props;

	const response = {
		[uniqueID]: stylesCleaner({
			'': getWrapperObject(props),
			':hover': getHoverWrapperObject(props),
			' .maxi-button-block__button': getNormalObject(props),
			' .maxi-button-block__icon': [
				getIconObject(props, 'icon'),
				getIconResponsive(props, 'icon'),
			],
			' .maxi-button-block__icon svg': getIconSize(props, false),
			' .maxi-button-block__icon svg > *': getIconObject(props, 'svg'),
			' .maxi-button-block__icon svg path': getIconPathStyles(
				props,
				false
			),
			' .maxi-button-block__content': getContentObject(props),
			' .maxi-button-block__button:hover': getHoverObject(props),
			' .maxi-button-block__button:hover .maxi-button-block__content':
				getHoverContentObject(props),
			' .maxi-button-block__button:hover .maxi-button-block__icon':
				props['icon-status-hover'] &&
				getIconHoverObject(props, 'iconHover'),
			' .maxi-button-block__button:hover .maxi-button-block__icon svg > *':
				props['icon-status-hover'] &&
				getIconHoverObject(props, 'iconHover'),
			' .maxi-button-block__button:hover .maxi-button-block__icon svg':
				props['icon-status-hover'] && getIconSize(props, true),
			' .maxi-button-block__button:hover .maxi-button-block__icon svg path':
				props['icon-status-hover'] && getIconPathStyles(props, true),
		}),
	};

	return response;
};

export default getStyles;
