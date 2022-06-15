import prefixAttributesCreator from '../prefixAttributesCreator';
import breakpointAttributesCreator from '../breakpointAttributesCreator';
import { icon } from './icon';

const prefix = 'navigation-dot-';

const dotIcon = {
	...prefixAttributesCreator({
		obj: icon,
		prefix,
		diffValAttr: {
			'navigation-dot-icon-width-general': '5',
			'navigation-dot-icon-stroke-palette-color': 5,
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
		'navigation-dot-icon-content': {
			type: 'string',
			default:
				'<svg class="circle-2-shape-maxi-svg__3" width="64px" height="64px" viewBox="0 0 36.1 36.1"><circle cx="18" cy="18" r="17.2" data-fill  fill="var(--maxi-light-icon-fill,rgba(var(--maxi-light-color-5,0,0,0),1))"/></svg>',
		},
	},
	...breakpointAttributesCreator({
		obj: {
			'navigation-dot-icon-spacing-horizontal': {
				type: 'number',
				default: 50,
			},
			'navigation-dot-icon-spacing-vertical': {
				type: 'number',
				default: 90,
			},
		},
	}),
};

export default dotIcon;
