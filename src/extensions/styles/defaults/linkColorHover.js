import linkColor from './linkColor';

export const linkColorHover = (() => {
	const response = {
		'link-color-status-hover': {
			type: 'boolean',
			default: false,
		},
	};

	Object.keys(linkColor).forEach(key => {
		const newKey = `${key}-hover`;
		const value = { ...linkColor[key] };

		if ('default' in value) delete value.default;

		response[newKey] = value;
	});

	return response;
})();

export default linkColorHover;
