import hoverAttributesCreator from '../hoverAttributesCreator';
import arrowIcon from './arrowIcon';

const arrowIconHover = hoverAttributesCreator({
	obj: arrowIcon,
	diffValAttr: {
		// navigation-arrow-both-icon-background-gradient-opacity-general-hover
		'nab-i-bg_o-general.h': 1,
		// navigation-arrow-both-icon-background-palette-color-general-hover
		'nab-i-b_pc-general.h': 6,
		// navigation-arrow-both-icon-background-active-media-general-hover
		'nab-i-b_am-general.h': 'none',
		// navigation-arrow-both-icon-box-shadow-palette-color-general
		'nab-i-bs_pc-general': 6,
	},
	newAttr: {
		'nab-i.sh': {
			type: 'boolean',
			default: false,
			longLabel: 'navigation-arrow-both-icon-status-hover',
		},
		'nab-i-str_ps.h': {
			type: 'boolean',
			default: true,
			longLabel: 'navigation-arrow-both-icon-stroke-palette-status-hover',
		},
		'nab-i-f_ps.h': {
			type: 'boolean',
			default: true,
			longLabel: 'navigation-arrow-both-icon-fill-palette-status-hover',
		},
		'nab-i-str_pc.h': {
			type: 'number',
			default: 6,
			longLabel: 'navigation-arrow-both-icon-stroke-palette-color-hover',
		},
		'nab-i-f_pc.h': {
			type: 'number',
			default: 2,
			longLabel: 'navigation-arrow-both-icon-fill-palette-color-hover',
		},
		'nab-i-bs.sh': {
			type: 'boolean',
			default: false,
			longLabel: 'navigation-arrow-both-icon-box-shadow-status-hover',
		},
	},
});

export default arrowIconHover;
