/**
 * Internal dependencies
 */
import { getGroupAttributes, stylesCleaner } from '../../extensions/styles';
import {
	getBorderStyles,
	getBoxShadowStyles,
	getDisplayStyles,
	getMapStyles,
	getMarginPaddingStyles,
	getOpacityStyles,
	getOverflowStyles,
	getPositionStyles,
	getSizeStyles,
	getTransformStyles,
	getZIndexStyles,
	getTypographyStyles,
	getCustomFormatsStyles,
} from '../../extensions/styles/helpers';
import { selectorsMap } from './custom-css';

const getNormalObject = props => {
	const response = {
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
		boxShadow: getBoxShadowStyles({
			obj: {
				...getGroupAttributes(props, 'boxShadow'),
			},
			parentBlockStyle: props.parentBlockStyle,
		}),
		size: getSizeStyles({
			...getGroupAttributes(props, 'size'),
		}),
		margin: getMarginPaddingStyles({
			obj: {
				...getGroupAttributes(props, 'margin'),
			},
		}),
		padding: getMarginPaddingStyles({
			obj: {
				...getGroupAttributes(props, 'padding'),
			},
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
		overflow: getOverflowStyles({
			...getGroupAttributes(props, 'overflow'),
		}),
	};

	return response;
};

const getHoverNormalObject = props => {
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

const getMapObject = (props, target) => {
	const typography =
		target === 'text'
			? getTypographyStyles({
					obj: {
						...getGroupAttributes(props, 'typography'),
					},
					parentBlockStyle: props.parentBlockStyle,
			  })
			: getTypographyStyles({
					obj: {
						...getGroupAttributes(
							props,
							'typography',
							false,
							'description-'
						),
					},
					parentBlockStyle: props.parentBlockStyle,
					prefix: 'description-',
			  });

	const response = {
		map: getMapStyles(
			{
				...getGroupAttributes(props, 'map'),
			},
			target,
			props.parentBlockStyle
		),
		[target === 'text' ? 'typography' : 'description-typography']:
			typography,
	};

	return response;
};

const getStyles = props => {
	const { uniqueID } = props;

	const response = {
		[uniqueID]: stylesCleaner(
			{
				'': getNormalObject(props),
				':hover': getHoverNormalObject(props),
				' .map-marker-info-window__title': getMapObject(props, 'text'),
				' .map-marker-info-window__address': getMapObject(
					props,
					'address'
				),
			},
			...getCustomFormatsStyles(
				' map-marker-info-window__title',
				props['custom-formats'],
				false,
				{ ...getGroupAttributes(props, 'typography') },
				props['map-marker-heading-level'],
				props.parentBlockStyle
			),
			...getCustomFormatsStyles(
				' map-marker-info-window__address',
				props['custom-formats'],
				false,
				{
					...getGroupAttributes(
						props,
						'typography',
						false,
						'description-'
					),
				},
				'p',
				props.parentBlockStyle
			),
			selectorsMap,
			props
		),
	};

	return response;
};

export default getStyles;
