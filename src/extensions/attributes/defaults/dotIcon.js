import prefixAttributesCreator from '../prefixAttributesCreator';
import breakpointAttributesCreator from '../breakpointAttributesCreator';
import {
	icon,
	iconBackground,
	iconBackgroundColor,
	iconBackgroundGradient,
	iconBoxShadow,
	iconPadding,
} from './icon';
import { iconBorder, iconBorderRadius, iconBorderWidth } from './iconBorder';

const prefix = 'nd-'; // navigation-dot-

const dotIcon = {
	...prefixAttributesCreator({
		obj: {
			...icon,
			...iconPadding,
			...iconBackground,
			...iconBackgroundColor,
			...iconBackgroundGradient,
			...iconBorder,
			...iconBorderRadius,
			...iconBorderWidth,
			...iconBoxShadow,
		},
		prefix,
		diffValAttr: {
			// navigation-dot-icon-width-general
			'nd-i-w-general': '10',
			// navigation-dot-icon-stroke-palette-color
			'nd-i-str-palette-color': 5,
			// navigation-dot-icon-fill-palette-color
			'nd-i-f-palette-color': 3,
			// navigation-dot-icon-border-radius-unit-general
			'nd-i-bo-ra.u-general': 'px',
			// navigation-dot-icon-background-active-media-general
			'nd-i-bam-general': 'none',
			// navigation-dot-icon-content
			'nd-i-c':
				'<svg class="circle-2-shape-maxi-svg__3" width="64px" height="64px" viewBox="0 0 36.1 36.1"><circle cx="18" cy="18" r="17.2" data-fill  fill="var(--maxi-light-icon-fill,rgba(var(--maxi-light-color-5,0,0,0),1))"/></svg>',
			// navigation-dot-svgType
			'nd-st': 'Shape',
		},
		exclAttr: [
			'i-i', // icon-inherit
			'i-on', // icon-only
			'i-pos', // icon-position
			'i-spa', // icon-spacing
		],
		newAttr: {
			'nd-i-bo.s': {
				type: 'boolean',
				default: false,
				longLabel: 'navigation-dot-icon-border-status',
			},
			'nd-i-b.s': {
				type: 'boolean',
				default: false,
				longLabel: 'navigation-dot-icon-background-status',
			},
			'nd-i-bs.s': {
				type: 'boolean',
				default: false,
				longLabel: 'navigation-dot-icon-box-shadow-status',
			},
		},
	}),
	...breakpointAttributesCreator({
		obj: {
			'nd-i-sh': {
				type: 'number',
				default: 50,
				longLabel: 'navigation-dot-icon-spacing-horizontal',
			},
			'nd-i-sv': {
				type: 'number',
				default: 85,
				longLabel: 'navigation-dot-icon-spacing-vertical',
			},
			'nd-i-sb': {
				type: 'number',
				default: 3,
				longLabel: 'navigation-dot-icon-spacing-between',
			},
		},
	}),
};

export default dotIcon;
