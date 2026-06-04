const isEmptyString = value =>
	typeof value === 'string' && value.trim().length === 0;

const sanitizeLinkAttributes = (attributes = {}) =>
	Object.entries(attributes).reduce((acc, [key, value]) => {
		if (value == null || isEmptyString(value)) return acc;

		acc[key] = typeof value === 'string' ? value.trim() : value;

		return acc;
	}, {});

export default sanitizeLinkAttributes;
