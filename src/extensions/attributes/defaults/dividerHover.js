import attributesShorter from '../dictionary/attributesShorter';
import hoverAttributesCreator from '../hoverAttributesCreator';
import divider from './divider';

const dividerHover = hoverAttributesCreator({
	obj: divider,
});

export default attributesShorter(dividerHover, 'dividerHover');
