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
} from '../../extensions/styles';
import {
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
import { selectorsAccordion } from './custom-css';

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
	};

	return response;
};

const getIconObject = props => {
	const response = {
		...getButtonIconStyles({
			obj: props,
			blockStyle: props.blockStyle,
			target: ' .maxi-pane-block__icon',
			wrapperTarget:
				' .maxi-pane-block[aria-expanded=false] .maxi-pane-block__header',
		}),
		...(props['icon-status-hover'] &&
			getButtonIconStyles({
				obj: props,
				blockStyle: props.blockStyle,
				target: ' .maxi-pane-block__icon',
				wrapperTarget:
					' .maxi-pane-block[aria-expanded] .maxi-pane-block__header',
				isHover: true,
			})),
		...getButtonIconStyles({
			obj: props,
			blockStyle: props.blockStyle,
			target: ' .maxi-pane-block__icon',
			wrapperTarget:
				' .maxi-pane-block[aria-expanded=true] .maxi-pane-block__header',
			prefix: 'active-',
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
			blockStyle: props.blockStyle,
		});

	return null;
};

const getPaneContentStyles = props => {
	const { animationDuration } = props;

	const getPaneContentTransition = duration => {
		return `max-height ${duration}s`;
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
	const response = {
		paneHeader: {
			label: 'Pane header',
			general: {
				'background-color': getColor({
					props,
					prefix: `${prefix}title-background-`,
					isHover,
				}),
			},
		},
	};

	return response;
};

const getPaneHeaderObject = props => {
	const response = {
		' .maxi-pane-block .maxi-pane-block__header': {
			paneHeader: {
				label: 'Pane header',
				general: {
					...getPaneHeaderStyles(props, '').paneHeader.general,
					'flex-direction':
						props['icon-position'] === 'right'
							? 'row'
							: 'row-reverse',
				},
			},
		},
		' .maxi-pane-block .maxi-pane-block__header::after': {
			headerLine: {
				...getDividerStyles(
					props,
					'line',
					props.blockStyle,
					false,
					'',
					true
				),
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
							'active-',
							true
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
							true,
							'',
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
			'title-'
		),
		...(props['title-typography-status-active'] && {
			' .maxi-pane-block[aria-expanded=true] .maxi-pane-block__title':
				getPaneTitleStyles(props, 'active-title-'),
		}),
		...(props['title-typography-status-hover'] && {
			' .maxi-pane-block[aria-expanded]:hover .maxi-pane-block__title':
				getPaneTitleStyles(props, 'title-', true),
		}),
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
					...getDividerStyles(
						props,
						'line',
						props.blockStyle,
						false,
						'',
						true
					),
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
								'active-',
								true
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
								true,
								'',
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
				...getPaneHeaderObject(props),
				...getIconObject(props),
				...getPaneContentObject(props),
			},
			selectorsAccordion,
			props
		),
	};
	return response;
};

export default getStyles;
