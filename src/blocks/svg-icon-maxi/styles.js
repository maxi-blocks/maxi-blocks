import { getGroupAttributes } from '../../extensions/styles';
import {
	getAlignmentFlexStyles,
	getBackgroundStyles,
	getBorderStyles,
	getBoxShadowStyles,
	getDisplayStyles,
	getMarginPaddingStyles,
	getOpacityStyles,
	getPositionStyles,
	getSvgStyles,
	getTransformStyles,
	getZIndexStyles,
} from '../../extensions/styles/helpers';

const getNormalObject = props => {
	const response = {
		boxShadow: getBoxShadowStyles({
			obj: {
				...getGroupAttributes(props, 'boxShadow'),
			},
			parentBlockStyle: props.parentBlockStyle,
		}),
		margin: getMarginPaddingStyles({
			...getGroupAttributes(props, 'margin'),
		}),
		padding: getMarginPaddingStyles({
			...getGroupAttributes(props, 'padding'),
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
		opacity: getOpacityStyles({
			...getGroupAttributes(props, 'opacity'),
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

const getSvgObject = (props, target) => {
	const response = {
		shape: getSvgStyles(
			{
				...getGroupAttributes(props, 'svg'),
			},
			target,
			props.parentBlockStyle
		),
	};

	return response;
};

const getStyles = props => {
	const { uniqueID } = props;

	const response = {
		[uniqueID]: {
			'': getNormalObject(props),
			':hover': getHoverObject(props),
			' .maxi-svg-icon-block__icon svg': getSvgObject(props, 'svg'),
			' .maxi-svg-icon-block__icon svg > path': getSvgObject(
				props,
				'path'
			),
			' .maxi-svg-icon-block__icon svg > path[data-fill]:not([fill^="none"])':
				getSvgObject(props, 'path-fill'),
			' .maxi-svg-icon-block__icon svg > path[data-stroke]:not([stroke^="none"])':
				getSvgObject(props, 'path-stroke'),
			' .maxi-svg-icon-block__icon svg > g[data-fill]:not([fill^="none"])':
				getSvgObject(props, 'path-fill'),
			' .maxi-svg-icon-block__icon svg > g[data-stroke]:not([stroke^="none"])':
				getSvgObject(props, 'path-stroke'),
			...getBackgroundStyles({
				...getGroupAttributes(props, [
					'background',
					'backgroundColor',
					'border',
					'borderWidth',
					'borderRadius',
				]),
				blockStyle: props.parentBlockStyle,
			}),
			...getBackgroundStyles({
				...getGroupAttributes(props, [
					'backgroundHover',
					'backgroundColorHover',
					'borderHover',
					'borderRadiusHover',
					'borderWidthHover',
				]),
				isHover: true,
				blockStyle: props.parentBlockStyle,
			}),
		},
	};

	return response;
};

export default getStyles;
