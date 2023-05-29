import hoverAttributesCreator from '../hoverAttributesCreator';
import arrowIcon from './arrowIcon';

const arrowIconHover = hoverAttributesCreator({
	obj: arrowIcon,
	diffValAttr: {
		// navigation-arrow-both-icon-background-gradient-opacity-g-hover
		'nab-i-bg_o-g.h': 1,
		// navigation-arrow-both-icon-background-palette-color-g-hover
		'nab-i-b_pc-g.h': 6,
		// navigation-arrow-both-icon-background-active-media-g-hover
		'nab-i-b_am-g.h': 'none',
		// navigation-arrow-both-icon-box-shadow-palette-color-g
		'nab-i-bs_pc-g': 6,
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
