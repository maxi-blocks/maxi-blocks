import prefixAttributesCreator from '../prefixAttributesCreator';
import breakpointAttributesCreator from '../breakpointAttributesCreator';
import attributesShorter from '../dictionary/attributesShorter';

import { rawBorder } from './border';

const prefix = 'divider-';
const rawDivider = {
	'divider-border-top': {
		type: 'number',
		default: 2,
	},
	'divider-border-top-unit': {
		type: 'string',
		default: 'px',
	},
	'divider-border-right': {
		type: 'number',
		default: 2,
	},
	'divider-border-right-unit': {
		type: 'string',
		default: 'px',
	},
	'divider-border-radius': {
		type: 'boolean',
		default: false,
	},
	'divider-width': {
		type: 'number',
		default: 50,
	},
	'divider-width-unit': {
		type: 'string',
		default: '%',
	},
	'divider-height': {
		type: 'number',
		default: 100,
	},
	'line-align': {
		type: 'string',
		default: 'row',
	},
	'line-vertical': {
		type: 'string',
		default: 'center',
	},
	'line-horizontal': {
		type: 'string',
		default: 'center',
	},
	'line-orientation': {
		type: 'string',
		default: 'horizontal',
	},
	...prefixAttributesCreator({
		prefix,
		obj: rawBorder,
		diffValAttr: {
			'divider-border-palette-color': 4,
			'divider-border-style': 'solid',
		},
	}),
};

export default attributesShorter(
	breakpointAttributesCreator({
		obj: rawDivider,
	}),
	'divider'
);
