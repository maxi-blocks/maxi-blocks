import prefixAttributesCreator from '@extensions/styles/prefixAttributesCreator';
import { icon } from './icon';
import { iconHover } from './iconHover';

const rawVideo = {
	url: {
		type: 'string',
		default: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
	},
	embedUrl: {
		type: 'string',
		default:
			'https://www.youtube.com/embed/ScMzIvxBSi4?rel=0&enablejsapi=1&controls=1&autoplay=0',
	},
	startTime: {
		type: 'string',
	},
	endTime: {
		type: 'string',
	},
	videoRatio: {
		type: 'string',
		default: 'ar169',
	},
	videoRatioCustom: {
		type: 'string',
		default: '1',
	},
	popupRatio: {
		type: 'string',
		default: 'ar169',
	},
	popupRatioCustom: {
		type: 'string',
		default: '1',
	},
	videoType: {
		type: 'string',
		default: 'youtube',
	},
	isLoop: {
		type: 'boolean',
		default: false,
	},
	isMuted: {
		type: 'boolean',
		default: false,
	},
	isAutoplay: {
		type: 'boolean',
		default: false,
	},
	showPlayerControls: {
		type: 'boolean',
		default: true,
	},
	playerType: {
		type: 'string',
		default: 'video',
	},
	hideImage: {
		type: 'boolean',
		default: false,
	},
	popAnimation: {
		type: 'string',
	},
};

const rawIcon = {
	...icon,
	...iconHover,
	'icon-inherit': {
		type: 'boolean',
		default: false,
	},
	'icon-width-general': {
		type: 'string',
		default: null,
	},
	'icon-width-unit-general': {
		type: 'string',
		default: null,
	},
	'icon-width-general-hover': {
		type: 'string',
		default: null,
	},
	'icon-width-unit-general-hover': {
		type: 'string',
		default: null,
	},
};

const icons = {
	...prefixAttributesCreator({
		obj: rawIcon,
		prefix: 'close-',
		diffValAttr: {
			'close-icon-spacing-general': 5,
			'close-icon-position': 'top-screen-right',
			'close-icon-fill-palette-color': 1,
			'close-icon-content':
				'<svg class="cross-24-shape-maxi-svg" width="64px" height="64px" viewBox="0 0 36.1 36.1"><path d="M33.9 25.1l-5.7-5.7-1.3-1.3h0L34 11a6.19 6.19 0 0 0 1.7-3.3c0-.1 0-.2.1-.3v-.3V6v-.1-.3-.1c0-.1 0-.2-.1-.3 0-.1-.1-.2-.1-.4 0-.1-.1-.2-.1-.3v-.1c0-.1-.1-.2-.1-.2v-.1c0-.1-.1-.2-.1-.2v-.1c-.1-.1-.1-.2-.2-.3s-.1-.2-.2-.3c0 0 0-.1-.1-.1 0-.1-.1-.1-.1-.2l-.1-.1-.2-.2s0-.1-.1-.1c-.1-.1-.2-.2-.2-.3C32.9 1 31.3.4 29.7.4c-.3 0-.6 0-.9.1h-.3c-1.2.2-2.3.8-3.2 1.7h0l-4 3.8L18 9.2 14.8 6 11 2.2C8.6-.2 4.6-.2 2.2 2.2c-.1.1-.2.1-.3.2 0 0 0 .1-.1.1 0 .1-.1.2-.1.2l-.1.1c0 .1-.1.2-.1.2s0 .1-.1.1c-.1.1-.1.2-.2.3s-.1.2-.2.3v.1c0 .1-.1.2-.1.2v.1c0 .1-.1.2-.1.2v.1c0 .1-.1.2-.1.3s-.1.2-.1.3v.1c0 .1 0 .2-.1.2v.1.2.1.7.1.3.1.3.1c.1 1.4.7 2.7 1.7 3.7l7.1 7.1L8 19.4l-5.7 5.7c-2.4 2.4-2.4 6.4 0 8.8s6.4 2.4 8.8 0l7.1-7.1 7.1 7.1c2.4 2.4 6.4 2.4 8.8 0 2.3-2.4 2.3-6.4-.2-8.8z" data-fill fill="var(--maxi-primary-color)"/></svg>',
		},
	}),
	...prefixAttributesCreator({
		obj: rawIcon,
		prefix: 'play-',
		diffValAttr: {
			'play-icon-fill-palette-color': 1,
			'play-icon-height-general': '50',
			'play-icon-content':
				'<svg class="play-16-shape-maxi-svg" width="64px" height="64px" viewBox="0 0 36.099 36.099"><path d="M18.05.438C8.323.438.438 8.323.438 18.05S8.323 35.661 18.05 35.661s17.611-7.885 17.611-17.611S27.776.438 18.05.438zM13.238 25.71V10.39l13.267 7.66-13.267 7.66z" data-fill fill="var(--maxi-primary-color)"/></svg>',
		},
	}),
};

const video = {
	...rawVideo,
	...icons,
};

export default video;
