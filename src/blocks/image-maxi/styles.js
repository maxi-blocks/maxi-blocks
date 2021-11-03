/**
 * Internal dependencies
 */
import { getGroupAttributes, stylesCleaner } from '../../extensions/styles';
import {
	getAlignmentFlexStyles,
	getAlignmentTextStyles,
	getBlockBackgroundStyles,
	getBorderStyles,
	getBoxShadowStyles,
	getCustomFormatsStyles,
	getDisplayStyles,
	getHoverEffectsBackgroundStyles,
	getImageShapeStyles,
	getLinkStyles,
	getMarginPaddingStyles,
	getOpacityStyles,
	getPositionStyles,
	getSizeStyles,
	getTransformStyles,
	getTypographyStyles,
	getZIndexStyles,
	getOverflowStyles,
} from '../../extensions/styles/helpers';

/**
 * External dependencies
 */
import { isEmpty, isNil } from 'lodash';

const getWrapperObject = props => {
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

const getHoverWrapperObject = props => {
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
				dropShadow:
					!isEmpty(props.clipPath) || !isNil(props.SVGElement),
				parentBlockStyle: props.parentBlockStyle,
				isHover: true,
			}),
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
		margin: getMarginPaddingStyles({
			obj: {
				...getGroupAttributes(props, 'hoverMargin'),
			},
			prefix: 'hover-',
		}),
		padding: getMarginPaddingStyles({
			obj: {
				...getGroupAttributes(props, 'hoverPadding'),
			},
			prefix: 'hover-',
		}),
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

const getHoverImageWrapperObject = props => {
	const response = {
		...(props['image-border-status-hover'] && {
			border: getBorderStyles({
				obj: {
					...getGroupAttributes(
						props,
						['border', 'borderWidth', 'borderRadius'],
						true,
						'image-'
					),
				},
				isHover: true,
				parentBlockStyle: props.parentBlockStyle,
				prefix: 'image-',
			}),
		}),
		...(props['image-box-shadow-status-hover'] && {
			boxShadow: getBoxShadowStyles({
				obj: {
					...getGroupAttributes(props, 'boxShadow', true, 'image-'),
				},
				isHover: true,
				parentBlockStyle: props.parentBlockStyle,
				prefix: 'image-',
			}),
		}),
	};

	return response;
};

const getImageWrapperObject = props => {
	const response = {
		alignment: getAlignmentFlexStyles({
			...getGroupAttributes(props, 'alignment'),
		}),
		...(props['hover-extension'] && {
			hoverExtension: { general: { overflow: 'visible' } },
		}),
		overflow: getOverflowStyles({
			...getGroupAttributes(props, 'overflow'),
		}),
		border: getBorderStyles({
			obj: {
				...getGroupAttributes(
					props,
					['border', 'borderWidth', 'borderRadius'],
					false,
					'image-'
				),
			},
			parentBlockStyle: props.parentBlockStyle,
			prefix: 'image-',
		}),
		boxShadow: getBoxShadowStyles({
			obj: {
				...getGroupAttributes(props, 'boxShadow', false, 'image-'),
			},
			dropShadow: !isEmpty(props.clipPath) || !isNil(props.SVGElement),
			parentBlockStyle: props.parentBlockStyle,
			prefix: 'image-',
		}),
		margin: getMarginPaddingStyles({
			obj: {
				...getGroupAttributes(props, 'margin', false, 'image-'),
			},
			prefix: 'image-',
		}),
		padding: getMarginPaddingStyles({
			obj: {
				...getGroupAttributes(props, 'padding', false, 'image-'),
			},
			prefix: 'image-',
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
		size: getSizeStyles(
			{
				...getGroupAttributes(props, 'size', false, 'image-'),
			},
			'image-'
		),
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

const getImageShapeObject = (target, props) => {
	const response = {
		...(props.SVGElement && {
			transform: getImageShapeStyles(target, {
				...getGroupAttributes(props, 'imageShape'),
			}),
		}),
		...(props.clipPath && {
			image: { general: { 'clip-path': props.clipPath } },
		}),
	};
	return response;
};

const getStyles = props => {
	const { uniqueID } = props;

	const response = {
		[uniqueID]: stylesCleaner({
			'': getWrapperObject(props),
			':hover': getHoverWrapperObject(props),
			' .maxi-image-block-wrapper': getImageWrapperObject(props),
			':hover .maxi-image-block-wrapper':
				getHoverImageWrapperObject(props),
			' .maxi-image-block-wrapper > svg:first-child': getImageShapeObject(
				'svg',
				props
			),
			' .maxi-image-block-wrapper > svg:first-child pattern image':
				getImageShapeObject('image', props),
			' .maxi-image-block-wrapper img': getImageObject(props),
			' figcaption': getFigcaptionObject(props),
			' .maxi-hover-details .maxi-hover-details__content h4':
				getHoverEffectTitleTextObject(props),
			' .maxi-hover-details .maxi-hover-details__content p':
				getHoverEffectContentTextObject(props),
			' .maxi-hover-details': getHoverEffectDetailsBoxObject(props),
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
