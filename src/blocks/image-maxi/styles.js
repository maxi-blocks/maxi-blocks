/**
 * Internal dependencies
 */
import { getGroupAttributes } from '../../extensions/styles';
import {
	getAlignmentFlexStyles,
	getAlignmentTextStyles,
	getBackgroundStyles,
	getBorderStyles,
	getBoxShadowStyles,
	getDisplayStyles,
	getHoverEffectsBackgroundStyles,
	getMarginPaddingStyles,
	getOpacityStyles,
	getPositionStyles,
	getSizeStyles,
	getTransformStyles,
	getTypographyStyles,
	getZIndexStyles,
} from '../../extensions/styles/helpers';

/**
 * External dependencies
 */
import { isEmpty, isNil } from 'lodash';

const getNormalObject = props => {
	const response = {
		margin: getMarginPaddingStyles({
			...getGroupAttributes(props, 'margin'),
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
		display: getDisplayStyles({
			...getGroupAttributes(props, 'display'),
		}),
		transform: getTransformStyles({
			...getGroupAttributes(props, 'transform'),
		}),
		alignment: getAlignmentFlexStyles({
			...getGroupAttributes(props, 'alignment'),
		}),
		size: getSizeStyles({
			...getGroupAttributes(props, 'size'),
		}),
	};

	return response;
};

const getHoverEffectDetailsBoxObject = props => {
	const response = {
		...(props['hover-border-status'] && {
			border: getBorderStyles(
				{
					...getGroupAttributes(
						props,
						[
							'hoverBorder',
							'hoverBorderWidth',
							'hoverBorderRadius',
						],
						false
					),
				},
				false,
				'hover-'
			),
		}),
		margin: getMarginPaddingStyles(
			{
				...getGroupAttributes(props, 'hoverMargin'),
			},
			'hover-'
		),
		padding: getMarginPaddingStyles(
			{
				...getGroupAttributes(props, 'hoverPadding'),
			},
			'hover-'
		),
		...(props['palette-custom-hover-background-color'] && {
			background: {
				...getHoverEffectsBackgroundStyles({
					...getGroupAttributes(props, [
						'hoverBackground',
						'hoverBackgroundColor',
						'hoverBackgroundGradient',
					]),
				}),
			},
		}),
		size: getSizeStyles({
			...getGroupAttributes(props, 'size'),
		}),
	};

	return response;
};

const getHoverEffectTitleTextObject = props => {
	const response = {
		...(props['hover-title-typography-status'] && {
			typography: getTypographyStyles(
				{
					...getGroupAttributes(props, 'hoverTitleTypography'),
				},
				false,
				'hover-title-'
			),
		}),
	};

	return response;
};

const getHoverEffectContentTextObject = props => {
	const response = {
		...(props['hover-content-typography-status'] && {
			typography: getTypographyStyles(
				{
					...getGroupAttributes(props, 'hoverContentTypography'),
				},
				false,
				'hover-content-'
			),
		}),
	};

	return response;
};

const getImageHoverObject = props => {
	const response = {
		...(props['border-status-hover'] && {
			border: getBorderStyles(
				{
					...getGroupAttributes(
						props,
						['border', 'borderWidth', 'borderRadius'],
						true
					),
				},
				true
			),
		}),
		...(props['box-shadow-status-hover'] && {
			boxShadow: getBoxShadowStyles(
				{
					...getGroupAttributes(props, 'boxShadow', true),
				},
				true
			),
		}),
	};

	return response;
};

const getImageBackendObject = props => {
	const response = {
		border: getBorderStyles({
			...getGroupAttributes(props, [
				'border',
				'borderWidth',
				'borderRadius',
			]),
		}),
		boxShadow: getBoxShadowStyles(
			{
				...getGroupAttributes(props, 'boxShadow'),
			},
			false,
			!isEmpty(props.clipPath) || !isNil(props.SVGCurrentElement)
		),
		opacity: getOpacityStyles({
			...getGroupAttributes(props, 'opacity'),
		}),
	};

	return response;
};

const getFigcaptionObject = props => {
	const response = {
		...(props.captionType !== 'none' && {
			typography: getTypographyStyles({
				...getGroupAttributes(props, 'typography'),
			}),
		}),
		textAlignment: getAlignmentTextStyles({
			...getGroupAttributes(props, 'textAlignment'),
		}),
	};

	return response;
};

const getResizeObject = props => {
	const response = {
		imageSize: getSizeStyles({
			...getGroupAttributes(props, 'size'),
		}),
	};

	return response;
};

const getImageHoverPreviewObject = props => {
	const { clipPath } = props;

	const response = {
		image: {
			label: 'Image settings',
			general: {},
		},
	};

	if (clipPath) response.image.general['clip-path'] = clipPath;

	return response;
};

const getStyles = props => {
	const { uniqueID } = props;

	const response = {
		[uniqueID]: {
			'': getNormalObject(props),
			' .maxi-block-hover-wrapper': getImageBackendObject(props),
			' .maxi-image-block__resizer': getResizeObject(props),
			':hover .maxi-block-hover-wrapper': getImageHoverObject(props),
			' .maxi-block-hover-wrapper .maxi-hover-preview':
				getImageHoverPreviewObject(props),
			' figcaption': getFigcaptionObject(props),
			' .maxi-hover-details .maxi-hover-details__content h3':
				getHoverEffectTitleTextObject(props),
			' .maxi-hover-details .maxi-hover-details__content p':
				getHoverEffectContentTextObject(props),
			' .maxi-hover-details': getHoverEffectDetailsBoxObject(props),
			...getBackgroundStyles({
				...getGroupAttributes(props, [
					'backgroundHover',
					'backgroundColorHover',
					'backgroundGradientHover',
					'borderRadiusHover',
				]),
				isHover: true,
			}),
			...getBackgroundStyles({
				...getGroupAttributes(props, [
					'background',
					'backgroundColor',
					'backgroundImage',
					'backgroundVideo',
					'backgroundGradient',
					'backgroundSVG',
				]),
			}),
		},
	};

	return response;
};

export default getStyles;
