/**
 * External dependencies
 */
import { isNil, isEmpty } from 'lodash';

/**
 * Internal dependencies
 */
import {
	getPaletteAttributes,
	getColorRGBAString,
	stylesCleaner,
	getLastBreakpointAttribute,
	getGroupAttributes,
} from '../../extensions/styles';
import {
	getBorderStyles,
	getBoxShadowStyles,
	getDisplayStyles,
	getDividerStyles,
	getFlexStyles,
	getMarginPaddingStyles,
	getOpacityStyles,
	getOverflowStyles,
	getPositionStyles,
	getSizeStyles,
	getSVGStyles,
	getTransformStyles,
	getZIndexStyles,
} from '../../extensions/styles/helpers';

const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const getPaneSpacing = props => {
	const response = { label: 'Pane spacing', general: {} };

	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {};
		if (!isNil(props[`pane-spacing-${breakpoint}`])) {
			response[breakpoint]['row-gap'] = `${
				props[`pane-spacing-${breakpoint}`]
			}${props[`pane-spacing-unit-${breakpoint}`] ?? 'px'}`;
		}
	});

	return response;
};

const getNormalObject = props => {
	const response = {
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
		boxShadow: getBoxShadowStyles({
			obj: {
				...getGroupAttributes(props, 'boxShadow'),
			},
			blockStyle: props.blockStyle,
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
		transform: getTransformStyles({
			...getGroupAttributes(props, 'transform'),
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
		flex: getFlexStyles({
			...getGroupAttributes(props, 'flex'),
		}),
		paneSpacing: getPaneSpacing(props),
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

const getIconSize = (obj, isHover = false) => {
	const response = {
		label: 'Icon size',
		general: {},
	};

	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {};

		const iconWidth = obj[`icon-width-${breakpoint}`];

		if (!isNil(iconWidth) && !isEmpty(iconWidth)) {
			const iconUnit =
				getLastBreakpointAttribute({
					target: 'icon-width-unit',
					breakpoint,
					attributes: obj,
					isHover,
				}) ?? 'px';
			response[breakpoint].width = `${iconWidth}${iconUnit}`;
			response[breakpoint].height = `${iconWidth}${iconUnit}`;
		}

		if (isEmpty(response[breakpoint]) && breakpoint !== 'general')
			delete response[breakpoint];
	});

	return { iconSize: response };
};

const getIconObject = props => {
	const response = {
		...getSVGStyles({
			obj: props,
			target: '.maxi-pane-block[aria-expanded=false] .maxi-pane-block__icon',
			prefix: 'icon-',
			blockStyle: props.blockStyle,
		}),
		...getSVGStyles({
			obj: props,
			target: '.maxi-pane-block[aria-expanded=true] .maxi-pane-block__icon',
			prefix: 'active-icon-',
			blockStyle: props.blockStyle,
		}),
		...(props['icon-status-hover'] &&
			getSVGStyles({
				obj: props,
				target: '.maxi-pane-block[aria-expanded=false]:hover .maxi-pane-block__icon',
				prefix: 'icon-',
				blockStyle: props.blockStyle,
				isHover: true,
			})),
		...(props['active-icon-status-hover'] &&
			getSVGStyles({
				obj: props,
				target: '.maxi-pane-block[aria-expanded=true]:hover .maxi-pane-block__icon',
				prefix: 'active-icon-',
				blockStyle: props.blockStyle,
				isHover: true,
			})),
		'.maxi-accordion-block .maxi-pane-block__icon svg': getIconSize(
			props,
			false
		),
	};
	return response;
};

const getColor = ({ props, prefix, isHover, breakpoint }) => {
	const { paletteStatus, paletteColor, paletteOpacity, color } =
		getPaletteAttributes({
			obj: props,
			...(prefix && { prefix }),
			...(isHover && { isHover }),
			...(breakpoint && { breakpoint }),
		});

	if (!paletteStatus && !isNil(color)) return color;
	if (paletteStatus && paletteColor)
		return getColorRGBAString({
			firstVar: `color-${paletteColor}`,
			opacity: paletteOpacity,
			blockStyle: props.blockStyle,
		});

	return null;
};

const getPaneContentStyles = props => {
	const { animationDuration } = props;

	const getPaneContentTransition = duration => {
		return `max-height ${duration}ms`;
	};

	const response = {
		paneTransition: {
			label: 'Pane transition',
			general: {
				transition: getPaneContentTransition(animationDuration),
			},
		},
	};

	return response;
};

const getPaneTitleStyles = (props, prefix, isHover = false) => {
	const response = {
		paneTitleColor: {
			label: 'Pane title color',
			general: {
				color: getColor({ props, prefix: `${prefix}title-`, isHover }),
			},
		},
	};

	return response;
};

const getPaneHeaderStyles = (props, prefix, isHover = false) => {
	const response = {
		paneHeader: {
			label: 'Pane header',
			general: {
				'background-color': getColor({
					props,
					prefix: `${prefix}title-background-`,
					isHover,
				}),
				'flex-direction':
					props['icon-position'] === 'right' ? 'row' : 'row-reverse',
			},
		},
	};

	return response;
};

const getPaneHeaderObject = props => {
	const response = {
		' .maxi-pane-block .maxi-pane-block__header': getPaneHeaderStyles(
			props,
			''
		),
		' .maxi-pane-block .maxi-pane-block__header::after': {
			headerLine: {
				...getDividerStyles(props, 'line', props.blockStyle, false),
			},
		},
		...(props['line-status-active'] && {
			' .maxi-pane-block[aria-expanded=true] .maxi-pane-block__header::after':
				{
					headerLine: {
						...getDividerStyles(
							props,
							'line',
							props.blockStyle,
							false,
							'active-'
						),
					},
				},
		}),
		...(props['line-status-hover'] && {
			' .maxi-pane-block[aria-expanded]:hover .maxi-pane-block__header::after':
				{
					headerLine: {
						...getDividerStyles(
							props,
							'line',
							props.blockStyle,
							true
						),
					},
				},
		}),
		' .maxi-pane-block[aria-expanded=true] .maxi-pane-block__header':
			getPaneHeaderStyles(props, 'active-'),
		' .maxi-pane-block[aria-expanded]:hover .maxi-pane-block__header':
			getPaneHeaderStyles(props, '', true),
		' .maxi-pane-block .maxi-pane-block__title': getPaneTitleStyles(
			props,
			''
		),
		' .maxi-pane-block[aria-expanded=true] .maxi-pane-block__title':
			getPaneTitleStyles(props, 'active-'),
		' .maxi-pane-block[aria-expanded]:hover .maxi-pane-block__title':
			getPaneTitleStyles(props, '', true),
	};

	return response;
};

const getPaneContentObject = props => {
	const { accordionLayout } = props;

	const response = {
		' .maxi-pane-block .maxi-pane-block__content':
			getPaneContentStyles(props),
		...(accordionLayout === 'simple' && {
			' .maxi-pane-block .maxi-pane-block__content::after': {
				paneLine: {
					...getDividerStyles(props, 'line', props.blockStyle, false),
				},
			},
			...(props['line-status-active'] && {
				' .maxi-pane-block[aria-expanded=true] .maxi-pane-block__content::after':
					{
						paneLine: {
							...getDividerStyles(
								props,
								'line',
								props.blockStyle,
								false,
								'active-'
							),
						},
					},
			}),
			...(props['line-status-hover'] && {
				' .maxi-pane-block[aria-expanded]:hover .maxi-pane-block__content::after':
					{
						paneLine: {
							...getDividerStyles(
								props,
								'line',
								props.blockStyle,
								true
							),
						},
					},
			}),
		}),
	};

	return response;
};

const getStyles = props => {
	const { uniqueID } = props;
	const response = {
		[uniqueID]: stylesCleaner({
			'': getNormalObject(props),
			':hover': getHoverObject(props),
			...getPaneHeaderObject(props),
			...getIconObject(props),
			...getPaneContentObject(props),
		}),
	};
	return response;
};

export default getStyles;
