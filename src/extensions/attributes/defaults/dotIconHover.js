import hoverAttributesCreator from '../hoverAttributesCreator';
import dotIcon from './dotIcon';

const dotIconHover = hoverAttributesCreator({
	obj: dotIcon,
	diffValAttr: {
		'nd-i-bs_pc-general': 6, // navigation-dot-icon-box-shadow-palette-color-general
	},
	newAttr: {
		'nd-i.sh': {
			type: 'boolean',
			default: false,
			longLabel: 'navigation-dot-icon-status-hover',
		},
		'nd-i-str_ps.h': {
			type: 'boolean',
			default: true,
			longLabel: 'navigation-dot-icon-stroke-palette-status-hover',
		},
		'nd-i-f_ps.h': {
			type: 'boolean',
			default: true,
			longLabel: 'navigation-dot-icon-fill-palette-status-hover',
		},
		'nd-i-str_pc.h': {
			type: 'number',
			default: 2,
			longLabel: 'navigation-dot-icon-stroke-palette-color-hover',
		},
		'nd-i-f_pc.h': {
			type: 'number',
			default: 6,
			longLabel: 'navigation-dot-icon-fill-palette-color-hover',
		},
		'nd-i-bs.sh': {
			type: 'boolean',
			default: false,
			longLabel: 'navigation-dot-icon-box-shadow-status-hover',
		},
	},
});

export default dotIconHover;
