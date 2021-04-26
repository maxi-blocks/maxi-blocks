import { getGroupAttributes } from '../../extensions/styles';
import {
	getAlignmentFlexStyles,
	getAlignmentTextStyles,
	getBorderStyles,
	getBoxShadowStyles,
	getColorBackgroundObject,
	getDisplayStyles,
	getGradientBackgroundObject,
	getIconStyles,
	getMarginPaddingStyles,
	getPositionStyles,
	getSizeStyles,
	getTransformStyles,
	getTypographyStyles,
	getZIndexStyles,
} from '../../extensions/styles/helpers';

const getWrapperObject = props => {
	const response = {
		zIndex: getZIndexStyles({
			...getGroupAttributes(props, 'zIndex'),
		}),
		transform: getTransformStyles({
			...getGroupAttributes(props, 'transform'),
		}),
		display: getDisplayStyles({
			...getGroupAttributes(props, 'display'),
		}),
		alignment: getAlignmentFlexStyles({
			...getGroupAttributes(props, 'alignment'),
		}),
	};

	return response;
};

const getContentObject = props => {
	const response = {
		typography: getTypographyStyles({
			...getGroupAttributes(props, 'typography'),
		}),
	};

	return response;
};

const getNormalObject = props => {
	const response = {
		boxShadow: getBoxShadowStyles(
			{
				...getGroupAttributes(props, 'boxShadow'),
			},
			false,
			false
		),
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
		border: getBorderStyles(
			{
				...getGroupAttributes(props, [
					'border',
					'borderWidth',
					'borderRadius',
				]),
			},
			false
		),
		textAlignment: getAlignmentTextStyles({
			...getGroupAttributes(props, 'textAlignment'),
		}),
		...(props['background-active-media'] === 'color' && {
			background: getColorBackgroundObject({
				...getGroupAttributes(props, 'backgroundColor'),
			}),
		}),
		...(props['background-active-media'] === 'gradient' && {
			background: getGradientBackgroundObject({
				...getGroupAttributes(props, 'backgroundGradient'),
			}),
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
		typography: getTypographyStyles(
			{
				...getGroupAttributes(props, 'typographyHover'),
			},
			true
		),
	};

	return response;
};

const getIconObject = props => {
	const response = {
		icon: getIconStyles({
			...getGroupAttributes(props, 'icon'),
			...getGroupAttributes(props, 'iconPadding'),
		}),
		padding: getMarginPaddingStyles(
			{
				...getGroupAttributes(props, 'iconPadding'),
			},
			'icon-'
		),
		border: getBorderStyles(
			{
				...getGroupAttributes(props, [
					'iconBorder',
					'iconBorderWidth',
					'iconBorderRadius',
				]),
			},
			false,
			'icon-'
		),
	};

	return response;
};

const getHoverIconObject = props => {
	const response = {
		icon:
			props['icon-status-hover'] &&
			getIconStyles(
				{
					...getGroupAttributes(props, 'icon', true),
				},
				true
			),
	};

	return response;
};

const getStyles = props => {
	const { uniqueID } = props;

	const response = {
		[uniqueID]: getWrapperObject(props),
		[`${uniqueID} .maxi-button-block__button`]: getNormalObject(
			props,
			uniqueID
		),
		[`${uniqueID} .maxi-button-block__content`]: getContentObject(
			props,
			uniqueID
		),
		[`${uniqueID} .maxi-button-block__button:hover`]: getHoverObject(props),
		[`${uniqueID} .maxi-button-block__button i`]: getIconObject(props),
		[`${uniqueID} .maxi-button-block__button:hover i`]: getHoverIconObject(
			props
		),
	};

	return response;
};

export default getStyles;
