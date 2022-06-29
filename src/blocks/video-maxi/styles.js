/**
 * External dependencies
 */
import { isNil, isEmpty } from 'lodash';

/**
 * Internal dependencies
 */
import {
	getAttributeValue,
	getGroupAttributes,
	stylesCleaner,
} from '../../extensions/styles';
import {
	getBoxShadowStyles,
	getZIndexStyles,
	getDisplayStyles,
	getTransformStyles,
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
} from '../../extensions/styles/helpers';
import { selectorsVideo } from './custom-css';

const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

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
		transform: getTransformStyles({
			...getGroupAttributes(props, 'transform'),
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

const getOverlayBackgroundObject = props => {
	const response = {
		...getBackgroundStyles({
			...getGroupAttributes(
				props,
				['background', 'backgroundColor'],
				false,
				'overlay-'
			),
			prefix: 'overlay-',
			blockStyle: props.blockStyle,
		}),
	};

	return response;
};

const getVideoPlayerOject = props => {
	const { videoRatio } = props;

	const response = {
		...(videoRatio && getAspectRatio(videoRatio)),
	};

	return response;
};

const getIconSize = (obj, prefix = '', isHover = false) => {
	const response = {
		label: 'Icon size',
		general: {},
	};

	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {};

		if (
			!isNil(
				getAttributeValue({
					target: 'icon-height',
					isHover,
					breakpoint,
					prefix,
					props: obj,
				})
			)
		) {
			response[breakpoint].height = `${getAttributeValue({
				target: 'icon-height',
				isHover,
				breakpoint,
				prefix,
				props: obj,
			})}${getAttributeValue({
				target: 'icon-height-unit',
				isHover,
				breakpoint,
				prefix,
				props: obj,
			})}`;
			response[breakpoint].width = `${getAttributeValue({
				target: 'icon-height',
				isHover,
				breakpoint,
				prefix,
				props: obj,
			})}${getAttributeValue({
				target: 'icon-height-unit',
				isHover,
				breakpoint,
				prefix,
				props: obj,
			})}`;
		}

		if (isEmpty(response[breakpoint]) && breakpoint !== 'general')
			delete response[breakpoint];
	});

	return { iconSize: response };
};

const getIconObject = (prefix, obj) => {
	const { [`${prefix}icon-status-hover`]: iconHoverStatus } = obj;

	return {
		[` .maxi-video-block__${prefix}button svg`]: getIconSize(obj, prefix),
		[` .maxi-video-block__${prefix}button svg path`]: getIconPathStyles(
			obj,
			false,
			prefix
		),
		[` .maxi-video-block__${prefix}button`]: {
			icon: getIconStyles(obj, obj.blockStyle, false, false, prefix),
		},
		...getSVGStyles({
			obj,
			target: `.maxi-video-block__${prefix}button`,
			blockStyle: obj.blockStyle,
			prefix: `${prefix}icon-`,
			useIconColor: true,
		}),
		...(iconHoverStatus && {
			[`:hover .maxi-video-block__${prefix}button svg`]: getIconSize(
				obj,
				prefix
			),
			[`:hover .maxi-video-block__${prefix}button svg`]: {
				icon: getIconStyles(obj, obj.blockStyle, false, true, prefix),
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
		}),
	};
};

const getStyles = props => {
	const { uniqueID } = props;

	const response = {
		[uniqueID]: stylesCleaner(
			{
				'': getNormalObject(props),
				':hover': getHoverObject(props),
				' .maxi-video-block__popup-wrapper': getLightBoxObject(props),
				' .maxi-video-block__video-player': getVideoPlayerOject(props),
				' .maxi-video-block__overlay-background':
					getOverlayBackgroundObject(props),
				...getIconObject('play-', props),
				...getIconObject('close-', props),
			},
			selectorsVideo,
			props
		),
	};

	return response;
};

export default getStyles;
