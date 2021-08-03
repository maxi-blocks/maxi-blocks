import { getGroupAttributes } from '../../extensions/styles';
import {
	getAlignmentFlexStyles,
	getAlignmentTextStyles,
	getBorderStyles,
	getBoxShadowStyles,
	getColorBackgroundObject,
	getDisplayStyles,
	getGradientBackgroundObject,
	getIconStyles,
	getMarginPaddingStyles,
	getPositionStyles,
	getSizeStyles,
	getTransformStyles,
	getTypographyStyles,
	getZIndexStyles,
} from '../../extensions/styles/helpers';

const getWrapperObject = props => {
	const response = {
		zIndex: getZIndexStyles({
			...getGroupAttributes(props, 'zIndex'),
		}),
		margin: getMarginPaddingStyles({
			...getGroupAttributes(props, 'margin'),
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

const getContentObject = props => {
	const response = {
		typography: getTypographyStyles({
			obj: {
				...getGroupAttributes(props, 'typography'),
			},
			parentBlockStyle: props.parentBlockStyle,
			textLevel: 'button',
		}),
	};

	return response;
};

const getNormalObject = props => {
	const response = {
		boxShadow: getBoxShadowStyles({
			obj: {
				...getGroupAttributes(props, 'boxShadow'),
			},
			parentBlockStyle: props.parentBlockStyle,
		}),
		size: getSizeStyles({
			...getGroupAttributes(props, 'size'),
		}),
		padding: getMarginPaddingStyles({
			...getGroupAttributes(props, 'padding'),
		}),
		zIndex: getZIndexStyles({
			...getGroupAttributes(props, 'zIndex'),
		}),
		position: getPositionStyles({
			...getGroupAttributes(props, 'position'),
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
		textAlignment: getAlignmentTextStyles({
			...getGroupAttributes(props, 'textAlignment'),
		}),
		...(props['background-active-media'] === 'color' && {
			background: getColorBackgroundObject({
				...getGroupAttributes(props, 'backgroundColor'),
				blockStyle: props.parentBlockStyle,
				isButton: true,
			}),
		}),
		...(props['background-active-media'] === 'gradient' && {
			background: getGradientBackgroundObject({
				...getGroupAttributes(props, 'backgroundGradient'),
			}),
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
		...(props['background-active-media-hover'] === 'color' && {
			background: getColorBackgroundObject({
				...getGroupAttributes(props, 'backgroundColor', true),
				blockStyle: props.parentBlockStyle,
				isHover: true,
				isButton: true,
			}),
		}),
		...(props['background-active-media-hover'] === 'gradient' && {
			background: getGradientBackgroundObject({
				...getGroupAttributes(props, 'backgroundGradient', true),
				isHover: true,
			}),
		}),
	};

	return response;
};

const getHoverContentObject = props => {
	const response = {
		typography: getTypographyStyles({
			obj: {
				...getGroupAttributes(props, 'typographyHover'),
			},
			isHover: true,
			parentBlockStyle: props.parentBlockStyle,
			textLevel: 'button',
		}),
	};

	return response;
};

const getIconObject = (props, target) => {
	const response = {
		icon: getIconStyles(
			{
				...getGroupAttributes(props, 'icon'),
			},
			target,
			props.parentBlockStyle
		),
		background: target === 'icon' && {
			...getColorBackgroundObject({
				...getGroupAttributes(props, 'iconBackgroundColor'),
				prefix: 'icon-',
				blockStyle: props.parentBlockStyle,
			}),
		},
		gradient: target === 'icon' && {
			...getGradientBackgroundObject({
				...getGroupAttributes(props, 'iconGradient'),
				prefix: 'icon-',
			}),
		},
		padding:
			target === 'icon' &&
			getMarginPaddingStyles(
				{
					...getGroupAttributes(props, 'iconPadding'),
				},
				'icon-'
			),
		border:
			target === 'icon' &&
			getBorderStyles({
				obj: {
					...getGroupAttributes(props, [
						'iconBorder',
						'iconBorderWidth',
						'iconBorderRadius',
					]),
				},
				prefix: 'icon-',
				parentBlockStyle: props.parentBlockStyle,
			}),
	};

	return response;
};

const getStyles = props => {
	const { uniqueID } = props;

	const response = {
		[uniqueID]: {
			'': getWrapperObject(props),
			' .maxi-button-block__button': getNormalObject(props),
			' .maxi-button-block__icon': getIconObject(props, 'icon'),
			' .maxi-button-block__icon svg > *': getIconObject(props, 'svg'),
			' .maxi-button-block__content': getContentObject(props),
			' .maxi-button-block__button:hover': getHoverObject(props),
			' .maxi-button-block__button:hover .maxi-button-block__content':
				getHoverContentObject(props),
		},
	};

	return response;
};

export default getStyles;
