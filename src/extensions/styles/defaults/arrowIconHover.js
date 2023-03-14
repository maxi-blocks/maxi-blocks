import hoverAttributesCreator from '../hoverAttributesCreator';
import arrowIcon from './arrowIcon';

const arrowIconHover = hoverAttributesCreator({
	obj: arrowIcon,
	diffValAttr: {
		'navigation-arrow-both-icon-background-gradient-o-general-hover': 1,
		'navigation-arrow-both-icon-background-pac-general-hover': 6,
		'navigation-arrow-both-icon-background-active-media-general-hover':
			'none',
		'navigation-arrow-both-icon-box-shadow-pac-general': 6,
	},
	newAttr: {
		'navigation-arrow-both-icon-status-hover': {
			type: 'boolean',
			default: false,
		},
		'navigation-arrow-both-icon-stroke-past-hover': {
			type: 'boolean',
			default: true,
		},
		'navigation-arrow-both-icon-fill-past-hover': {
			type: 'boolean',
			default: true,
		},
		'navigation-arrow-both-icon-stroke-pac-hover': {
			type: 'number',
			default: 6,
		},
		'navigation-arrow-both-icon-fill-pac-hover': {
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
