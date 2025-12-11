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
			hoverProp: 'border-status-hover',
		},
		'box shadow': {
			title: __('Box shadow', 'maxi-blocks'),
			target: [overlayClass, videoClass],
			property: 'box-shadow',
			hoverProp: 'box-shadow-status-hover',
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

const inlineStylesTargets = {
	block: '',
	video: videoClass,
	overlay: overlayClass,
	closeIcon: ' .maxi-video-block__close-button',
	playIcon: ' .maxi-video-block__play-button',
	closeIconPath: ' .maxi-video-block__close-button svg path',
	playIconPath: ' .maxi-video-block__play-button svg path',
	closeIconSvg: ' .maxi-video-block__close-button svg',
	playIconSvg: ' .maxi-video-block__play-button svg',
	overlayMedia: ' .maxi-video-block__overlay-image',
};

const attributesToStyles = {
	'close-icon-stroke': {
		target: inlineStylesTargets.closeIconPath,
		property: 'stroke-width',
		isMultiplySelector: true,
	},
	'play-icon-stroke': {
		target: inlineStylesTargets.playIconPath,
		property: 'stroke-width',
		isMultiplySelector: true,
	},
	'play-icon-height': {
		target: inlineStylesTargets.playIconSvg,
		property: ['height', 'width'],
	},
	'video-border-top-width': {
		target: inlineStylesTargets.video,
		property: 'border-top-width',
	},
	'video-border-right-width': {
		target: inlineStylesTargets.video,
		property: 'border-right-width',
	},
	'video-border-bottom-width': {
		target: inlineStylesTargets.video,
		property: 'border-bottom-width',
	},
	'video-border-left-width': {
		target: inlineStylesTargets.video,
		property: 'border-left-width',
	},
	'video-border-top-left-radius': {
		target: inlineStylesTargets.video,
		property: 'border-top-left-radius',
	},
	'video-border-top-right-radius': {
		target: inlineStylesTargets.video,
		property: 'border-top-right-radius',
	},
	'video-border-bottom-right-radius': {
		target: inlineStylesTargets.video,
		property: 'border-bottom-right-radius',
	},
	'video-border-bottom-left-radius': {
		target: inlineStylesTargets.video,
		property: 'border-bottom-left-radius',
	},
	'video-margin-top': {
		target: inlineStylesTargets.video,
		property: 'margin-top',
	},
	'video-margin-right': {
		target: inlineStylesTargets.video,
		property: 'margin-right',
	},
	'video-margin-bottom': {
		target: inlineStylesTargets.video,
		property: 'margin-bottom',
	},
	'video-margin-left': {
		target: inlineStylesTargets.video,
		property: 'margin-left',
	},
	'video-padding-top': {
		target: inlineStylesTargets.video,
		property: 'padding-top',
	},
	'video-padding-right': {
		target: inlineStylesTargets.video,
		property: 'padding-right',
	},
	'video-padding-bottom': {
		target: inlineStylesTargets.video,
		property: 'padding-bottom',
	},
	'video-padding-left': {
		target: inlineStylesTargets.video,
		property: 'padding-left',
	},
	'video-width': {
		target: inlineStylesTargets.video,
		property: 'width',
	},
	'video-height': {
		target: inlineStylesTargets.video,
		property: 'height',
	},
	'video-min-width': {
		target: inlineStylesTargets.video,
		property: 'min-width',
	},
	'video-min-height': {
		target: inlineStylesTargets.video,
		property: 'min-height',
	},
	'video-max-width': {
		target: inlineStylesTargets.video,
		property: 'max-width',
	},
	'video-max-height': {
		target: inlineStylesTargets.video,
		property: 'max-height',
	},
	'overlay-media-width': {
		target: inlineStylesTargets.overlayMedia,
		property: 'width',
	},
	'overlay-media-height': {
		target: inlineStylesTargets.overlayMedia,
		property: 'height',
	},
	'border-top-width': {
		target: inlineStylesTargets.block,
		property: 'border-top-width',
	},
	'border-right-width': {
		target: inlineStylesTargets.block,
		property: 'border-right-width',
	},
	'border-bottom-width': {
		target: inlineStylesTargets.block,
		property: 'border-bottom-width',
	},
	'border-left-width': {
		target: inlineStylesTargets.block,
		property: 'border-left-width',
	},
	'border-top-left-radius': {
		target: inlineStylesTargets.block,
		property: 'border-top-left-radius',
	},
	'border-top-right-radius': {
		target: inlineStylesTargets.block,
		property: 'border-top-right-radius',
	},
	'border-bottom-right-radius': {
		target: inlineStylesTargets.block,
		property: 'border-bottom-right-radius',
	},
	'border-bottom-left-radius': {
		target: inlineStylesTargets.block,
		property: 'border-bottom-left-radius',
	},
	opacity: {
		target: inlineStylesTargets.block,
		property: 'opacity',
	},
	'flex-grow': {
		target: inlineStylesTargets.block,
		property: 'flex-grow',
	},
	'flex-shrink': {
		target: inlineStylesTargets.block,
		property: 'flex-shrink',
	},
	'row-gap': {
		target: inlineStylesTargets.block,
		property: 'row-gap',
	},
	'column-gap': {
		target: inlineStylesTargets.block,
		property: 'column-gap',
	},
	order: {
		target: inlineStylesTargets.block,
		property: 'order',
	},
	'margin-top': {
		target: inlineStylesTargets.block,
		property: 'margin-top',
	},
	'margin-right': {
		target: inlineStylesTargets.block,
		property: 'margin-right',
	},
	'margin-bottom': {
		target: inlineStylesTargets.block,
		property: 'margin-bottom',
	},
	'margin-left': {
		target: inlineStylesTargets.block,
		property: 'margin-left',
	},
	'padding-top': {
		target: inlineStylesTargets.block,
		property: 'padding-top',
	},
	'padding-right': {
		target: inlineStylesTargets.block,
		property: 'padding-right',
	},
	'padding-bottom': {
		target: inlineStylesTargets.block,
		property: 'padding-bottom',
	},
	'padding-left': {
		target: inlineStylesTargets.block,
		property: 'padding-left',
	},
	'position-top': {
		target: inlineStylesTargets.block,
		property: 'top',
	},
	'position-right': {
		target: inlineStylesTargets.block,
		property: 'right',
	},
	'position-bottom': {
		target: inlineStylesTargets.block,
		property: 'bottom',
	},
	'position-left': {
		target: inlineStylesTargets.block,
		property: 'left',
	},
	width: {
		target: inlineStylesTargets.block,
		property: 'width',
	},
	height: {
		target: inlineStylesTargets.block,
		property: 'height',
	},
	'min-width': {
		target: inlineStylesTargets.block,
		property: 'min-width',
	},
	'min-height': {
		target: inlineStylesTargets.block,
		property: 'min-height',
	},
	'max-width': {
		target: inlineStylesTargets.block,
		property: 'max-width',
	},
	'max-height': {
		target: inlineStylesTargets.block,
		property: 'max-height',
	},
};

const data = {
	name,
	copyPasteMapping,
	customCss,
	transition,
	interactionBuilderSettings,
	attributesToStyles,
};

export {
	copyPasteMapping,
	customCss,
	transition,
	interactionBuilderSettings,
	ariaLabelsCategories,
	attributesToStyles,
};
export default data;
