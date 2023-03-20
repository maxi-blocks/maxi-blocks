import attributesShorter from '../dictionary/attributesShorter';
import hoverAttributesCreator from '../hoverAttributesCreator';
import display from './display';

const displayHover = hoverAttributesCreator({
	obj: display,
	diffValAttr: { 'box-shadow-palette-color-general': 6 },
});

export default attributesShorter(displayHover, 'displayHover');
