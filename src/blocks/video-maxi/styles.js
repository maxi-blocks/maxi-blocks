/**
 * Internal dependencies
 */
import {
	getGroupAttributes,
	getLastBreakpointAttribute,
	styleProcessor,
} from '../../extensions/styles';
import {
	getBoxShadowStyles,
	getZIndexStyles,
	getDisplayStyles,
	getMarginPaddingStyles,
	getBorderStyles,
	getOpacityStyles,
	getOverflowStyles,
	getFlexStyles,
	getSizeStyles,
	getBackgroundStyles,
	getIconPathStyles,
	getIconStyles,
	getAspectRatio,
	getSVGStyles,
	getIconSize,
} from '../../extensions/styles/helpers';
import { selectorsVideo } from './custom-css';
import transitionObj from './transitionObj';

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

const getVideoContainerOject = props => {
	const { videoRatio } = props;

	const response = {
		...(videoRatio && getAspectRatio(videoRatio)),
	};

	return response;
};

const getVideoPlayerStyles = (props, isHover = false) => {
	const { playerType } = props;

	const response =
		playerType === 'video'
			? {
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
					padding: getMarginPaddingStyles({
						obj: {
							...getGroupAttributes(
								props,
								'padding',
								false,
								videoPrefix
							),
						},
						prefix: videoPrefix,
					}),
					size: getSizeStyles(
						{
							...getGroupAttributes(
								props,
								'size',
								false,
								videoPrefix
							),
						},
						videoPrefix
					),
			  }
			: {};

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
			target: `.maxi-video-block__${prefix}button`,
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

const getOverlayStyles = (props, isHover = false) => {
	return {
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
		boxShadow: getBoxShadowStyles({
			obj: {
				...getGroupAttributes(props, 'boxShadow', isHover, videoPrefix),
			},
			blockStyle: props.blockStyle,
			prefix: videoPrefix,
			isHover,
		}),
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
	};
};

const getStyles = props => {
	const { uniqueID } = props;

	const response = {
		[uniqueID]: styleProcessor(
			{
				'': getNormalObject(props),
				':hover': getHoverObject(props),
				' .maxi-video-block__popup-wrapper': getLightBoxObject(props),
				' .maxi-video-block__video-container':
					getVideoContainerOject(props),
				' .maxi-video-block__video-player': getVideoPlayerStyles(props),
				' .maxi-video-block__overlay': getOverlayStyles(props),
				' .maxi-video-block__overlay-background':
					getOverlayBackgroundObject(props),
				...(props['overlay-background-hover-status'] && {
					':hover .maxi-video-block__overlay-background':
						getOverlayBackgroundObject(props, true),
				}),
				...getIconObject('play-', props),
				...getIconObject('close-', props),
			},
			selectorsVideo,
			props,
			transitionObj
		),
		[`popup-${uniqueID}`]: styleProcessor(
			{
				' .maxi-video-block__popup-wrapper': getLightBoxObject(props),
				' .maxi-video-block__video-container':
					getVideoContainerOject(props),
				' .maxi-video-block__video-player': getVideoPlayerStyles(props),
				...getIconObject('close-', props),
			},
			selectorsVideo,
			props,
			transitionObj
		),
	};

	return response;
};

export default getStyles;
