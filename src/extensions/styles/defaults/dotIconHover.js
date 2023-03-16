import hoverAttributesCreator from '../hoverAttributesCreator';
import dotIcon from './dotIcon';

const dotIconHover = hoverAttributesCreator({
	obj: dotIcon,
	diffValAttr: {
		'navigation-dot-icon-box-shadow-pac-general': 6,
	},
	newAttr: {
		'navigation-dot-icon-status-hover': {
			type: 'boolean',
			default: false,
		},
		'navigation-dot-icon-stroke-pa-status-hover': {
			type: 'boolean',
			default: true,
		},
		'navigation-dot-icon-fill-pa-status-hover': {
			type: 'boolean',
			default: true,
		},
		'navigation-dot-icon-stroke-pac-hover': {
			type: 'number',
			default: 2,
		},
		'navigation-dot-icon-fill-pac-hover': {
			type: 'number',
			default: 6,
		},
		'navigation-dot-icon-box-shadow-status-hover': {
			type: 'boolean',
			default: false,
		},
	},
});

export default dotIconHover;
