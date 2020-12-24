import border from './border';

const borderHover = (function borderHoverGenerator() {
	const response = {
		'border-hover-status': {
			type: 'boolean',
			default: false,
		},
	};

	Object.keys(border).forEach(key => {
		const newKey = key.replace('border-', 'border-hover-');
		const value = { ...border[key] };

		if (key.includes('unit') || key.includes('sync'))
			response[newKey] = value;
		else {
			value.default = '';

			response[newKey] = value;
		}
	});

	return response;
})();

export default borderHover;
