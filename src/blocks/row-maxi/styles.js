import getGroupAttributes from '../../extensions/styles/getGroupAttributes';

import {
	getSizeStyles,
	getBoxShadowStyles,
	getZIndexStyles,
	getPositionStyles,
	getDisplayStyles,
	getTransformStyles,
	getMarginStyles,
	getPaddingStyles,
	getBackgroundStyles,
	getBorderStyles,
	getOpacityStyles,
} from '../../extensions/styles/helpers';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

const getNormalObject = props => {
	const response = {
		boxShadow: getBoxShadowStyles({
			...getGroupAttributes(props, 'boxShadow'),
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
		margin: getMarginStyles({
			...getGroupAttributes(props, 'margin'),
		}),
		padding: getPaddingStyles({
			...getGroupAttributes(props, 'padding'),
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
		row: {
			general: {},
		},
	};

	// if (fullWidth !== 'full') response['sizeContainer'] = sizeContainer;

	if (!isEmpty(props.horizontalAlign))
		response.row.general['justify-content'] = props.horizontalAlign;

	if (!isEmpty(props.verticalAlign))
		response.row.general['align-items'] = props.verticalAlign;

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
			target: uniqueID,
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
			target: uniqueID,
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
