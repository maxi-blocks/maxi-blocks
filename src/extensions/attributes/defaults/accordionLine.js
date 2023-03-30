import prefixAttributesCreator from '../prefixAttributesCreator';
import divider from './divider';
import dividerHover from './dividerHover';

const accordionLineAttributes = {
	'_li.sh': {
		type: 'boolean',
		default: false,
		longLabel: 'line-status-hover',
	},
	'_li.sa': {
		type: 'boolean',
		default: false,
		longLabel: 'line-status-active',
	},
};

const rawAccordionLine = {
	...divider,
	'di-bo_pc-general': {
		type: 'number',
		default: 3,
		longLabel: 'divider-border-palette-color-general',
	},
	'di_w-general': {
		type: 'number',
		default: 100,
		longLabel: 'divider-width-general',
	},
	...dividerHover,
	'di_w-general.h': {
		type: 'number',
		default: 100,
		longLabel: 'divider-width-general-hover',
	},
	...accordionLineAttributes,
	...prefixAttributesCreator({
		obj: divider,
		prefix: 'a-',
		longPrefix: 'active-',
		diffValAttr: {
			'a-db_pc-general': 3, // active-divider-border-palette-color-general
			'a-di_w-general': 100, // active-divider-width-general
		},
	}),
};

const accordionLine = {
	...prefixAttributesCreator({
		obj: rawAccordionLine,
		prefix: 'he-',
		longPrefix: 'header-',
	}),
	...prefixAttributesCreator({
		obj: rawAccordionLine,
		prefix: 'c-',
		longPrefix: 'content-',
	}),
};

export default accordionLine;
