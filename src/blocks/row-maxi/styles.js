import { getGroupAttributes, stylesCleaner } from '../../extensions/styles';
import {
	getSizeStyles,
	getContainerStyles,
	getBoxShadowStyles,
	getZIndexStyles,
	getPositionStyles,
	getDisplayStyles,
	getTransformStyles,
	getMarginPaddingStyles,
	getBlockBackgroundStyles,
	getBorderStyles,
	getOpacityStyles,
	getOverflowStyles,
} from '../../extensions/styles/helpers';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

const getNormalObject = props => {
	let response = {
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
		size: getSizeStyles({
			...getGroupAttributes(props, 'size'),
		}),
		margin: getMarginPaddingStyles({
			...getGroupAttributes(props, 'margin'),
		}),
		padding: getMarginPaddingStyles({
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
		overflow: getOverflowStyles({
			...getGroupAttributes(props, 'overflow'),
		}),
	};

	if (props.fullWidth !== 'full') {
		response = {
			...response,
			containerSize: getContainerStyles({
				...getGroupAttributes(props, 'container'),
			}),
		};
	}

	if (!isEmpty(props.horizontalAlign))
		response.row.general['justify-content'] = props.horizontalAlign;

	if (!isEmpty(props.verticalAlign))
		response.row.general['align-items'] = props.verticalAlign;

	return response;
};

const getContainerObject = props => {
	const response = {
		row: {
			general: {},
		},
	};

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
			' .maxi-row-block__container': getContainerObject(props),
			':hover': getHoverObject(props),
			...getBlockBackgroundStyles({
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
			...getBlockBackgroundStyles({
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
