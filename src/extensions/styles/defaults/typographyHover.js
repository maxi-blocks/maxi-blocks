import { typography } from './typography';

const typographyHover = (function backgroundHoverGenerator() {
	const response = {
		'typography-status-hover': {
			type: 'boolean',
			default: false,
		},
	};

	Object.entries(typography).forEach(([key, val]) => {
		// if (key.indexOf('font-family') >= 0) debugger;
		const newKey = `${key}-hover`;
		const value = { ...val };

		delete value.default;

		response[newKey] = value;
	});

	return response;
})();

export default typographyHover;
