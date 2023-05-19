/**
 * Internal dependencies
 */
import getAttributesValue from '../../attributes/getAttributesValue';
import getBorderStyles from './getBorderStyles';
import getColorRGBAString from '../getColorRGBAString';
import getDisplayStyles from './getDisplayStyles';
import getGroupAttributes from '../../attributes/getGroupAttributes';
import getImageShapeStyles from './getImageShapeStyles';
import getLastBreakpointAttribute from '../../attributes/getLastBreakpointAttribute';
import getPaletteAttributes from '../../attributes/getPaletteAttributes';

/**
 * External dependencies
 */
import {
	compact,
	isEmpty,
	isNil,
	isNumber,
	merge,
	pickBy,
	round,
	toNumber,
} from 'lodash';
import getAttributeKey from '../../attributes/getAttributeKey';
import { axisDictionary, sizeDictionary } from '../../attributes/constants';

const BREAKPOINTS = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 * Clean BackgroundControl object for being delivered for styling
 *
 * @param {Object} background BackgroundControl related object
 */
export const getColorBackgroundObject = ({
	isHover = false,
	prefix = '',
	blockStyle,
	isButton = false,
	isIcon = false,
	isIconInherit = false,
	breakpoint = 'general',
	scValues = {},
	backgroundColorProperty = 'background-color',
	...props
}) => {
	const hoverStatus = getAttributesValue({
		target: 'b.sh',
		props,
	});

	const {
		'hover-background-color-global': isActive,
		'hover-background-color-all': affectAll,
	} = scValues;
	const globalHoverStatus = isActive && affectAll;

	if (isHover && !isNil(hoverStatus) && !hoverStatus && !globalHoverStatus)
		return {};

	const response = {
		label: 'Background Color',
		[breakpoint]: {},
	};

	const backgroundActiveMedia = getAttributesValue({
		target: 'b_am',
		props,
	});

	const { paletteStatus, paletteColor, paletteOpacity, color } =
		getPaletteAttributes({
			obj: props,
			prefix: getAttributeKey('bc-', false, prefix),
			isHover,
			breakpoint,
		});

	const [bgClipPath, isBgColorClipPathActive] = getLastBreakpointAttribute({
		target: ['bc_cp', 'bc_cp.s'],
		breakpoint,
		attributes: props,
		isHover,
		prefix,
	});

	if (!paletteStatus && !isEmpty(color))
		response[breakpoint][backgroundColorProperty] = color;
	else if (paletteStatus && (paletteColor || paletteOpacity)) {
		if (isButton && (!isHover || hoverStatus || globalHoverStatus))
			response[breakpoint].background = getColorRGBAString({
				firstVar: `button-background-color${isHover ? '-hover' : ''}`,
				secondVar: `color-${paletteColor}`,
				opacity: paletteOpacity,
				blockStyle,
			});
		else
			response[breakpoint][backgroundColorProperty] = getColorRGBAString({
				firstVar: `color-${paletteColor}`,
				opacity: paletteOpacity,
				blockStyle,
			});
	}

	if (isIconInherit) {
		const hasBackground =
			!!backgroundActiveMedia && backgroundActiveMedia !== 'none';

		if (hasBackground)
			response[breakpoint][backgroundColorProperty] =
				backgroundActiveMedia !== '' && paletteStatus
					? getColorRGBAString({
							firstVar: `button-background-color${
								isHover ? '-hover' : ''
							}`,
							secondVar: `color-${paletteColor}`,
							opacity: paletteOpacity,
							blockStyle,
					  })
					: color;
		else response[breakpoint][backgroundColorProperty] = '';
	}

	if (!isIconInherit && isIcon)
		response[breakpoint].background = paletteStatus
			? getColorRGBAString({
					firstVar: `color-${paletteColor}`,
					opacity: paletteOpacity,
					blockStyle,
			  })
			: color;
	else if (isIcon) {
		const hasBackground =
			!!backgroundActiveMedia && backgroundActiveMedia !== 'none';

		const { paletteColor, paletteOpacity, color } = getPaletteAttributes({
			obj: props,
			prefix: 'bt-bc',
			isHover,
			breakpoint,
		});

		if (hasBackground)
			response[breakpoint].background = paletteStatus
				? getColorRGBAString({
						firstVar: `color-${paletteColor}`,
						opacity: paletteOpacity,
						blockStyle,
				  })
				: color;
		else response[breakpoint].background = '';
	}

	if (isBgColorClipPathActive)
		response[breakpoint]['clip-path'] = isEmpty(bgClipPath)
			? 'none'
			: bgClipPath;

	return response;
};

