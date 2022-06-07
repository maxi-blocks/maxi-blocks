import prefixAttributesCreator from '../prefixAttributesCreator';
import { icon, iconBackground, iconPadding } from './icon';
import { iconBorder, iconBorderRadius, iconBorderWidth } from './iconBorder';

const rawVideo = {
	url: {
		type: 'string',
		default: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
	},
	embedUrl: {
		type: 'string',
		default: 'https://www.youtube.com/embed/ScMzIvxBSi4?rel=0&controls=1',
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
	videoType: {
		type: 'string',
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
};

const rawIcon = {
	svgType: {
		type: 'string',
	},
	'icon-inherit': {
		type: 'boolean',
		default: false,
	},
	...icon,
	...iconBackground,
	...iconPadding,
	...iconBorder,
	...iconBorderWidth,
	...iconBorderRadius,
};

const icons = {
	...prefixAttributesCreator({
		obj: rawIcon,
		prefix: 'close-',
		diffValAttr: {
			'close-icon-stroke-general': 0,
			'close-icon-content':
				'<svg class="cross-24-shape-maxi-svg" width="64px" height="64px" viewBox="0 0 36.1 36.1"><path d="M33.9 25.1l-5.7-5.7-1.3-1.3h0L34 11a6.19 6.19 0 0 0 1.7-3.3c0-.1 0-.2.1-.3v-.3V6v-.1-.3-.1c0-.1 0-.2-.1-.3 0-.1-.1-.2-.1-.4 0-.1-.1-.2-.1-.3v-.1c0-.1-.1-.2-.1-.2v-.1c0-.1-.1-.2-.1-.2v-.1c-.1-.1-.1-.2-.2-.3s-.1-.2-.2-.3c0 0 0-.1-.1-.1 0-.1-.1-.1-.1-.2l-.1-.1-.2-.2s0-.1-.1-.1c-.1-.1-.2-.2-.2-.3C32.9 1 31.3.4 29.7.4c-.3 0-.6 0-.9.1h-.3c-1.2.2-2.3.8-3.2 1.7h0l-4 3.8L18 9.2 14.8 6 11 2.2C8.6-.2 4.6-.2 2.2 2.2c-.1.1-.2.1-.3.2 0 0 0 .1-.1.1 0 .1-.1.2-.1.2l-.1.1c0 .1-.1.2-.1.2s0 .1-.1.1c-.1.1-.1.2-.2.3s-.1.2-.2.3v.1c0 .1-.1.2-.1.2v.1c0 .1-.1.2-.1.2v.1c0 .1-.1.2-.1.3s-.1.2-.1.3v.1c0 .1 0 .2-.1.2v.1.2.1.7.1.3.1.3.1c.1 1.4.7 2.7 1.7 3.7l7.1 7.1L8 19.4l-5.7 5.7c-2.4 2.4-2.4 6.4 0 8.8s6.4 2.4 8.8 0l7.1-7.1 7.1 7.1c2.4 2.4 6.4 2.4 8.8 0 2.3-2.4 2.3-6.4-.2-8.8z" data-fill fill="#ff4a17"/></svg>',
		},
	}),
	...prefixAttributesCreator({
		obj: rawIcon,
		prefix: 'play-',
		diffValAttr: {
			'play-icon-stroke-general': 0,
			'play-icon-content':
				'<svg class="play-17-shape-maxi-svg" width="64px" height="64px" viewBox="0 0 36.099 36.099"><path d="M31.892 15.954l-8.856-5.166-7.189-4.193-9.181-5.166C4.69.272 2.747 1.199 2.747 3.491v29.12c0 2.284 1.943 3.215 3.919 2.063l9.019-5.166 7.272-4.193 8.898-5.166c1.971-1.157 2.009-3.042.036-4.194z" data-fill fill="#ff4a17"/></svg>',
		},
	}),
};

const video = {
	...rawVideo,
	...icons,
};

export default video;
