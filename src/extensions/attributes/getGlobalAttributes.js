import * as defaultAttributes from '../styles/defaults';

const attributesList = new Map();

export const getGlobalAttributes = (attrs = []) => {
	Array.from(Object.keys(defaultAttributes)).forEach(item => {
		attributesList.set(item, defaultAttributes[item]);
	});

	let attributes = {
		...defaultAttributes.breakpoints,
		blockStyle: {
			type: 'string',
		},
		blockStyleBackground: {
			type: 'number',
			default: 1,
		},
		defaultBlockStyle: {
			type: 'string',
			default: 'maxi-def-light',
		},
		extraClassName: {
			type: 'string',
			default: '',
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
	};

	attrs.forEach(requestedProperty => {
		attributes = {
			...attributes,
			...attributesList.get(requestedProperty),
		};
	});

	return attributes;
};
