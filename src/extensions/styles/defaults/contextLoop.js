import prefixAttributesCreator from '../prefixAttributesCreator';
import { typography } from './typography';
import flex from './flex';
import paletteAttributesCreator from '../paletteAttributesCreator';

const prefix = 'cl-pagination-';

const contextLoop = {
	'cl-status': {
		type: 'boolean',
	},
	'cl-type': {
		type: 'string',
	},
	'cl-relation': {
		type: 'string',
	},
	'cl-id': {
		type: 'number',
	},
	'cl-author': {
		type: 'number',
	},
	'cl-order-by': {
		type: 'string',
	},
	'cl-order': {
		type: 'string',
	},
	'cl-accumulator': {
		type: 'number',
	},
	'cl-grandchild-accumulator': {
		type: 'boolean',
		default: false,
	},
	'cl-pagination': {
		type: 'boolean',
		default: false,
	},
	'cl-pagination-per-page': {
		type: 'number',
		default: 3,
	},
	'cl-pagination-total': {
		type: 'number',
	},
	'cl-pagination-total-all': {
		type: 'boolean',
		default: true,
	},
	'cl-pagination-show-page-list': {
		type: 'boolean',
		default: true,
	},
	'cl-pagination-previous-text': {
		type: 'string',
		default: 'Previous',
	},
	'cl-pagination-next-text': {
		type: 'string',
		default: 'Next',
	},
	...prefixAttributesCreator({
		obj: typography,
		prefix,
	}),
	...paletteAttributesCreator({
		prefix: `${prefix}link-hover-`,
		palette: 4,
	}),
	...paletteAttributesCreator({
		prefix: `${prefix}link-current-`,
		palette: 6,
	}),
	...prefixAttributesCreator({
		obj: flex,
		prefix,
	}),
};

export default contextLoop;
