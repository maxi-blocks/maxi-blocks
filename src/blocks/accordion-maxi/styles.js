/**
 * External dependencies
 */
import { isNil } from 'lodash';

/**
 * Internal dependencies
 */
import {
	getAttributesValue,
	getGroupAttributes,
	getPaletteAttributes,
} from '../../extensions/attributes';
import { getColorRGBAString, styleProcessor } from '../../extensions/styles';
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
} from '../../extensions/styles/helpers';
import data from './data';

const breakpoints = ['g', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

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
			blockStyle: props._bs,
		}),
		size: getSizeStyles({
			...getGroupAttributes(props, 'size'),
		}),
		boxShadow: getBoxShadowStyles({
			obj: {
				...getGroupAttributes(props, 'boxShadow'),
			},
			blockStyle: props._bs,
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
	const [borderStatusHover, boxShadowStatusHover, opacityStatusHover] =
		getAttributesValue({
			target: ['bo.s', 'bs.s', '_o.s'],
			props,
			isHover: true,
		});

	const response = {
		border:
			borderStatusHover &&
			getBorderStyles({
				obj: {
					...getGroupAttributes(
						props,
						['border', 'borderWidth', 'borderRadius'],
						true
					),
				},
				isHover: true,
				blockStyle: props._bs,
			}),
		boxShadow:
			boxShadowStatusHover &&
			getBoxShadowStyles({
				obj: {
					...getGroupAttributes(props, 'boxShadow', true),
				},
				isHover: true,
				blockStyle: props._bs,
			}),
		opacity:
			opacityStatusHover &&
			getOpacityStyles(
				{ ...getGroupAttributes(props, 'opacity', true) },
				true
			),
	};

	return response;
};

const getIconObject = (props, uniqueID) => {
	const iconStatusHover = getAttributesValue({
		target: 'i.sh',
		props,
	});

	const response = {
		...getButtonIconStyles({
			obj: props,
			blockStyle: props._bs,
			target: ' .maxi-pane-block__icon',
			wrapperTarget: `.maxi-pane-block[data-accordion="${uniqueID}"][aria-expanded=false] .maxi-pane-block__header`,
		}),
		...(iconStatusHover &&
			getButtonIconStyles({
				obj: props,
				blockStyle: props._bs,
				target: ' .maxi-pane-block__icon',
				wrapperTarget: `.maxi-pane-block[data-accordion="${uniqueID}"][aria-expanded] .maxi-pane-block__header`,
				isHover: true,
			})),
		...getButtonIconStyles({
			obj: props,
			blockStyle: props._bs,
			target: ' .maxi-pane-block__icon',
			wrapperTarget: `.maxi-pane-block[data-accordion="${uniqueID}"][aria-expanded=true] .maxi-pane-block__header`,
			prefix: 'a-',
		}),
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
			blockStyle: props._bs,
		});

	return null;
};

const getPaneContentWrapperStyles = props => {
	const animationDuration = getAttributesValue({
		target: '_ad',
		props,
	});

	const getPaneContentTransition = duration => {
		return `max-height ${duration}s, padding-top ${duration}s, padding-bottom ${duration}s`;
	};

	const response = {
		paneTransition: {
			label: 'Pane transition',
			g: {
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
			blockStyle: props._bs,
			textLevel: props._tl,
		}),
	};

	return response;
};

const getPaneHeaderStyles = (props, prefix, isHover = false) => {
	const response = {};

	breakpoints.forEach(breakpoint => {
		const bgStatus = getAttributesValue({
			target: 'ti-b.s',
			props,
			isHover,
			prefix,
		});
		if (bgStatus)
			response[breakpoint] = {
				'background-color': getColor({
					props,
					prefix: `${prefix}ti-b-`,
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
				g: {
					'flex-direction':
						getAttributesValue({
							target: 'i_pos',
							props,
						}) === 'right'
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
					props._bs,
					false,
					'he-'
				),
			},
		},
		' .maxi-pane-block__header-line': {
			headerLine: {
				...getDividerStyles(
					props,
					'line',
					props._bs,
					false,
					'he-',
					true
				),
			},
		},
		...(getAttributesValue({
			target: 'li.sa',
			prefix: 'he-',
			props,
		}) && {
			'[aria-expanded=true] .maxi-pane-block__header-line': {
				headerLine: {
					...getDividerStyles(
						props,
						'line',
						props._bs,
						false,
						'he-a-',
						true
					),
				},
			},
		}),
		...(getAttributesValue({
			target: 'li.s',
			prefix: 'he-',
			isHover: true,
			props,
		}) && {
			'[aria-expanded] .maxi-pane-block__header:hover .maxi-pane-block__header-line':
				{
					headerLine: {
						...getDividerStyles(
							props,
							'line',
							props._bs,
							true,
							'he-',
							true
						),
					},
				},
		}),
		'[aria-expanded=true] .maxi-pane-block__header-content': {
			paneHeaderActive: getPaneHeaderStyles(props, 'a-'),
		},
		'[aria-expanded] .maxi-pane-block__header:hover .maxi-pane-block__header-content':
			{
				paneHeaderHover: getPaneHeaderStyles(props, '', true),
			},
		' .maxi-pane-block__title': getPaneTitleStyles(props, 'ti-'),
		...(getAttributesValue({
			target: 'ti-t.sa',
			props,
		}) && {
			'[aria-expanded=true] .maxi-pane-block__title': getPaneTitleStyles(
				props,
				'a-ti-'
			),
		}),
		...(getAttributesValue({
			target: 'ti-t.sh',
			props,
		}) && {
			'[aria-expanded] .maxi-pane-block__header:hover .maxi-pane-block__title':
				getPaneTitleStyles(props, 'ti-', true),
		}),
	};

	return response;
};

const getPaneContentObject = props => {
	const accordionLayout = getAttributesValue({
		target: '_acl',
		props,
	});

	const response = {
		' .maxi-pane-block__content-wrapper':
			getPaneContentWrapperStyles(props),
		...(accordionLayout === 'simple' && {
			' .maxi-pane-block__content-line-container': {
				paneLine: {
					...getDividerStyles(
						props,
						'container',
						props._bs,
						false,
						'c-'
					),
				},
			},
			' .maxi-pane-block__content-line': {
				paneLine: {
					...getDividerStyles(
						props,
						'line',
						props._bs,
						false,
						'c-',
						true
					),
				},
			},
			...(getAttributesValue({
				target: 'li.sa',
				prefix: 'c-',
				props,
			}) && {
				'[aria-expanded=true] .maxi-pane-block__content-line': {
					paneLine: {
						...getDividerStyles(
							props,
							'line',
							props._bs,
							false,
							'c-a-',
							true
						),
					},
				},
			}),
			...(getAttributesValue({
				target: 'li.s',
				prefix: 'c-',
				isHover: true,
				props,
			}) && {
				'[aria-expanded] .maxi-pane-block__header:hover .maxi-pane-block__content-line':
					{
						paneLine: {
							...getDividerStyles(
								props,
								'line',
								props._bs,
								true,
								'c-',
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
	const { _uid: uniqueID } = props;

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
					blockStyle: props._bs,
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
					blockStyle: props._bs,
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
