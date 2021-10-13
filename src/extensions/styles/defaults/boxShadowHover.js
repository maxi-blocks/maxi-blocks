import boxShadow from './boxShadow';

const boxShadowHover = (() => {
	const response = {
		'box-shadow-status-hover': {
			type: 'boolean',
			default: false,
		},
	};

	Object.keys(boxShadow).forEach(key => {
		const newKey = `${key}-hover`;
		const value = { ...boxShadow[key] };

		if (
			key !== 'box-shadow-palette-color-status-general' &&
			'default' in value
		)
			value.default = '';
		if (key === 'box-shadow-palette-color-general') value.default = 6;

		response[newKey] = value;
	});

	return response;
})();

export default boxShadowHover;
