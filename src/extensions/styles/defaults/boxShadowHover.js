import boxShadow from './boxShadow';

const boxShadowHover = (function boxShadowHoverGenerator() {
	const response = {
		'box-shadow-status-hover': {
			type: 'boolean',
			default: false,
		},
	};

	Object.keys(boxShadow).forEach(key => {
		const newKey = `${key}-hover`;
		const value = { ...boxShadow[key] };

		value.default = '';

		response[newKey] = value;
	});

	return response;
})();

export default boxShadowHover;
