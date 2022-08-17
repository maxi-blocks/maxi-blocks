import { createSelectors } from '../../extensions/styles/custom-css';
import getCanvasSettings from '../../components/relation-control/getCanvasSettings';

/**
 * Classnames
 */
const blockClass = ' .maxi-video-block';
const videoClass = `${blockClass}__video-player`;
const overlayClass = `${blockClass}__overlay`;

const data = {
	name: 'video-maxi',
	copyPasteMapping: {
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
	},
	customCss: {
		selectors: {
			...createSelectors({
				canvas: '',
			}),
			...createSelectors({
				video: videoClass,
				overlay: overlayClass,
			}),
		},
		categories: [
			'canvas',
			'before canvas',
			'after canvas',
			'video',
			'overlay',
		],
	},
	get interactionBuilderSettings() {
		return getCanvasSettings(this);
	},
};

const { copyPasteMapping, customCss, interactionBuilderSettings } = data;

export { copyPasteMapping, customCss, interactionBuilderSettings };
export default data;
