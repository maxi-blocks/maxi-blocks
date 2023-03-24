import attributesShorter from '../dictionary/attributesShorter';
import getAttributeKey from '../getAttributeKey';
import hoverAttributesCreator from '../hoverAttributesCreator';
import clipPath from './clipPath';

const clipPathHover = hoverAttributesCreator({
	obj: clipPath,
	sameValAttr: ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'].map(breakpoint =>
		getAttributeKey('clip-path-status', false, '', breakpoint)
	),
});

export default attributesShorter(clipPathHover, 'clipPathHover');
