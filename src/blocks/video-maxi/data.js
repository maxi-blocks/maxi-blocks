/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { getCanvasSettings, getAdvancedSettings } from '@extensions/relations';
import { createIconTransitions } from '@extensions/styles';
import {
	createIconSelectors,
	createSelectors,
} from '@extensions/styles/custom-css';
import transitionDefault from '@extensions/styles/transitions/transitionDefault';

/**
 * Classnames
 */
const blockClass = ' .maxi-video-block';
const videoClass = `${blockClass}__video-player`;
const overlayClass = `${blockClass}__overlay`;

/**
 * Data object
 */
const name = 'video-maxi';
const copyPasteMapping = {
	_exclude: ['url', 'embedUrl', 'videoType', 'overlay-mediaURL'],
	settings: {
		[__('Video', 'maxi-blocks')]: {
			group: {
				[__('Url', 'maxi-blocks')]: ['url', 'embedUrl', 'videoType'],
				[__('Video type', 'maxi-blocks')]: 'playerType',
				[__('Start time', 'maxi-blocks')]: 'startTime',
				[__('End time', 'maxi-blocks')]: 'endTime',
				[__('Aspect ratio', 'maxi-blocks')]: 'videoRatio',
			},
		},
		[__('Video options', 'maxi-blocks')]: {
			group: {
				[__('Autoplay', 'maxi-blocks')]: 'isAutoplay',
				[__('Mute', 'maxi-blocks')]: 'isMuted',
				[__('Loop', 'maxi-blocks')]: 'isLoop',
				[__('Player controls', 'maxi-blocks')]: 'showPlayerControls',
				[__('Reduce black borders', 'maxi-blocks')]: 'reduceBorders',
				[__('Lightbox background colour', 'maxi-blocks')]: {
					groupAttributes: [
						'lightboxBackground',
						'lightboxBackgroundColor',
					],
				},
			},
		},
		[__('Video overlay', 'maxi-blocks')]: {
			group: {
				[__('Overlay background colour', 'maxi-blocks')]: {
					groupAttributes: ['background', 'backgroundColor'],
				},
				[__('Play button', 'maxi-blocks')]: {
					groupAttributes: 'icon',
					prefix: 'play-',
				},
			},
		},
		[__('Popup settings', 'maxi-blocks')]: {
			group: {
				[__('Lightbox background', 'maxi-blocks')]: {
					groupAttributes: ['background', 'backgroundColor'],
					prefix: 'lightbox-',
				},
				[__('Close button', 'maxi-blocks')]: {
					groupAttributes: 'icon',
					prefix: 'close-',
				},
				[__('Pop animation', 'maxi-blocks')]: 'popAnimation',
			},
		},
		[__('Image', 'maxi-blocks')]: {
			group: {
				[__('Hide image(icon only)', 'maxi-blocks')]: 'hideImage',
				[__('Overlay background', 'maxi-blocks')]: {
					groupAttributes: ['background', 'backgroundColor'],
					prefix: 'overlay-',
				},
				[__('Image source', 'maxi-blocks')]: 'overlay-mediaURL',
			},
		},
		[__('Border', 'maxi-blocks')]: {
			template: 'border',
			prefix: 'overlay-',
		},
		[__('Box shadow', 'maxi-blocks')]: {
			template: 'boxShadow',
			prefix: 'overlay-',
		},
		[__('Margin/Padding', 'maxi-blocks')]: {
			template: 'marginPadding',
			prefix: 'overlay-',
		},
	},
	advanced: {
		template: 'advanced',
		[__('Opacity', 'maxi-blocks')]: {
			template: 'opacity',
		},
	},
};
const customCss = {
	selectors: {
		...createSelectors({
			canvas: '',
			video: videoClass,
			overlay: overlayClass,
		}),
		...createIconSelectors({
			'close icon': ' .maxi-video-block__close-button',
			'play icon': ' .maxi-video-block__play-button',
		}),
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
const ariaLabelsCategories = ['canvas', 'video', 'close icon', 'play icon'];
const transition = {
	...transitionDefault,
	block: {
		border: {
			title: __('Border', 'maxi-blocks'),
			target: [overlayClass, videoClass],
			property: ['border', 'border-radius'],
			hoverProp: 'video-border-status-hover',
		},
		'box shadow': {
			title: __('Box shadow', 'maxi-blocks'),
			target: [overlayClass, videoClass],
			property: 'box-shadow',
			hoverProp: 'video-box-shadow-status-hover',
		},
		'overlay colour': {
			title: __('Overlay colour', 'maxi-blocks'),
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

export {
	copyPasteMapping,
	customCss,
	transition,
	interactionBuilderSettings,
	ariaLabelsCategories,
};
export default data;
