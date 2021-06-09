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
	getBackgroundStyles,
	getArrowStyles,
	getMarginPaddingStyles,
	getShapeDividerStyles,
	getShapeDividerSVGStyles,
	getContainerStyles,
} from '../../extensions/styles/helpers';

const getNormalObject = props => {
	const response = {
		border: getBorderStyles({
			...getGroupAttributes(props, [
				'border',
				'borderWidth',
				'borderRadius',
			]),
		}),
		size: getSizeStyles(
			{
				...getGroupAttributes(props, 'container'),
			},
			'container-'
		),
		boxShadow: getBoxShadowStyles(
			{
				...getGroupAttributes(props, 'boxShadow'),
			},
			false,
			props['arrow-status']
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
		margin: getMarginPaddingStyles({
			...getGroupAttributes(props, 'margin'),
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
				true,
				props['arrow-status']
			),
	};

	return response;
};

const getContainerObject = props => {
	const { isFirstOnHierarchy, fullWidth } = props;

	let response = {
		padding: getMarginPaddingStyles({
			...getGroupAttributes(props, 'padding'),
		}),
	};

	if (isFirstOnHierarchy && fullWidth === 'full')
		response = {
			...response,
			sizeContainer: getContainerStyles({
				...getGroupAttributes(props, 'container'),
			}),
		};

	return response;
};

const getStyles = props => {
	const { uniqueID } = props;

	const response = {
		[uniqueID]: {
			'': getNormalObject(props),
			':hover': getHoverObject(props),
			' > .maxi-container-block__container': getContainerObject(props),
			' .maxi-shape-divider__top': {
				shapeDivider: {
					...getShapeDividerStyles(
						{
							...getGroupAttributes(props, 'shapeDivider'),
						},
						'top'
					),
				},
			},
			' .maxi-shape-divider__top svg': {
				shapeDivider: {
					...getShapeDividerSVGStyles(
						{
							...getGroupAttributes(props, 'shapeDivider'),
						},
						'top'
					),
				},
			},
			' .maxi-shape-divider__bottom': {
				shapeDivider: {
					...getShapeDividerStyles(
						{
							...getGroupAttributes(props, 'shapeDivider'),
						},
						'bottom'
					),
				},
			},
			' .maxi-shape-divider__bottom svg': {
				shapeDivider: {
					...getShapeDividerSVGStyles(
						{
							...getGroupAttributes(props, 'shapeDivider'),
						},
						'bottom'
					),
				},
			},
			...getBackgroundStyles({
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
				...getGroupAttributes(props, [
					'backgroundHover',
					'backgroundColorHover',
					'backgroundGradientHover',
					'borderRadiusHover',
				]),
				isHover: true,
			}),
			...getArrowStyles({
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
		},
	};

	return response;
};

export default getStyles;
