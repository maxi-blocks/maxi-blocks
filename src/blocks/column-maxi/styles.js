import { getGroupAttributes, stylesCleaner } from '../../extensions/styles';
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
	getOverflowStyles,
} from '../../extensions/styles/helpers';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

const getNormalObject = props => {
	const response = {
		boxShadow: getBoxShadowStyles({
			obj: {
				...getGroupAttributes(props, 'boxShadow'),
			},
			parentBlockStyle: props.parentBlockStyle,
		}),
		border: getBorderStyles({
			obj: {
				...getGroupAttributes(props, [
					'border',
					'borderWidth',
					'borderRadius',
				]),
			},
			parentBlockStyle: props.parentBlockStyle,
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
		overflow: getOverflowStyles({
			...getGroupAttributes(props, 'overflow'),
		}),
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
			getBorderStyles({
				obj: {
					...getGroupAttributes(
						props,
						['border', 'borderWidth', 'borderRadius'],
						true
					),
				},
				isHover: true,
				parentBlockStyle: props.parentBlockStyle,
			}),
		boxShadow:
			props['box-shadow-status-hover'] &&
			getBoxShadowStyles({
				obj: {
					...getGroupAttributes(props, 'boxShadow', true),
				},
				isHover: true,
				parentBlockStyle: props.parentBlockStyle,
			}),
	};

	return response;
};

const getStyles = props => {
	const { uniqueID } = props;

	const response = {
		[uniqueID]: stylesCleaner({
			'': getNormalObject(props),
			':hover': getHoverObject(props),
			...getBackgroundStyles({
				...getGroupAttributes(props, [
					'background',
					'backgroundColor',
					'backgroundImage',
					'backgroundVideo',
					'backgroundGradient',
					'backgroundSVG',
					'border',
					'borderWidth',
					'borderRadius',
				]),
				blockStyle: props.parentBlockStyle,
			}),
			...getBackgroundStyles({
				...getGroupAttributes(props, [
					'backgroundHover',
					'backgroundColorHover',
					'backgroundGradientHover',
					'borderHover',
					'borderRadiusHover',
					'borderWidthHover',
				]),
				isHover: true,
				blockStyle: props.parentBlockStyle,
			}),
		}),
	};

	return response;
};

export default getStyles;
