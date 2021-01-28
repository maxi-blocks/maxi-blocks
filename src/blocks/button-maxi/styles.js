import getGroupAttributes from '../../extensions/styles/getGroupAttributes';

import {
	getSizeStyles,
	getBoxShadowStyles,
	getIconStyles,
	getZIndexStyles,
	getPositionStyles,
	getDisplayStyles,
	getTransformStyles,
	getMarginStyles,
	getPaddingStyles,
	getBackgroundStyles,
	getBorderStyles,
	getAlignmentFlexStyles,
	getAlignmentTextStyles,
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
		margin: getMarginStyles({
			...getGroupAttributes(props, 'margin'),
		}),
		padding: getPaddingStyles({
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

const getIconObject = props => {
	const response = {
		icon: getIconStyles({
			...getGroupAttributes(props, 'icon'),
		}),
		padding: getPaddingStyles(
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

const getStyles = props => {
	const { uniqueID } = props;

	let response = {
		[uniqueID]: getWrapperObject(props),
		[`${uniqueID} .maxi-button-block__button`]: getNormalObject(
			props,
			uniqueID
		),
		[`${uniqueID} .maxi-button-block__button:hover`]: getHoverObject(props),
		[`${uniqueID} .maxi-button-block__button i`]: getIconObject(props),
	};

	response = {
		...response,
		...getBackgroundStyles({
			target: `${uniqueID} .maxi-button-block__button`,
			...getGroupAttributes(props, [
				'backgroundHover',
				'backgroundColorHover',
				'backgroundGradientHover',
				'borderRadiusHover',
			]),
			isHover: !!props['background-hover-status'],
		}),
		...getBackgroundStyles({
			target: `${uniqueID} .maxi-button-block__button`,
			...getGroupAttributes(props, [
				'background',
				'backgroundColor',
				'backgroundGradient',
				'borderRadius',
			]),
		}),
	};

	return response;
};

export default getStyles;