export const getGradientBackgroundObject = ({
	isHover = false,
	prefix = '',
	breakpoint = 'general',
	isIcon = false,
	blockStyle,
	isButton,
	isIconInherit,
	scValues,
	...props
}) => {
	const response = {
		label: 'Background gradient',
		[breakpoint]: {},
	};

	const [
		bgGradientOpacity,
		bgGradient,
		bgGradientClipPath,
		isBgGradientClipPathActive,
		backgroundActiveMedia,
	] = getLastBreakpointAttribute({
		target: ['bg_o', 'bg_c', 'bg_cp', 'bg_cp.s', 'b_am'],
		prefix,
		breakpoint,
		attributes: props,
		isHover,
	});

	if ((isIcon && backgroundActiveMedia === 'gradient') || !isIcon) {
		if (
			isNumber(bgGradientOpacity) &&
			!isEmpty(bgGradient) &&
			bgGradient !== 'undefined'
		) {
			response[breakpoint].background = bgGradient;

			if (bgGradientOpacity < 1) {
				const colorRegex =
					/rgba?\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})(?:,\s*(\d(?:\.\d+)?))?\)/g;

				const matches = bgGradient.match(colorRegex);
				if (matches) {
					matches.forEach(match => {
						let colorOpacity = 1;

						const isRgba = match.includes('rgba');
						if (isRgba)
							colorOpacity = toNumber(
								match.split(',')[3].replace(')', '')
							);

						const newMatch = match.replace(
							colorRegex,
							`rgba($1,$2,$3,${round(
								colorOpacity * bgGradientOpacity,
								2
							)})`
						);
						response[breakpoint].background = response[
							breakpoint
						].background.replace(match, newMatch);
					});
				}
			}
		} else if (!isIcon) {
			const colorBackground = getColorBackgroundObject({
				...getGroupAttributes(
					props,
					['background', 'backgroundColor'],
					isHover,
					prefix
				),
				blockStyle,
				isButton,
				breakpoint,
				isHover,
				prefix,
				isIconInherit,
				scValues,
			});

			const background =
				colorBackground[breakpoint].background ??
				colorBackground[breakpoint]['background-color'];

			if (background) response[breakpoint].background = background;
		}

		if (isBgGradientClipPathActive)
			response[breakpoint]['clip-path'] = isEmpty(bgGradientClipPath)
				? 'none'
				: bgGradientClipPath;
	}

	return response;
};

