/**
 * Internal dependencies
 */
import {
	getAttributesValue,
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '../../extensions/attributes';
import { styleProcessor } from '../../extensions/styles';
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

const breakpoints = ['g', 'xxl', 'xl', 'l', 'm', 's', 'xs'];
const prefix = 'im-';

const getWrapperObject = props => {
	const { _fps: fitParentSize } = props;

	const response = {
		border: getBorderStyles({
			obj: {
				...getGroupAttributes(props, [
					'border',
					'borderWidth',
					'borderRadius',
				]),
			},
			blockStyle: props._bs,
		}),
		boxShadow: getBoxShadowStyles({
			obj: {
				...getGroupAttributes(props, 'boxShadow'),
			},
			blockStyle: props._bs,
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
	const [borderStatusHover, boxShadowStatusHover, opacityStatusHover] =
		getAttributesValue({
			target: ['bo.s', 'bs.s', '_o.s'],
			props,
			isHover: true,
		});

	const response = {
		...(borderStatusHover && {
			border: getBorderStyles({
				obj: {
					...getGroupAttributes(
						props,
						['border', 'borderWidth', 'borderRadius'],
						true
					),
				},
				isHover: true,
				blockStyle: props._bs,
			}),
		}),
		...(boxShadowStatusHover && {
			boxShadow: getBoxShadowStyles({
				obj: {
					...getGroupAttributes(props, 'boxShadow', true),
				},
				blockStyle: props._bs,
				isHover: true,
			}),
		}),
		...(opacityStatusHover && {
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
		...(getAttributesValue({
			target: 'bo.s',
			props,
			prefix: 'h-',
		}) && {
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
				prefix: 'h-',
				blockStyle: props._bs,
			}),
		}),
		margin: getMarginPaddingStyles({
			obj: {
				...getGroupAttributes(props, 'hoverMargin'),
			},
			prefix: 'h-',
		}),
		padding: getMarginPaddingStyles({
			obj: {
				...getGroupAttributes(props, 'hoverPadding'),
			},
			prefix: 'h-',
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
				props._bs
			),
		},
		size: getSizeStyles({
			...getGroupAttributes(props, 'size'),
		}),
		...(props._ir && getAspectRatio(props._ir)),
	};

	return response;
};

const getHoverEffectTitleTextObject = props => {
	const response = {
		...(getAttributesValue({
			target: 't.s',
			props,
			prefix: 'h-ti-',
		}) && {
			typography: getTypographyStyles({
				obj: {
					...getGroupAttributes(props, 'hoverTitleTypography'),
				},
				prefix: 'h-ti-',
				blockStyle: props._bs,
			}),
		}),
	};

	return response;
};

const getHoverEffectContentTextObject = props => {
	const response = {
		...(getAttributesValue({
			target: 't.s',
			props,
			prefix: 'hc-',
		}) && {
			typography: getTypographyStyles({
				obj: {
					...getGroupAttributes(props, 'hoverContentTypography'),
				},
				prefix: 'hc-',
				blockStyle: props._bs,
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
		...(getAttributesValue({
			target: 'h_ex',
			props,
		}) && {
			hoverExtension: { g: { overflow: 'visible' } },
		}),
		overflow: getOverflowStyles({
			...getGroupAttributes(props, 'overflow'),
		}),
		margin: getMarginPaddingStyles({
			obj: {
				...getGroupAttributes(props, 'margin', false, prefix),
			},
			prefix,
		}),
		padding: getMarginPaddingStyles({
			obj: {
				...getGroupAttributes(props, 'padding', false, prefix),
			},
			prefix,
		}),
		...(props._fps && {
			firParentSize: { g: { overflow: 'hidden' } },
		}),
	};

	return response;
};

const getImageFitWrapper = props => {
	const response = {};

	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {};

		const objectSize = getLastBreakpointAttribute({
			target: '_os',
			breakpoint,
			attributes: props,
		});
		const horizontalPosition = getLastBreakpointAttribute({
			target: '_oph',
			breakpoint,
			attributes: props,
		});
		const verticalPosition = getLastBreakpointAttribute({
			target: '_opv',
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
		_ir: imageRatio,
		_iw: imgWidth,
		_uis: useInitSize,
		_mew: mediaWidth,
		_fps: fitParentSize,
		_ioh: isFirstOnHierarchy,
	} = props;

	return {
		border: getBorderStyles({
			obj: {
				...getGroupAttributes(
					props,
					['border', 'borderWidth', 'borderRadius'],
					false,
					prefix
				),
			},
			blockStyle: props._bs,
			prefix,
		}),
		boxShadow: getBoxShadowStyles({
			obj: {
				...getGroupAttributes(props, 'boxShadow', false, prefix),
				...getGroupAttributes(props, 'clipPath'),
				SVGElement: props._se,
			},
			blockStyle: props._bs,
			prefix,
		}),
		...(imageRatio && getAspectRatio(imageRatio)),
		size: getSizeStyles(
			{
				...getGroupAttributes(props, 'size', false, prefix),
			},
			prefix
		),
		clipPath: getClipPathStyles({
			obj: {
				...getGroupAttributes(props, 'clipPath'),
			},
		}),
		...(imgWidth && {
			imgWidth: {
				g: {
					width: !useInitSize ? `${imgWidth}%` : `${mediaWidth}px`,
				},
			},
		}),
		...(fitParentSize &&
			!isFirstOnHierarchy && {
				fitParentSize: getImageFitWrapper(props),
			}),
	};
};

const getHoverImageObject = props => {
	const [
		imageBorderStatusHover,
		imageBoxShadowStatusHover,
		imageClipPathStatusHover,
	] = getAttributesValue({
		target: [`${prefix}bo.s`, `${prefix}bs.s`, '_cp.s'],
		props,
		isHover: true,
	});

	return {
		...(imageBorderStatusHover && {
			border: getBorderStyles({
				obj: {
					...getGroupAttributes(
						props,
						['border', 'borderWidth', 'borderRadius'],
						true,
						prefix
					),
				},
				isHover: true,
				blockStyle: props._bs,
				prefix,
			}),
		}),
		...(imageBoxShadowStatusHover && {
			boxShadow: getBoxShadowStyles({
				obj: {
					...getGroupAttributes(props, 'boxShadow', true, prefix),
					...getGroupAttributes(props, 'clipPath'),
					SVGElement: props._se,
				},
				isHover: true,
				blockStyle: props._bs,
				prefix,
			}),
		}),
		...(imageClipPathStatusHover && {
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
					...getGroupAttributes(props, 'boxShadow', false, prefix),
					...getGroupAttributes(props, 'clipPath'),
					SVGElement: props._se,
				},
				dropShadow: true,
				blockStyle: props._bs,
				prefix,
				forClipPath: true,
			}),
		}),
		...(getAttributesValue({
			target: 'bs.sh',
			prefix,
			props,
		}) &&
			isHover && {
				boxShadow: getBoxShadowStyles({
					obj: {
						...getGroupAttributes(props, 'boxShadow', true, prefix),
						...getGroupAttributes(props, 'clipPath'),
						SVGElement: props._se,
					},
					isHover: true,
					dropShadow: true,
					blockStyle: props._bs,
					prefix,
					forClipPath: true,
				}),
			}),
	};

	return response;
};

const getFigcaptionObject = props => {
	const response = {
		...(props._ct !== 'none' && {
			typography: getTypographyStyles({
				obj: {
					...getGroupAttributes(props, 'typography'),
				},
				blockStyle: props._bs,
			}),
		}),
		textAlignment: getAlignmentTextStyles({
			...getGroupAttributes(props, 'textAlignment'),
		}),
		...(props._iw && {
			imgWidth: { g: { width: `${props._iw}%` } },
		}),
		...(() => {
			const response = { captionMargin: {} };
			const { _cpo: captionPosition } = props;

			breakpoints.forEach(breakpoint => {
				const num = getLastBreakpointAttribute({
					target: '_cga',
					breakpoint,
					attributes: props,
				});
				const unit = getLastBreakpointAttribute({
					target: '_cga.u',
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
	const { _se: SVGElement, _cp: clipPath, _ir: imageRatio } = props;

	const response = {
		...(SVGElement && {
			transform: getImageShapeStyles(target, {
				...getGroupAttributes(props, 'imageShape'),
			}),
		}),
		...(clipPath && {
			image: { g: { 'clip-path': clipPath } },
		}),
		...(target === 'svg' && imageRatio && getAspectRatio(imageRatio)),
	};

	return response;
};

const getStyles = props => {
	const { _uid: uniqueID } = props;

	const imgTag = props._se === '' || !props._se ? 'img' : 'svg';

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
						blockStyle: props._bs,
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
						'borderWidth',
						'borderRadius',
					]),
					blockStyle: props._bs,
				}),
				...getBlockBackgroundStyles({
					...getGroupAttributes(props, [
						'blockBackground',
						'border',
						'borderWidth',
						'borderRadius',
					]),
					blockStyle: props._bs,
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
					blockStyle: props._bs,
				}),
				...getCustomFormatsStyles(
					' .maxi-image-block__caption',
					getAttributesValue({ target: '_cf', props }),
					false,
					{ ...getGroupAttributes(props, 'typography') },
					'p',
					props._bs
				),
				...getCustomFormatsStyles(
					':hover .maxi-image-block__caption',
					getAttributesValue({
						target: '_cf.h',
						props,
					}),
					true,
					getGroupAttributes(props, 'typographyHover'),
					'p',
					props._bs
				),
				...getLinkStyles(
					{ ...getGroupAttributes(props, 'link') },
					[' a figcaption.maxi-image-block__caption'],
					props._bs
				),
				...getLinkStyles(
					{ ...getGroupAttributes(props, 'link') },
					[' figcaption.maxi-image-block__caption a'],
					props._bs
				),
			},
			data,
			props
		),
	};

	return response;
};

export default getStyles;
