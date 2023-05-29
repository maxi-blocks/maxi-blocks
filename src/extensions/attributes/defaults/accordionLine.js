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
	'di-bo_pc-g': {
		type: 'number',
		default: 3,
		longLabel: 'divider-border-palette-color-g',
	},
	'di_w-g': {
		type: 'number',
		default: 100,
		longLabel: 'divider-width-g',
	},
	...dividerHover,
	'di_w-g.h': {
		type: 'number',
		default: 100,
		longLabel: 'divider-width-g-hover',
	},
	...accordionLineAttributes,
	...prefixAttributesCreator({
		obj: divider,
		prefix: 'a-',
		longPrefix: 'active-',
		diffValAttr: {
			'a-db_pc-g': 3, // active-divider-border-palette-color-g
			'a-di_w-g': 100, // active-divider-width-g
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
