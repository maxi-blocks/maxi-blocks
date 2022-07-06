import { icon } from './icon';
import prefixAttributesCreator from '../prefixAttributesCreator';
import { iconHover } from './iconHover';

const accordionIcon = {
	...prefixAttributesCreator({
		obj: icon,
		prefix: 'active-',
		diffValAttr: {
			'active-icon-stroke-palette-color': 5,
			'active-icon-content':
				'<svg class="arrow-up-2-line-maxi-svg" width="64px" height="64px" viewBox="0 0 24 24"><path d="M2.9 17.25L12 6.75l9.1 10.5" fill="none" data-stroke="" stroke="#081219" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"></path></svg>',
		},
	}),
	...icon,
	...iconHover,
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
