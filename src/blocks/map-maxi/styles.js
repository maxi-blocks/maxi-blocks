/**
 * Internal dependencies
 */
import {
	getAttributesValue,
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '../../extensions/attributes';
import { styleProcessor } from '../../extensions/styles';
import {
	getBackgroundStyles,
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
	getSVGWidthStyles,
	getTypographyStyles,
	getZIndexStyles,
} from '../../extensions/styles/helpers';
import data from './data';

const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const getNormalObject = props => {
	const { _bs: blockStyle } = props;

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
		boxShadow: getBoxShadowStyles({
			obj: {
				...getGroupAttributes(props, 'boxShadow'),
			},
			blockStyle,
		}),
		size: getSizeStyles({
			...getGroupAttributes(props, 'size'),
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

const getHoverNormalObject = props => {
	const [
		blockStyle,
		borderStatusHover,
		boxShadowStatusHover,
		opacityStatusHover,
	] = getAttributesValue({
		target: ['_bs', 'bo.sh', 'bs.sh', '_o.sh'],
		props,
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
				blockStyle,
			}),
		boxShadow:
			boxShadowStatusHover &&
			getBoxShadowStyles({
				obj: {
					...getGroupAttributes(props, 'boxShadow', true),
				},
				isHover: true,
				blockStyle,
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

const getPopupTypographyStyles = (props, isTitle = false) => {
	const { _bs: blockStyle } = props;

	const prefix = isTitle ? '' : 'd-';

	const response = {
		[isTitle ? 'typography' : 'typographyDescription']: getTypographyStyles(
			{
				obj: {
					...getGroupAttributes(props, 'typography', false, prefix),
				},
				blockStyle,
				prefix,
				textLevel: isTitle
					? getAttributesValue({
							target: 'm_mhl',
							props,
					  })
					: 'p',
			}
		),
	};

	return response;
};

const getAdjustedPositionPopupStyles = props => {
	const response = {};

	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {
			'margin-left': `${
				+getLastBreakpointAttribute({
					target: 's_w',
					breakpoint,
					attributes: props,
				}) * 0.85
			}px`,
		};
	});

	return {
		popupPosition: response,
	};
};

const getStyles = props => {
	const { _uid: uniqueID, _bs: blockStyle } = props;

	const response = {
		[uniqueID]: styleProcessor(
			{
				'': getNormalObject(props),
				':hover': getHoverNormalObject(props),
				' .maxi-map-block__popup__content__title':
					getPopupTypographyStyles(props, true),
				' .maxi-map-block__popup__content__description':
					getPopupTypographyStyles(props),
				' .maxi-map-block__popup': {
					boxShadow: getBoxShadowStyles({
						obj: {
							...getGroupAttributes(
								props,
								'boxShadow',
								false,
								'p-'
							),
						},
						blockStyle,
						prefix: 'p-',
					}),
					...getBackgroundStyles({
						...getGroupAttributes(
							props,
							['background', 'backgroundColor'],
							false,
							'p-'
						),
						blockStyle,
						prefix: 'p-',
					}),
				},
				' .maxi-map-block__popup:before': {
					...getBackgroundStyles({
						...getGroupAttributes(
							props,
							['background', 'backgroundColor'],
							false,
							'p-'
						),
						blockStyle,
						prefix: 'p-',
						backgroundColorProperty: 'border-top-color',
					}),
				},
				' .leaflet-marker-icon': getSVGWidthStyles({
					obj: getGroupAttributes(props, 'svg'),
					prefix: 's-',
				}),
				' .leaflet-popup-content-wrapper':
					getAdjustedPositionPopupStyles(props),
				...getSVGStyles({
					obj: {
						...getGroupAttributes(props, 'svg'),
					},
					target: ' .leaflet-marker-icon',
					blockStyle,
				}),
			},
			data,
			props
		),
	};

	return response;
};

export default getStyles;