export const getImageBackgroundObject = ({
	isHover = false,
	prefix = '',
	breakpoint,
	isParallax = false,
	ignoreMediaAttributes = false,
	...props
}) => {
	const response = {
		label: 'Background Image',
		[breakpoint]: {},
	};

	const bgImageUrl = getAttributesValue({
		target: 'bi_mu',
		props,
		prefix,
	});

	if (isEmpty(bgImageUrl) && !ignoreMediaAttributes) return {};

	const getBgImageAttributeValue = (target, isHoverParam = isHover) =>
		getAttributesValue({
			target,
			isHover: isHoverParam,
			prefix,
			breakpoint,
			props,
		});
	const getBgImageLastBreakpointAttribute = target =>
		getLastBreakpointAttribute({
			target,
			prefix,
			breakpoint,
			attributes: props,
			isHover,
		});

	const bgImageSize = getLastBreakpointAttribute({
		target: 'bi_si',
		prefix,
		breakpoint,
		attributes: props,
		isHover,
	});
	const bgImageCropOptions = getBgImageAttributeValue('bi_co');
	const bgImageRepeat = getBgImageAttributeValue('bi_re');
	const bgImagePosition = getLastBreakpointAttribute({
		target: 'bi_pos',
		prefix,
		breakpoint,
		attributes: props,
		isHover,
	});
	const bgImageOrigin = getBgImageAttributeValue('bi_ori');
	const bgImageClip = getBgImageAttributeValue('bi_clp');
	const bgImageAttachment = getBgImageAttributeValue('bi_at');
	const bgImageOpacity = getBgImageAttributeValue('bi_o');

	const bgImageClipPath = getLastBreakpointAttribute({
		target: 'bi_cp',
		prefix,
		breakpoint,
		attributes: props,
		isHover,
	});

	const isBGImageClipPathActive = getLastBreakpointAttribute({
		target: 'bi_cp.s',
		prefix,
		breakpoint,
		attributes: props,
		isHover,
	});

	if (!isParallax) {
		// Image
		if (breakpoint === 'general') {
			if (bgImageSize === 'custom' && !isNil(bgImageCropOptions)) {
				response[breakpoint][
					'background-image'
				] = `url('${bgImageCropOptions.image.source_url}')`;
			} else if (
				(bgImageSize === 'custom' && isNil(bgImageCropOptions)) ||
				(bgImageSize !== 'custom' && !isNil(bgImageUrl))
			) {
				response[breakpoint][
					'background-image'
				] = `url('${bgImageUrl}')`;
			}
		}

		// Size
		if (bgImageSize !== 'custom') {
			if (!isNil(response[breakpoint]['background-size']))
				response[breakpoint][
					'background-size'
				] = `${response[breakpoint]['background-size']},${bgImageSize}`;
			else response[breakpoint]['background-size'] = bgImageSize;
		} else if (!isNil(response[breakpoint]['background-size']))
			response[breakpoint][
				'background-size'
			] = `${response[breakpoint]['background-size']},cover`;
		else response[breakpoint]['background-size'] = 'cover';

		// Repeat
		if (bgImageRepeat)
			response[breakpoint]['background-repeat'] = bgImageRepeat;

		// Position
		if (bgImagePosition !== 'custom')
			response[breakpoint]['background-position'] = bgImagePosition;
		else {
			const bgImagePositionWidth =
				getBgImageLastBreakpointAttribute('bi_pos_w');
			const bgImagePositionWidthUnit =
				getBgImageLastBreakpointAttribute('bi_pos_w.u');
			const bgImagePositionHeight =
				getBgImageLastBreakpointAttribute('bi_pos_h');
			const bgImagePositionHeightUnit =
				getBgImageLastBreakpointAttribute('bi_pos_h.u');
			response[breakpoint][
				'background-position'
			] = `${bgImagePositionWidth}${bgImagePositionWidthUnit} ${bgImagePositionHeight}${bgImagePositionHeightUnit}`;
		}

		// Origin
		if (bgImageOrigin)
			response[breakpoint]['background-origin'] = bgImageOrigin;

		// Clip
		if (bgImageClip) response[breakpoint]['background-clip'] = bgImageClip;

		// Attachment
		if (bgImageAttachment) {
			if (!isNil(response[breakpoint]['background-attachment']))
				response[breakpoint][
					'background-attachment'
				] = `${response[breakpoint]['background-attachment']},${bgImageAttachment}`;
			else
				response[breakpoint]['background-attachment'] =
					bgImageAttachment;
		}
	} else {
		if (bgImageSize !== 'custom')
			response[breakpoint]['object-fit'] = bgImageSize;
		else response[breakpoint]['object-fit'] = 'cover';

		// Position
		if (bgImagePosition !== 'custom')
			response[breakpoint]['object-position'] = bgImagePosition;
		else {
			const bgImagePositionWidth =
				getBgImageLastBreakpointAttribute('bi_pos_w');
			const bgImagePositionWidthUnit =
				getBgImageLastBreakpointAttribute('bi_pos_w.u');
			const bgImagePositionHeight =
				getBgImageLastBreakpointAttribute('bi_pos_h');
			const bgImagePositionHeightUnit =
				getBgImageLastBreakpointAttribute('bi_pos_h.u');
			response[breakpoint][
				'object-position'
			] = `${bgImagePositionWidth}${bgImagePositionWidthUnit} ${bgImagePositionHeight}${bgImagePositionHeightUnit}`;
		}
	}

	// Opacity
	if (isNumber(bgImageOpacity)) {
		response[breakpoint].opacity = bgImageOpacity;

		// To avoid image blinking on opacity hover
		if (!isHover) {
			const bgImageOpacityHover = getBgImageAttributeValue('bi_o', true);

			if (isNumber(bgImageOpacityHover))
				response[breakpoint]['-webkit-transform'] =
					'translate3d(0,0,0)';
		}
	}

	// Clip-path
	if (isBGImageClipPathActive)
		response[breakpoint]['clip-path'] = isEmpty(bgImageClipPath)
			? 'none'
			: bgImageClipPath;

	return response;
};

