import { uniqueId } from 'lodash';
import breakpoints from './breakpoints';

const generateStyleID = () => {
	const id = uniqueId('maxi-');
	const obj = { type: 'string', default: id };

	return obj;
};

const global = {
	...breakpoints,
	'maxi-version-current': {
		type: 'string',
	},
	'maxi-version-origin': {
		type: 'string',
	},
	blockStyle: {
		type: 'string',
	},
	extraClassName: {
		type: 'string',
	},
	anchorLink: {
		type: 'string',
	},
	isFirstOnHierarchy: {
		type: 'boolean',
	},
	linkSettings: {
		type: 'object',
	},
	uniqueID: {
		type: 'string',
	},
	customLabel: {
		type: 'string',
	},
	relations: {
		type: 'array',
	},
	preview: { type: 'boolean', default: false },
	...generateStyleID(),
};

export default global;
