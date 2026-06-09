import { prefixAttributesCreator } from '@extensions/styles';

const prefix = 'fixture-';
const attributes = {
	'plain-setting': {
		type: 'string',
	},
	ariaLabels: {
		type: 'object',
	},
	blockStyle: {
		type: 'string',
	},
	preview: {
		type: 'boolean',
	},
	'transition-canvas-selected': {
		type: 'boolean',
	},
	'excluded-setting': {
		type: 'string',
	},
	'missing-setting': {
		type: 'string',
	},
	'advanced-css-general': {
		type: 'string',
	},
	'opacity-general-hover': {
		type: 'number',
	},
	'cl-source': {
		type: 'string',
	},
	'palette-test-palette-status': {
		type: 'boolean',
	},
	'palette-test-color': {
		type: 'string',
	},
	...prefixAttributesCreator({
		obj: {
			'gap-general': {
				type: 'number',
			},
			'width-general': {
				type: 'number',
			},
		},
		prefix,
	}),
};

export default attributes;
