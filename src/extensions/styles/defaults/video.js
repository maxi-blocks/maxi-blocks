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
	reduceBorders: {
		type: 'boolean',
		default: false,
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
		},
	}),
	...prefixAttributesCreator({
		obj: rawIcon,
		prefix: 'play-',
		diffValAttr: {
			'play-icon-stroke-general': 0,
		},
	}),
};

const video = {
	...rawVideo,
	...icons,
};

export default video;
