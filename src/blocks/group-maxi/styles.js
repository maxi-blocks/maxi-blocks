import getGroupAttributes from '../../extensions/styles/getGroupAttributes';
import {
	getBorderStyles,
	getSizeStyles,
	getBoxShadowStyles,
	getOpacityStyles,
	getZIndexStyles,
	getPositionStyles,
	getDisplayStyles,
	getTransformStyles,
	getBackgroundStyles,
	getMarginStyles,
	getPaddingStyles,
	getShapeDividerStyles,
	getShapeDividerSVGStyles,
} from '../../extensions/styles/helpers';

const getNormalObject = props => {
	const response = {
		margin: getMarginStyles({
			...getGroupAttributes(props, 'margin'),
		}),
		padding: getPaddingStyles({
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
		[`${uniqueID} .maxi-shape-divider__top`]: {
			shapeDivider: {
				...getShapeDividerStyles(
					{
						...getGroupAttributes(props, 'shapeDivider'),
					},
					'top'
				),
			},
		},
		[`${uniqueID} .maxi-shape-divider__top svg`]: {
			shapeDivider: {
				...getShapeDividerSVGStyles(
					{
						...getGroupAttributes(props, 'shapeDivider'),
					},
					'top'
				),
			},
		},
		[`${uniqueID} .maxi-shape-divider__bottom`]: {
			shapeDivider: {
				...getShapeDividerStyles(
					{
						...getGroupAttributes(props, 'shapeDivider'),
					},
					'bottom'
				),
			},
		},
		[`${uniqueID} .maxi-shape-divider__bottom svg`]: {
			shapeDivider: {
				...getShapeDividerSVGStyles(
					{
						...getGroupAttributes(props, 'shapeDivider'),
					},
					'bottom'
				),
			},
		},
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
				'backgroundImageHover',
				'backgroundVideoHover',
				'backgroundGradientHover',
				'backgroundSVGHover',
				'borderRadiusHover',
			]),
			isHover: !!props['background-hover-status'],
		}),
	};

	return response;
};

export default getStyles;
