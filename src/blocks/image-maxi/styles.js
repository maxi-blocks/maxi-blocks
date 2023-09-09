/**
 * Internal dependencies
 */
import {
	getGroupAttributes,
	getLastBreakpointAttribute,
	styleProcessor,
} from '../../extensions/styles';
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
	getTypographyStyles,
	getZIndexStyles,
	getOverflowStyles,
	getClipPathStyles,
	getFlexStyles,
	getAspectRatio,
} from '../../extensions/styles/helpers';
import data from './data';

/**
 * External dependencies
 */
import { isNil } from 'lodash';

const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const getWrapperObject = props => {
	const { fitParentSize } = props;

	const response = {
		border: getBorderStyles({
			obj: {
				...getGroupAttributes(props, [
					'border',
					'borderWidth',
					'borderRadius',
				]),
			},
			blockStyle: props.blockStyle,
		}),
		boxShadow: getBoxShadowStyles({
			obj: {
				...getGroupAttributes(props, 'boxShadow'),
			},
			blockStyle: props.blockStyle,
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
		alignment: getAlignmentFlexStyles({
			...getGroupAttributes(props, 'alignment'),
		}),
		size: getSizeStyles({
			...getGroupAttributes(props, 'size'),
			fitParentSize,
		}),
		opacity: getOpacityStyles({
			...getGroupAttributes(props, 'opacity'),
		}),
		flex: getFlexStyles({
			...getGroupAttributes(props, 'flex'),
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
				blockStyle: props.blockStyle,
			}),
		}),
		...(props['box-shadow-status-hover'] && {
			boxShadow: getBoxShadowStyles({
				obj: {
					...getGroupAttributes(props, 'boxShadow', true),
				},
				blockStyle: props.blockStyle,
				isHover: true,
			}),
		}),
		...(props['opacity-status-hover'] && {
			opacity: getOpacityStyles(
				{ ...getGroupAttributes(props, 'opacity', true) },
				true
			),
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
				blockStyle: props.blockStyle,
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
				props.blockStyle
			),
		},
		size: getSizeStyles({
			...getGroupAttributes(props, 'size'),
		}),
		...(props.imageRatio && getAspectRatio(props.imageRatio)),
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
				blockStyle: props.blockStyle,
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
				blockStyle: props.blockStyle,
			}),
		}),
	};

	return response;
};

const getImageOverflow = props => {
	const response = {
		overflow: getOverflowStyles({
			...getGroupAttributes(props, 'overflow'),
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
		padding: getMarginPaddingStyles({
			obj: {
				...getGroupAttributes(props, 'padding', false, 'image-'),
			},
			prefix: 'image-',
		}),
		...(props.fitParentSize && {
			firParentSize: { general: { overflow: 'hidden' } },
		}),
	};

	return response;
};

const getImageFitWrapper = props => {
	const response = {};

	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {};

		const objectSize = getLastBreakpointAttribute({
			target: 'object-size',
			breakpoint,
			attributes: props,
		});
		const horizontalPosition = getLastBreakpointAttribute({
			target: 'object-position-horizontal',
			breakpoint,
			attributes: props,
		});
		const verticalPosition = getLastBreakpointAttribute({
			target: 'object-position-vertical',
			breakpoint,
			attributes: props,
		});

		const size = objectSize * 100;

		response[breakpoint].height = `${size}%`;
		response[breakpoint].width = `${size}%`;

		const displacementCoefficient = 100 - size;

		const horizontalDisplacement =
			(displacementCoefficient * horizontalPosition) / 100;
		const verticalDisplacement =
			(displacementCoefficient * verticalPosition) / 100;

		response[breakpoint].left = `${horizontalDisplacement}%`;
		response[breakpoint].top = `${verticalDisplacement}%`;

		response[breakpoint][
			'object-position'
		] = `${horizontalPosition}% ${verticalPosition}%`;
	});

	return response;
};

const getImageObject = props => {
	const {
		imageRatio,
		imgWidth,
		useInitSize,
		mediaWidth,
		isFirstOnHierarchy,
	} = props;

	return {
		border: getBorderStyles({
			obj: {
				...getGroupAttributes(
					props,
					['border', 'borderWidth', 'borderRadius'],
					false,
					'image-'
				),
			},
			blockStyle: props.blockStyle,
			prefix: 'image-',
		}),
		boxShadow: getBoxShadowStyles({
			obj: {
				...getGroupAttributes(props, 'boxShadow', false, 'image-'),
				...getGroupAttributes(props, 'clipPath'),
				SVGElement: props.SVGElement,
			},
			blockStyle: props.blockStyle,
			prefix: 'image-',
		}),
		margin: getMarginPaddingStyles({
			obj: {
				...getGroupAttributes(props, 'margin', false, 'image-'),
			},
			prefix: 'image-',
		}),
		...(imageRatio && getAspectRatio(imageRatio)),
		size: getSizeStyles(
			{
				...getGroupAttributes(props, 'size', false, 'image-'),
			},
			'image-'
		),
		clipPath: getClipPathStyles({
			obj: {
				...getGroupAttributes(props, 'clipPath'),
			},
		}),
		...(imgWidth && {
			imgWidth: {
				general: {
					width: !useInitSize ? `${imgWidth}%` : `${mediaWidth}px`,
				},
			},
		}),
		...(!isFirstOnHierarchy && {
			fitParentSize: getImageFitWrapper(props),
		}),
	};
};

