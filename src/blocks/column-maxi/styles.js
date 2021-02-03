import getGroupAttributes from '../../extensions/styles/getGroupAttributes';

import {
	getBoxShadowStyles,
	getZIndexStyles,
	getColumnSizeStyles,
	getDisplayStyles,
	getTransformStyles,
	getMarginPaddingStyles,
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
		padding: getMarginPaddingStyles({
			...getGroupAttributes(props, 'padding'),
		}),
		margin: getMarginPaddingStyles({
			...getGroupAttributes(props, 'margin'),
		}),
		opacity: getOpacityStyles({
			...getGroupAttributes(props, 'opacity'),
		}),
		zIndex: getZIndexStyles({
			...getGroupAttributes(props, 'zIndex'),
		}),
		display: getDisplayStyles({
			...getGroupAttributes(props, 'display'),
		}),
		transform: getTransformStyles({
			...getGroupAttributes(props, 'transform'),
		}),
		columnSize: {
			...getColumnSizeStyles({
				...getGroupAttributes(props, 'columnSize'),
			}),
		},
		...(!isEmpty(props.verticalAlign) && {
			column: {
				general: {
					'justify-content': props.verticalAlign,
				},
			},
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

const getResizerObject = props => {
	const response = {
		margin: getMarginPaddingStyles({
			...getGroupAttributes(props, 'margin'),
		}),
		display: getDisplayStyles({
			...getGroupAttributes(props, 'display'),
		}),
	};

	return response;
};

const getStyles = props => {
	const { uniqueID } = props;

	let response = {
		[`maxi-column-block__resizer__${uniqueID}`]: getResizerObject(props),
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
			isHover: !!props['background-status-hover'],
		}),
	};

	return response;
};

export default getStyles;
