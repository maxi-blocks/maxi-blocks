/**
 * Internal dependencies
 */
import {
	getAttributesValue,
	getGroupAttributes,
} from '../../extensions/attributes';
import { styleProcessor } from '../../extensions/styles';
import {
	getAlignmentFlexStyles,
	getBackgroundStyles,
	getBlockBackgroundStyles,
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
	getZIndexStyles,
} from '../../extensions/styles/helpers';
import data from './data';

const getWrapperObject = props => {
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
		boxShadow: getBoxShadowStyles({
			obj: {
				...getGroupAttributes(props, 'boxShadow'),
			},
			blockStyle: props._bs,
		}),
		opacity: getOpacityStyles({
			...getGroupAttributes(props, 'opacity'),
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
		zIndex: getZIndexStyles({
			...getGroupAttributes(props, 'zIndex'),
		}),
		alignment: getAlignmentFlexStyles({
			...getGroupAttributes(props, 'alignment'),
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

const getWrapperObjectHover = props => {
	const [borderStatusHover, boxShadowStatusHover, opacityStatusHover] =
		getAttributesValue({
			target: ['bo.sh', 'bs.sh', '_o.sh'],
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

const getNormalObject = (props, iconWidthHeightRatio) => {
	const response = {
		boxShadow: getBoxShadowStyles({
			obj: {
				...getGroupAttributes(props, 'boxShadow', false, 's-'),
			},
			blockStyle: props._bs,
			prefix: 's-',
		}),
		padding: getMarginPaddingStyles({
			obj: {
				...getGroupAttributes(props, 'margin', false, 's-'),
			},
			prefix: 's-',
		}),
		margin: getMarginPaddingStyles({
			obj: {
				...getGroupAttributes(props, 'padding', false, 's-'),
			},
			prefix: 's-',
		}),
		border: getBorderStyles({
			obj: {
				...getGroupAttributes(
					props,
					['border', 'borderWidth', 'borderRadius'],
					false,
					's-'
				),
			},
			blockStyle: props._bs,
			prefix: 's-',
		}),
		...getSVGWidthStyles({
			obj: getGroupAttributes(props, 'svg'),
			prefix: 's-',
			iconWidthHeightRatio,
		}),
		...getBackgroundStyles({
			...getGroupAttributes(
				props,
				['background', 'backgroundColor', 'backgroundGradient'],
				false,
				's-'
			),
			blockStyle: props._bs,
			prefix: 's-',
		}),
	};

	return response;
};

const getHoverObject = props => {
	const [borderStatusHover, boxShadowStatusHover] = getAttributesValue({
		target: ['bo.sh', 'bs.sh'],
		props,
		isHover: true,
		prefix: 's-',
	});

	const response = {
		border:
			borderStatusHover &&
			getBorderStyles({
				obj: {
					...getGroupAttributes(
						props,
						['border', 'borderWidth', 'borderRadius'],
						true,
						's-'
					),
				},
				isHover: true,
				blockStyle: props._bs,
				prefix: 's-',
			}),
		boxShadow:
			boxShadowStatusHover &&
			getBoxShadowStyles({
				obj: {
					...getGroupAttributes(props, 'boxShadow', true, 's-'),
				},
				isHover: true,
				blockStyle: props._bs,
				prefix: 's-',
			}),
		...getBackgroundStyles({
			...getGroupAttributes(
				props,
				['background', 'backgroundColor', 'backgroundGradient'],
				true,
				's-'
			),
			blockStyle: props._bs,
			isHover: true,
			prefix: 's-',
		}),
	};

	return response;
};

const getStyles = (props, iconWidthHeightRatio) => {
	const { _uid: uniqueID, _bs: blockStyle } = props;

	const response = {
		[uniqueID]: styleProcessor(
			{
				'': getWrapperObject(props),
				':hover': getWrapperObjectHover(props),
				' .maxi-svg-icon-block__icon': getNormalObject(
					props,
					iconWidthHeightRatio
				),
				' .maxi-svg-icon-block__icon:hover': getHoverObject(props),
				...getSVGStyles({
					obj: {
						...getGroupAttributes(props, 'svg'),
					},
					target: ' .maxi-svg-icon-block__icon',
					blockStyle,
				}),

				...(getAttributesValue({
					target: 's.sh',
					props,
				}) && {
					...getSVGStyles({
						obj: {
							...getGroupAttributes(props, 'svg', true),
						},
						target: '.maxi-svg-icon-block__icon:hover',
						blockStyle,
						isHover: true,
					}),
				}),
				...getBlockBackgroundStyles({
					...getGroupAttributes(props, [
						'blockBackground',
						'border',
						'borderWidth',
						'borderRadius',
					]),
					blockStyle,
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
