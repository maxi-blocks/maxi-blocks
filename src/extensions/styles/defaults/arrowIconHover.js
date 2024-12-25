import hoverAttributesCreator from '@extensions/styles/hoverAttributesCreator';
import arrowIcon from './arrowIcon';

const arrowIconHover = hoverAttributesCreator({
	obj: arrowIcon,
	diffValAttr: {
		'navigation-arrow-both-icon-background-gradient-opacity-general-hover': 1,
		'navigation-arrow-both-icon-background-palette-color-general-hover': 6,
		'navigation-arrow-both-icon-background-active-media-general-hover':
			'none',
		'navigation-arrow-both-icon-box-shadow-palette-color-general': 6,
	},
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
		'navigation-arrow-both-icon-box-shadow-status-hover': {
			type: 'boolean',
			default: false,
		},
	},
});

export default arrowIconHover;
