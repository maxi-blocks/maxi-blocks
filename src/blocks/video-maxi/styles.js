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
	getAspectRatio,
	getBackgroundStyles,
	getBlockBackgroundStyles,
	getBorderStyles,
	getBoxShadowStyles,
	getDisplayStyles,
	getFlexStyles,
	getIconPathStyles,
	getIconSize,
	getIconStyles,
	getMarginPaddingStyles,
	getOpacityStyles,
	getOverflowStyles,
	getSizeStyles,
	getSVGStyles,
	getZIndexStyles,
} from '../../extensions/styles/helpers';
import data from './data';

const breakpoints = ['g', 'xxl', 'xl', 'l', 'm', 's', 'xs'];
const videoPrefix = 'v-';

const getNormalObject = props => {
	const response = {
		boxShadow: getBoxShadowStyles({
			obj: {
				...getGroupAttributes(props, 'boxShadow'),
			},
			blockStyle: props._bs,
		}),
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
		padding: getMarginPaddingStyles({
			obj: { ...getGroupAttributes(props, 'padding') },
		}),
		margin: getMarginPaddingStyles({
			obj: { ...getGroupAttributes(props, 'margin') },
		}),
		opacity: getOpacityStyles({
			...getGroupAttributes(props, 'opacity'),
		}),
		zIndex: getZIndexStyles({
			...getGroupAttributes(props, 'zIndex'),
		}),
		display: getDisplayStyles({
			...getGroupAttributes(props, 'display'),
		}),
		size: getSizeStyles({
			...getGroupAttributes(props, 'size'),
		}),
		overflow: getOverflowStyles({
			...getGroupAttributes(props, 'overflow'),
		}),
		flex: getFlexStyles({
			...getGroupAttributes(props, 'flex'),
		}),
	};

	return response;
};

const getHoverObject = props => {
	const [borderStatusHover, boxShadowStatusHover, opacityStatusHover] =
		getAttributesValue({
			target: ['bo.s', 'bs.s', '_o.s'],
			props,
			isHover: true,
		});

	const response = {
		border:
			borderStatusHover &&
			getBorderStyles({
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
		boxShadow:
			boxShadowStatusHover &&
			getBoxShadowStyles({
				obj: {
					...getGroupAttributes(props, 'boxShadow', true),
				},
				isHover: true,
				blockStyle: props._bs,
			}),
		opacity:
			opacityStatusHover &&
			getOpacityStyles(
				{ ...getGroupAttributes(props, 'opacity', true) },
				true
			),
	};

	return response;
};

const getLightBoxObject = props => {
	const response = {
		...getBackgroundStyles({
			...getGroupAttributes(
				props,
				['background', 'backgroundColor'],
				false,
				'lb-'
			),
			prefix: 'lb-',
			blockStyle: props._bs,
		}),
	};

	return response;
};

const getOverlayImageStyles = props => {
	const prefix = 'om-';

	const response = {
		size: getSizeStyles(
			{
				...getGroupAttributes(props, 'size', false, prefix),
			},
			prefix
		),
		opacity: getOpacityStyles(
			{
				...getGroupAttributes(props, 'opacity', false, prefix),
			},
			false,
			prefix
		),
	};

	return response;
};

const getOverlayBackgroundObject = (props, isHover = false) => {
	const response = {
		...getBackgroundStyles({
			...getGroupAttributes(props, 'videoOverlay'),
			prefix: 'o-',
			blockStyle: props._bs,
			isHover,
		}),
	};

	return response;
};

const getAspectRatioStyles = (props, isPopup = false) => {
	const { _vr: videoRatio, _pra: popupRatio } = props;

	const response = {
		...(isPopup
			? { ...(popupRatio && getAspectRatio(popupRatio)) }
			: { ...(videoRatio && getAspectRatio(videoRatio)) }),
	};

	return response;
};

const getCloseIconPosition = obj => {
	const response = {
		label: 'Icon position',
	};

	const { 'cl-i_pos': iconPosition } = obj;

	// if the icon is spacing from the screen boundaries we want to move it left down,
	// if it is spacing from the video we want to move it top right
	const isSpacingPositive = iconPosition === 'top-screen-right';

	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {};

		const rawIconSpacing = getLastBreakpointAttribute({
			target: 'cl-i_spa',
			breakpoint,
			attributes: obj,
		});
		const iconSpacingUnit = getLastBreakpointAttribute({
			target: 'cl-i_spa.u',
			breakpoint,
			attributes: obj,
		});

		const iconSpacing = isSpacingPositive
			? rawIconSpacing
			: -rawIconSpacing;

		response[breakpoint].top = `${iconSpacing ?? 0}${
			iconSpacingUnit ?? 'px'
		}`;
		response[breakpoint].right = `${iconSpacing ?? 0}${
			iconSpacingUnit ?? 'px'
		}`;
	});

	return {
		iconPosition: {
			response,
		},
	};
};

