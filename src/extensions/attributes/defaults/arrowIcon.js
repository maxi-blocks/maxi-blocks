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

const prefix = 'na-b-'; // navigation-arrow-both-

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
		diffValAttr: {
			'na-b-i-w-general': '20', // navigation-arrow-both-icon-width-general
			'na-b-i-str-pc': 5, // navigation-arrow-both-icon-stroke-palette-color
			'na-b-i-bam-general': 'none', // navigation-arrow-both-icon-background-active-media-general
			'na-b-i-bo-ra.u-general': 'px', // navigation-arrow-both-icon-border-radius-unit-general
		},
		exclAttr: [
			'i-i', // 'icon-inherit'
			'i-on', // 'icon-only'
			'i-pos', // 'icon-position'
			'i-c', // 'icon-content'
			'i-spa', // 'icon-spacing'
		],
		newAttr: {
			'na-b-i-b.s': {
				type: 'boolean',
				default: false,
				longLabel: 'navigation-arrow-both-icon-background-status',
			},
			'na-b-i-bo.s': {
				type: 'boolean',
				default: false,
				longLabel: 'navigation-arrow-both-icon-border-status',
			},
			'na-b-i-bs.s': {
				type: 'boolean',
				default: false,
				longLabel: 'navigation-arrow-both-icon-box-shadow-status',
			},
		},
	}),
	...{
		// navigation-arrow-first-icon-content
		'na-fi-i-c': {
			type: 'string',
			default:
				'<svg class="arrow-left-line-maxi-svg" width="64px" height="64px" viewBox="0 0 24 24" fill="none" data-stroke stroke="#081219" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"><path d="M8.85 19l-7-7 7-7m-7 7h20.3"/></svg>',
		},
		// navigation-arrow-second-icon-content
		'na-sec-i-c': {
			type: 'string',
			default:
				'<svg class="arrow-right-line-maxi-svg" width="64px" height="64px" viewBox="0 0 24 24" fill="none" data-stroke stroke="#081219" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"><path d="M15.15 5l7 7-7 7m7-7H1.85"/></svg>',
		},
	},
	...breakpointAttributesCreator({
		obj: {
			'na-b-i-sh': {
				type: 'number',
				default: -40,
				longLabel: 'navigation-arrow-both-icon-spacing-horizontal',
			},
			'na-b-i-sv': {
				type: 'number',
				default: 50,
				longLabel: 'navigation-arrow-both-icon-spacing-vertical',
			},
		},
	}),
	'na-fi-st': {
		type: 'string',
		default: 'Line',
		longLabel: 'navigation-arrow-first-svgType',
	},
	'na-sec-st': {
		type: 'string',
		default: 'Line',
		longLabel: 'navigation-arrow-second-svgType',
	},
};

export default arrowIcon;
