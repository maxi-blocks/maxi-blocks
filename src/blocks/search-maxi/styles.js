/**
 * Internal dependencies
 */
import {
	getGroupAttributes,
	getLastBreakpointAttribute,
	getColorRGBAString,
	styleProcessor,
} from '@extensions/styles';
import {
	getBackgroundStyles,
	getBorderStyles,
	getBoxShadowStyles,
	getButtonIconStyles,
	getDisplayStyles,
	getFlexStyles,
	getMarginPaddingStyles,
	getOpacityStyles,
	getOverflowStyles,
	getPositionStyles,
	getSizeStyles,
	getTypographyStyles,
	getZIndexStyles,
} from '@extensions/styles/helpers';
import data, { prefixes } from './data';

const { buttonPrefix, closeIconPrefix, inputPrefix } = prefixes;

const getNormalObject = props => {
	const { blockStyle } = props;

	const response = {
		border: getBorderStyles({
			obj: {
				...getGroupAttributes(props, [
					'border',
					'borderWidth',
					'borderRadius',
				]),
			},
			blockStyle,
		}),
		margin: getMarginPaddingStyles({
			obj: { ...getGroupAttributes(props, 'margin') },
		}),
		padding: getMarginPaddingStyles({
			obj: { ...getGroupAttributes(props, 'padding') },
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

const getSearchButtonStyles = (props, isHover = false) => {
	const { blockStyle } = props;

	const response = {
		...getBackgroundStyles({
			...getGroupAttributes(
				props,
				['background', 'backgroundColor'],
				isHover,
				buttonPrefix
			),
			isHover,
			blockStyle,
			prefix: buttonPrefix,
		}),
		border: getBorderStyles({
			obj: {
				...getGroupAttributes(
					props,
					['border', 'borderWidth', 'borderRadius'],
					isHover,
					buttonPrefix
				),
			},
			isHover,
			prefix: buttonPrefix,
			blockStyle,
		}),
		...(!isHover && {
			margin: getMarginPaddingStyles({
				obj: {
					...getGroupAttributes(props, 'margin', false, buttonPrefix),
				},
				prefix: buttonPrefix,
			}),
			padding: getMarginPaddingStyles({
				obj: {
					...getGroupAttributes(
						props,
						'padding',
						false,
						buttonPrefix
					),
				},
				prefix: buttonPrefix,
			}),
		}),
	};

	return response;
};

const getSearchButtonIconStyles = props => {
	const { blockStyle, buttonSkin, skin } = props;

	const searchButtonIsIcon = buttonSkin === 'icon';

	const defaultIconHelperProps = {
		obj: props,
		blockStyle,
		target: ' .maxi-search-block__button__default-icon',
		wrapperTarget: ' .maxi-search-block__button',
	};

	const closeIconHelperProps = {
		obj: props,
		blockStyle,
		target: ' .maxi-search-block__button__close-icon',
		wrapperTarget: ' .maxi-search-block__button',
		prefix: closeIconPrefix,
	};

	const response = {
		...(searchButtonIsIcon && {
			...getButtonIconStyles({
				...defaultIconHelperProps,
			}),
			...getButtonIconStyles({
				isHover: true,
				...defaultIconHelperProps,
			}),
			...(skin === 'icon-reveal' && {
				...getButtonIconStyles({
					...closeIconHelperProps,
				}),
				...getButtonIconStyles({
					isHover: true,
					...closeIconHelperProps,
				}),
			}),
		}),
	};

	return response;
};

const getSearchButtonContentStyles = (props, isHover = false) => {
	const { blockStyle } = props;

	const response = {
		typography: getTypographyStyles({
			obj: {
				...getGroupAttributes(
					props,
					'typography',
					isHover,
					buttonPrefix
				),
			},
			isHover,
			blockStyle,
			prefix: buttonPrefix,
		}),
	};

	return response;
};

const getSearchInputStyles = (props, isHover = false) => {
	const { blockStyle } = props;

	const response = {
		...getBackgroundStyles({
			...getGroupAttributes(
				props,
				['background', 'backgroundColor'],
				isHover,
				inputPrefix
			),
			isHover,
			prefix: inputPrefix,
			blockStyle,
		}),
		border: getBorderStyles({
			obj: {
				...getGroupAttributes(
					props,
					['border', 'borderWidth', 'borderRadius'],
					isHover,
					inputPrefix
				),
			},
			isHover,
			prefix: inputPrefix,
			blockStyle,
		}),
		...(!isHover && {
			padding: getMarginPaddingStyles({
				obj: {
					...getGroupAttributes(props, 'padding', false, inputPrefix),
				},
				prefix: inputPrefix,
			}),
		}),
		typography: getTypographyStyles({
			obj: {
				...getGroupAttributes(
					props,
					'typography',
					isHover,
					inputPrefix
				),
			},
			blockStyle,
			isHover,
			prefix: inputPrefix,
		}),
	};

	return response;
};

const getSearchInputPlaceholderStyles = props => {
	const { blockStyle } = props;

	const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

	const response = {};

	breakpoints.forEach(breakpoint => {
		const paletteStatus = getLastBreakpointAttribute({
			target: 'placeholder-palette-status',
			attributes: props,
			breakpoint,
		});

		const paletteColor = getLastBreakpointAttribute({
			target: 'placeholder-palette-color',
			attributes: props,
			breakpoint,
		});

		const paletteOpacity = getLastBreakpointAttribute({
			target: 'placeholder-palette-opacity',
			attributes: props,
			breakpoint,
		});

		const color = getLastBreakpointAttribute({
			target: 'placeholder-color',
			attributes: props,
			breakpoint,
		});

		if (paletteStatus) {
			response[breakpoint] = {
				color: getColorRGBAString({
					firstVar: `color-${paletteColor}`,
					opacity: paletteOpacity,
					blockStyle,
				}),
			};
		} else if (color) {
			response[breakpoint] = {
				color,
			};
		}
	});

	return {
		placeholder: response,
	};
};

const getStyles = props => {
	const { uniqueID } = props;

	const response = {
		[uniqueID]: styleProcessor(
			{
				'': getNormalObject(props),
				' .maxi-search-block__input': getSearchInputStyles(props),
				' .maxi-search-block__input::placeholder':
					getSearchInputPlaceholderStyles(props),
				' .maxi-search-block__button': getSearchButtonStyles(props),
				...getSearchButtonIconStyles(props),
				' .maxi-search-block__button__content':
					getSearchButtonContentStyles(props),
				// Hover styles
				':hover': getHoverObject(props),
				' .maxi-search-block__input:hover': getSearchInputStyles(
					props,
					true
				),
				' .maxi-search-block__button:hover': getSearchButtonStyles(
					props,
					true
				),
				' .maxi-search-block__button:hover .maxi-search-block__button__content':
					getSearchButtonContentStyles(props, true),
			},
			data,
			props
		),
	};

	return response;
};

export default getStyles;
