import prefixAttributesCreator from '@extensions/styles/prefixAttributesCreator';
import breakpointAttributesCreator from '@extensions/styles/breakpointAttributesCreator';
import {
	icon,
	iconBackground,
	iconBackgroundColor,
	iconBackgroundGradient,
	iconBoxShadow,
	iconPadding,
} from './icon';
import { iconBorder, iconBorderRadius, iconBorderWidth } from './iconBorder';

const prefix = 'navigation-dot-';

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
			'navigation-dot-icon-width-general': '10',
			'navigation-dot-icon-stroke-palette-color': 5,
			'navigation-dot-icon-fill-palette-color': 3,
			'navigation-dot-icon-border-unit-radius-general': 'px',
			'navigation-dot-icon-background-active-media-general': 'none',
			'navigation-dot-icon-content':
				'<svg class="circle-2-shape-maxi-svg__3" width="64px" height="64px" viewBox="0 0 36.1 36.1"><circle cx="18" cy="18" r="17.2" data-fill  fill="var(--maxi-light-icon-fill,rgba(var(--maxi-light-color-5,0,0,0),1))"/></svg>',
			'navigation-dot-svgType': 'Shape',
		},
		exclAttr: [
			'icon-inherit',
			'icon-only',
			'icon-position',
			'icon-spacing',
		],
		newAttr: {
			'navigation-dot-icon-status-border': {
				type: 'boolean',
				default: false,
			},
			'navigation-dot-icon-status-background': {
				type: 'boolean',
				default: false,
			},
			'navigation-dot-icon-status-shadow': {
				type: 'boolean',
				default: false,
			},
		},
	}),
	...breakpointAttributesCreator({
		obj: {
			'navigation-dot-icon-spacing-horizontal': {
				type: 'number',
				default: 50,
			},
			'navigation-dot-icon-spacing-vertical': {
				type: 'number',
				default: 85,
			},
			'navigation-dot-icon-spacing-between': {
				type: 'number',
				default: 3,
			},
		},
	}),
};

export default dotIcon;
