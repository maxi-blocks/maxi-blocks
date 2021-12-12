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

		if (key !== 'palette-status-general') delete value.default;
		if (key === 'palette-color-general') value.default = 5;

		response[newKey] = value;
	});

	return response;
})();

export default typographyHover;
