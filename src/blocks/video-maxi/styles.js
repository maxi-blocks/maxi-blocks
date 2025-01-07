/**
 * Internal dependencies
 */
import {
	getGroupAttributes,
	getLastBreakpointAttribute,
	styleProcessor,
} from '@extensions/styles';
import {
	getBlockBackgroundStyles,
	getBoxShadowStyles,
	getZIndexStyles,
	getDisplayStyles,
	getMarginPaddingStyles,
	getBackgroundStyles,
	getBorderStyles,
	getOpacityStyles,
	getOverflowStyles,
	getFlexStyles,
	getSizeStyles,
	getIconPathStyles,
	getIconStyles,
	getAspectRatio,
	getSVGStyles,
	getIconSize,
} from '@extensions/styles/helpers';
import data from './data';

const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];
const videoPrefix = 'video-';

const getNormalObject = props => {
	const response = {
		boxShadow: getBoxShadowStyles({
			obj: {
				...getGroupAttributes(props, 'boxShadow'),
			},
			blockStyle: props.blockStyle,
		}),
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
				blockStyle: props.blockStyle,
			}),
		boxShadow:
			props['box-shadow-status-hover'] &&
			getBoxShadowStyles({
				obj: {
					...getGroupAttributes(props, 'boxShadow', true),
				},
				isHover: true,
				blockStyle: props.blockStyle,
			}),
		opacity:
			props['opacity-status-hover'] &&
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
				'lightbox-'
			),
			prefix: 'lightbox-',
			blockStyle: props.blockStyle,
		}),
	};

	return response;
};

const getOverlayImageStyles = props => {
	const prefix = 'overlay-media-';

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
			prefix: 'overlay-',
			blockStyle: props.blockStyle,
			isHover,
		}),
	};

	return response;
};

const getAspectRatioStyles = (props, isPopup = false) => {
	const { popupRatio, popupRatioCustom, videoRatio, videoRatioCustom } =
		props;

	const response = {
		...(isPopup
			? {
					...(popupRatio &&
						getAspectRatio(popupRatio, popupRatioCustom)),
			  }
			: {
					...(videoRatio &&
						getAspectRatio(videoRatio, videoRatioCustom)),
			  }),
	};

	return response;
};

const getCloseIconPosition = obj => {
	const response = {
		label: 'Icon position',
	};

	const { 'close-icon-position': iconPosition } = obj;

	// if the icon is spacing from the screen boundaries we want to move it left down,
	// if it is spacing from the video we want to move it top right
	const isSpacingPositive = iconPosition === 'top-screen-right';

	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {};

		const rawIconSpacing = getLastBreakpointAttribute({
			target: 'close-icon-spacing',
			breakpoint,
			attributes: obj,
		});
		const iconSpacingUnit = getLastBreakpointAttribute({
			target: 'close-icon-spacing-unit',
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

const getIconObject = (prefix, obj) => {
	const { [`${prefix}icon-status-hover`]: iconHoverStatus } = obj;

	return {
		[` .maxi-video-block__${prefix}button svg`]: getIconSize(
			obj,
			false,
			prefix
		),
		[` .maxi-video-block__${prefix}button svg path`]: getIconPathStyles(
			obj,
			false,
			prefix
		),
		[` .maxi-video-block__${prefix}button`]: {
			icon: getIconStyles(obj, obj.blockStyle, false, false, prefix),
			...(prefix === 'close-' && {
				iconPosition: getCloseIconPosition(obj),
			}),
		},
		...getSVGStyles({
			obj,
			target: ` .maxi-video-block__${prefix}button`,
			blockStyle: obj.blockStyle,
			prefix: `${prefix}icon-`,
			useIconColor: true,
		}),
		...(iconHoverStatus &&
			(prefix === 'play-'
				? {
						[`:hover .maxi-video-block__${prefix}button svg`]: {
							...getIconSize(obj, true, prefix),
							icon: getIconStyles(
								obj,
								obj.blockStyle,
								false,
								true,
								prefix
							),
						},
						[`:hover .maxi-video-block__${prefix}button svg path`]:
							getIconPathStyles(obj, true, prefix),
						...getSVGStyles({
							obj,
							target: `:hover .maxi-video-block__${prefix}button`,
							blockStyle: obj.blockStyle,
							prefix: `${prefix}icon-`,
							useIconColor: true,
							isHover: true,
						}),
				  }
				: {
						[` .maxi-video-block__${prefix}button:hover svg`]: {
							...getIconSize(obj, true, prefix),
							icon: getIconStyles(
								obj,
								obj.blockStyle,
								false,
								true,
								prefix
							),
						},
						[` .maxi-video-block__${prefix}button:hover svg path`]:
							getIconPathStyles(obj, true, prefix),
						...getSVGStyles({
							obj,
							target: ` .maxi-video-block__${prefix}button:hover`,
							blockStyle: obj.blockStyle,
							prefix: `${prefix}icon-`,
							useIconColor: true,
							isHover: true,
						}),
				  })),
	};
};

const getVideoStyles = (props, isHover = false) => {
	return {
		...((!isHover || props[`${videoPrefix}border-status-hover`]) && {
			border: getBorderStyles({
				obj: {
					...getGroupAttributes(
						props,
						['border', 'borderWidth', 'borderRadius'],
						isHover,
						videoPrefix
					),
				},
				blockStyle: props.blockStyle,
				prefix: videoPrefix,
				isHover,
			}),
		}),
		...((!isHover || props[`${videoPrefix}box-shadow-status-hover`]) && {
			boxShadow: getBoxShadowStyles({
				obj: {
					...getGroupAttributes(
						props,
						'boxShadow',
						isHover,
						videoPrefix
					),
				},
				blockStyle: props.blockStyle,
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
	const { uniqueID, playerType } = props;

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
				...(props['overlay-background-status-hover'] && {
					':hover .maxi-video-block__overlay-background':
						getOverlayBackgroundObject(props, true),
				}),
				...getIconObject('play-', props),
				...getIconObject('close-', props),
			},
			data,
			props
		),
		...(playerType === 'popup' && {
			[`popup-${uniqueID}`]: styleProcessor(
				{
					' .maxi-video-block__popup-wrapper':
						getLightBoxObject(props),
					' .maxi-video-block__video-container': getAspectRatioStyles(
						props,
						true
					),
					...getIconObject('close-', props),
				},
				data,
				props
			),
		}),
	};

	return response;
};

export default getStyles;
