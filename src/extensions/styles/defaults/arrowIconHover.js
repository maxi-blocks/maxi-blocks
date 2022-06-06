import hoverAttributesCreator from '../hoverAttributesCreator';
import { arrowIcon } from './arrowIcon';

export const arrowIconHover = hoverAttributesCreator({
	obj: arrowIcon,
	diffValAttr: {
		'navigation-arrow-first-stroke-palette-color-hover': 6,
		'navigation-arrow-first-fill-palette-color-hover': 2,
		'navigation-arrow-first-width-general': '',
		'navigation-arrow-first-stroke-general': '',
		'navigation-arrow-second-stroke-palette-color-hover': 6,
		'navigation-arrow-second-fill-palette-color-hover': 2,
		'navigation-arrow-second-width-general': '',
		'navigation-arrow-second-stroke-general': '',
		'navigation-arrow-both-stroke-palette-color-hover': 6,
		'navigation-arrow-both-fill-palette-color-hover': 2,
		'navigation-arrow-both-width-general': '',
		'navigation-arrow-both-stroke-general': '',
	},
	newAttr: {
		'navigation-arrow-first-status-hover': {
			type: 'boolean',
			default: false,
		},
		'navigation-arrow-first-stroke-palette-status-hover': {
			type: 'boolean',
			default: true,
		},
		'navigation-arrow-first-fill-palette-status-hover': {
			type: 'boolean',
			default: true,
		},
		'navigation-arrow-second-status-hover': {
			type: 'boolean',
			default: false,
		},
		'navigation-arrow-second-stroke-palette-status-hover': {
			type: 'boolean',
			default: true,
		},
		'navigation-arrow-second-fill-palette-status-hover': {
			type: 'boolean',
			default: true,
		},
		'navigation-arrow-both-status-hover': {
			type: 'boolean',
			default: false,
		},
		'navigation-arrow-both-stroke-palette-status-hover': {
			type: 'boolean',
			default: true,
		},
		'navigation-arrow-both-fill-palette-status-hover': {
			type: 'boolean',
			default: true,
		},
	},
});
