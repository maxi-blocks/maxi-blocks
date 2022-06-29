/**
 * External dependencies
 */
import { isNil, isEmpty } from 'lodash';

/**
 * Internal dependencies
 */
import {
	getGroupAttributes,
	getLastBreakpointAttribute,
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

const getIconSize = (obj, prefix = '') => {
	const response = {
		label: 'Icon size',
		general: {},
	};

	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {};

		if (!isNil(obj[`${prefix}icon-height-${breakpoint}`])) {
			response[breakpoint].height = `${
				obj[`${prefix}icon-height-${breakpoint}`]
			}${getLastBreakpointAttribute({
				target: `${prefix}icon-height-unit`,
				breakpoint,
				attributes: obj,
			})}`;
			response[breakpoint].width = `${
				obj[`${prefix}icon-height-${breakpoint}`]
			}${getLastBreakpointAttribute({
				target: `${prefix}icon-height-unit`,
				breakpoint,
				attributes: obj,
			})}`;
		}

		if (isEmpty(response[breakpoint]) && breakpoint !== 'general')
			delete response[breakpoint];
	});

	return { iconSize: response };
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
				' .maxi-video-block__close-button': getIconStyles(
					props,
					props.blockStyle,
					false,
					false,
					'close-'
				),
				' .maxi-video-block__close-button svg': getIconSize(
					props,
					'close-'
				),
				' .maxi-video-block__close-button svg path': getIconPathStyles(
					props,
					false,
					'close-'
				),
				' .maxi-video-block__play-button svg': getIconSize(
					props,
					'play-'
				),
				' .maxi-video-block__play-button': getIconStyles(
					props,
					props.blockStyle,
					false,
					false,
					'play-'
				),
				' .maxi-video-block__play-button svg path': getIconPathStyles(
					props,
					false,
					'play-'
				),
			},
			selectorsVideo,
			props
		),
	};

	return response;
};

export default getStyles;
