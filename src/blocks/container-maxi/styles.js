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
	getArrowStyles,
	getMarginStyles,
	getPaddingStyles,
	getShapeDividerStyles,
	getShapeDividerSVGStyles,
	getContainerStyles,
} from '../../extensions/styles/helpers';

const getNormalObject = props => {
	const response = {
		border: getBorderStyles({
			...getGroupAttributes(props, 'border'),
		}),
		size: getSizeStyles({
			...getGroupAttributes(props, 'size'),
		}),
		boxShadow: getBoxShadowStyles({
			...getGroupAttributes(props, 'boxShadow'),
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
	};

	return response;
};

const getHoverObject = props => {
	const response = {
		border: getBorderStyles(
			{
				...getGroupAttributes(props, 'border', true),
			},
			true
		),
		boxShadow: getBoxShadowStyles(
			{
				...getGroupAttributes(props, 'boxShadow', true),
			},
			true
		),
	};

	return response;
};

const getWrapperObject = props => {
	const response = {
		margin: getMarginStyles({
			...getGroupAttributes(props, 'margin'),
		}),
		padding: getPaddingStyles({
			...getGroupAttributes(props, 'padding'),
		}),
	};

	return response;
};

const getContainerObject = props => {
	const { isFirstOnHierarchy, fullWidth } = props;

	if (isFirstOnHierarchy && fullWidth === 'full')
		return {
			sizeContainer: getContainerStyles({
				...getGroupAttributes(props, 'container'),
			}),
		};

	return {};
};

const getStyles = props => {
	const { uniqueID } = props;

	let response = {
		[uniqueID]: getNormalObject(props),
		[`${uniqueID}:hover`]: getHoverObject(props),
		[`${uniqueID}>.maxi-container-block__wrapper`]: getWrapperObject(props),
		[`${uniqueID}>.maxi-container-block__wrapper>.maxi-container-block__container`]: getContainerObject(
			props
		),
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
			target: `${uniqueID} .maxi-container-block__wrapper`,
			...getGroupAttributes(props, [
				'background',
				'backgroundColor',
				'backgroundImage',
				'backgroundVideo',
				'backgroundGradient',
				'backgroundSVG',
			]),
		}),
		...getBackgroundStyles({
			target: `${uniqueID} .maxi-container-block__wrapper`,
			...getGroupAttributes(props, [
				'backgroundHover',
				'backgroundColorHover',
				'backgroundImageHover',
				'backgroundVideoHover',
				'backgroundGradientHover',
				'backgroundSVGHover',
			]),
			isHover: true,
		}),
		...getArrowStyles({
			target: uniqueID,
			...getGroupAttributes(props, [
				'arrow',
				'border',
				'background',
				'backgroundColor',
				'backgroundGradient',
				'boxShadow',
			]),
		}),
	};

	return response;
};

export default getStyles;
