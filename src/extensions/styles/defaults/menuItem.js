import prefixAttributesCreator from '../prefixAttributesCreator';
import { typography } from './typography';

const menuItem = {
	...prefixAttributesCreator({
		obj: typography,
		prefix: 'menu-item-',
	}),
};

export default menuItem;
