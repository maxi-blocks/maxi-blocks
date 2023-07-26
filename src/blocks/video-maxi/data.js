/**
 * Internal dependencies
 */
import {
	getCanvasSettings,
	getAdvancedSettings,
} from '../../extensions/relations';
import { createIconTransitions } from '../../extensions/styles';
import { createSelectors } from '../../extensions/styles/custom-css';
import transitionDefault from '../../extensions/styles/transitions/transitionDefault';

/**
 * Classnames
 */
const blockClass = ' .maxi-video-block';
const videoClass = `${blockClass}__video-container`;
const overlayClass = `${blockClass}__overlay`;

/**
 * Data object
 */
const name = 'video-maxi';
const copyPasteMapping = {
	_exclude: ['url', 'embedUrl', 'videoType', 'overlay-mediaURL'],
	settings: {
		Video: {
			group: {
				Url: ['url', 'embedUrl', 'videoType'],
				'Video type': 'playerType',
				'Start time': 'startTime',
				'End time': 'endTime',
				'Aspect ratio': 'videoRatio',
			},
		},
		'Video options': {
			group: {
				Autoplay: 'isAutoplay',
				Mute: 'isMuted',
				Loop: 'isLoop',
				'Player controls': 'showPlayerControls',
				'Reduce black borders': 'reduceBorders',
				'Lightbox background colour': {
					groupAttributes: [
						'lightboxBackground',
						'lightboxBackgroundColor',
					],
				},
			},
		},
		'Video overlay': {
			group: {
				'Overlay background colour': {
					groupAttributes: ['background', 'backgroundColor'],
				},
				'Play button': { groupAttributes: 'icon', prefix: 'play-' },
			},
		},
		'Popup settings': {
			group: {
				'Lightbox background': {
					groupAttributes: ['background', 'backgroundColor'],
					prefix: 'lightbox-',
				},
				'Close button': {
					groupAttributes: 'icon',
					prefix: 'close-',
				},
				'Pop animation': 'popAnimation',
			},
		},
		Image: {
			group: {
				'Hide image(icon only)': 'hideImage',
				'Overlay background': {
					groupAttributes: ['background', 'backgroundColor'],
					prefix: 'overlay-',
				},
				'Image source': 'overlay-mediaURL',
			},
		},
		Border: {
			template: 'border',
			prefix: 'overlay-',
		},
		'Box shadow': {
			template: 'boxShadow',
			prefix: 'overlay-',
		},
		'Margin/Padding': {
			template: 'marginPadding',
			prefix: 'overlay-',
		},
	},
	advanced: {
		template: 'advanced',
		Opacity: {
			template: 'opacity',
		},
	},
};
const customCss = {
	selectors: {
		...createSelectors({
			canvas: '',
		}),
		...createSelectors({
			video: videoClass,
			overlay: overlayClass,
		}),
		'close icon': {
			normal: {
				label: 'close icon',
				target: ' .maxi-video-block__close-button',
			},
			svg: {
				label: "close icon's svg",
				target: ' .maxi-video-block__close-button svg',
			},
			insideSvg: {
				label: 'everything inside svg (svg > *)',
				target: ' .maxi-video-block__close-button svg > *',
			},
			path: {
				label: "svg's path",
				target: ' .maxi-video-block__close-button svg path',
			},
			hover: {
				label: 'close icon on hover',
				target: ' .maxi-video-block__close-button:hover',
			},
			hoverSvg: {
				label: "close icon's svg on hover",
				target: ' .maxi-video-block__close-button:hover svg',
			},
			hoverInsideSvg: {
				label: 'everything inside svg on hover (:hover svg > *)',
				target: ' .maxi-video-block__close-button:hover svg > *',
			},
			hoverPath: {
				label: "svg's path on hover",
				target: ' .maxi-video-block__close-button:hover svg path',
			},
		},
		'play icon': {
			normal: {
				label: 'play icon',
				target: ' .maxi-video-block__play-button',
			},
			svg: {
				label: "play icon's svg",
				target: ' .maxi-video-block__play-button svg',
			},
			insideSvg: {
				label: 'everything inside svg (svg > *)',
				target: ' .maxi-video-block__play-button svg > *',
			},
			path: {
				label: "svg's path",
				target: ' .maxi-video-block__play-button svg path',
			},
			hover: {
				label: 'play icon on hover',
				target: ' .maxi-video-block__play-button:hover',
			},
			hoverSvg: {
				label: "play icon's svg on hover",
				target: ' .maxi-video-block__play-button:hover svg',
			},
			hoverInsideSvg: {
				label: 'everything inside svg on hover (:hover svg > *)',
				target: ' .maxi-video-block__play-button:hover svg > *',
			},
			hoverPath: {
				label: "svg's path on hover",
				target: ' .maxi-video-block__play-button:hover svg path',
			},
		},
	},
	categories: [
		'canvas',
		'before canvas',
		'after canvas',
		'video',
		'overlay',
		'close icon',
		'play icon',
	],
};
const transition = {
	...transitionDefault,
	block: {
		border: {
			title: 'Border',
			target: [overlayClass, videoClass],
			property: ['border', 'border-radius'],
			hoverProp: 'video-border-status-hover',
		},
		'box shadow': {
			title: 'Box shadow',
			target: [overlayClass, videoClass],
			property: 'box-shadow',
			hoverProp: 'video-box-shadow-status-hover',
		},
		'overlay colour': {
			title: 'Overlay colour',
			target: `${overlayClass}-background`,
			property: 'background-color',
			hoverProp: 'overlay-background-status-hover',
		},
		...createIconTransitions({
			target: ' .maxi-video-block__play-button',
			prefix: 'play-icon-',
			titlePrefix: 'play icon',
			disableBorder: true,
			disableBackground: true,
		}),
		...createIconTransitions({
			target: ' .maxi-video-block__close-button',
			prefix: 'close-icon-',
			titlePrefix: 'close icon',
			disableBorder: true,
			disableBackground: true,
		}),
	},
};
const interactionBuilderSettings = {
	canvas: getCanvasSettings({ name }),
	advanced: getAdvancedSettings({ customCss }),
};

const data = {
	name,
	copyPasteMapping,
	customCss,
	transition,
	interactionBuilderSettings,
};

export { copyPasteMapping, customCss, transition, interactionBuilderSettings };
export default data;
