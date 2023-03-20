import attributesShorter from '../dictionary/attributesShorter';
import prefixAttributesCreator from '../prefixAttributesCreator';
import divider from './divider';
import dividerHover from './dividerHover';

const accordionLineAttributes = {
	'line-status-hover': {
		type: 'boolean',
		default: false,
	},
	'line-status-active': {
		type: 'boolean',
		default: false,
	},
};

const rawAccordionLine = {
	...divider,
	'divider-border-palette-color-general': {
		type: 'number',
		default: 3,
	},
	'divider-width-general': {
		type: 'number',
		default: 100,
	},
	...dividerHover,
	'divider-width-general-hover': {
		type: 'number',
		default: 100,
	},
	...attributesShorter(accordionLineAttributes, 'accordionLine'),
	...prefixAttributesCreator({
		obj: divider,
		prefix: 'active-',
		diffValAttr: {
			'active-divider-border-palette-color-general': 3,
			'active-divider-width-general': 100,
		},
	}),
};

const accordionLine = {
	...prefixAttributesCreator({
		obj: rawAccordionLine,
		prefix: 'header-',
	}),
	...prefixAttributesCreator({
		obj: rawAccordionLine,
		prefix: 'content-',
	}),
};

export default attributesShorter(accordionLine, 'accordionLine');
