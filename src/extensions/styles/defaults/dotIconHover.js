import hoverAttributesCreator from '@extensions/styles/hoverAttributesCreator';
import dotIcon from './dotIcon';

const dotIconHover = hoverAttributesCreator({
	obj: dotIcon,
	diffValAttr: {
		'navigation-dot-icon-box-shadow-palette-color-general': 6,
	},
	newAttr: {
		'navigation-dot-icon-status-hover': {
			type: 'boolean',
			default: false,
		},
		'navigation-dot-icon-stroke-palette-status-hover': {
			type: 'boolean',
			default: true,
		},
		'navigation-dot-icon-fill-palette-status-hover': {
			type: 'boolean',
			default: true,
		},
		'navigation-dot-icon-stroke-palette-color-hover': {
			type: 'number',
			default: 2,
		},
		'navigation-dot-icon-fill-palette-color-hover': {
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
