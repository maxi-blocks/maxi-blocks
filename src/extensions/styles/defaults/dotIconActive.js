import activeAttributesCreator from '../activeAttributesCreator';
import dotIcon from './dotIcon';

const dotIconActive = activeAttributesCreator({
	obj: dotIcon,
	newAttr: {
		'navigation-dot-icon-status-active': {
			type: 'boolean',
			default: true,
		},
		'navigation-dot-icon-stroke-palette-status-active': {
			type: 'boolean',
			default: true,
		},
		'navigation-dot-icon-fill-palette-status-active': {
			type: 'boolean',
			default: true,
		},
		'navigation-dot-icon-stroke-palette-color-active': {
			type: 'number',
			default: 2,
		},
		'navigation-dot-icon-fill-palette-color-active': {
			type: 'number',
			default: 5,
		},
	},
});

export default dotIconActive;