export const getVideoBackgroundObject = ({
	isHover = false,
	prefix = '',
	breakpoint,
	...props
}) => {
	const response = {
		label: 'Video Background',
		[breakpoint]: {},
	};

	const [bgVideoOpacity, bgVideoClipPath, bgVideoFallbackUrl] =
		getLastBreakpointAttribute({
			target: ['bv_o', 'bv_cp', 'bv_fu'],
			breakpoint,
			attributes: props,
			isHover,
			prefix,
		});

	// Opacity
	if (isNumber(bgVideoOpacity)) response[breakpoint].opacity = bgVideoOpacity;

	// Clip-path
	if (!isNil(bgVideoClipPath))
		response[breakpoint]['clip-path'] = isEmpty(bgVideoClipPath)
			? 'none'
			: bgVideoClipPath;

	// Fallback URL
	if (!isEmpty(bgVideoFallbackUrl)) {
		response[breakpoint].background = `url(${bgVideoFallbackUrl})`;
		response[breakpoint]['background-size'] = 'cover';
	}

	return response;
};

const getWrapperObject = ({
	breakpoint,
	isHover = false,
	prefix = '',
	...props
}) => {
	const response = {
		label: 'Background layer wrapper',
		[breakpoint]: {},
	};

	['_w', '_h'].forEach(size => {
		const bgSize = getLastBreakpointAttribute({
			target: size,
			breakpoint,
			attributes: props,
			isHover,
			prefix,
		});

		if (isNumber(bgSize)) {
			const bgSVGSizeUnit = getLastBreakpointAttribute({
				target: `${size}.u`,
				breakpoint,
				attributes: props,
				isHover,
				prefix,
			});

			response[breakpoint][
				sizeDictionary[size]
			] = `${bgSize}${bgSVGSizeUnit}`;
		}
	});

	const axisWords = Object.keys(axisDictionary);

	axisWords.forEach(axis => {
		const [positionValue, positionUnit] = getLastBreakpointAttribute({
			target: [`_pos${axis}`, `_pos${axis}.u`],
			breakpoint,
			attributes: props,
			isHover,
			prefix,
		});

		if (!isNil(positionValue) && !isNil(positionUnit)) {
			response[breakpoint][axisDictionary[axis]] =
				positionValue === 'auto'
					? 'auto'
					: `${positionValue}${positionUnit}`;
		}
	});

	return !isEmpty(response[breakpoint]) ? response : {};
};

const getSVGBackgroundObject = ({
	blockStyle,
	breakpoint,
	isHover,
	...props
}) => {
	const response = {
		label: 'Icon background',
		[breakpoint]: {},
	};

	const { paletteStatus, paletteColor, paletteOpacity, color } =
		getPaletteAttributes({
			obj: props,
			prefix: 'bsv',
			isHover,
			breakpoint,
		});

	if (paletteStatus)
		response[breakpoint].fill = getColorRGBAString({
			firstVar: `color-${paletteColor}`,
			opacity: paletteOpacity,
			blockStyle,
		});
	else response[breakpoint].fill = color;

	return response;
};

