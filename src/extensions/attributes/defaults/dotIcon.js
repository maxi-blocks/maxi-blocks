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

const prefix = 'nd-';
const longPrefix = 'navigation-dot-';

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
		longPrefix,
		diffValAttr: {
			// navigation-dot-icon-width-g
			'nd-i_w-g': '10',
			// navigation-dot-icon-stroke-palette-color
			'nd-i-str_pc': 5,
			// navigation-dot-icon-fill-palette-color
			'nd-i-f_pc': 3,
			// navigation-dot-icon-border-radius-unit-g
			'nd-i_bo-ra.u-g': 'px',
			// navigation-dot-icon-background-active-media-g
			'nd-i-b_am-g': 'none',
			// navigation-dot-icon-content
			'nd-i_c':
				'<svg class="circle-2-shape-maxi-svg__3" width="64px" height="64px" viewBox="0 0 36.1 36.1"><circle cx="18" cy="18" r="17.2" data-fill  fill="var(--maxi-light-icon-fill,rgba(var(--maxi-light-color-5,0,0,0),1))"/></svg>',
			// navigation-dot-svgType
			nd_st: 'Shape',
		},
		exclAttr: [
			'i_i', // icon-inherit
			'i_on', // icon-only
			'i_pos', // icon-position
			'i_spa', // icon-spacing
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
			'nd-i_sh': {
				type: 'number',
				default: 50,
				longLabel: 'navigation-dot-icon-spacing-horizontal',
			},
			'nd-i_sv': {
				type: 'number',
				default: 85,
				longLabel: 'navigation-dot-icon-spacing-vertical',
			},
			'nd-i_sb': {
				type: 'number',
				default: 3,
				longLabel: 'navigation-dot-icon-spacing-between',
			},
		},
	}),
};

export default dotIcon;
