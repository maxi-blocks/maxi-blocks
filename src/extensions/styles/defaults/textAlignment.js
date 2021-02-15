/**
 * WordPress dependencies
 */
const { select } = wp.data;

const { isRTL } = select('core/editor').getEditorSettings();

const textAlignment = {
	'text-alignment-general': {
		type: 'string',
		default: isRTL ? 'right' : 'left',
	},
	'text-alignment-xxl': {
		type: 'string',
		default: '',
	},
	'text-alignment-xl': {
		type: 'string',
		default: '',
	},
	'text-alignment-l': {
		type: 'string',
		default: '',
	},
	'text-alignment-m': {
		type: 'string',
		default: '',
	},
	'text-alignment-s': {
		type: 'string',
		default: '',
	},
	'text-alignment-xs': {
		type: 'string',
		default: '',
	},
};

export default textAlignment;
