/**
 * Internal dependencies
 */
import { getGroupAttributes, styleProcessor } from '@extensions/styles';
import {
	getBlockBackgroundStyles,
	getBorderStyles,
	getBoxShadowStyles,
	getDisplayStyles,
	getMarginPaddingStyles,
	getNumberCounterStyles,
	getOpacityStyles,
	getOverflowStyles,
	getPositionStyles,
	getSizeStyles,
	getZIndexStyles,
	getFlexStyles,
	getAlignmentFlexStyles,
} from '@extensions/styles/helpers';
import data from './data';

const getWrapperObject = props => {
	const response = {
		alignment: getAlignmentFlexStyles({
			...getGroupAttributes(props, 'alignment'),
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
		size: getSizeStyles({
			...getGroupAttributes(props, 'size'),
		}),
		flex: getFlexStyles({
			...getGroupAttributes(props, 'flex'),
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

const getBoxObject = props => {
	const { 'number-counter-title-font-size': fontSize } = props;
	const endCountValue = Math.ceil((props['number-counter-end'] * 360) / 100);

	const size = getSizeStyles(
		{
			...getGroupAttributes(props, 'size', false, 'number-counter-'),
			...getGroupAttributes(props, 'numberCounter'),
		},
		'number-counter-'
	);
	Object.entries(size).forEach(([key, val]) => {
		if (key.includes('min-width') && !val)
			size[key] = fontSize * (endCountValue.toString().length - 1);
	});

	const response = {
		size,
		margin: getMarginPaddingStyles({
			obj: {
				...getGroupAttributes(
					props,
					'margin',
					false,
					'number-counter-'
				),
			},
			prefix: 'number-counter-',
		}),
		padding: getMarginPaddingStyles({
			obj: {
				...getGroupAttributes(
					props,
					'padding',
					false,
					'number-counter-'
				),
			},
			prefix: 'number-counter-',
		}),
		boxShadow: getBoxShadowStyles({
			obj: {
				...getGroupAttributes(
					props,
					'boxShadow',
					false,
					'number-counter-'
				),
			},
			blockStyle: props.blockStyle,
			prefix: 'number-counter-',
		}),
		border: getBorderStyles({
			obj: {
				...getGroupAttributes(
					props,
					['border', 'borderWidth', 'borderRadius'],
					false,
					'number-counter-'
				),
			},
			blockStyle: props.blockStyle,
			prefix: 'number-counter-',
		}),
	};

	return response;
};

const getHoverBoxObject = props => {
	const response = {
		border:
			props['number-counter-border-status-hover'] &&
			getBorderStyles({
				obj: {
					...getGroupAttributes(
						props,
						['border', 'borderWidth', 'borderRadius'],
						true,
						'number-counter-'
					),
				},
				isHover: true,
				blockStyle: props.blockStyle,
				prefix: 'number-counter-',
			}),
		boxShadow:
			props['number-counter-box-shadow-status-hover'] &&
			getBoxShadowStyles({
				obj: {
					...getGroupAttributes(
						props,
						'boxShadow',
						true,
						'number-counter-'
					),
				},
				isHover: true,
				blockStyle: props.blockStyle,
				prefix: 'number-counter-',
			}),
	};

	return response;
};

const getStyles = props => {
	const { uniqueID, blockStyle } = props;

	const response = {
		[uniqueID]: styleProcessor(
			{
				'': getWrapperObject(props),
				':hover': getHoverWrapperObject(props),
				':hover .maxi-number-counter__box': getHoverBoxObject(props),
				' .maxi-number-counter__box': getBoxObject(props),
				...getNumberCounterStyles({
					obj: {
						...getGroupAttributes(props, 'numberCounter'),
					},
					target: '.maxi-number-counter__box',
					blockStyle,
				}),
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
					blockStyle: props.blockStyle,
					isHover: true,
				}),
			},
			data,
			props
		),
	};
	return response;
};

export default getStyles;