const getBackgroundLayers = ({
	response,
	layers,
	target,
	isHover = false,
	blockStyle,
	prefix,
	breakpoint,
	ignoreMediaAttributes,
}) => {
	layers.forEach(layer => {
		const { type } = layer;

		const layerTarget = `${target} > .maxi-background-displayer .maxi-background-displayer__${layer.order}`;

		switch (type) {
			case 'color':
				response[layerTarget] = {
					...response[layerTarget],
					[type]: {
						...merge(
							response?.[layerTarget]?.[type],
							getWrapperObject({
								...getGroupAttributes(
									layer,
									'backgroundColor',
									isHover
								),
								breakpoint,
								prefix: 'bcw',
								isHover,
							}),
							getColorBackgroundObject({
								...getGroupAttributes(
									layer,
									'backgroundColor',
									isHover
								),
								isHover,
								prefix,
								blockStyle,
								breakpoint,
							}),
							getDisplayStyles(
								{
									...getGroupAttributes(
										layer,
										'display',
										isHover
									),
								},
								isHover
							)
						),
					},
				};
				break;
			case 'gradient':
				response[layerTarget] = {
					...response[layerTarget],
					[type]: {
						...merge(
							response?.[layerTarget]?.[type],
							getGradientBackgroundObject({
								...getGroupAttributes(
									layer,
									'backgroundGradient',
									isHover
								),
								isHover,
								prefix,
								blockStyle,
								breakpoint,
							}),
							getWrapperObject({
								...getGroupAttributes(
									layer,
									'backgroundGradient',
									isHover
								),
								breakpoint,
								prefix: 'bgw',
								isHover,
							}),
							getDisplayStyles(
								{
									...getGroupAttributes(
										layer,
										'display',
										isHover
									),
								},
								isHover
							)
						),
					},
				};
				break;
			case 'image': {
				const parallaxStatus = getAttributesValue({
					target: 'bi_pa.s',
					props: layer,
					prefix,
				});

				if (!parallaxStatus)
					response[layerTarget] = {
						...response[layerTarget],
						[type]: {
							...merge(
								response?.[layerTarget]?.[type],
								getImageBackgroundObject({
									...getGroupAttributes(
										layer,
										'backgroundImage',
										isHover
									),
									...(!isHover &&
										pickBy(
											getGroupAttributes(
												layer,
												'backgroundImage',
												true
											),
											(value, key) =>
												key.includes('bi_o') &&
												key.includes('.h')
										)),
									isHover,
									prefix,
									breakpoint,
									isParallax: parallaxStatus,
									ignoreMediaAttributes,
								}),
								getWrapperObject({
									...getGroupAttributes(
										layer,
										'backgroundImage',
										isHover
									),
									breakpoint,
									prefix: 'biw',
									isHover,
								}),
								getDisplayStyles(
									{
										...getGroupAttributes(
											layer,
											'display',
											isHover
										),
									},
									isHover
								)
							),
						},
					};
				else {
					response[layerTarget] = {
						...response[layerTarget],
						[type]: {
							...merge(
								response?.[layerTarget]?.[type],
								getDisplayStyles(
									{
										...getGroupAttributes(
											layer,
											'display',
											isHover
										),
									},
									isHover
								)
							),
						},
					};
					response[`${layerTarget} img`] = {
						...response[`${layerTarget} img`],
						[type]: {
							...merge(
								response?.[`${layerTarget} img`]?.[type],
								getImageBackgroundObject({
									...getGroupAttributes(
										layer,
										'backgroundImage',
										isHover
									),
									isHover,
									prefix,
									breakpoint,
									isParallax: parallaxStatus,
								}),
								getDisplayStyles(
									{
										...getGroupAttributes(
											layer,
											'display',
											isHover
										),
									},
									isHover
								)
							),
						},
					};
				}
				break;
			}
			case 'video':
				response[layerTarget] = {
					...response[layerTarget],
					[type]: {
						...merge(
							response?.[layerTarget]?.[type],
							getVideoBackgroundObject({
								...getGroupAttributes(
									layer,
									'backgroundVideo',
									isHover
								),
								isHover,
								prefix,
								breakpoint,
							}),
							getWrapperObject({
								...getGroupAttributes(
									layer,
									'backgroundVideo',
									isHover
								),
								breakpoint,
								prefix: 'bvw',
								isHover,
							}),
							getDisplayStyles(
								{
									...getGroupAttributes(
										layer,
										'display',
										isHover
									),
								},
								isHover
							)
						),
					},
				};
				break;
			case 'shape':
				response[layerTarget] = {
					...response[layerTarget],
					[type]: {
						...merge(
							response?.[layerTarget]?.[type],
							getWrapperObject({
								...getGroupAttributes(
									layer,
									'backgroundSVG',
									isHover
								),
								breakpoint,
								prefix: 'bsv',
								isHover,
							}),
							getDisplayStyles(
								{
									...getGroupAttributes(
										layer,
										'display',
										isHover
									),
								},
								isHover
							)
						),
					},
				};
				response[`${layerTarget} svg *`] = {
					...response[`${layerTarget} svg *`],
					[type]: {
						...merge(
							response?.[`${layerTarget} svg *`]?.[type],
							getSVGBackgroundObject({
								...getGroupAttributes(
									layer,
									'backgroundSVG',
									isHover
								),
								blockStyle,
								breakpoint,
								isHover,
							})
						),
					},
				};
				if (breakpoint === 'general') {
					response[`${layerTarget} > svg:first-child`] = {
						...response[`${layerTarget} > svg:first-child`],
						[type]: {
							...merge(
								response?.[
									`${layerTarget} > svg:first-child`
								]?.[type],
								...getImageShapeStyles(
									'svg',
									getGroupAttributes(
										layer,
										'imageShape',
										false,
										'bsv'
									),
									'bsv'
								)
							),
						},
					};
					response[`${layerTarget} > svg:first-child pattern image`] =
						{
							...response[
								`${layerTarget} > svg:first-child pattern image`
							],
							[type]: {
								...merge(
									response?.[
										`${layerTarget} > svg:first-child pattern image`
									]?.[type],
									...getImageShapeStyles(
										'image',
										getGroupAttributes(
											layer,
											'imageShape',
											false,
											'bsv-'
										),
										'bsv'
									)
								),
							},
						};
				}
				break;
			default:
				break;
		}
	});

	return response;
};

