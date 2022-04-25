import { getGroupAttributes, stylesCleaner } from '../../extensions/styles';
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
	getTransformStyles,
	getZIndexStyles,
	getFlexStyles,
	getAlignmentFlexStyles,
} from '../../extensions/styles/helpers';
import { selectorsNumberCounter } from './custom-css';

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
		transform: getTransformStyles({
			...getGroupAttributes(props, 'transform'),
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
			parentBlockStyle: props.parentBlockStyle,
		}),
		boxShadow: getBoxShadowStyles({
			obj: {
				...getGroupAttributes(props, 'boxShadow'),
			},
			parentBlockStyle: props.parentBlockStyle,
		}),
		size: getSizeStyles({
			...getGroupAttributes(props, 'size'),
		}),
		background: {
			...getBlockBackgroundStyles({
				...getGroupAttributes(props, ['blockBackground']),
				blockStyle: props.parentBlockStyle,
			}),
		},
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
				parentBlockStyle: props.parentBlockStyle,
			}),
		boxShadow:
			props['box-shadow-status-hover'] &&
			getBoxShadowStyles({
				obj: {
					...getGroupAttributes(props, 'boxShadow', true),
				},
				isHover: true,
				parentBlockStyle: props.parentBlockStyle,
			}),
		background: {
			...getBlockBackgroundStyles({
				...getGroupAttributes(props, ['blockBackground'], true),
				blockStyle: props.parentBlockStyle,
				isHover: true,
			}),
		},
	};

	return response;
};

const getBoxObject = props => {
	const { 'number-counter-title-font-size': fontSize } = props;
	const endCountValue = Math.ceil((props['number-counter-end'] * 360) / 100);

	const size = getSizeStyles(
		{
			...getGroupAttributes(props, 'size', false, 'number-counter-'),
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
			parentBlockStyle: props.parentBlockStyle,
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
			parentBlockStyle: props.parentBlockStyle,
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
				parentBlockStyle: props.parentBlockStyle,
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
				parentBlockStyle: props.parentBlockStyle,
				prefix: 'number-counter-',
			}),
	};

	return response;
};

const getStyles = props => {
	const { uniqueID, parentBlockStyle: blockStyle } = props;

	const response = {
		[uniqueID]: stylesCleaner(
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
			},
			selectorsNumberCounter,
			props
		),
	};
	return response;
};

export default getStyles;
