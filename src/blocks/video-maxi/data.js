/**
 * Internal dependencies
 */
import { createSelectors } from '../../extensions/styles/custom-css';
import getCanvasSettings from '../../components/relation-control/getCanvasSettings';
import transitionDefault from '../../extensions/styles/transitions/transitionDefault';

/**
 * Classnames
 */
const blockClass = ' .maxi-video-block';
const videoClass = `${blockClass}__video-player`;
const overlayClass = `${blockClass}__overlay`;

const prefix = 'video-';

/**
 * Data object
 */
const name = 'video-maxi';
const copyPasteMapping = {
	settings: {
		Video: {
			group: {
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
			target: [
				' .maxi-video-block__overlay',
				' .maxi-video-block__video-player',
			],
			property: 'border',
			prefix,
		},
		'box shadow': {
			title: 'Box shadow',
			target: [
				' .maxi-video-block__overlay',
				' .maxi-video-block__video-player',
			],
			property: 'box-shadow',
			prefix,
		},
		'overlay colour': {
			title: 'Overlay colour',
			target: ' .maxi-video-block__overlay-background',
			hoverProp: 'overlay-background-hover-status',
			property: 'background-color',
		},
		'play icon colour': {
			title: 'Play icon colour',
			target: ' .maxi-video-block__play-button svg > *',
			hoverProp: 'play-icon-status-hover',
			limitless: true,
		},
		'play icon width': {
			title: 'Play icon width',
			target: ' .maxi-video-block__play-button svg',
			property: ['width', 'height'],
			hoverProp: 'play-icon-status-hover',
		},
		'play icon background': {
			title: 'Play icon background',
			target: ' .maxi-video-block__play-button',
			property: 'background',
			hoverProp: 'play-icon-status-hover',
		},
		'play icon border': {
			title: 'Play icon border',
			target: ' .maxi-video-block__play-button',
			property: 'border',
			hoverProp: 'play-icon-status-hover',
		},
		'close icon colour': {
			title: 'Close icon colour',
			target: ' .maxi-video-block__close-button svg > *',
			hoverProp: 'close-icon-status-hover',
			limitless: true,
		},
		'close icon width': {
			title: 'Close icon width',
			target: ' .maxi-video-block__close-button svg',
			property: ['width', 'height'],
			hoverProp: 'close-icon-status-hover',
		},
		'close icon background': {
			title: 'Close icon background',
			target: ' .maxi-video-block__close-button',
			property: 'background',
			hoverProp: 'close-icon-status-hover',
		},
		'close icon border': {
			title: 'Close icon border',
			target: ' .maxi-video-block__close-button',
			property: 'border',
			hoverProp: 'close-icon-status-hover',
		},
	},
};
const interactionBuilderSettings = getCanvasSettings({ name, customCss });

const data = {
	name,
	copyPasteMapping,
	customCss,
	transition,
	interactionBuilderSettings,
};

export { copyPasteMapping, customCss, transition, interactionBuilderSettings };
export default data;
