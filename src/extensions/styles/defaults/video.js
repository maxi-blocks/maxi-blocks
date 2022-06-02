import prefixAttributesCreator from '../prefixAttributesCreator';
import { icon, iconBackground, iconPadding } from './icon';
import { iconBorder, iconBorderRadius, iconBorderWidth } from './iconBorder';

const rawVideo = {
	url: {
		type: 'string',
	},
	embedUrl: {
		type: 'string',
	},
	startTime: {
		type: 'string',
	},
	endTime: {
		type: 'string',
	},
	videoType: {
		type: 'string',
	},
	isLightbox: {
		type: 'boolean',
		default: false,
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
		default: false,
	},
	reduceBorders: {
		type: 'boolean',
		default: false,
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
	}),
	...prefixAttributesCreator({
		obj: rawIcon,
		prefix: 'play-',
	}),
};

const video = {
	...rawVideo,
	...icons,
};

export default video;
