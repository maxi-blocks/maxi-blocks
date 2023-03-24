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
			blockStyle: props.blockStyle,
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
	const {
		'border-status': borderStatusHover,
		'box-shadow-status': boxShadowStatusHover,
		'opacity-status': opacityStatusHover,
	} = getAttributesValue({
		target: ['border-status', 'box-shadow-status', 'opacity-status'],
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
				blockStyle: props.blockStyle,
			}),
		boxShadow:
			boxShadowStatusHover &&
			getBoxShadowStyles({
				obj: {
					...getGroupAttributes(props, 'boxShadow', true),
				},
				isHover: true,
				blockStyle: props.blockStyle,
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
				...getGroupAttributes(props, 'boxShadow', false, 'svg-'),
			},
			blockStyle: props.blockStyle,
			prefix: 'svg-',
		}),
		padding: getMarginPaddingStyles({
			obj: {
				...getGroupAttributes(props, 'margin', false, 'svg-'),
			},
			prefix: 'svg-',
		}),
		margin: getMarginPaddingStyles({
			obj: {
				...getGroupAttributes(props, 'padding', false, 'svg-'),
			},
			prefix: 'svg-',
		}),
		border: getBorderStyles({
			obj: {
				...getGroupAttributes(
					props,
					['border', 'borderWidth', 'borderRadius'],
					false,
					'svg-'
				),
			},
			blockStyle: props.blockStyle,
			prefix: 'svg-',
		}),
		...getSVGWidthStyles({
			obj: getGroupAttributes(props, 'svg'),
			prefix: 'svg-',
			iconWidthHeightRatio,
		}),
		...getBackgroundStyles({
			...getGroupAttributes(
				props,
				['background', 'backgroundColor', 'backgroundGradient'],
				false,
				'svg-'
			),
			blockStyle: props.blockStyle,
			prefix: 'svg-',
		}),
	};

	return response;
};

const getHoverObject = props => {
	const { 'border-status': borderStatusHover, boxShadowStatusHover } =
		getAttributesValue({
			target: ['border-status', 'box-shadow-status'],
			props,
			isHover: true,
			prefix: 'svg-',
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
						'svg-'
					),
				},
				isHover: true,
				blockStyle: props.blockStyle,
				prefix: 'svg-',
			}),
		boxShadow:
			boxShadowStatusHover &&
			getBoxShadowStyles({
				obj: {
					...getGroupAttributes(props, 'boxShadow', true, 'svg-'),
				},
				isHover: true,
				blockStyle: props.blockStyle,
				prefix: 'svg-',
			}),
		...getBackgroundStyles({
			...getGroupAttributes(
				props,
				['background', 'backgroundColor', 'backgroundGradient'],
				true,
				'svg-'
			),
			blockStyle: props.blockStyle,
			isHover: true,
			prefix: 'svg-',
		}),
	};

	return response;
};

const getStyles = (props, iconWidthHeightRatio) => {
	const { uniqueID, blockStyle } = props;

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
					target: 'svg-status-hover',
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
