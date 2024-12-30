import breakpointAttributesCreator from '@extensions/styles/breakpointAttributesCreator';
import paletteAttributesCreator from '@extensions/styles/paletteAttributesCreator';

const prefix = 'box-shadow-';

const rawBoxShadow = {
	...paletteAttributesCreator({ prefix, palette: 8, opacity: 1 }),
	'box-shadow-inset': { type: 'boolean', default: false },
	'box-shadow-horizontal': {
		type: 'number',
		default: 0,
	},
	'box-shadow-horizontal-unit': {
		type: 'string',
		default: 'px',
	},
	'box-shadow-vertical': {
		type: 'number',
		default: 0,
	},
	'box-shadow-vertical-unit': {
		type: 'string',
		default: 'px',
	},
	'box-shadow-blur': {
		type: 'number',
		default: 0,
	},
	'box-shadow-blur-unit': {
		type: 'string',
		default: 'px',
	},
	'box-shadow-spread': {
		type: 'number',
		default: 0,
	},
	'box-shadow-spread-unit': {
		type: 'string',
		default: 'px',
	},
};
const boxShadow = breakpointAttributesCreator({
	obj: rawBoxShadow,
});

export default boxShadow;
