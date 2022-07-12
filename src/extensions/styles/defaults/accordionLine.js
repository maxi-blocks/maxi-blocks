import prefixAttributesCreator from '../prefixAttributesCreator';
import divider from './divider';
import dividerHover from './dividerHover';

const accordionLine = {
	...divider,
	...dividerHover,
	'line-status-hover': {
		type: 'boolean',
		default: false,
	},
	'line-status-active': {
		type: 'boolean',
		default: false,
	},
	...prefixAttributesCreator({
		obj: divider,
		prefix: 'active-',
	}),
};

export default accordionLine;
