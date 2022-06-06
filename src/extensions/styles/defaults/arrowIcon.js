import prefixAttributesCreator from '../prefixAttributesCreator';
import { icon } from './icon';
import padding from './padding';

const prefix = 'navigation-arrow-both-';

const arrowIcon = {
	...prefixAttributesCreator({
		obj: icon,
		prefix,
		diffValAttr: {
			'navigation-arrow-both-icon-width-general': '20',
		},
		exclAttr: [
			'icon-inherit',
			'icon-only',
			'icon-position',
			'icon-content',
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
};

export default arrowIcon;
