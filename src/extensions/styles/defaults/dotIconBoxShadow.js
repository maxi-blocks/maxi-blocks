import prefixAttributesCreator from '../prefixAttributesCreator';
import boxShadow from './boxShadow';

const prefix = 'navigation-dot-icon-';

const dotIconBoxShadow = prefixAttributesCreator({
	obj: boxShadow,
	prefix,
});

export default dotIconBoxShadow;
