import prefixAttributesCreator from '../prefixAttributesCreator';
import breakpointAttributesCreator from '../breakpointAttributesCreator';
import { icon } from './icon';

const prefix = 'navigation-arrow-both-';

const arrowIcon = {
	...prefixAttributesCreator({
		obj: icon,
		prefix,
		diffValAttr: {
			'navigation-arrow-both-icon-width-general': '20',
			'navigation-arrow-both-icon-stroke-palette-color': 5,
		},
		exclAttr: [
			'icon-inherit',
			'icon-only',
			'icon-position',
			'icon-content',
			'icon-spacing',
		],
	}),
	...{
		'navigation-arrow-first-icon-content': {
			type: 'string',
			default:
				'<svg class="arrow-left-line-maxi-svg" width="64px" height="64px" viewBox="0 0 24 24" fill="none" data-stroke stroke="#081219" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"><path d="M8.85 19l-7-7 7-7m-7 7h20.3"/></svg>',
		},
		'navigation-arrow-second-icon-content': {
			type: 'string',
			default:
				'<svg class="arrow-right-line-maxi-svg" width="64px" height="64px" viewBox="0 0 24 24" fill="none" data-stroke stroke="#081219" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"><path d="M15.15 5l7 7-7 7m7-7H1.85"/></svg>',
		},
	},
	...breakpointAttributesCreator({
		obj: {
			'navigation-arrow-both-icon-spacing-horizontal': {
				type: 'number',
				default: -40,
			},
			'navigation-arrow-both-icon-spacing-vertical': {
				type: 'number',
				default: 50,
			},
		},
	}),
	...{
		'navigation-arrow-first-svgType': {
			type: 'string',
			default: 'Line',
		},
	},
	...{
		'navigation-arrow-second-svgType': {
			type: 'string',
			default: 'Line',
		},
	},
};

export default arrowIcon;
