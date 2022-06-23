import prefixAttributesCreator from '../prefixAttributesCreator';
import { icon } from './icon';

const prefix = 'navigation-active-dot-';

const dotIconActive = prefixAttributesCreator({
	obj: icon,
	prefix,
	diffValAttr: {
		[`${prefix}icon-width-general`]: '10',
		[`${prefix}icon-stroke-palette-color`]: 2,
		[`${prefix}icon-fill-palette-color`]: 5,
	},
	newAttr: {
		[`${prefix}icon-status`]: {
			type: 'boolean',
			default: true,
		},
		[`${prefix}icon-stroke-palette-status`]: {
			type: 'boolean',
			default: true,
		},
		[`${prefix}icon-fill-palette-status`]: {
			type: 'boolean',
			default: true,
		},
	},
	exclAttr: [
		'icon-inherit',
		'icon-only',
		'icon-position',
		'icon-content',
		'icon-spacing',
	],
});

export default dotIconActive;
