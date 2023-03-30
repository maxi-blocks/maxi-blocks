import breakpointAttributesCreator from '../breakpointAttributesCreator';
import paletteAttributesCreator from '../paletteAttributesCreator';

const rawLink = {
	...paletteAttributesCreator({
		prefix: '_l-',
		longPrefix: 'link-',
		palette: 4,
	}),
	...paletteAttributesCreator({
		prefix: '_lih-',
		longPrefix: 'link-hover-',
		palette: 6,
	}),
	...paletteAttributesCreator({
		prefix: '_lia-',
		longPrefix: 'link-active-',
		palette: 6,
	}),
	...paletteAttributesCreator({
		prefix: '_liv-',
		longPrefix: 'link-visited-',
		palette: 6,
	}),
};

export default breakpointAttributesCreator({
	obj: rawLink,
});
