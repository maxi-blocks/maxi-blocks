/**
 * External dependencies
 */
import { isNil } from 'lodash';

/**
 * Internal dependencies
 */
import {
	getPaletteAttributes,
	getColorRGBAString,
	styleProcessor,
	getGroupAttributes,
	getAttributeValue,
} from '@extensions/styles';
import {
	getBlockBackgroundStyles,
	getBorderStyles,
	getBoxShadowStyles,
	getButtonIconStyles,
	getDisplayStyles,
	getDividerStyles,
	getFlexStyles,
	getMarginPaddingStyles,
	getOpacityStyles,
	getOverflowStyles,
	getPositionStyles,
	getSizeStyles,
	getTypographyStyles,
	getZIndexStyles,
} from '@extensions/styles/helpers';
import data from './data';

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
		opacity:
			props['opacity-status-hover'] &&
			getOpacityStyles(
				{ ...getGroupAttributes(props, 'opacity', true) },
				true
			),
	};

	return response;
};

const getIconObject = (props, uniqueID) => {
	const getIconStyles = (isHover = false, isActive = false) =>
		getButtonIconStyles({
			obj: props,
			blockStyle: props.blockStyle,
			target: ' .maxi-pane-block__icon',
			wrapperTarget: `.maxi-pane-block[data-accordion="${uniqueID}"][aria-expanded=${isActive}] .maxi-pane-block__header`,
			prefix: isActive ? 'active-' : '',
			isHover,
			hoverOnIcon: true,
		});

	const response = {
		...getIconStyles(),
		...(props['icon-status-hover'] && getIconStyles(true)),
		...getIconStyles(false, true),
		...(props['active-icon-status-hover'] && getIconStyles(true, true)),
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

const getPaneContentWrapperStyles = props => {
	const { animationDuration } = props;

	const getPaneContentTransition = duration => {
		return `max-height ${duration}s, padding-top ${duration}s, padding-bottom ${duration}s`;
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
		typography: getTypographyStyles({
			obj: {
				...getGroupAttributes(props, 'accordionTitle'),
			},
			...(isHover && {
				normalTypography: {
					...getGroupAttributes(props, 'typography', false, prefix),
				},
			}),
			isHover,
			prefix,
			blockStyle: props.blockStyle,
			textLevel: props.titleLevel,
		}),
	};

	return response;
};

const getPaneHeaderStyles = (props, prefix, isHover = false) => {
	const response = {};

	breakpoints.forEach(breakpoint => {
		const bgStatus = getAttributeValue({
			target: 'title-background-status',
			props,
			isHover,
			prefix,
		});
		if (bgStatus)
			response[breakpoint] = {
				'background-color': getColor({
					props,
					prefix: `${prefix}title-background-`,
					isHover,
					breakpoint,
				}),
			};
	});

	return response;
};

const getPaneHeaderObject = props => {
	const response = {
		' .maxi-pane-block__header-content': {
			paneHeader: getPaneHeaderStyles(props, ''),
			paneHeaderIconPosition: {
				general: {
					'flex-direction':
						props['icon-position'] === 'right'
							? 'row'
							: 'row-reverse',
				},
			},
		},
		' .maxi-pane-block__header-line-container': {
			headerLine: {
				...getDividerStyles(
					props,
					'container',
					props.blockStyle,
					false,
					'header-'
				),
			},
		},
		' .maxi-pane-block__header-line': {
			headerLine: {
				...getDividerStyles(
					props,
					'line',
					props.blockStyle,
					false,
					'header-',
					true
				),
			},
		},
		...(props['header-line-status-active'] && {
			'[aria-expanded=true] .maxi-pane-block__header-line': {
				headerLine: {
					...getDividerStyles(
						props,
						'line',
						props.blockStyle,
						false,
						'header-active-',
						true
					),
				},
			},
		}),
		...(props['header-line-status-hover'] && {
			'[aria-expanded] .maxi-pane-block__header:hover .maxi-pane-block__header-line':
				{
					headerLine: {
						...getDividerStyles(
							props,
							'line',
							props.blockStyle,
							true,
							'header-',
							true
						),
					},
				},
		}),
		'[aria-expanded=true] .maxi-pane-block__header-content': {
			paneHeaderActive: getPaneHeaderStyles(props, 'active-'),
		},
		'[aria-expanded] .maxi-pane-block__header:hover .maxi-pane-block__header-content':
			{
				paneHeaderHover: getPaneHeaderStyles(props, '', true),
			},
		' .maxi-pane-block__title': getPaneTitleStyles(props, 'title-'),
		...(props['title-typography-status-active'] && {
			'[aria-expanded=true] .maxi-pane-block__title': getPaneTitleStyles(
				props,
				'active-title-'
			),
		}),
		...(props['title-typography-status-hover'] && {
			'[aria-expanded] .maxi-pane-block__header:hover .maxi-pane-block__title':
				getPaneTitleStyles(props, 'title-', true),
		}),
	};

	return response;
};

const getPaneContentObject = props => {
	const { accordionLayout } = props;

	const response = {
		' .maxi-pane-block__content-wrapper':
			getPaneContentWrapperStyles(props),
		...(accordionLayout === 'simple' && {
			' .maxi-pane-block__content-line-container': {
				paneLine: {
					...getDividerStyles(
						props,
						'container',
						props.blockStyle,
						false,
						'content-'
					),
				},
			},
			' .maxi-pane-block__content-line': {
				paneLine: {
					...getDividerStyles(
						props,
						'line',
						props.blockStyle,
						false,
						'content-',
						true
					),
				},
			},
			...(props['content-line-status-active'] && {
				'[aria-expanded=true] .maxi-pane-block__content-line': {
					paneLine: {
						...getDividerStyles(
							props,
							'line',
							props.blockStyle,
							false,
							'content-active-',
							true
						),
					},
				},
			}),
			...(props['content-line-status-hover'] && {
				'[aria-expanded] .maxi-pane-block__header:hover .maxi-pane-block__content-line':
					{
						paneLine: {
							...getDividerStyles(
								props,
								'line',
								props.blockStyle,
								true,
								'content-',
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
				...getIconObject(props, uniqueID),
			},
			data,
			props
		),
		[`${uniqueID} .maxi-pane-block[data-accordion="${uniqueID}"]`]:
			styleProcessor(
				{
					...getPaneHeaderObject(props),
					...getPaneContentObject(props),
				},
				data,
				props
			),
	};
	return response;
};

export default getStyles;
