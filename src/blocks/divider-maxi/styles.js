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
	getDividerStyles,
} from '../../extensions/styles/helpers';
const getNormalObject = props => {
	const { lineAlign, lineVertical, lineHorizontal } = props;
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
		divider: getDividerStyles({
			...getGroupAttributes(props, 'divider'),
			lineAlign,
			lineVertical,
			lineHorizontal,
		}),
	};

	// if (!isNil(linesAlign)) {
	// 	response.divider.general['flex-direction'] = linesAlign;
	// 	if (linesAlign === 'row') {
	// 		if (!isNil(lineVertical))
	// 			response.divider.general['align-items'] = lineVertical;
	// 		if (!isNil(lineHorizontal))
	// 			response.divider.general['justify-content'] = lineHorizontal;
	// 	} else {
	// 		if (!isNil(lineVertical))
	// 			response.divider.general['justify-content'] = lineVertical;
	// 		if (!isNil(lineHorizontal))
	// 			response.divider.general['align-items'] = lineHorizontal;
	// 	}
	// }

	return response;
};

const getDividerObject = props => {
	const response = {
		divider: getDividerStyles(
			{
				...getGroupAttributes(props, 'divider'),
			},
			'line'
		),
		boxShadow: getBoxShadowStyles({
			...getGroupAttributes(props, 'boxShadow'),
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
		[`${uniqueID}:hover hr.maxi-divider-block__divider`]: getHoverObject(
			props
		),
		[`${uniqueID} hr.maxi-divider-block__divider`]: getDividerObject(props),
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
			isHover: !!props['background-hover-status'],
		}),
	};

	return response;
};

export default getStyles;