const getGeneralBackgroundStyles = (
	props,
	borderProps,
	blockStyle,
	isHover
) => {
	const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];
	const size = {};

	const getBorderValue = (target, breakpoint, forceIsHover = null) => {
		const lastValue = getLastBreakpointAttribute({
			target,
			breakpoint,
			attributes: props,
			avoidXXL: !isHover,
			isHover: forceIsHover ?? isHover,
			prefix: 'bo_w',
		});

		return isNumber(lastValue) ? lastValue : 2;
	};

	const border = getBorderStyles({
		obj: borderProps,
		blockStyle,
		isHover,
	});

	if (!isEmpty(props)) {
		breakpoints.forEach(breakpoint => {
			let widthTop;
			let widthBottom;
			let widthLeft;
			let widthRight;

			const borderStyle = getAttributesValue({
				target: 'bo_s',
				breakpoint,
				props,
			});
			const borderStyleGeneral = getAttributesValue({
				target: 'bo_s',
				breakpoint: 'general',
				props,
			});

			if (
				borderStyleGeneral !== 'none' &&
				((borderStyle && borderStyle !== 'none') || borderStyleGeneral)
			) {
				widthTop = getBorderValue('.t', breakpoint);
				widthBottom = getBorderValue('.b', breakpoint);
				widthLeft = getBorderValue('.l', breakpoint);
				widthRight = getBorderValue('.r', breakpoint);
			}

			const widthUnit =
				getLastBreakpointAttribute({
					target: 'bo_w.u',
					breakpoint,
					attributes: props,
				}) || 'px';

			if (
				border[breakpoint]['border-style'] ||
				Number.isFinite(widthTop) ||
				Number.isFinite(widthBottom) ||
				Number.isFinite(widthLeft) ||
				Number.isFinite(widthRight)
			) {
				const getSize = (width, target) => {
					if (!Number.isFinite(width)) return null;

					if (isHover) {
						const isSameThanNormal =
							getBorderValue(target, breakpoint, false) === width;

						if (isSameThanNormal) {
							return null;
						}
					}
					return {
						[axisDictionary[target]]: -round(width, 2) + widthUnit,
					};
				};

				size[breakpoint] = {
					...getSize(widthTop, '.t'),
					...getSize(widthBottom, '.b'),
					...getSize(widthLeft, '.l'),
					...getSize(widthRight, '.r'),
				};
			}
		});
	}

	breakpoints.forEach(breakpoint => {
		const breakpointStyle = border[breakpoint]['border-style'];

		if (!breakpointStyle) return;

		if (border[breakpoint]['border-top-width'])
			border[breakpoint]['border-top-style'] = breakpointStyle;

		if (border[breakpoint]['border-right-width'])
			border[breakpoint]['border-right-style'] = breakpointStyle;

		if (border[breakpoint]['border-bottom-width'])
			border[breakpoint]['border-bottom-style'] = breakpointStyle;

		if (border[breakpoint]['border-left-width'])
			border[breakpoint]['border-left-style'] = breakpointStyle;
	});

	delete border.general['border-style'];

	// Clean size object
	if (!isEmpty(size))
		[...breakpoints].reverse().forEach(breakpoint => {
			if (
				size[breakpoints[breakpoints.indexOf(breakpoint) - 1]]?.top ===
				size[breakpoint]?.top
			)
				delete size[breakpoint]?.top;
			if (
				size[breakpoints[breakpoints.indexOf(breakpoint) - 1]]?.left ===
				size[breakpoint]?.left
			)
				delete size[breakpoint]?.left;
			if (
				size[breakpoints[breakpoints.indexOf(breakpoint) - 1]]
					?.bottom === size[breakpoint]?.bottom
			)
				delete size[breakpoint]?.bottom;
			if (
				size[breakpoints[breakpoints.indexOf(breakpoint) - 1]]
					?.right === size[breakpoint]?.right
			)
				delete size[breakpoint]?.right;

			if (
				isEmpty(size[breakpoints[breakpoints.indexOf(breakpoint) - 1]])
			) {
				delete size[breakpoints[breakpoints.indexOf(breakpoint) - 1]];
			}
			if (isEmpty(size[breakpoint])) {
				delete size[breakpoint];
			}
		});

	return { border, ...(!isEmpty(size) && { size }) };
};

