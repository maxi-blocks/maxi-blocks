import getGroupAttributes from '../../extensions/styles/getGroupAttributes';
import {
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
	getAlignmentFlexStyles,
	getIconStyles,
	getBorderStyles,
} from '../../extensions/styles/helpers';

const getNormalObject = props => {
	const response = {
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
		display: getDisplayStyles({
			...getGroupAttributes(props, 'display'),
		}),
		transform: getTransformStyles({
			...getGroupAttributes(props, 'transform'),
		}),
		opacity: getOpacityStyles({
			...getGroupAttributes(props, 'opacity'),
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

const getWrapperObject = props => {
	const response = {
		alignment: getAlignmentFlexStyles({
			...getGroupAttributes(props, 'alignment'),
		}),
	};

	return response;
};

const getIconObject = props => {
	const response = {
		icon: getIconStyles({
			...getGroupAttributes(props, 'icon'),
		}),
	};

	return response;
};

const getStyles = props => {
	const { uniqueID } = props;

	let response = {
		[uniqueID]: getNormalObject(props),
		[`${uniqueID}:hover`]: getHoverObject(props),
		[`${uniqueID} .maxi-font-icon-block__icon`]: getWrapperObject(props),
		[`${uniqueID} .maxi-font-icon-block__icon i`]: getIconObject(props),
	};

	response = {
		...response,
		...getBackgroundStyles({
			target: uniqueID,
			...getGroupAttributes(props, [
				'background',
				'backgroundColor',
				'backgroundGradient',
			]),
		}),
		...getBackgroundStyles({
			target: uniqueID,
			...getGroupAttributes(props, [
				'backgroundHover',
				'backgroundColorHover',
				'backgroundVideoHover',
				'backgroundGradientHover',
			]),
			isHover: !!props['background-status-hover'],
		}),
	};

	return response;
};

export default getStyles;
