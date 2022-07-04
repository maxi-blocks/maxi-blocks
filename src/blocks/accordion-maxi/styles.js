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
		...getSVGStyles({
			obj: props,
			target: '.maxi-pane-block[aria-expanded=false]:hover .maxi-pane-block__icon',
			prefix: 'icon-',
			blockStyle: props.blockStyle,
			isHover: true,
		}),
		...getSVGStyles({
			obj: props,
			target: '.maxi-pane-block[aria-expanded=true]:hover .maxi-pane-block__icon',
			prefix: 'active-icon-',
			blockStyle: props.blockStyle,
			isHover: true,
		}),
		'.maxi-accordion-block .maxi-pane-block__icon svg': getIconSize(
			props,
			false
		),
	};
	return response;
};

const getPaneSpacing = props => {
	const response = { label: 'Pane spacing', general: {} };
	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {};
		if (!isNil(props[`pane-spacing-${breakpoint}`])) {
			response[breakpoint]['row-gap'] = `${
				props[`pane-spacing-${breakpoint}`]
			}px`;
		}
	});
	return response;
};

const getColor = (props, prefix) => {
	const { paletteStatus, paletteColor, paletteOpacity, color } =
		getPaletteAttributes({
			obj: props,
			prefix,
		});
	if (!paletteStatus && !isNil(color)) return color;
	if (paletteStatus && paletteColor)
		return getColorRGBAString({
			firstVar: `color-${paletteColor}`,
			opacity: paletteOpacity,
			blockStyle: props.blockStyle,
		});
};

const getPaneTitleStyles = (props, target) => {
	const response = {
		[`${target} .maxi-pane-block__title`]: {
			paneTitleColor: {
				label: 'Pane title color',
				general: {
					color: getColor(props, 'title-'),
				},
			},
		},
		[`${target} .maxi-pane-block__header`]: {
			paneTitleBgColor: {
				label: 'Pane title background color',
				general: {
					'background-color': getColor(props, 'title-background-'),
					'flex-direction':
						props['icon-position'] === 'right'
							? 'row'
							: 'row-reverse',
				},
			},
		},
	};

	return response;
};

const getBackgroundObject = props => {
	const response = {};

	['active-background-', 'background-'].forEach(prefix => {
		[false, true].forEach(isHover => {
			const resp = {};
			breakpoints.forEach(breakpoint => {
				resp[breakpoint] = {};
				const { paletteStatus, paletteColor, paletteOpacity, color } =
					getPaletteAttributes({
						obj: props,
						prefix,
						breakpoint,
						isHover,
					});
				if (!paletteStatus && !isNil(color))
					resp[breakpoint]['background-color'] = color;
				if (paletteStatus && paletteColor)
					resp[breakpoint]['background-color'] = getColorRGBAString({
						firstVar: `color-${paletteColor}`,
						opacity: paletteOpacity,
						blockStyle: props.blockStyle,
					});
			});

			response[
				` .maxi-pane-block[aria-expanded=${
					prefix === 'background-' ? 'false' : 'true'
				}] .maxi-pane-block__content${isHover ? ':hover' : ''}`
			] = { paneBackground: resp };
		});
	});

	return response;
};

const getPaneStyles = props => {
	const response = {
		paneSpacing: getPaneSpacing(props),
	};
	return response;
};

const getStyles = props => {
	const { uniqueID } = props;
	const response = {
		[uniqueID]: stylesCleaner({
			'': getNormalObject(props),
			':hover': getHoverObject(props),
			'.maxi-accordion-block .maxi-accordion-block__content':
				getPaneStyles(props),
			...getPaneTitleStyles(props, ' .maxi-pane-block'),
			...getIconObject(props),
			...getBackgroundObject(props),
		}),
	};
	return response;
};

export default getStyles;
