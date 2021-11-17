import { getGroupAttributes, stylesCleaner } from '../../extensions/styles';
import {
	getBorderStyles,
	getBoxShadowStyles,
	getCustomCss,
	getCustomStyles,
	getDisplayStyles,
	getMapStyles,
	getMarginPaddingStyles,
	getOpacityStyles,
	getOverflowStyles,
	getPositionStyles,
	getSizeStyles,
	getTransformStyles,
	getZIndexStyles,
} from '../../extensions/styles/helpers';

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
		transform: getTransformStyles({
			...getGroupAttributes(props, 'transform'),
		}),
		overflow: getOverflowStyles({
			...getGroupAttributes(props, 'overflow'),
		}),
		customCss: getCustomCss(
			{
				...getGroupAttributes(props, 'customCss'),
			},
			'map',
			0
		),
	};

	return response;
};

const getHoverNormalObject = props => {
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
		customCss: getCustomCss(
			{
				...getGroupAttributes(props, 'customCss'),
			},
			'map',
			1
		),
	};

	return response;
};

const getMapObject = (props, target) => {
	const response = {
		map: getMapStyles(
			{
				...getGroupAttributes(props, 'map'),
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
		[uniqueID]: stylesCleaner({
			'': getNormalObject(props),
			':before': getCustomStyles(props, 'before map', 0),
			':after': getCustomStyles(props, 'after map', 0),
			':hover': getHoverNormalObject(props),
			':hover:before': getCustomStyles(props, 'before map', 1),
			':hover:after': getCustomStyles(props, 'after map', 1),
			' .map-marker-info-window__title': [
				getMapObject(props, 'title'),
				getCustomStyles(props, 'title', 0),
			],
			':hover .map-marker-info-window__title': getCustomStyles(
				props,
				'title',
				1
			),

			' .map-marker-info-window__address': [
				getMapObject(props, 'address'),
				getCustomStyles(props, 'address', 0),
			],
			':hover .map-marker-info-window__address': getCustomStyles(
				props,
				'address',
				1
			),
		}),
	};

	return response;
};

export default getStyles;
