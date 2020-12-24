import boxShadow from './boxShadow';

const boxShadowHover = (function boxShadowHoverGenerator() {
	const response = {
		'boxShadow-hover-status': {
			type: 'boolean',
			default: false,
		},
	};

	Object.keys(boxShadow).forEach(key => {
		const newKey = key.replace('boxShadow-', 'boxShadow-hover-');
		const value = { ...boxShadow[key] };

		value.default = '';

		response[newKey] = value;
	});

	return response;
})();

export default boxShadowHover;
