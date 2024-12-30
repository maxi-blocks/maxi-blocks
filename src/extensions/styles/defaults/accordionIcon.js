import {
	icon,
	iconBackground,
	iconBackgroundColor,
	iconBackgroundGradient,
	iconPadding,
} from './icon';
import prefixAttributesCreator from '@extensions/styles/prefixAttributesCreator';
import {
	iconBackgroundHover,
	iconBackgroundColorHover,
	iconBackgroundGradientHover,
	iconHover,
} from './iconHover';
import { iconBorder, iconBorderRadius, iconBorderWidth } from './iconBorder';
import {
	iconBorderHover,
	iconBorderRadiusHover,
	iconBorderWidthHover,
} from './iconBorderHover';

const allIconAttributes = {
	...icon,
	...iconBackground,
	...iconBackgroundColor,
	...iconBackgroundGradient,
	...iconBorder,
	...iconBorderRadius,
	...iconBorderWidth,
	...iconPadding,
	...iconHover,
	...iconBackgroundHover,
	...iconBackgroundColorHover,
	...iconBackgroundGradientHover,
	...iconBorderHover,
	...iconBorderRadiusHover,
	...iconBorderWidthHover,
};

const accordionIcon = {
	...prefixAttributesCreator({
		obj: allIconAttributes,
		prefix: 'active-',
		diffValAttr: {
			'active-svgType': 'Line',
			'active-icon-stroke-palette-color': 5,
			'active-icon-inherit': false,
			'active-icon-content':
				'<svg class="arrow-up-2-line-maxi-svg" width="64px" height="64px" viewBox="0 0 24 24"><path d="M2.9 17.25L12 6.75l9.1 10.5" fill="none" data-stroke="" stroke="#081219" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"></path></svg>',
		},
	}),
	...allIconAttributes,

	svgType: {
		type: 'string',
		default: 'Line',
	},
	'icon-inherit': {
		type: 'boolean',
		default: false,
	},
	'icon-content': {
		type: 'string',
		default:
			'<svg class="arrow-down-2-line-maxi-svg" width="64px" height="64px" viewBox="0 0 24 24"><path d="M21.1 6.75L12 17.25 2.9 6.75" fill="none" data-stroke="" stroke="#081219" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"></path></svg>',
	},
	'icon-stroke-palette-color': {
		type: 'number',
		default: 5,
	},
};

export default accordionIcon;
