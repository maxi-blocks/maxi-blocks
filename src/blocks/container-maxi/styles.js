import { getGroupAttributes, stylesCleaner } from '../../extensions/styles';
import {
	getBorderStyles,
	getSizeStyles,
	getBoxShadowStyles,
	getOpacityStyles,
	getZIndexStyles,
	getPositionStyles,
	getDisplayStyles,
	getTransformStyles,
	getBlockBackgroundStyles,
	getArrowStyles,
	getMarginPaddingStyles,
	getShapeDividerStyles,
	getShapeDividerSVGStyles,
	getOverflowStyles,
} from '../../extensions/styles/helpers';
import { selectorsContainer } from './custom-css';

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
		size: getSizeStyles({
			...getGroupAttributes(props, 'size'),
		}),
		boxShadow: getBoxShadowStyles({
			obj: {
				...getGroupAttributes(props, 'boxShadow'),
			},
			parentBlockStyle: props.parentBlockStyle,
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
		overflow: getOverflowStyles({
			...getGroupAttributes(props, 'overflow'),
		}),
		transform: getTransformStyles({
			...getGroupAttributes(props, 'transform'),
		}),
		margin: getMarginPaddingStyles({
			obj: {
				...getGroupAttributes(props, 'margin'),
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

const getContainerObject = props => {
	const response = {
		padding: getMarginPaddingStyles({
			obj: {
				...getGroupAttributes(props, 'padding'),
			},
		}),
	};

	return response;
};

const getStyles = props => {
	const { uniqueID } = props;

	const response = {
		[uniqueID]: stylesCleaner(
			{
				'': getNormalObject(props),
				':hover': getHoverObject(props),
				' > .maxi-container-block__container':
					getContainerObject(props),
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
								...getGroupAttributes(props, ['shapeDivider']),
							},
							'top',
							props.parentBlockStyle
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
								...getGroupAttributes(props, ['shapeDivider']),
							},
							'bottom',
							props.parentBlockStyle
						),
					},
				},
				...getBlockBackgroundStyles({
					...getGroupAttributes(props, [
						'blockBackground',
						'border',
						'borderWidth',
						'borderRadius',
					]),
					blockStyle: props.parentBlockStyle,
				}),
				...getBlockBackgroundStyles({
					...getGroupAttributes(
						props,
						[
							'blockBackground',
							'border',
							'borderWidth',
							'borderRadius',
						],
						true
					),
					isHover: true,
					blockStyle: props.parentBlockStyle,
				}),
				...getArrowStyles({
					...getGroupAttributes(props, [
						'arrow',
						'border',
						'borderWidth',
						'borderRadius',
						'blockBackground',
						'boxShadow',
					]),
					blockStyle: props.parentBlockStyle,
				}),
				...getArrowStyles({
					...getGroupAttributes(
						props,
						[
							'arrow',
							'border',
							'borderWidth',
							'borderRadius',
							'blockBackground',
							'boxShadow',
						],
						true
					),
					...getGroupAttributes(props, ['arrow']),
					blockStyle: props.parentBlockStyle,
					isHover: true,
				}),
			},
			selectorsContainer,
			props
		),
	};

	return response;
};

export default getStyles;
