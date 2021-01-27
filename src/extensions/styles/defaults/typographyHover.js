import { typography } from './typography';

const typographyHover = (function backgroundHoverGenerator() {
	const response = {
		'typography-status-hover': {
			type: 'boolean',
			default: false,
		},
	};

	Object.entries(typography).forEach(([key, val]) => {
		const newKey = `${key}-hover`;
		const value = { ...val };

		delete value.default;

		response[newKey] = value;
	});

	return response;
})();

export default typographyHover;
