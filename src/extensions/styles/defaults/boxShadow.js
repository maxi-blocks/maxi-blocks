import breakpointAttributesCreator from '../breakpointAttributesCreator';
import paletteAttributesCreator from '../paletteAttributesCreator';

const prefix = 'box-shadow-';

const rawBoxShadow = {
	...paletteAttributesCreator({ prefix, palette: 8 }),
	'box-shadow-horizontal': {
		type: 'number',
	},
	'box-shadow-vertical': {
		type: 'number',
	},
	'box-shadow-blur': {
		type: 'number',
	},
	'box-shadow-spread': {
		type: 'number',
	},
};
const boxShadow = breakpointAttributesCreator({
	obj: rawBoxShadow,
});

export default boxShadow;