const getBasicResponseObject = ({
	target,
	isHover,
	prefix,
	blockStyle,
	rowBorderRadius,
	...props
}) => {
	const includeBorder =
		!isHover ||
		(isHover &&
			getAttributesValue({
				target: 'bo.s',
				props,
				isHover,
				prefix,
			}));

	const borderObj =
		includeBorder &&
		getGeneralBackgroundStyles(
			props,
			{
				...getGroupAttributes(
					props,
					['border', 'borderRadius', 'borderWidth'],
					isHover
				),
			},
			blockStyle,
			isHover
		);
	const rowBorderRadiusObj = getGeneralBackgroundStyles(
		rowBorderRadius,
		{ ...rowBorderRadius },
		blockStyle,
		isHover
	);
	const mergedBorderObj = merge(rowBorderRadiusObj, borderObj);

	return {
		[`${target} > .maxi-background-displayer`]:
			includeBorder && !isEmpty(borderObj.general)
				? mergedBorderObj
				: rowBorderRadiusObj,
	};
};

export const getBlockBackgroundStyles = ({
	target: rawTarget,
	isHover = false,
	prefix = '',
	blockStyle,
	rowBorderRadius = {},
	ignoreMediaAttributes,
	...props
}) => {
	const target = `${rawTarget ?? ''}${isHover ? ':hover' : ''}`;

	let response = getBasicResponseObject({
		target,
		isHover,
		prefix,
		blockStyle,
		rowBorderRadius,
		...props,
	});

	if (
		isHover &&
		!getAttributesValue({
			target: 'bb.s',
			props,
			isHover,
			prefix,
		})
	)
		return response;

	const layers = compact([
		...getAttributesValue({
			target: 'b_ly',
			props,
			prefix,
		}),
		...(isHover && [
			...getAttributesValue({
				target: 'b_ly',
				props,
				prefix,
				isHover,
			}),
		]),
	]);

	if (layers && layers.length > 0)
		BREAKPOINTS.forEach(breakpoint => {
			response = {
				...merge(
					{ ...response },
					{
						...getBackgroundLayers({
							response,
							layers,
							target,
							isHover,
							blockStyle,
							prefix,
							breakpoint,
							ignoreMediaAttributes,
						}),
					}
				),
			};
		});

	return response;
};

export const getBackgroundStyles = ({
	isHover = false,
	prefix = '',
	isButton = false,
	blockStyle,
	isIconInherit = false,
	scValues = {},
	backgroundColorProperty,
	...props
}) => {
	const response = {};

	BREAKPOINTS.forEach(breakpoint => {
		const currentActiveMedia = getLastBreakpointAttribute({
			target: 'b_am',
			prefix,
			breakpoint,
			attributes: props,
			isHover,
		});

		if (!currentActiveMedia) return;

		merge(response, {
			...(currentActiveMedia === 'color' && {
				background: getColorBackgroundObject({
					...getGroupAttributes(
						props,
						['background', 'backgroundColor'],
						isHover,
						prefix
					),
					blockStyle,
					isButton,
					breakpoint,
					isHover,
					prefix,
					isIconInherit,
					scValues,
					backgroundColorProperty,
				}),
			}),
			...(currentActiveMedia === 'gradient' && {
				background: getGradientBackgroundObject({
					...getGroupAttributes(
						props,
						['backgroundColor', 'backgroundGradient'],
						isHover,
						prefix
					),
					blockStyle,
					isButton,
					breakpoint,
					isHover,
					prefix,
					isIconInherit,
					scValues,
				}),
			}),
		});
	});

	return response;
};
