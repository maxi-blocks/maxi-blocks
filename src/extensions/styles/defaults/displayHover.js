import display from './display';

export const displayHover = (() => {
	const response = {};

	Object.entries(display).forEach(([key, val]) => {
		const newKey = `${key}-hover`;

		if ('default' in val) delete val.default;

		response[newKey] = val;
	});

	return response;
})();

export default displayHover;
