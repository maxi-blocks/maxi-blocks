import prefixAttributesCreator from '../prefixAttributesCreator';
import { typography } from './typography';
import typographyHover from './typographyHover';

const prefix = 'menu-item-';

const menuItem = {
	...prefixAttributesCreator({
		obj: typography,
		prefix,
	}),
	...prefixAttributesCreator({
		obj: typographyHover,
		prefix,
	}),
	...prefixAttributesCreator({
		obj: typography,
		prefix: `active-${prefix}`,
	}),
	'menu-item-typography-status-active': {
		type: 'boolean',
		default: false,
	},
};

export default menuItem;
