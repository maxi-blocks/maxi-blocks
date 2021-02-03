import { getGroupAttributes } from '../../extensions/styles';
import {
	getBorderStyles,
	getSizeStyles,
	getBoxShadowStyles,
	getOpacityStyles,
	getZIndexStyles,
	getPositionStyles,
	getDisplayStyles,
	getTransformStyles,
	getBackgroundStyles,
	getMarginPaddingStyles,
	getTypographyStyles,
	getAlignmentFlexStyles,
	getAlignmentTextStyles,
} from '../../extensions/styles/helpers';

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
	};

	return response;
};

const getHoverEffectDetailsBoxObject = props => {
	const response = {
		...(props['border-status-hover'] && {
			border: getBorderStyles(
				{
					...getGroupAttributes(
						props,
						[
							'hoverBorder',
							'hoverBorderWidth',
							'hoverBorderRadius',
						],
						true
					),
				},
				true,
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

const getImageFrontendObject = props => {
	const response = {
		boxShadow: getBoxShadowStyles({
			...getGroupAttributes(props, 'boxShadow'),
		}),
		imageSize: getSizeStyles({
			...getGroupAttributes(props, 'size'),
		}),
		opacity: getOpacityStyles({
			...getGroupAttributes(props, 'opacity'),
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
	const { clipPath } = props;

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
			props['arrow-status']
		),
		opacity: getOpacityStyles({
			...getGroupAttributes(props, 'opacity'),
		}),
		image: {
			label: 'Image settings',
			general: {},
		},
	};

	if (clipPath) response.image.general['clip-path'] = clipPath;

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

const getStyles = props => {
	const { uniqueID } = props;

	let response = {
		[uniqueID]: getNormalObject(props),
		[`${uniqueID} .maxi-block-hover-wrapper`]: getImageFrontendObject(
			props
		),
		[`${uniqueID}:hover .maxi-block-hover-wrapper`]: getImageHoverObject(
			props
		),
		[`${uniqueID} .maxi-block-hover-wrapper img`]: getImageBackendObject(
			props
		),
		[`${uniqueID} .maxi-block-hover-wrapper svg`]: getImageBackendObject(
			props
		),
		[`${uniqueID} figcaption`]: getFigcaptionObject(props),
		[`${uniqueID} .maxi-hover-details .maxi-hover-details__content h3`]: getHoverEffectTitleTextObject(
			props
		),
		[`${uniqueID} .maxi-hover-details .maxi-hover-details__content p`]: getHoverEffectContentTextObject(
			props
		),
		[`${uniqueID} .maxi-hover-details`]: getHoverEffectDetailsBoxObject(
			props
		),
	};

	response = {
		...response,
		...getBackgroundStyles({
			target: uniqueID,
			...getGroupAttributes(props, [
				'backgroundHover',
				'backgroundColorHover',
				'backgroundGradientHover',
				'borderRadiusHover',
			]),
			isHover: !!props['background-status-hover'],
		}),
		...getBackgroundStyles({
			target: `${uniqueID} .maxi-hover-details`,
			...getGroupAttributes(props, [
				'hoverBackground',
				'hoverBackgroundColor',
				'hoverBackgroundGradient',
				'hoverBorderRadius',
			]),
			prefix: 'hover-',
			groupAttrNames: {
				background: 'hoverBackground',
				backgroundColor: 'hoverBackgroundColor',
				backgroundGradient: 'hoverBackgroundGradient',
				borderRadius: 'hoverBorderRadius',
			},
		}),
		...getBackgroundStyles({
			target: uniqueID,
			...getGroupAttributes(props, [
				'background',
				'backgroundColor',
				'backgroundImage',
				'backgroundVideo',
				'backgroundGradient',
				'backgroundSVG',
			]),
		}),
	};

	return response;
};

export default getStyles;
