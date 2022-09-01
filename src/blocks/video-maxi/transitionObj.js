import transitionDefault from '../../extensions/styles/transitions/transitionDefault';

const prefix = 'video-';

const transitionObj = {
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
			hoverProp: 'overlay-background-status-hover',
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

export default transitionObj;
