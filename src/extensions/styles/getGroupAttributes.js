import * as defaults from './defaults/index';

const getPaletteObj = () => {
	let palette = {};

	Object.values(defaults.palette).forEach(val => {
		palette = { ...palette, ...val };
	});

	return palette;
};

const getGroupAttributes = (
	attributes,
	target,
	isHover = false,
	prefix = '',
	cleaned = false
) => {
	const response = {};

	if (typeof target === 'string') {
		const defaultAttributes =
			target !== 'palette'
				? defaults[`${target}${isHover ? 'Hover' : ''}`]
				: getPaletteObj();

		Object.keys(defaultAttributes).forEach(key => {
			if ((cleaned && attributes[`${prefix}${key}`]) || !cleaned)
				response[`${prefix}${key}`] = attributes[`${prefix}${key}`];
		});
	} else
		target.forEach(el => {
			const defaultAttributes =
				el !== 'palette'
					? defaults[`${el}${isHover ? 'Hover' : ''}`]
					: getPaletteObj();

			Object.keys(defaultAttributes).forEach(key => {
				if ((cleaned && attributes[`${prefix}${key}`]) || !cleaned)
					response[`${prefix}${key}`] = attributes[`${prefix}${key}`];
			});
		});

	return response;
};

export default getGroupAttributes;
