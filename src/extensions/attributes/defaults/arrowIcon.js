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

const prefix = 'nab-'; // navigation-arrow-both-
const longPrefix = 'navigation-arrow-both-';

const arrowIcon = {
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
			'nab-i_w-g': '20', // navigation-arrow-both-icon-width-g
			'nab-i-str_pc': 5, // navigation-arrow-both-icon-stroke-palette-color
			'nab-i-b_am-g': 'none', // navigation-arrow-both-icon-background-active-media-g
			'nab-i-bo.ra.u-g': 'px', // navigation-arrow-both-icon-border-radius-unit-g
		},
		exclAttr: [
			'i_i', // 'icon-inherit'
			'i_on', // 'icon-only'
			'i_pos', // 'icon-position'
			'i_c', // 'icon-content'
			'i_spa', // 'icon-spacing'
		],
		newAttr: {
			'nab-i-b.s': {
				type: 'boolean',
				default: false,
				longLabel: 'navigation-arrow-both-icon-background-status',
			},
			'nab-i-bo.s': {
				type: 'boolean',
				default: false,
				longLabel: 'navigation-arrow-both-icon-border-status',
			},
			'nab-i-bs.s': {
				type: 'boolean',
				default: false,
				longLabel: 'navigation-arrow-both-icon-box-shadow-status',
			},
		},
	}),
	...{
		'naf-i_c': {
			type: 'string',
			default:
				'<svg class="arrow-left-line-maxi-svg" width="64px" height="64px" viewBox="0 0 24 24" fill="none" data-stroke stroke="#081219" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"><path d="M8.85 19l-7-7 7-7m-7 7h20.3"/></svg>',
			longLabel: 'navigation-arrow-first-icon-content',
		},
		'nas-i_c': {
			type: 'string',
			default:
				'<svg class="arrow-right-line-maxi-svg" width="64px" height="64px" viewBox="0 0 24 24" fill="none" data-stroke stroke="#081219" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"><path d="M15.15 5l7 7-7 7m7-7H1.85"/></svg>',
			longLabel: 'navigation-arrow-second-icon-content',
		},
	},
	...breakpointAttributesCreator({
		obj: {
			'nab-i_sh': {
				type: 'number',
				default: -40,
				longLabel: 'navigation-arrow-both-icon-spacing-horizontal',
			},
			'nab-i_sv': {
				type: 'number',
				default: 50,
				longLabel: 'navigation-arrow-both-icon-spacing-vertical',
			},
		},
	}),
	naf_st: {
		type: 'string',
		default: 'Line',
		longLabel: 'navigation-arrow-first-svgType',
	},
	nas_st: {
		type: 'string',
		default: 'Line',
		longLabel: 'navigation-arrow-second-svgType',
	},
};

export default arrowIcon;
