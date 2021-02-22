import { background, backgroundColor } from './background';

const shapeDividerBackground = location => {
	const response = {};

	Object.keys(background).forEach(key => {
		const newKey = key.replace(
			'background-',
			`shape-divider-${location}-background-`
		);
		const value = { ...background[key] };

		if (value.type === 'string' || value.type === 'number')
			delete value.default;

		response[newKey] = value;
	});

	return response;
};

const shapeDividerBackgroundColor = location => {
	const response = {};

	Object.keys(backgroundColor).forEach(key => {
		const newKey = key.replace(
			'background-',
			`shape-divider-${location}-background-`
		);
		const value = { ...backgroundColor[key] };

		delete value.default;

		response[newKey] = value;
	});

	return response;
};

const shapeDivider = {
	'shape-divider-top-status': {
		type: 'boolean',
		default: false,
	},
	'shape-divider-top-height': {
		type: 'number',
		default: 100,
	},
	'shape-divider-top-height-unit': {
		type: 'string',
		default: 'px',
	},
	'shape-divider-top-opacity': {
		type: 'number',
		default: 1,
	},
	'shape-divider-top-shape-style': {
		type: 'string',
	},
	...shapeDividerBackground('top'),
	...shapeDividerBackgroundColor('top'),
	'shape-divider-top-effects-status': {
		type: 'boolean',
		default: false,
	},
	'shape-divider-bottom-status': {
		type: 'boolean',
		default: false,
	},
	'shape-divider-bottom-height': {
		type: 'number',
		default: 100,
	},
	'shape-divider-bottom-height-unit': {
		type: 'string',
		default: 'px',
	},
	'shape-divider-bottom-opacity': {
		type: 'number',
		default: 1,
	},
	'shape-divider-bottom-shape-style': {
		type: 'string',
	},
	...shapeDividerBackground('bottom'),
	...shapeDividerBackgroundColor('bottom'),
	'shape-divider-bottom-effects-status': {
		type: 'boolean',
		default: false,
	},
};

export default shapeDivider;
