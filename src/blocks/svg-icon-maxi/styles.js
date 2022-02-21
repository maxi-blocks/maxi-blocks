import { getGroupAttributes, stylesCleaner } from '../../extensions/styles';
import {
	getAlignmentFlexStyles,
	getBlockBackgroundStyles,
	getBorderStyles,
	getBoxShadowStyles,
	getDisplayStyles,
	getMarginPaddingStyles,
	getOpacityStyles,
	getPositionStyles,
	getSizeStyles,
	getSVGStyles,
	getTransformStyles,
	getZIndexStyles,
	getOverflowStyles,
	getSVGWidthStyles,
} from '../../extensions/styles/helpers';
import { selectorsSvgIcon } from './custom-css';

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
			parentBlockStyle: props.parentBlockStyle,
		}),
		boxShadow: getBoxShadowStyles({
			obj: {
				...getGroupAttributes(props, 'boxShadow'),
			},
			parentBlockStyle: props.parentBlockStyle,
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
		transform: getTransformStyles({
			...getGroupAttributes(props, 'transform'),
		}),
		display: getDisplayStyles({
			...getGroupAttributes(props, 'display'),
		}),
		overflow: getOverflowStyles({
			...getGroupAttributes(props, 'overflow'),
		}),
	};

	return response;
};

const getWrapperObjectHover = props => {
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
	};

	return response;
};

const getNormalObject = props => {
	const response = {
		...getBoxShadowStyles({
			obj: {
				...getGroupAttributes(props, 'boxShadow', false, 'svg-'),
			},
			parentBlockStyle: props.parentBlockStyle,
			prefix: 'svg-',
		}),
		...getMarginPaddingStyles({
			obj: {
				...getGroupAttributes(props, 'margin', false, 'svg-'),
			},
			prefix: 'svg-',
		}),
		...getMarginPaddingStyles({
			obj: {
				...getGroupAttributes(props, 'padding', false, 'svg-'),
			},
			prefix: 'svg-',
		}),
		...getBorderStyles({
			obj: {
				...getGroupAttributes(
					props,
					['border', 'borderWidth', 'borderRadius'],
					false,
					'svg-'
				),
			},
			parentBlockStyle: props.parentBlockStyle,
			prefix: 'svg-',
		}),
		...getSVGWidthStyles(getGroupAttributes(props, 'svg')),
	};

	return response;
};

const getHoverObject = props => {
	const response = {
		border:
			props['svg-border-status-hover'] &&
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
				parentBlockStyle: props.parentBlockStyle,
				prefix: 'svg-',
			}),
		boxShadow:
			props['svg-box-shadow-status-hover'] &&
			getBoxShadowStyles({
				obj: {
					...getGroupAttributes(props, 'boxShadow', true, 'svg-'),
				},
				isHover: true,
				parentBlockStyle: props.parentBlockStyle,
				prefix: 'svg-',
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
				':hover': getWrapperObjectHover(props),
				' .maxi-svg-icon-block__icon': getNormalObject(props),
				' .maxi-svg-icon-block__icon:hover': getHoverObject(props),
				...getSVGStyles({
					obj: {
						...getGroupAttributes(props, 'svg'),
					},
					target: ' .maxi-svg-icon-block__icon',
					blockStyle,
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
			selectorsSvgIcon,
			props
		),
	};

	return response;
};

export default getStyles;
