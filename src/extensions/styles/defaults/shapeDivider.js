import {
	background,
	backgroundColor,
	backgroundImage,
	backgroundVideo,
	backgroundGradient,
	backgroundSVG,
} from './background';

const shapeDividerBackground = location => {
	const response = {};

	Object.keys(background).forEach(key => {
		const newKey = key.replace(
			'background-',
			`shape-divider-${location}-background-`
		);
		const value = { ...background[key] };

		if (value.type === 'string' || value.type === 'number')
			value.default = '';

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

		value.default = '';

		response[newKey] = value;
	});

	return response;
};

const shapeDividerBackgroundImage = location => {
	const response = {};

	Object.keys(backgroundImage).forEach(key => {
		const newKey = key.replace(
			'background-',
			`shape-divider-${location}-background-`
		);
		const value = { ...backgroundImage[key] };

		value.default = '';

		response[newKey] = value;
	});

	return response;
};

const shapeDividerBackgroundVideo = location => {
	const response = {};

	Object.keys(backgroundVideo).forEach(key => {
		const newKey = key.replace(
			'background-',
			`shape-divider-${location}-background-`
		);
		const value = { ...backgroundVideo[key] };

		value.default = '';

		response[newKey] = value;
	});

	return response;
};

const shapeDividerBackgroundGradient = location => {
	const response = {};

	Object.keys(backgroundGradient).forEach(key => {
		const newKey = key.replace(
			'background-',
			`shape-divider-${location}-background-`
		);
		const value = { ...backgroundGradient[key] };

		value.default = '';

		response[newKey] = value;
	});

	return response;
};

const shapeDividerBackgroundSVG = location => {
	const response = {};

	Object.keys(backgroundSVG).forEach(key => {
		const newKey = key.replace(
			'background-',
			`shape-divider-${location}-background-`
		);
		const value = { ...backgroundSVG[key] };

		value.default = '';

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
		default: '',
	},
	...shapeDividerBackground('top'),
	...shapeDividerBackgroundColor('top'),
	...shapeDividerBackgroundImage('top'),
	...shapeDividerBackgroundVideo('top'),
	...shapeDividerBackgroundGradient('top'),
	...shapeDividerBackgroundSVG('top'),
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
		default: '',
	},
	...shapeDividerBackground('bottom'),
	...shapeDividerBackgroundColor('bottom'),
	...shapeDividerBackgroundImage('bottom'),
	...shapeDividerBackgroundVideo('bottom'),
	...shapeDividerBackgroundGradient('bottom'),
	...shapeDividerBackgroundSVG('bottom'),
	'shape-divider-bottom-effects-status': {
		type: 'boolean',
		default: false,
	},
};

export default shapeDivider;
