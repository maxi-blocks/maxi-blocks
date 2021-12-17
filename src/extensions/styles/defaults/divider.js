import prefixAttributesCreator from '../prefixAttributesCreator';
import { rawBorder } from './border';

const prefix = 'divider-';

const divider = {
	...prefixAttributesCreator({
		prefix,
		obj: rawBorder,
		diffValAttr: {
			'divider-border-palette-color': 4,
			'divider-border-style': 'solid',
		},
	}),
	'divider-border-top-width': {
		type: 'number',
		default: 2,
	},
	'divider-border-top-unit': {
		type: 'string',
		default: 'px',
	},
	'divider-border-right-width': {
		type: 'number',
		default: 2,
	},
	'divider-border-right-unit': {
		type: 'string',
		default: 'px',
	},
	'divider-border-radius': {
		type: 'string',
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
};

export default divider;
