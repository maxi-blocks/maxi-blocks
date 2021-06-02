import { getGroupAttributes } from '../../extensions/styles';
import {
	getBorderStyles,
	getSizeStyles,
	getBoxShadowStyles,
	getOpacityStyles,
	getZIndexStyles,
	getPositionStyles,
	getDisplayStyles,
	getTransformStyles,
	getArrowStyles,
	getBackgroundStyles,
	getMarginPaddingStyles,
} from '../../extensions/styles/helpers';

const getNormalObject = props => {
	const response = {
		margin: getMarginPaddingStyles({
			...getGroupAttributes(props, 'margin'),
		}),
		padding: getMarginPaddingStyles({
			...getGroupAttributes(props, 'padding'),
		}),
		border: getBorderStyles({
			...getGroupAttributes(props, [
				'border',
				'borderWidth',
				'borderRadius',
			]),
		}),
		size: getSizeStyles({
			...getGroupAttributes(props, 'size'),
		}),
		boxShadow: getBoxShadowStyles(
			{
				...getGroupAttributes(props, 'boxShadow'),
			},
			false
		),
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
	};

	return response;
};

const getHoverObject = props => {
	const response = {
		border:
			props['border-status-hover'] &&
			getBorderStyles(
				{
					...getGroupAttributes(
						props,
						['border', 'borderWidth', 'borderRadius'],
						true
					),
				},
				true
			),
		boxShadow:
			props['box-shadow-status-hover'] &&
			getBoxShadowStyles(
				{
					...getGroupAttributes(props, 'boxShadow', true),
				},
				true
			),
	};

	return response;
};

const getStyles = props => {
	const { uniqueID } = props;

	let response = {
		[uniqueID]: getNormalObject(props),
		[`${uniqueID}:hover`]: getHoverObject(props),
	};

	response = {
		...response,
		...getBackgroundStyles({
			target: [uniqueID],
			...getGroupAttributes(props, [
				'background',
				'backgroundColor',
				'backgroundImage',
				'backgroundVideo',
				'backgroundGradient',
				'backgroundSVG',
				'borderRadius',
			]),
		}),
		...getBackgroundStyles({
			target: [uniqueID],
			...getGroupAttributes(props, [
				'backgroundHover',
				'backgroundColorHover',
				'backgroundGradientHover',
				'borderRadiusHover',
			]),
			isHover: true,
		}),
		...getArrowStyles({
			target: uniqueID,
			...getGroupAttributes(props, [
				'arrow',
				'border',
				'borderWidth',
				'borderRadius',
				'background',
				'backgroundColor',
				'backgroundGradient',
				'boxShadow',
				'palette',
			]),
		}),
	};

	return response;
};

export default getStyles;
