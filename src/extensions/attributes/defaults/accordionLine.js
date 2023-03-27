import prefixAttributesCreator from '../prefixAttributesCreator';
import divider from './divider';
import dividerHover from './dividerHover';

const accordionLineAttributes = {
	'li.sh': {
		type: 'boolean',
		default: false,
		longLabel: 'line-status-hover',
	},
	'li.sa': {
		type: 'boolean',
		default: false,
		longLabel: 'line-status-active',
	},
};

const rawAccordionLine = {
	...divider,
	'db-pc-general': {
		type: 'number',
		default: 3,
		longLabel: 'divider-border-palette-color-general',
	},
	'dw-general': {
		type: 'number',
		default: 100,
		longLabel: 'divider-width-general',
	},
	...dividerHover,
	'dw-general.h': {
		type: 'number',
		default: 100,
		longLabel: 'divider-width-general-hover',
	},
	...accordionLineAttributes,
	...prefixAttributesCreator({
		obj: divider,
		prefix: 'a-', // active-
		diffValAttr: {
			'a-db-pc-general': 3, // active-divider-border-palette-color-general
			'a-dw-general': 100, // active-divider-width-general
		},
	}),
};

const accordionLine = {
	...prefixAttributesCreator({
		obj: rawAccordionLine,
		prefix: 'he-', // he-
	}),
	...prefixAttributesCreator({
		obj: rawAccordionLine,
		prefix: 'c-', // content-
	}),
};

export default accordionLine;