const getHoverImageObject = props => {
	return {
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
				blockStyle: props.blockStyle,
				prefix: 'image-',
			}),
		}),
		...(props['image-box-shadow-status-hover'] && {
			boxShadow: getBoxShadowStyles({
				obj: {
					...getGroupAttributes(props, 'boxShadow', true, 'image-'),
					...getGroupAttributes(props, 'clipPath'),
					SVGElement: props.SVGElement,
				},
				isHover: true,
				blockStyle: props.blockStyle,
				prefix: 'image-',
			}),
		}),
		...(props['clip-path-status-hover'] && {
			clipPath: getClipPathStyles({
				obj: {
					...getGroupAttributes(props, 'clipPath', true),
				},
				isHover: true,
			}),
		}),
	};
};

const getClipPathDropShadowObject = (props, isHover = false) => {
	// for clip path drop shadow should be applied to wrapper div
	const response = {
		...(!isHover && {
			boxShadow: getBoxShadowStyles({
				obj: {
					...getGroupAttributes(props, 'boxShadow', false, 'image-'),
					...getGroupAttributes(props, 'clipPath'),
					SVGElement: props.SVGElement,
				},
				dropShadow: true,
				blockStyle: props.blockStyle,
				prefix: 'image-',
				forClipPath: true,
			}),
		}),
		...(props['image-box-shadow-status-hover'] &&
			isHover && {
				boxShadow: getBoxShadowStyles({
					obj: {
						...getGroupAttributes(
							props,
							'boxShadow',
							true,
							'image-'
						),
						...getGroupAttributes(props, 'clipPath'),
						SVGElement: props.SVGElement,
					},
					isHover: true,
					dropShadow: true,
					blockStyle: props.blockStyle,
					prefix: 'image-',
					forClipPath: true,
				}),
			}),
	};

	return response;
};

const getFigcaptionObject = props => {
	const response = {
		...(props.captionType !== 'none' && {
			typography: getTypographyStyles({
				obj: {
					...getGroupAttributes(props, 'typography'),
				},
				blockStyle: props.blockStyle,
			}),
		}),
		textAlignment: getAlignmentTextStyles({
			...getGroupAttributes(props, 'textAlignment'),
		}),
		...(props.imgWidth && {
			imgWidth: { general: { width: `${props.imgWidth}%` } },
		}),
		...(() => {
			const response = { captionMargin: {} };
			const { captionPosition } = props;

			breakpoints.forEach(breakpoint => {
				const num = getLastBreakpointAttribute({
					target: 'caption-gap',
					breakpoint,
					attributes: props,
				});
				const unit = getLastBreakpointAttribute({
					target: 'caption-gap-unit',
					breakpoint,
					attributes: props,
				});

				if (!isNil(num) && !isNil(unit)) {
					const marginType =
						captionPosition === 'bottom'
							? 'margin-top'
							: 'margin-bottom';

					response.captionMargin[breakpoint] = {
						[marginType]: num + unit,
					};
				}
			});

			return response;
		})(),
	};

	return response;
};

const getImageShapeObject = (target, props) => {
	const { SVGElement, clipPath, imageRatio } = props;

	const response = {
		...(SVGElement && {
			transform: getImageShapeStyles(target, {
				...getGroupAttributes(props, 'imageShape'),
			}),
		}),
		...(clipPath && {
			image: { general: { 'clip-path': clipPath } },
		}),
		...(target === 'svg' && imageRatio && getAspectRatio(imageRatio)),
	};

	return response;
};

const getStyles = props => {
	const { uniqueID } = props;

	const imgTag = props.SVGElement === '' || !props.SVGElement ? 'img' : 'svg';

	const response = {
		[uniqueID]: styleProcessor(
			{
				'': { ...getWrapperObject(props) },
				' .maxi-block__resizer--overflow': {
					...getImageOverflow(props),
					border: getBorderStyles({
						obj: {
							...getGroupAttributes(props, ['borderRadius']),
						},
						blockStyle: props.blockStyle,
					}),
				},
				':hover': getHoverWrapperObject(props),
				' .maxi-image-block-wrapper': {
					...getImageWrapperObject(props),
					...getClipPathDropShadowObject(props),
				},
				[` .maxi-image-block-wrapper ${imgTag}`]: getImageObject(props),
				[`:hover .maxi-image-block-wrapper ${imgTag}`]:
					getHoverImageObject(props),
				':hover .maxi-image-block-wrapper': getClipPathDropShadowObject(
					props,
					true
				),
				// add the same styles to the hover to avoid conflict with transform styles
				// which are also applied to the hover state
				...[
					' .maxi-image-block__image',
					' .maxi-image-block__image:hover',
				].reduce((acc, selector) => {
					acc[selector] = getImageShapeObject('svg', props);
					return acc;
				}, {}),
				' .maxi-image-block__image pattern image': getImageShapeObject(
					'image',
					props
				),
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
					blockStyle: props.blockStyle,
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
					blockStyle: props.blockStyle,
				}),
				...getCustomFormatsStyles(
					' .maxi-image-block__caption',
					props['custom-formats'],
					false,
					{ ...getGroupAttributes(props, 'typography') },
					'p',
					props.blockStyle
				),
				...getCustomFormatsStyles(
					':hover .maxi-image-block__caption',
					props['custom-formats-hover'],
					true,
					getGroupAttributes(props, 'typographyHover'),
					'p',
					props.blockStyle
				),
				...getLinkStyles(
					{ ...getGroupAttributes(props, 'link') },
					[' a figcaption.maxi-image-block__caption'],
					props.blockStyle
				),
				...getLinkStyles(
					{ ...getGroupAttributes(props, 'link') },
					[' figcaption.maxi-image-block__caption a'],
					props.blockStyle
				),
			},
			data,
			props
		),
	};

	return response;
};

export default getStyles;
