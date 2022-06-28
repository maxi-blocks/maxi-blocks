import hoverAttributesCreator from '../hoverAttributesCreator';
import { arrowIcon } from './arrowIcon';

const arrowIconHover = hoverAttributesCreator({
	obj: arrowIcon,
	newAttr: {
		'navigation-arrow-both-icon-status-hover': {
			type: 'boolean',
			default: false,
		},
		'navigation-arrow-both-icon-stroke-palette-status-hover': {
			type: 'boolean',
			default: true,
		},
		'navigation-arrow-both-icon-fill-palette-status-hover': {
			type: 'boolean',
			default: true,
		},
		'navigation-arrow-both-icon-stroke-palette-color-hover': {
			type: 'number',
			default: 6,
		},
		'navigation-arrow-both-icon-fill-palette-color-hover': {
			type: 'number',
			default: 2,
		},
	},
});

export default arrowIconHover;
