import prefixAttributesCreator from '../prefixAttributesCreator';
import boxShadow from './boxShadow';

const prefix = 'navigation-arrow-both-icon-';

const arrowIconBoxShadow = prefixAttributesCreator({
	obj: boxShadow,
	prefix,
});

export default arrowIconBoxShadow;
