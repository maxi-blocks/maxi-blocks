import { getGroupAttributes, stylesCleaner } from '../../extensions/styles';
import {
	getSizeStyles,
	getBoxShadowStyles,
	getOpacityStyles,
	getZIndexStyles,
	getPositionStyles,
	getDisplayStyles,
	getTransformStyles,
	getBackgroundStyles,
	getMarginPaddingStyles,
	getDividerStyles,
} from '../../extensions/styles/helpers';

const getNormalObject = props => {
	const { lineAlign, lineVertical, lineHorizontal } = props;

	const response = {
		size: getSizeStyles({
			...getGroupAttributes(props, 'size'),
		}),
		margin: getMarginPaddingStyles({
			...getGroupAttributes(props, 'margin'),
		}),
		padding: getMarginPaddingStyles({
			...getGroupAttributes(props, 'padding'),
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
		opacity: getOpacityStyles({
			...getGroupAttributes(props, 'opacity'),
		}),
		divider: getDividerStyles(
			{
				...getGroupAttributes(props, 'divider'),
				lineAlign,
				lineVertical,
				lineHorizontal,
			},
			null,
			props.parentBlockStyle
		),
	};

	return response;
};

const getDividerObject = props => {
	const { lineOrientation } = props;
	const response = {
		divider: getDividerStyles(
			{
				...getGroupAttributes(props, 'divider'),
				lineOrientation,
			},
			'line',
			props.parentBlockStyle
		),
		boxShadow: getBoxShadowStyles({
			obj: {
				...getGroupAttributes(props, 'boxShadow'),
			},
			parentBlockStyle: props.parentBlockStyle,
		}),
		opacity: getOpacityStyles({
			...getGroupAttributes(props, 'opacity'),
		}),
	};

	return response;
};

const getHoverObject = props => {
	const response = {
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

const getStyles = props => {
	const { uniqueID } = props;

	const response = {
		[uniqueID]: stylesCleaner({
			'': getNormalObject(props),
			':hover hr.maxi-divider-block__divider': getHoverObject(props),
			' hr.maxi-divider-block__divider': getDividerObject(props),
			...getBackgroundStyles({
				...getGroupAttributes(props, [
					'background',
					'backgroundColor',
					'backgroundGradient',
				]),
				blockStyle: props.parentBlockStyle,
			}),
			...getBackgroundStyles({
				...getGroupAttributes(props, [
					'backgroundHover',
					'backgroundColorHover',
					'backgroundGradientHover',
				]),
				isHover: true,
				blockStyle: props.parentBlockStyle,
			}),
		}),
	};

	return response;
};

export default getStyles;
