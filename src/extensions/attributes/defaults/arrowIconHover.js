import hoverAttributesCreator from '../hoverAttributesCreator';
import arrowIcon from './arrowIcon';

const arrowIconHover = hoverAttributesCreator({
	obj: arrowIcon,
	diffValAttr: {
		// navigation-arrow-both-icon-background-gradient-opacity-general-hover
		'na-b-i-bg-o-general.h': 1,
		// navigation-arrow-both-icon-background-palette-color-general-hover
		'na-b-i-b-pc-general.h': 6,
		// navigation-arrow-both-icon-background-active-media-general-hover
		'na-b-i-bam-general.h': 'none',
		// navigation-arrow-both-icon-box-shadow-palette-color-general
		'na-b-i-bs-pc-general': 6,
	},
	newAttr: {
		'na-b-i.sh': {
			type: 'boolean',
			default: false,
			longLabel: 'navigation-arrow-both-icon-status-hover',
		},
		'na-b-i-str-pa.sh': {
			type: 'boolean',
			default: true,
			longLabel: 'navigation-arrow-both-icon-stroke-pa-status-hover',
		},
		'na-b-i-f-pa.sh': {
			type: 'boolean',
			default: true,
			longLabel: 'navigation-arrow-both-icon-fill-pa-status-hover',
		},
		'na-b-i-str-pc.h': {
			type: 'number',
			default: 6,
			longLabel: 'navigation-arrow-both-icon-stroke-palette-color-hover',
		},
		'na-b-i-fill-pc.h': {
			type: 'number',
			default: 2,
			longLabel: 'navigation-arrow-both-icon-fill-palette-color-hover',
		},
		'na-b-i-bs.sh': {
			type: 'boolean',
			default: false,
			longLabel: 'navigation-arrow-both-icon-box-shadow-status-hover',
		},
	},
});

export default arrowIconHover;
