import breakpointAttributesCreator from '../breakpointAttributesCreator';
import paletteAttributesCreator from '../paletteAttributesCreator';
import prefixAttributesCreator from '../prefixAttributesCreator';
import {
	icon,
	iconBackground,
	iconBackgroundColor,
	iconBackgroundGradient,
	iconPadding,
} from './icon';
import { iconBorder, iconBorderRadius, iconBorderWidth } from './iconBorder';
import {
	iconBorderHover,
	iconBorderRadiusHover,
	iconBorderWidthHover,
} from './iconBorderHover';
import {
	iconBackgroundColorHover,
	iconBackgroundGradientHover,
	iconBackgroundHover,
	iconHover,
} from './iconHover';

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
	...icon,
	...iconBackground,
	...iconHover,
	...iconBackgroundHover,
	...iconPadding,
	...{
		...iconBackgroundColor,
		'icon-background-palette-status-general': {
			type: 'boolean',
			default: true,
		},
		'icon-background-palette-color-general': {
			type: 'number',
			default: 4,
		},
	},
	...iconBackgroundColorHover,
	...iconBackgroundGradient,
	...iconBackgroundGradientHover,
	...iconBorder,
	...iconBorderWidth,
	...iconBorderRadius,
	...iconBorderHover,
	...iconBorderWidthHover,
	...iconBorderRadiusHover,
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
