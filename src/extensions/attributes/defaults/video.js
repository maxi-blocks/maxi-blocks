import prefixAttributesCreator from '../prefixAttributesCreator';
import { icon } from './icon';
import { iconHover } from './iconHover';

const rawVideo = {
	u: {
		type: 'string',
		default: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
		longLabel: 'url',
	},
	eu: {
		type: 'string',
		default:
			'https://www.youtube.com/embed/ScMzIvxBSi4?rel=0&enablejsapi=1&controls=1&autoplay=0',
		longLabel: 'embedUrl',
	},
	sti: {
		type: 'string',
		longLabel: 'startTime',
	},
	eti: {
		type: 'string',
		longLabel: 'endTime',
	},
	vr: {
		type: 'string',
		default: 'ar169',
		longLabel: 'videoRatio',
	},
	pra: {
		type: 'string',
		default: 'ar169',
		longLabel: 'popupRatio',
	},
	vt: {
		type: 'string',
		default: 'youtube',
		longLabel: 'videoType',
	},
	il: {
		type: 'boolean',
		default: false,
		longLabel: 'isLoop',
	},
	im: {
		type: 'boolean',
		default: false,
		longLabel: 'isMuted',
	},
	ia: {
		type: 'boolean',
		default: false,
		longLabel: 'isAutoplay',
	},
	spc: {
		type: 'boolean',
		default: true,
		longLabel: 'showPlayerControls',
	},
	pt: {
		type: 'string',
		default: 'video',
		longLabel: 'playerType',
	},
	hi: {
		type: 'boolean',
		default: false,
		longLabel: 'hideImage',
	},
	pan: {
		type: 'string',
		longLabel: 'popAnimation',
	},
};

const rawIcon = {
	...icon,
	...iconHover,
	'i-i': {
		type: 'boolean',
		default: false,
		longLabel: 'icon-inherit',
	},
	'i-w-general': {
		type: 'string',
		default: null,
		longLabel: 'icon-width-general',
	},
	'i-w.u-general': {
		type: 'string',
		default: null,
		longLabel: 'icon-width-unit-general',
	},
	'i-w-general.h': {
		type: 'string',
		default: null,
		longLabel: 'icon-width-general-hover',
	},
	'i-w.u-general.h': {
		type: 'string',
		default: null,
		longLabel: 'icon-width-unit-general-hover',
	},
};

const icons = {
	...prefixAttributesCreator({
		obj: rawIcon,
		prefix: 'cl-', // close-
		diffValAttr: {
			'cl-i-spa-general': 5, // 'close-icon-spacing-general'
			'cl-i-pos': 'top-screen-right', // 'close-icon-position'
			'cl-i-f-pc': 1, // 'close-icon-fill-palette-color'
			// 'close-icon-content'
			'cl-i-c':
				'<svg class="cross-24-shape-maxi-svg" width="64px" height="64px" viewBox="0 0 36.1 36.1"><path d="M33.9 25.1l-5.7-5.7-1.3-1.3h0L34 11a6.19 6.19 0 0 0 1.7-3.3c0-.1 0-.2.1-.3v-.3V6v-.1-.3-.1c0-.1 0-.2-.1-.3 0-.1-.1-.2-.1-.4 0-.1-.1-.2-.1-.3v-.1c0-.1-.1-.2-.1-.2v-.1c0-.1-.1-.2-.1-.2v-.1c-.1-.1-.1-.2-.2-.3s-.1-.2-.2-.3c0 0 0-.1-.1-.1 0-.1-.1-.1-.1-.2l-.1-.1-.2-.2s0-.1-.1-.1c-.1-.1-.2-.2-.2-.3C32.9 1 31.3.4 29.7.4c-.3 0-.6 0-.9.1h-.3c-1.2.2-2.3.8-3.2 1.7h0l-4 3.8L18 9.2 14.8 6 11 2.2C8.6-.2 4.6-.2 2.2 2.2c-.1.1-.2.1-.3.2 0 0 0 .1-.1.1 0 .1-.1.2-.1.2l-.1.1c0 .1-.1.2-.1.2s0 .1-.1.1c-.1.1-.1.2-.2.3s-.1.2-.2.3v.1c0 .1-.1.2-.1.2v.1c0 .1-.1.2-.1.2v.1c0 .1-.1.2-.1.3s-.1.2-.1.3v.1c0 .1 0 .2-.1.2v.1.2.1.7.1.3.1.3.1c.1 1.4.7 2.7 1.7 3.7l7.1 7.1L8 19.4l-5.7 5.7c-2.4 2.4-2.4 6.4 0 8.8s6.4 2.4 8.8 0l7.1-7.1 7.1 7.1c2.4 2.4 6.4 2.4 8.8 0 2.3-2.4 2.3-6.4-.2-8.8z" data-fill fill="#ff4a17"/></svg>',
		},
	}),
	...prefixAttributesCreator({
		obj: rawIcon,
		prefix: 'pl-', // play-
		diffValAttr: {
			'pl-i-f-pc': 1, // 'play-icon-fill-palette-color'
			'pl-i-h-general': '50', // 'play-icon-height-general'
			// 'play-icon-content'
			'pl-i-c':
				'<svg class="play-16-shape-maxi-svg" width="64px" height="64px" viewBox="0 0 36.099 36.099"><path d="M18.05.438C8.323.438.438 8.323.438 18.05S8.323 35.661 18.05 35.661s17.611-7.885 17.611-17.611S27.776.438 18.05.438zM13.238 25.71V10.39l13.267 7.66-13.267 7.66z" data-fill fill="#ff4a17"/></svg>',
		},
	}),
};

const video = {
	...rawVideo,
	...icons,
};

export default video;