const getIconObject = (longPrefix, obj) => {
	const shortPrefix = `${longPrefix.slice(0, 2)}-`;
	const { [`${shortPrefix}i.sh`]: iconHoverStatus } = obj;

	return {
		[` .maxi-video-block__${longPrefix}button svg`]: getIconSize(
			obj,
			false,
			shortPrefix
		),
		[` .maxi-video-block__${longPrefix}button svg path`]: getIconPathStyles(
			obj,
			false,
			shortPrefix
		),
		[` .maxi-video-block__${longPrefix}button`]: {
			icon: getIconStyles(obj, obj._bs, false, false, shortPrefix),
			...(longPrefix === 'close-' && {
				iconPosition: getCloseIconPosition(obj),
			}),
		},
		...getSVGStyles({
			obj,
			target: `.maxi-video-block__${longPrefix}button`,
			blockStyle: obj._bs,
			prefix: `${shortPrefix}i-`,
			useIconColor: true,
		}),
		...(iconHoverStatus &&
			(longPrefix === 'play-'
				? {
						[`:hover .maxi-video-block__${longPrefix}button svg`]: {
							...getIconSize(obj, true, shortPrefix),
							icon: getIconStyles(
								obj,
								obj._bs,
								false,
								true,
								shortPrefix
							),
						},
						[`:hover .maxi-video-block__${longPrefix}button svg path`]:
							getIconPathStyles(obj, true, shortPrefix),
						...getSVGStyles({
							obj,
							target: `:hover .maxi-video-block__${longPrefix}button`,
							blockStyle: obj._bs,
							prefix: `${shortPrefix}i-`,
							useIconColor: true,
							isHover: true,
						}),
				  }
				: {
						[` .maxi-video-block__${longPrefix}button:hover svg`]: {
							...getIconSize(obj, true, shortPrefix),
							icon: getIconStyles(
								obj,
								obj._bs,
								false,
								true,
								shortPrefix
							),
						},
						[` .maxi-video-block__${longPrefix}button:hover svg path`]:
							getIconPathStyles(obj, true, shortPrefix),
						...getSVGStyles({
							obj,
							target: ` .maxi-video-block__${longPrefix}button:hover`,
							blockStyle: obj._bs,
							prefix: `${shortPrefix}i-`,
							useIconColor: true,
							isHover: true,
						}),
				  })),
	};
};

const getVideoStyles = (props, isHover = false) => {
	const [borderStatusHover, boxShadowStatusHover] = getAttributesValue({
		target: ['bo.s', 'bs.s'],
		props,
		isHover: true,
		prefix: videoPrefix,
	});

	return {
		...((!isHover || borderStatusHover) && {
			border: getBorderStyles({
				obj: {
					...getGroupAttributes(
						props,
						['border', 'borderWidth', 'borderRadius'],
						isHover,
						videoPrefix
					),
				},
				blockStyle: props._bs,
				prefix: videoPrefix,
				isHover,
			}),
		}),
		...((!isHover || boxShadowStatusHover) && {
			boxShadow: getBoxShadowStyles({
				obj: {
					...getGroupAttributes(
						props,
						'boxShadow',
						isHover,
						videoPrefix
					),
				},
				blockStyle: props._bs,
				prefix: videoPrefix,
				isHover,
			}),
		}),
		...(!isHover && {
			padding: getMarginPaddingStyles({
				obj: {
					...getGroupAttributes(props, 'padding', false, videoPrefix),
				},
				prefix: videoPrefix,
			}),
			size: getSizeStyles(
				{
					...getGroupAttributes(props, 'size', false, videoPrefix),
				},
				videoPrefix
			),
		}),
	};
};

const getStyles = props => {
	const [uniqueID, playerType, overlayBackgroundStatusHover] =
		getAttributesValue({
			target: ['_uid', '_pt', 'o-b.sh'],
			props,
		});

	const response = {
		[uniqueID]: styleProcessor(
			{
				'': getNormalObject(props),
				':hover': getHoverObject(props),
				' .maxi-video-block__popup-wrapper': getLightBoxObject(props),
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
				...(playerType === 'video'
					? {
							' .maxi-video-block__video-player':
								getVideoStyles(props),
							' .maxi-video-block__video-player:hover':
								getVideoStyles(props, true),
							' .maxi-video-block__video-container':
								getAspectRatioStyles(props),
					  }
					: {
							' .maxi-video-block__overlay': {
								...getVideoStyles(props),
								...getAspectRatioStyles(props),
							},
							' .maxi-video-block__overlay:hover': getVideoStyles(
								props,
								true
							),
							' .maxi-video-block__overlay-image':
								getOverlayImageStyles(props),
					  }),
				' .maxi-video-block__overlay-background':
					getOverlayBackgroundObject(props),
				...(overlayBackgroundStatusHover && {
					':hover .maxi-video-block__overlay-background':
						getOverlayBackgroundObject(props, true),
				}),
				...getIconObject('play-', props),
				...getIconObject('close-', props),
			},
			data,
			props
		),
		[`popup-${uniqueID}`]: styleProcessor(
			{
				' .maxi-video-block__popup-wrapper': getLightBoxObject(props),
				' .maxi-video-block__video-container': getAspectRatioStyles(
					props,
					true
				),
				...getIconObject('close-', props),
			},
			data,
			props
		),
	};

	return response;
};

export default getStyles;
