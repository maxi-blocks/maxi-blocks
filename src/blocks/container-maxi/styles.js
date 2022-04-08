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
	getTransitionStyles,
	getFlexStyles,
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
		padding: getMarginPaddingStyles({
			obj: {
				...getGroupAttributes(props, 'padding'),
			},
		}),
		flex: getFlexStyles({
			...getGroupAttributes(props, 'flex'),
		}),
		transitionDuration: getTransitionStyles({
			...getGroupAttributes(props, 'transitionDuration'),
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
		[uniqueID]: stylesCleaner(
			{
				'': getNormalObject(props),
				':hover': getHoverObject(props),
				...(props['shape-divider-top-status'] && {
					' .maxi-shape-divider__top': {
						shapeDivider: {
							...getShapeDividerStyles(
								{
									...getGroupAttributes(props, [
										'shapeDivider',
										'padding',
									]),
								},
								'top'
							),
						},
					},
					' ': getTransitionStyles({
						...getGroupAttributes(props, 'transitionDuration'),
					}),
					' .maxi-shape-divider__top svg': {
						shapeDivider: {
							...getShapeDividerSVGStyles(
								{
									...getGroupAttributes(props, [
										['shapeDivider', 'padding'],
									]),
								},
								'top',
								props.parentBlockStyle
							),
						},
					},
				}),
				...(props['shape-divider-bottom-status'] && {
					' .maxi-shape-divider__bottom': {
						shapeDivider: {
							...getShapeDividerStyles(
								{
									...getGroupAttributes(props, [
										'shapeDivider',
										'padding',
									]),
								},
								'bottom'
							),
						},
					},
					' .maxi-shape-divider__bottom svg': {
						shapeDivider: {
							...getShapeDividerSVGStyles(
								{
									...getGroupAttributes(props, [
										['shapeDivider', 'padding'],
									]),
								},
								'bottom',
								props.parentBlockStyle
							),
						},
					},
				}),
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
