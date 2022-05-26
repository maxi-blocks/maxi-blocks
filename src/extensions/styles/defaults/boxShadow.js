import breakpointAttributesCreator from '../breakpointAttributesCreator';
import paletteAttributesCreator from '../paletteAttributesCreator';

const prefix = 'box-shadow-';

const rawBoxShadow = {
	...paletteAttributesCreator({ prefix, palette: 8 }),
	'box-shadow-horizontal': {
		type: 'number',
	},
	'box-shadow-horizontal-unit': {
		type: 'string',
		default: 'px',
	},
	'box-shadow-vertical': {
		type: 'number',
	},
	'box-shadow-vertical-unit': {
		type: 'string',
		default: 'px',
	},
	'box-shadow-blur': {
		type: 'number',
	},
	'box-shadow-blur-unit': {
		type: 'string',
		default: 'px',
	},
	'box-shadow-spread': {
		type: 'number',
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
