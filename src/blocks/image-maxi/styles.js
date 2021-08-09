/**
 * Internal dependencies
 */
import { getGroupAttributes, stylesCleaner } from '../../extensions/styles';
import {
	getAlignmentFlexStyles,
	getAlignmentTextStyles,
	getBackgroundStyles,
	getBorderStyles,
	getBoxShadowStyles,
	getCustomFormatsStyles,
	getDisplayStyles,
	getHoverEffectsBackgroundStyles,
	getLinkStyles,
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
		opacity: getOpacityStyles({
			...getGroupAttributes(props, 'opacity'),
		}),
	};

	return response;
};

const getHoverEffectDetailsBoxObject = props => {
	const response = {
		...(props['hover-border-status'] && {
			border: getBorderStyles({
				obj: {
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
				prefix: 'hover-',
				parentBlockStyle: props.parentBlockStyle,
			}),
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
		// ...(!props['hover-background-palette-color-status'] && {
		...{
			background: {
				...getHoverEffectsBackgroundStyles(
					{
						...getGroupAttributes(props, [
							'hoverBackground',
							'hoverBackgroundColor',
							'hoverBackgroundGradient',
						]),
					},
					props.parentBlockStyle
				),
			},
		},
		size: getSizeStyles({
			...getGroupAttributes(props, 'size'),
		}),
	};

	return response;
};

const getHoverEffectTitleTextObject = props => {
	const response = {
		...(props['hover-title-typography-status'] && {
			typography: getTypographyStyles({
				obj: {
					...getGroupAttributes(props, 'hoverTitleTypography'),
				},
				prefix: 'hover-title-',
				parentBlockStyle: props.parentBlockStyle,
			}),
		}),
	};

	return response;
};

const getHoverEffectContentTextObject = props => {
	const response = {
		...(props['hover-content-typography-status'] && {
			typography: getTypographyStyles({
				obj: {
					...getGroupAttributes(props, 'hoverContentTypography'),
				},
				prefix: 'hover-content-',
				parentBlockStyle: props.parentBlockStyle,
			}),
		}),
	};

	return response;
};

const getImageHoverObject = props => {
	const response = {
		...(props['border-status-hover'] && {
			border: getBorderStyles({
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
		}),
		...(props['box-shadow-status-hover'] && {
			boxShadow: getBoxShadowStyles({
				obj: {
					...getGroupAttributes(props, 'boxShadow', true),
				},
				isHover: true,
				parentBlockStyle: props.parentBlockStyle,
			}),
		}),
	};

	return response;
};

const getImageWrapperObject = props => {
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
		alignment: getAlignmentFlexStyles({
			...getGroupAttributes(props, 'alignment'),
		}),
		boxShadow: getBoxShadowStyles({
			obj: {
				...getGroupAttributes(props, 'boxShadow'),
			},
			dropShadow: !isEmpty(props.clipPath) || !isNil(props.SVGElement),
			parentBlockStyle: props.parentBlockStyle,
		}),
		...(props['hover-extension'] && {
			hoverExtension: { general: { overflow: 'visible' } },
		}),
	};

	return response;
};

const getImageObject = props => {
	return {
		...(props.clipPath && {
			image: { general: { 'clip-path': props.clipPath } },
		}),
		...(props.imgWidth && {
			imgWidth: { general: { width: `${props.imgWidth}%` } },
		}),
	};
};

const getFigcaptionObject = props => {
	const response = {
		...(props.captionType !== 'none' && {
			typography: getTypographyStyles({
				obj: {
					...getGroupAttributes(props, 'typography'),
				},
				parentBlockStyle: props.parentBlockStyle,
			}),
		}),
		textAlignment: getAlignmentTextStyles({
			...getGroupAttributes(props, 'textAlignment'),
		}),
		...(props.imgWidth && {
			imgWidth: { general: { width: `${props.imgWidth}%` } },
		}),
	};

	return response;
};

const getStyles = props => {
	const { uniqueID } = props;

	const response = {
		[uniqueID]: stylesCleaner({
			'': getNormalObject(props),
			' .maxi-image-block-wrapper': getImageWrapperObject(props),
			':hover .maxi-image-block-wrapper': getImageHoverObject(props),
			' .maxi-image-block-wrapper img': getImageObject(props),
			' figcaption': getFigcaptionObject(props),
			' .maxi-hover-details .maxi-hover-details__content h3':
				getHoverEffectTitleTextObject(props),
			' .maxi-hover-details .maxi-hover-details__content p':
				getHoverEffectContentTextObject(props),
			' .maxi-hover-details': getHoverEffectDetailsBoxObject(props),
			...getBackgroundStyles({
				...getGroupAttributes(props, [
					'background',
					'backgroundColor',
					'backgroundImage',
					'backgroundVideo',
					'backgroundGradient',
					'backgroundSVG',
					'borderRadius',
				]),
				blockStyle: props.parentBlockStyle,
			}),
			...getBackgroundStyles({
				...getGroupAttributes(props, [
					'backgroundHover',
					'backgroundColorHover',
					'backgroundGradientHover',
					'borderRadiusHover',
				]),
				isHover: true,
				blockStyle: props.parentBlockStyle,
			}),
			...getCustomFormatsStyles(
				' .maxi-image-block__caption',
				props['custom-formats'],
				false,
				{ ...getGroupAttributes(props, 'typography') },
				'p',
				props.parentBlockStyle
			),
			...getCustomFormatsStyles(
				':hover .maxi-image-block__caption',
				props['custom-formats-hover'],
				true,
				getGroupAttributes(props, 'typographyHover'),
				'p',
				props.parentBlockStyle
			),
			...getLinkStyles(
				{ ...getGroupAttributes(props, 'link') },
				[' a figcaption.maxi-image-block__caption'],
				props.parentBlockStyle
			),
			...getLinkStyles(
				{ ...getGroupAttributes(props, 'link') },
				[' figcaption.maxi-image-block__caption a'],
				props.parentBlockStyle
			),
		}),
	};

	return response;
};

export default getStyles;
